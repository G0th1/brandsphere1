import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { DATABASE_URL } from './database-url';
import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon for serverless environment with optimal settings
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineTLS = true;
neonConfig.poolQueryTimeoutMs = 15000; // 15 second query timeout
neonConfig.poolMaxUses = 100; // Max pool connection reuse
neonConfig.poolConnectionTimeoutMs = 10000; // 10 second connection timeout

// Database configuration
const isDevelopment = process.env.NODE_ENV === 'development';
let prisma: PrismaClient;

// Handle SQLite database setup in development
if (isDevelopment && DATABASE_URL.startsWith('file:')) {
    // Use absolute path for database location for reliability
    const DATABASE_FILENAME = 'dev.db';
    const PROJECT_ROOT = process.cwd();
    const PRISMA_DIR = path.join(PROJECT_ROOT, 'prisma');
    const DB_PATH = path.join(PRISMA_DIR, DATABASE_FILENAME);

    // Override environment variable with absolute path
    const absoluteDatabaseUrl = `file:${DB_PATH}`;
    process.env.DATABASE_URL = absoluteDatabaseUrl;

    // Setup database directory and file
    function setupDatabase() {
        try {
            // Create prisma directory if needed
            if (!fs.existsSync(PRISMA_DIR)) {
                fs.mkdirSync(PRISMA_DIR, { recursive: true });
            }

            let needsMigration = false;

            // Check if database file exists and is valid
            if (fs.existsSync(DB_PATH)) {
                try {
                    const stats = fs.statSync(DB_PATH);
                    // File is too small to be valid SQLite
                    if (stats.size < 100) {
                        fs.unlinkSync(DB_PATH);
                        needsMigration = true;
                    } else {
                        // Verify database integrity
                        try {
                            execSync(`npx prisma db execute --file="scripts/test-query.sql"`, {
                                stdio: 'pipe',
                                env: { ...process.env, DATABASE_URL: absoluteDatabaseUrl },
                            });
                            return true; // Database is valid
                        } catch {
                            fs.unlinkSync(DB_PATH);
                            needsMigration = true;
                        }
                    }
                } catch {
                    try {
                        fs.unlinkSync(DB_PATH);
                    } catch {
                        return false;
                    }
                    needsMigration = true;
                }
            } else {
                needsMigration = true;
            }

            // Create new database file if needed
            if (needsMigration) {
                fs.writeFileSync(DB_PATH, '', { mode: 0o666 });

                try {
                    // Apply database schema
                    execSync('npx prisma db push --force-reset', {
                        stdio: 'pipe',
                        env: { ...process.env, DATABASE_URL: absoluteDatabaseUrl },
                    });
                    return true;
                } catch (error) {
                    return false;
                }
            }
        } catch {
            return false;
        }
        return true;
    }

    // Run database setup
    setupDatabase();
}

// Initialize and export Prisma client with Neon serverless configuration
prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL
        }
    },
    log: isDevelopment ? ['error', 'warn'] : ['error'],
    // Add better error handling for connections
    errorFormat: 'pretty',
});

// Create a Neon SQL executor for raw queries
export const sql = neon(DATABASE_URL);

// Make sure DATABASE_URL is set for other tools that might read it
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = DATABASE_URL;
}

export const db = prisma;

// For convenience in imports
export * from '@prisma/client';

// Test connection on startup (but don't block execution)
(async function () {
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
        try {
            console.log(`🔄 Testing database connection (attempt ${retries + 1})...`);

            // Test Prisma connection
            await db.$connect();
            console.log('✅ Prisma connection successful');

            // Test Neon serverless connection
            const result = await sql`SELECT NOW()`;
            console.log('✅ Neon serverless connection successful:', result[0].now);

            // Successfully connected
            break;
        } catch (error) {
            retries++;
            console.error(`❌ Database connection error (attempt ${retries}/${maxRetries}):`, error);

            if (retries >= maxRetries) {
                console.error('⚠️ Maximum connection attempts reached. Database connection failed.');
                console.error('Please check your database configuration and ensure Neon database is accessible.');

                // Log more details in development
                if (isDevelopment) {
                    console.error('Database URL:', DATABASE_URL.substring(0, 20) + '...');
                    console.error('Full error:', error);
                }
            } else {
                // Wait before retrying (exponential backoff)
                const waitTime = Math.min(1000 * Math.pow(2, retries), 10000);
                console.log(`Retrying in ${waitTime / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }
})(); 