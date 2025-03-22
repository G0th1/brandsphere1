import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { DATABASE_URL } from './database-url';
import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon for serverless environment with optimal settings
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineTLS = true;
neonConfig.poolQueryTimeoutMs = 30000; // 30 second query timeout (increased from 15s)
neonConfig.poolMaxUses = 100; // Max pool connection reuse
neonConfig.poolConnectionTimeoutMs = 15000; // 15 second connection timeout (increased from 10s)
neonConfig.wsConnectionMaxLifetime = 1800000; // 30 minutes max WebSocket lifetime
neonConfig.webSocketConstructor = globalThis.WebSocket; // Custom WebSocket setting for cross-platform

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
                    // Try basic SQLite operation to check file validity
                    const { Database } = require('sqlite3');
                    const db = new Database(DB_PATH);
                    db.close();
                    console.log('SQLite database exists and is valid.');
                } catch (error) {
                    console.warn('SQLite database exists but appears to be invalid. Recreating...');
                    fs.unlinkSync(DB_PATH);
                    needsMigration = true;
                }
            } else {
                console.log('SQLite database does not exist. Creating...');
                needsMigration = true;
            }

            // Create database if needed by running migrations
            if (needsMigration) {
                try {
                    console.log('Running Prisma migrations to create SQLite database...');
                    execSync('npx prisma migrate dev --name init', {
                        stdio: 'inherit',
                        env: { ...process.env, DATABASE_URL: absoluteDatabaseUrl }
                    });
                    console.log('Prisma migrations completed successfully.');
                } catch (error) {
                    console.error('Failed to run Prisma migrations:', error);
                    process.exit(1);
                }
            }
        } catch (error) {
            console.error('Error setting up SQLite database:', error);
            process.exit(1);
        }
    }

    // Setup SQLite database
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

// Enhance Prisma client with connection resilience
const originalConnect = prisma.$connect.bind(prisma);
const originalDisconnect = prisma.$disconnect.bind(prisma);

// Add retry logic to connection
prisma.$connect = async function () {
    let retries = 3;
    while (retries > 0) {
        try {
            await originalConnect();
            return;
        } catch (error) {
            retries--;
            if (retries === 0) throw error;
            console.error(`Database connection failed. Retrying (${retries} attempts left)...`, error);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

// Create a Neon SQL executor for raw queries with retries
export const sql = neon(DATABASE_URL);

// Add a wrapper function for SQL queries with retry logic
export async function executeSQL(query: string, params: any[] = []): Promise<any> {
    let retries = 3;
    while (retries > 0) {
        try {
            return await sql(query, params);
        } catch (error) {
            retries--;
            if (retries === 0) throw error;
            console.error(`SQL query failed. Retrying (${retries} attempts left)...`, error);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

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