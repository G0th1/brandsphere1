import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

// --- DATABASE CONNECTION DEBUGGING ---
// Get the absolute path to the database file
const DB_PATH = path.resolve(process.cwd(), 'prisma/dev.db');

// Log database file status on startup
console.log('=== DATABASE SETUP ===');
console.log(`Working directory: ${process.cwd()}`);
console.log(`Database path: ${DB_PATH}`);

// Ensure database file and schema
function ensureDatabaseFile() {
    try {
        // Check if the database file exists
        const exists = fs.existsSync(DB_PATH);
        console.log(`Database file exists: ${exists}`);

        // If the database file doesn't exist, create it
        if (!exists) {
            // Ensure directory exists
            const dirPath = path.dirname(DB_PATH);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Created directory: ${dirPath}`);
            }

            // Create empty file
            fs.writeFileSync(DB_PATH, '');
            console.log(`Created new database file at ${DB_PATH}`);

            // Automatically push the schema to the new database
            try {
                execSync('npx prisma db push', { stdio: 'inherit' });
                console.log('Successfully pushed schema to new database file');
            } catch (schemaError) {
                console.error(`Error pushing schema to database: ${schemaError}`);
            }
        }

        return true;
    } catch (error) {
        console.error(`ERROR handling database file: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}

// Ensure database file exists before proceeding
ensureDatabaseFile();

// Set DATABASE_URL environment variable explicitly
process.env.DATABASE_URL = `file:${DB_PATH}`;

// Create a new PrismaClient with a single configuration
const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
        db: {
            url: `file:${DB_PATH}`
        }
    }
});

// Export the client instance
export const db = prisma;

// Test connection immediately
async function testDatabaseConnection() {
    try {
        await db.$connect();
        console.log("✅ Database connection successful");

        // Verify with a simple query
        const result = await db.$queryRaw`SELECT 1 as test`;
        console.log("✅ Database query successful:", result);

        // Try to access User table (basic schema verification)
        const userCount = await db.user.count();
        console.log(`✅ User table accessible. Current user count: ${userCount}`);

        return true;
    } catch (error) {
        console.error("❌ DATABASE CONNECTION ERROR:", error);

        if (error instanceof Error) {
            if (error.message.includes('table') && error.message.includes('not found')) {
                console.error("❌ Database schema not initialized. Run 'npx prisma db push'");

                // Try to auto-fix schema
                try {
                    console.log("Attempting to fix database schema automatically...");
                    execSync('npx prisma db push', { stdio: 'inherit' });
                    console.log("✅ Database schema fixed successfully");
                    return true;
                } catch (schemaError) {
                    console.error("❌ Failed to fix database schema:", schemaError);
                }
            } else if (error.message.includes('access') || error.message.includes('permission')) {
                console.error("❌ Database permission error. Check file permissions.");
            }
        }

        return false;
    }
}

// Execute test immediately
testDatabaseConnection()
    .catch(error => console.error("❌ Fatal database error:", error)); 