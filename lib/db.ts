import { PrismaClient } from "@prisma/client";

// Create a type for the global variable
declare global {
    var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client with verbose logging in development
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
};

// Use a single PrismaClient instance for the entire app
// This prevents connection errors and ensures consistency
export const db = globalThis.prisma ?? prismaClientSingleton();

// In development, preserve the connection between hot reloads
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}

// Wrap the database test in a function for more control
async function testDatabaseConnection() {
    try {
        // Explicitly test the connection
        await db.$connect();
        console.log("✅ Database connection successful");

        // Basic query to verify functionality
        const result = await db.$queryRaw`SELECT 1 as test`;
        console.log("✅ Database query successful:", result);

        return true;
    } catch (error) {
        console.error("❌ Database connection failed:", error);

        // Check if we can access the SQLite database file
        if (error instanceof Error && error.message.includes('database file')) {
            console.error("❌ SQLite database file issue - check if file exists and is accessible");
        }

        return false;
    }
}

// Initialize the connection test without blocking module import
testDatabaseConnection().catch(error => {
    console.error("Fatal database error:", error);
}); 