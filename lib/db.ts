import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

// =========== DATABASE CONFIGURATION ===========
// Handle environment-specific database setup
const isDevelopment = process.env.NODE_ENV === 'development';

// Only run filesystem checks in development with SQLite
if (isDevelopment && process.env.DATABASE_URL?.startsWith('file:')) {
    console.log('🔍 DATABASE DIAGNOSTICS:');

    // Use absolute path for database location for maximum reliability
    const DATABASE_FILENAME = 'dev.db';
    const PROJECT_ROOT = process.cwd();
    const PRISMA_DIR = path.join(PROJECT_ROOT, 'prisma');
    const DB_PATH = path.join(PRISMA_DIR, DATABASE_FILENAME);

    console.log(`Working directory: ${PROJECT_ROOT}`);
    console.log(`Prisma directory: ${PRISMA_DIR}`);
    console.log(`Database path: ${DB_PATH}`);
    console.log(`Database exists: ${fs.existsSync(DB_PATH)}`);
    console.log(`Prisma dir exists: ${fs.existsSync(PRISMA_DIR)}`);

    // Use absolute path for SQLite - more reliable across environments
    const DATABASE_URL = `file:${DB_PATH}`;
    console.log(`Database URL: ${DATABASE_URL}`);

    // Override environment variable with absolute path
    process.env.DATABASE_URL = DATABASE_URL;

    // =========== DATABASE FILE MANAGEMENT ===========
    function setupDatabase() {
        try {
            // Check if prisma directory exists and create it if not
            if (!fs.existsSync(PRISMA_DIR)) {
                try {
                    fs.mkdirSync(PRISMA_DIR, { recursive: true });
                    console.log(`✅ Created Prisma directory at ${PRISMA_DIR}`);
                } catch (dirError) {
                    console.error(`❌ Failed to create Prisma directory: ${dirError}`);
                    console.error(`Current permissions: ${fs.statSync(PROJECT_ROOT).mode.toString(8)}`);
                    return false;
                }
            }

            // SQLITE FILE HANDLING
            let needsSchema = false;

            // Ensure database file exists with proper permissions
            try {
                // Remove any problematic database file
                if (fs.existsSync(DB_PATH)) {
                    try {
                        // Check file size to determine if it's valid
                        const stats = fs.statSync(DB_PATH);
                        if (stats.size < 100) {
                            // File is too small to be valid SQLite
                            console.log('Removing potentially corrupt database file');
                            fs.unlinkSync(DB_PATH);
                            needsSchema = true;
                        } else {
                            console.log(`Database file size: ${stats.size} bytes`);
                            // Try to test file with SQLite directly
                            try {
                                execSync(`npx prisma db execute --file="scripts/test-query.sql"`, {
                                    stdio: 'inherit',
                                    env: { ...process.env, DATABASE_URL },
                                });
                                console.log('✅ Existing database is valid');
                                return true; // Database is good to go
                            } catch (testError) {
                                console.error('❌ Existing database failed validation, recreating...');
                                fs.unlinkSync(DB_PATH);
                                needsSchema = true;
                            }
                        }
                    } catch (error) {
                        console.error(`❌ Error checking database file: ${error}`);
                        try {
                            fs.unlinkSync(DB_PATH);
                        } catch (unlinkError) {
                            console.error(`❌ Failed to remove problematic database: ${unlinkError}`);
                            return false;
                        }
                        needsSchema = true;
                    }
                } else {
                    needsSchema = true;
                }

                // Create new database file if needed
                if (needsSchema) {
                    // Create empty file with wide-open permissions
                    fs.writeFileSync(DB_PATH, '', { mode: 0o666 });
                    console.log(`✅ Created database file at ${DB_PATH}`);

                    // Push schema to the new database
                    try {
                        console.log('Initializing database schema...');
                        // Run Prisma migration
                        execSync('npx prisma db push --force-reset', {
                            cwd: PROJECT_ROOT,
                            stdio: 'inherit'
                        });
                        console.log('✅ Schema successfully pushed to database');
                    } catch (schemaError) {
                        console.error(`❌ Failed to push schema: ${schemaError}`);
                        return false;
                    }
                }

                return true;
            } catch (error) {
                console.error(`❌ Database file handling error: ${error}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Unexpected error setting up database: ${error}`);
            return false;
        }
    }

    // Initialize database before proceeding
    const dbSetupSuccess = setupDatabase();
    if (!dbSetupSuccess) {
        console.error('❌ DATABASE SETUP FAILED - Application may not work correctly');
    }
}

// =========== PRISMA CLIENT INITIALIZATION ===========
// Simplify client creation for maximum compatibility
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    // In production, just use the DATABASE_URL from environment variables
    prisma = new PrismaClient();
    console.log('✅ PrismaClient initialized for production');
} else {
    try {
        // In development, we might need more specific configuration
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            },
            log: ['error', 'warn'],
        });
        console.log('✅ PrismaClient initialized successfully');
    } catch (initError) {
        console.error('❌ Failed to initialize PrismaClient:', initError);
        // Create a fallback client with no options
        prisma = new PrismaClient();
    }
}

// Create and export a singleton instance
export const db = prisma;

// Test connection immediately but don't block execution
(async function () {
    try {
        // Force connection to occur
        await db.$connect();
        console.log('✅ Database connection successful');

        // Basic test query - customize for PostgreSQL if needed
        const testResult = await db.$queryRaw`SELECT 1 as test`;
        console.log('✅ Basic query successful:', testResult);

        // Check if tables exist - this syntax works for both SQLite and PostgreSQL
        const tables = await db.$queryRaw`
      SELECT table_name as name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
        console.log('✅ Database tables:', tables);

    } catch (error) {
        console.error('❌ Database connection test failed:', error);

        if (error instanceof Error) {
            if (error.message.includes('no such table') || error.message.includes('relation does not exist')) {
                console.error('❌ Schema missing, try running: npx prisma db push');
            } else if (error.message.includes('SQLITE_CANTOPEN')) {
                console.error('❌ Cannot open database file, check permissions');
            } else if (error.message.includes('connection refused')) {
                console.error('❌ Database connection refused. Check database URL and credentials.');
            }
        }
    }
})(); 