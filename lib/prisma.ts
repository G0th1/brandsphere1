import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connections during hot reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create Prisma client with additional configuration and error handling
function createPrismaClient() {
    try {
        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            // Improved connection settings
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                },
            },
            // Add better error handling to all queries
            errorFormat: 'pretty',
        });
    } catch (e) {
        console.error('Failed to initialize Prisma client:', e);
        // In case of failure, return a basic client that will be properly initialized later
        // or when connection is restored
        return new PrismaClient({
            log: ['error'],
            errorFormat: 'minimal',
        });
    }
}

// Use the global prisma instance if available (development) or create a new one
export const prisma = globalForPrisma.prisma || createPrismaClient();

// Add prisma to the global object in development
if (process.env.NODE_ENV === 'development') {
    globalForPrisma.prisma = prisma;
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
    } = {}
): Promise<T> {
    const maxRetries = options.maxRetries ?? 3;
    const initialDelay = options.initialDelay ?? 250; // ms

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
        ];

        // Error messages that indicate transient issues
        const transientMessages = [
            'connection',
            'timeout',
            'timed out',
            'closed',
            'terminating',
            'forcibly closed',
        ];

        return transientErrors.some(code => errorCode.includes(code)) ||
            transientMessages.some(msg => errorMessage.toLowerCase().includes(msg));
    });

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                console.log(`Retry attempt ${attempt}/${maxRetries} for database operation`);
            }

            return await operation();
        } catch (error) {
            lastError = error;

            // If we've used all retries or this isn't a retryable error, throw
            if (attempt >= maxRetries || !shouldRetry(error)) {
                throw error;
            }

            // Exponential backoff with jitter
            const delay = initialDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
            console.log(`Database operation failed, retrying in ${Math.round(delay)}ms:`, error);

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // This shouldn't happen due to the throw in the loop, but TypeScript needs it
    throw lastError;
} 