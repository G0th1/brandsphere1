/**
 * Database Repair Script
 * Run with: node scripts/fix-database.js
 * 
 * This script directly creates and initializes the SQLite database
 * with proper permissions and schema.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🛠️ DATABASE REPAIR TOOL 🛠️');

// Database configuration
const PROJECT_ROOT = process.cwd();
const PRISMA_DIR = path.join(PROJECT_ROOT, 'prisma');
const DB_PATH = path.join(PRISMA_DIR, 'dev.db');

console.log(`Project root: ${PROJECT_ROOT}`);
console.log(`Prisma directory: ${PRISMA_DIR}`);
console.log(`Database path: ${DB_PATH}`);

// Step 1: Check if Prisma directory exists
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

// Step 2: Check if database file exists and remove it if it does
console.log('\n🗃️ Checking database file...');
if (fs.existsSync(DB_PATH)) {
    try {
        fs.unlinkSync(DB_PATH);
        console.log('✅ Removed existing database file');
    } catch (err) {
        console.error('❌ Failed to remove existing database file:', err);
        process.exit(1);
    }
}

// Step 3: Create new empty database file
try {
    fs.writeFileSync(DB_PATH, '', { mode: 0o666 });
    console.log('✅ Created new empty database file with full permissions');
} catch (err) {
    console.error('❌ Failed to create database file:', err);
    process.exit(1);
}

// Step 4: Push schema to database
console.log('\n🔄 Initializing database schema...');
try {
    console.log('Running: npx prisma db push --force-reset');
    execSync('npx prisma db push --force-reset', {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    });
    console.log('✅ Database schema initialized successfully');
} catch (err) {
    console.error('❌ Failed to initialize schema:', err);
    process.exit(1);
}

// Step 5: Verify database is working
console.log('\n🔍 Verifying database...');
try {
    // Run a simple test query using Prisma
    execSync('npx prisma db execute --file="scripts/test-query.sql"', {
        stdio: 'inherit',
        cwd: PROJECT_ROOT,
        env: {
            ...process.env,
            DATABASE_URL: `file:${DB_PATH}`
        }
    });
    console.log('✅ Database verification successful');
} catch (err) {
    console.error('❌ Database verification failed:', err);

    // Create the test query file if it doesn't exist
    const sqlFile = path.join(PROJECT_ROOT, 'scripts', 'test-query.sql');
    if (!fs.existsSync(sqlFile)) {
        try {
            fs.writeFileSync(sqlFile, 'SELECT 1 as test;');
            console.log('Created test query file');
        } catch (err) {
            console.error('Failed to create test query file:', err);
        }
    }
}

console.log('\n✨ Database repair process completed');
console.log('Please restart your application for changes to take effect.'); 