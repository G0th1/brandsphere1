import { PrismaClient, Prisma } from '@prisma/client';
import { env, getEnv } from './env';

// Metrics for connection tracking
interface PrismaMetrics {
    connections: {
        total: number;
        active: number;
        idle: number;
        failed: number;
    };
    queries: {
        total: number;
        failed: number;
        slow: number; // Queries taking > 500ms
    };
    lastReconnectAttempt: Date | null;
    connectionErrors: Array<{
        time: Date;
        message: string;
    }>;
    healthStatus: 'healthy' | 'degraded' | 'unhealthy';
    lastHealthCheck: Date | null;
}

// Initialize metrics
const metrics: PrismaMetrics = {
    connections: {
        total: 0,
        active: 0,
        idle: 0,
        failed: 0,
    },
    queries: {
        total: 0,
        failed: 0,
        slow: 0,
    },
    lastReconnectAttempt: null,
    connectionErrors: [],
    healthStatus: 'healthy',
    lastHealthCheck: null,
};

// Extended PrismaClient with connection management
class PrismaClientManager extends PrismaClient {
    private isConnected = false;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private healthCheckInterval: NodeJS.Timeout | null = null;
    private maxConnectionAttempts = getEnv('PRISMA_CONNECTION_RETRIES');
    private connectionAttempts = 0;

    constructor(options?: Prisma.PrismaClientOptions) {
        super(options);

        // Add middleware for metrics and monitoring
        this.$use(async (params, next) => {
            metrics.queries.total++;
            metrics.connections.active++;

            const startTime = performance.now();
            try {
                const result = await next(params);
                return result;
            } catch (error) {
                metrics.queries.failed++;
                throw error;
            } finally {
                const duration = performance.now() - startTime;
                if (duration > 500) {
                    metrics.queries.slow++;
                    console.warn(`Slow query detected (${Math.round(duration)}ms): ${params.model}.${params.action}`);
                }
                metrics.connections.active--;
                metrics.connections.idle++;
            }
        });
    }

    // Connect with enhanced error handling
    async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            metrics.lastReconnectAttempt = new Date();
            this.connectionAttempts++;
            metrics.connections.total++;

            console.log(`Attempting database connection (attempt ${this.connectionAttempts}/${this.maxConnectionAttempts})...`);

            // Test the connection with a simple query
            await this.$queryRaw`SELECT 1 as connection_test`;

            this.isConnected = true;
            this.connectionAttempts = 0;
            metrics.healthStatus = 'healthy';
            console.log('✅ Database connection established successfully');

            // Set up periodic health checks
            this.startHealthChecks();

        } catch (error) {
            metrics.connections.failed++;
            const errorMessage = error instanceof Error ? error.message : String(error);

            metrics.connectionErrors.push({
                time: new Date(),
                message: errorMessage
            });

            // Keep only the last 10 errors
            if (metrics.connectionErrors.length > 10) {
                metrics.connectionErrors.shift();
            }

            console.error(`❌ Database connection failed:`, errorMessage);

            // Handle reconnection if needed
            if (this.connectionAttempts < this.maxConnectionAttempts) {
                const delay = getEnv('PRISMA_CONNECTION_RETRY_DELAY') * Math.pow(2, this.connectionAttempts - 1);
                console.log(`Will retry in ${delay}ms...`);

                // Clear any existing timers
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                }

                // Set up the reconnection timer
                this.reconnectTimer = setTimeout(() => {
                    this.connect().catch(e => {
                        metrics.healthStatus = 'unhealthy';
                        console.error('Reconnection attempt failed:', e);
                    });
                }, delay);
            } else {
                metrics.healthStatus = 'unhealthy';
                console.error(`Maximum reconnection attempts (${this.maxConnectionAttempts}) reached. Giving up.`);
            }

            throw error;
        }
    }

    // Start periodic health checks
    private startHealthChecks() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }

        this.healthCheckInterval = setInterval(async () => {
            try {
                metrics.lastHealthCheck = new Date();
                await this.$queryRaw`SELECT 1 as health_check`;
                metrics.healthStatus = 'healthy';
            } catch (error) {
                console.error('Health check failed:', error);
                metrics.healthStatus = 'degraded';

                // If health checks fail repeatedly, consider reconnecting
                if (metrics.healthStatus === 'degraded') {
                    this.isConnected = false;
                    this.connect().catch(e => console.error('Health-triggered reconnect failed:', e));
                }
            }
        }, 30000); // Check every 30 seconds
    }

    // Clean up resources
    async disconnect(): Promise<void> {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }

        await super.$disconnect();
        this.isConnected = false;
        console.log('Database connection closed');
    }

    // Get current metrics
    getMetrics(): PrismaMetrics {
        return { ...metrics };
    }
}

