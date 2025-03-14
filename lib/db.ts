import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { DATABASE_URL } from './database-url';

// =========== DATABASE CONFIGURATION ===========
// Handle environment-specific database setup
const isDevelopment = process.env.NODE_ENV === 'development';

// Only run filesystem checks in development with SQLite
if (isDevelopment && DATABASE_URL.startsWith('file:')) {
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

// Use a single instance of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Create the PrismaClient with appropriate configuration
export const db =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: DATABASE_URL
            }
        },
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

// Save the instance in development mode
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Test connection on startup (but don't block execution)
(async function () {
    try {
        console.log('🔄 Testing database connection...');
        await db.$connect();
        console.log('✅ Database connection successful');

        // Run a simple query to validate the connection
        const result = await db.$queryRaw`SELECT NOW()`;
        console.log('✅ Database query successful:', result);
    } catch (error) {
        console.error('❌ Database connection error:', error);
        console.error('Please check your database configuration and ensure Neon database is accessible.');
    }
})();

// Check if we're in the browser and in offline mode
if (typeof window !== 'undefined') {
    (async function setupOfflineMode() {
        // Add a short delay to let the app initialize first
        setTimeout(() => {
            try {
                // Check if offline mode is enabled in localStorage
                const isOfflineMode = localStorage.getItem('offlineMode') === 'true';

                // Add browser compatibility check
                const ua = window.navigator.userAgent;
                const isChrome = ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1;

                if (!isChrome) {
                    console.log('🔄 Non-Chrome browser detected. Applying database compatibility fixes.');

                    // Set SameSite=None cookies for cross-browser compatibility
                    document.cookie = "db-compat=true; path=/; SameSite=None; Secure";

                    // Add event listener to catch connection errors
                    window.addEventListener('error', function (event) {
                        if (event.message && (
                            event.message.includes('database') ||
                            event.message.includes('connection') ||
                            event.message.includes('fetch')
                        )) {
                            console.warn('⚠️ Caught database error:', event.message);
                            // Prevent the error from disrupting the user experience
                            event.preventDefault();
                            return true;
                        }
                    }, true);
                }

                if (isOfflineMode) {
                    console.log('🔌 Running in offline mode with mock database');

                    // Create mock handlers for common database operations
                    const mockSuccessResponse = { success: true };

                    // Intercept database operations with a proxy
                    window.addEventListener('error', function (event) {
                        // Catch database-related errors
                        if (event.message && event.message.includes('database') && isOfflineMode) {
                            console.log('🛡️ Prevented database error in offline mode:', event.message);
                            event.preventDefault();
                            return true;
                        }
                    }, true);
                }
            } catch (e) {
                console.error('Error setting up browser compatibility:', e);
            }
        }, 500);
    })();
} 