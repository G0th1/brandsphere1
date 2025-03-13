import { PrismaClient } from "@prisma/client";

// Use a single PrismaClient instance for the entire app
// This prevents connection errors and ensures consistency
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a simple, reliable Prisma client instance
export const db = globalForPrisma.prisma || new PrismaClient({
    log: ['error', 'warn'],
});

// In development, preserve the connection between hot reloads
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

// Basic test to verify database connection
db.$connect()
    .then(() => {
        console.log("✅ Database connection successful");
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
    }); 