/**
 * Create Prisma client with additional configuration and error handling
 */
function createPrismaClient(): PrismaClientManager {
    try {
        // Use validated environment variables
        const engineType = getEnv('PRISMA_CLIENT_ENGINE_TYPE');

        const client = new PrismaClientManager({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            datasources: {
                db: {
                    url: getEnv('DATABASE_URL')
                },
            },
            errorFormat: 'pretty'
        });

        // Connect immediately for eager connection establishment
        if (process.env.NODE_ENV === 'production') {
            client.connect().catch(e => {
                console.error('Initial database connection failed:', e);
            });
        }

        return client;
    } catch (e) {
        console.error('Failed to initialize Prisma client:', e);
        // In case of failure, return a minimal client
        return new PrismaClientManager({
            log: ['error'],
            errorFormat: 'minimal',
        });
    }
}

// Use the global prisma instance or create a new one
export const prisma = global.prisma || createPrismaClient();

// Add prisma to the global object in development
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

// Register exit handlers to properly close DB connections
if (typeof process !== 'undefined') {
    process.on('beforeExit', async () => {
        await prisma.disconnect();
    });

    // Handle termination signals
    ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal => {
        process.once(signal, async () => {
            await prisma.disconnect();
            process.exit(0);
        });
    });
}

/**
 * Wraps a Prisma database operation with error handling and automatic retries
 * for transient database errors like connection timeouts
 */
export async function withErrorHandling<T>(
    operation: () => Promise<T>,
    options: {
        maxRetries?: number;
        initialDelay?: number;
        shouldRetry?: (error: any) => boolean;
        onRetry?: (attempt: number, error: any) => void;
        context?: string; // For better logging
    } = {}
): Promise<T> {
    const maxRetries = options.maxRetries ?? getEnv('PRISMA_CONNECTION_RETRIES');
    const initialDelay = options.initialDelay ?? getEnv('PRISMA_CONNECTION_RETRY_DELAY');
    const context = options.context || 'database operation';

    // Default function to determine if an error should trigger a retry
    const shouldRetry = options.shouldRetry ?? ((error: any) => {
        const errorCode = error?.code || '';
        const errorMessage = error?.message || '';

        // Common transient database errors
        const transientErrors = [
            'P1001', // Connection error
            'P1002', // Timeout connecting to database
            'P1008', // Operations timed out
            'P1017', // Server close connection
            'ECONNRESET', // Connection reset
            'ETIMEDOUT', // Connection timeout
            'EPIPE', // Broken pipe
            'P2024', // Connection pool timeout
            'P2034', // Transaction timed out
        ];

        // Error messages that indicate transient issues
        const transientMessages = [
            'connection',
            'timeout',
            'timed out',
            'closed',
            'terminating',
            'forcibly closed',
            'network',
            'reset',
            'unavailable',
        ];

        return transientErrors.some(code => errorCode.includes(code)) ||
            transientMessages.some(msg => errorMessage.toLowerCase().includes(msg));
    });

    const onRetry = options.onRetry ?? ((attempt, error) => {
        console.log(`Retry attempt ${attempt}/${maxRetries} for ${context}`);
    });

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                onRetry(attempt, lastError);
            }

            return await operation();
        } catch (error) {
            lastError = error;

            // Check if prisma is disconnected and try reconnecting
            if (prisma instanceof PrismaClientManager && !prisma['isConnected']) {
                try {
                    await prisma.connect();
                } catch (connError) {
                    console.error('Failed to reconnect to database:', connError);
                }
            }

            // If we've used all retries or this isn't a retryable error, throw
            if (attempt >= maxRetries || !shouldRetry(error)) {
                throw error;
            }

            // Exponential backoff with jitter
            const delay = initialDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
            console.log(`${context} failed, retrying in ${Math.round(delay)}ms:`, error);

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // This shouldn't happen due to the throw in the loop, but TypeScript needs it
    throw lastError;
}

// Expose health check endpoint for monitoring
export async function checkDatabaseHealth() {
    try {
        const startTime = performance.now();
        await prisma.$queryRaw`SELECT 1 as health_check`;
        const duration = performance.now() - startTime;

        return {
            ok: true,
            responseTime: Math.round(duration),
            status: metrics.healthStatus,
            metrics: {
                connections: metrics.connections,
                queries: metrics.queries,
                lastHealthCheck: metrics.lastHealthCheck,
            }
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
            status: 'unhealthy',
            metrics: {
                connections: metrics.connections,
                connectionErrors: metrics.connectionErrors.slice(-3), // Last 3 errors
            }
        };
    }
} 