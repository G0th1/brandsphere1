import { PrismaClient } from "@prisma/client";
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

// =========== DATABASE CONFIGURATION ===========
// Use relative path for database location for better compatibility
const DATABASE_FILENAME = 'dev.db';
const PROJECT_ROOT = process.cwd();
const PRISMA_DIR = path.join(PROJECT_ROOT, 'prisma');
const DB_PATH = path.join(PRISMA_DIR, DATABASE_FILENAME);

console.log('🔍 DATABASE DIAGNOSTICS:');
console.log(`Working directory: ${PROJECT_ROOT}`);
console.log(`Prisma directory: ${PRISMA_DIR}`);
console.log(`Database path: ${DB_PATH}`);
console.log(`Database exists: ${fs.existsSync(DB_PATH)}`);
console.log(`Prisma dir exists: ${fs.existsSync(PRISMA_DIR)}`);

// Directly define DATABASE_URL for Prisma
const DATABASE_URL = `file:${path.relative(PROJECT_ROOT, DB_PATH)}`;
console.log(`Database URL: ${DATABASE_URL}`);

// Check for proper environment variables
if (process.env.DATABASE_URL) {
    console.log(`Original DATABASE_URL from env: ${process.env.DATABASE_URL}`);
}

// Set environment variable
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

        // Check database file
        let needsSchema = false;
        if (!fs.existsSync(DB_PATH)) {
            try {
                // Create empty file with explicit permissions
                fs.writeFileSync(DB_PATH, '', { mode: 0o666 });
                console.log(`✅ Created database file at ${DB_PATH}`);
                needsSchema = true;
            } catch (fileError) {
                console.error(`❌ Failed to create database file: ${fileError}`);
                return false;
            }
        } else {
            // File exists, check if it's a valid database by trying to get its size
            try {
                const stats = fs.statSync(DB_PATH);
                console.log(`Database file size: ${stats.size} bytes`);
                // If file is empty, needs schema
                if (stats.size === 0) {
                    needsSchema = true;
                }
            } catch (statError) {
                console.error(`❌ Error accessing database file: ${statError}`);
                return false;
            }
        }

        // Initialize schema if needed
        if (needsSchema) {
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
        console.error(`❌ Unexpected error setting up database: ${error}`);
        return false;
    }
}

// Initialize database before proceeding
const dbSetupSuccess = setupDatabase();
if (!dbSetupSuccess) {
    console.error('❌ DATABASE SETUP FAILED - Application may not work correctly');
}

// =========== PRISMA CLIENT INITIALIZATION ===========
// Create a standard PrismaClient with explicit database URL
const prismaClientOptions = {
    datasources: {
        db: {
            url: DATABASE_URL
        }
    },
    log: ['error', 'warn']
};

// Add debug logs in development
if (process.env.NODE_ENV === 'development') {
    prismaClientOptions.log.push('query');
    console.log('Debug logging enabled for database queries');
}

// Initialize Prisma client
const prisma = new PrismaClient(prismaClientOptions);

// Export singleton instance
export const db = prisma;

// Verify connection on startup
async function verifyDatabaseConnection() {
    try {
        // Test basic connection
        await db.$connect();
        console.log('✅ Database connection successful');

        // Test query functionality
        const result = await db.$queryRaw`SELECT 1 as test`;
        console.log(`✅ Database query successful: ${JSON.stringify(result)}`);

        // Test schema is working
        const tableCount = await db.$queryRaw`SELECT count(*) as count FROM sqlite_master WHERE type='table'`;
        console.log(`✅ Database has ${JSON.stringify(tableCount)} tables`);

        return true;
    } catch (error) {
        console.error('❌ DATABASE CONNECTION ERROR:', error);
        return false;
    }
}

// Run verification but don't block module export
verifyDatabaseConnection()
    .then(success => {
        if (success) {
            console.log('✅ DATABASE READY');
        } else {
            console.error('❌ DATABASE VERIFICATION FAILED');
        }
    })
    .catch(error => {
        console.error('❌ FATAL DATABASE ERROR:', error);
    }); 