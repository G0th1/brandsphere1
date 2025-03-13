/**
 * ENHANCED Database Repair Script
 * Run with: node scripts/fix-database.js
 * 
 * This script completely recreates the SQLite database
 * with proper permissions and correct schema.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔧 ENHANCED DATABASE REPAIR TOOL 🔧');
console.log('========================================');

// Database configuration
const PROJECT_ROOT = process.cwd();
const PRISMA_DIR = path.join(PROJECT_ROOT, 'prisma');
const DB_PATH = path.join(PRISMA_DIR, 'dev.db');
const SCHEMA_PATH = path.join(PRISMA_DIR, 'schema.prisma');

console.log(`📂 Project root: ${PROJECT_ROOT}`);
console.log(`📂 Prisma directory: ${PRISMA_DIR}`);
console.log(`🗃️ Database path: ${DB_PATH}`);
console.log(`📄 Schema path: ${SCHEMA_PATH}`);

// Helper function to execute commands safely
function runCommand(command, description) {
    console.log(`\n⚙️ ${description}...`);
    try {
        console.log(`> ${command}`);
        const output = execSync(command, {
            stdio: 'inherit',
            cwd: PROJECT_ROOT
        });
        console.log(`✅ ${description} successful`);
        return true;
    } catch (err) {
        console.error(`❌ ${description} failed:`, err.message);
        return false;
    }
}

// Step 1: Verify Schema Exists
console.log('\n📋 Verifying Prisma schema...');
if (!fs.existsSync(SCHEMA_PATH)) {
    console.error('❌ Prisma schema not found! Cannot proceed without a schema.');
    process.exit(1);
}
console.log('✅ Prisma schema exists');

// Step 2: Check if Prisma directory exists
console.log('\n📁 Checking Prisma directory...');
if (!fs.existsSync(PRISMA_DIR)) {
    try {
        fs.mkdirSync(PRISMA_DIR, { recursive: true });
        console.log('✅ Created Prisma directory');
    } catch (err) {
        console.error('❌ Failed to create Prisma directory:', err);
        process.exit(1);
    }
} else {
    console.log('✅ Prisma directory exists');
}

// Step 3: Check if database file exists and remove it if it does
console.log('\n🗃️ Checking database file...');
if (fs.existsSync(DB_PATH)) {
    try {
        // Try to get file permissions before deleting
        try {
            const stats = fs.statSync(DB_PATH);
            console.log(`Current file permissions: ${stats.mode.toString(8)}`);
        } catch (statErr) {
            console.log('Could not read file permissions:', statErr.message);
        }

        fs.unlinkSync(DB_PATH);
        console.log('✅ Removed existing database file');
    } catch (err) {
        console.error('❌ Failed to remove existing database file:', err);
        console.log('Attempting forced removal...');

        try {
            // On Windows, sometimes files need multiple attempts to delete
            setTimeout(() => {
                try {
                    fs.unlinkSync(DB_PATH);
                    console.log('✅ Forced removal successful');
                } catch (retryErr) {
                    console.error('❌ Forced removal failed:', retryErr);
                    process.exit(1);
                }
            }, 1000);
        } catch (timeoutErr) {
            console.error('❌ Timeout failed:', timeoutErr);
            process.exit(1);
        }
    }
}

// Step 4: Create new empty database file with explicit permissions
console.log('\n📄 Creating new database file...');
try {
    // Create with wide open permissions
    fs.writeFileSync(DB_PATH, '', { mode: 0o666 });
    console.log('✅ Created new empty database file');

    // Verify permissions
    const stats = fs.statSync(DB_PATH);
    console.log(`File created with permissions: ${stats.mode.toString(8)}`);

    // On Windows, sometimes permissions need to be set after creation
    try {
        fs.chmodSync(DB_PATH, 0o666);
        console.log('✅ Set explicit permissions on database file');
    } catch (chmodErr) {
        console.warn('⚠️ Could not set explicit permissions:', chmodErr.message);
        console.log('Continuing anyway as this may be system-dependent');
    }
} catch (err) {
    console.error('❌ Failed to create database file:', err);
    process.exit(1);
}

// Step 5: Update DATABASE_URL environment variable
const DATABASE_URL = `file:${DB_PATH}`;
process.env.DATABASE_URL = DATABASE_URL;
console.log(`📌 Set DATABASE_URL: ${DATABASE_URL}`);

// Step 6: Push schema to database
console.log('\n🔄 Initializing database schema...');
if (!runCommand('npx prisma db push --force-reset', 'Database schema initialization')) {
    console.error('❌ Failed to initialize database schema');
    process.exit(1);
}

// Step 7: Generate Prisma client
if (!runCommand('npx prisma generate', 'Prisma client generation')) {
    console.warn('⚠️ Could not generate Prisma client, continuing anyway');
}

// Step 8: Verify database is working
console.log('\n🔍 Verifying database...');
try {
    // Create SQL test file if it doesn't exist
    const testQueryPath = path.join(PROJECT_ROOT, 'scripts', 'test-query.sql');
    if (!fs.existsSync(testQueryPath)) {
        fs.writeFileSync(testQueryPath, 'SELECT 1 as test;');
        console.log('✅ Created test SQL file');
    }

    // Run test query
    if (runCommand(`npx prisma db execute --file="${testQueryPath}"`, 'Database test query')) {
        console.log('✅ Database verification successful');
    } else {
        throw new Error('Database verification failed');
    }
} catch (err) {
    console.error('❌ Database verification failed:', err.message);
    console.log('\n⚠️ Despite errors, your database file may still work. Try restarting the application.');
    process.exit(1);
}

console.log('\n✨ DATABASE REPAIR COMPLETED SUCCESSFULLY ✨');
console.log('Restart your Next.js application for changes to take effect.'); 