import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Log function for database issues
function logDatabaseIssue(message: string, error?: any) {
    console.error(`🔴 DATABASE ERROR: ${message}`);
    if (error) {
        console.error(`💥 Error details:`, error);
        if (error.code) {
            console.error(`💥 Error code: ${error.code}`);
        }
    }
}

// Create a simple, reliable Prisma client instance
function createPrismaClient() {
    // For development, log the database configuration
    if (process.env.NODE_ENV !== "production") {
        console.log("Database configuration:", {
            DATABASE_URL: Boolean(process.env.DATABASE_URL),
            POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
            POSTGRES_URL_NON_POOLING: Boolean(process.env.POSTGRES_URL_NON_POOLING)
        });
    }

    // Create a basic Prisma client - Prisma will handle the connection URL priority
    return new PrismaClient();
}

// Use the global instance in development to prevent connection exhaustion
// during hot reloads, or create a new instance
const prisma = global.prisma || createPrismaClient();

// Store the instance globally in development
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

// Test database connection when module loads
(async () => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        const dbType = isProduction ? "PostgreSQL" : "SQLite";

        console.log(`🔄 Testing ${dbType} database connection...`);
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log(`✅ ${dbType} database connection successful!`, result);
    } catch (connectionError) {
        const isProduction = process.env.NODE_ENV === "production";
        const dbType = isProduction ? "PostgreSQL" : "SQLite";

        logDatabaseIssue(`Could not connect to ${dbType} database:`, connectionError);

        if (isProduction) {
            console.error('🚨 RECOMMENDATION: Verify that database environment variables are correctly set');
            console.error('🚨 Environment variables that should exist on Vercel:');
            console.error('   - POSTGRES_PRISMA_URL (for pooled connections)');
            console.error('   - POSTGRES_URL_NON_POOLING (for direct connections, migrations, etc)');
        } else {
            console.error('🚨 RECOMMENDATION: Verify that the SQLite database is correctly initialized');
            console.error('   Try running: npx prisma db push');
        }
    }
})();

export const db = prisma; 