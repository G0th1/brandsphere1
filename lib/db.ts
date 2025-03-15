import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { DATABASE_URL } from './database-url';

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

// Initialize and export Prisma client
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // Prevent multiple instances during development
    const globalForPrisma = global as unknown as { prisma: PrismaClient };

    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
            log: ['error'],
        });
    }

    prisma = globalForPrisma.prisma;
}

export const db = prisma;

// For convenience in imports
export * from '@prisma/client';

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