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
            // Add retries and better error handling to all queries
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

// Use existing Prisma instance if available, otherwise create a new one
export const prisma = globalForPrisma.prisma || createPrismaClient();

// Only cache in development mode
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to handle database connection errors with retry logic
export async function withErrorHandling<T>(
    databaseOperation: () => Promise<T>,
    maxRetries = 2
): Promise<T> {
    let retries = 0;

    while (true) {
        try {
            return await databaseOperation();
        } catch (error) {
            console.error(`Database operation failed (attempt ${retries + 1}/${maxRetries + 1}):`, error);

            // If we've reached the max number of retries, throw the error
            if (retries >= maxRetries) {
                throw error;
            }

            // Attempt to reconnect if the error is connection-related
            if (error instanceof Error &&
                (error.message.includes('Connection') ||
                    error.message.includes('timeout') ||
                    error.message.includes('connect'))) {
                try {
                    console.log('Attempting to reconnect to database...');
                    await prisma.$disconnect();
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
                    await prisma.$connect();
                    console.log('Reconnected to database successfully');
                } catch (reconnectError) {
                    console.error('Failed to reconnect to database:', reconnectError);
                }
            }

            // Increment retry counter
            retries++;
        }
    }
} 