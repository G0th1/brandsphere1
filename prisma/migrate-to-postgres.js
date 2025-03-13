/**
 * Helper script to migrate from SQLite to PostgreSQL
 * Run with: node prisma/migrate-to-postgres.js
 * 
 * Prerequisites:
 * 1. Set up a PostgreSQL database and have the connection string ready
 * 2. Update your .env/.env.local file with the new DATABASE_URL
 * 3. Update your schema.prisma file to use PostgreSQL
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('Current working directory:', process.cwd());

// First try to load from .env.local which takes precedence
let envLoaded = false;
try {
    if (fs.existsSync('.env.local')) {
        const result = dotenv.config({ path: '.env.local' });
        console.log('Loaded environment from .env.local:', result.parsed ? 'success' : 'failed');
        envLoaded = !!result.parsed;
    }
} catch (e) {
    console.error('Error loading .env.local:', e);
}

// If .env.local didn't work, try .env
if (!envLoaded) {
    try {
        if (fs.existsSync('.env')) {
            const result = dotenv.config({ path: '.env' });
            console.log('Loaded environment from .env:', result.parsed ? 'success' : 'failed');
            envLoaded = !!result.parsed;
        }
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

// Manual approach - read the file directly
try {
    if (fs.existsSync('.env.local')) {
        const envContent = fs.readFileSync('.env.local', 'utf8');
        const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
        if (dbUrlMatch && dbUrlMatch[1]) {
            process.env.DATABASE_URL = dbUrlMatch[1];
            console.log('Manually extracted DATABASE_URL from .env.local');
        }
    }
} catch (e) {
    console.error('Error manually reading .env.local:', e);
}

async function migrateToPostgres() {
    console.log('Starting migration from SQLite to PostgreSQL...');
    console.log('Environment variables loaded:', Object.keys(process.env).filter(key =>
        key.includes('DATABASE') || key.includes('POSTGRES')
    ));

    try {
        // Step 1: Verify PostgreSQL connection string
        if (!process.env.DATABASE_URL ||
            (!process.env.DATABASE_URL.startsWith('postgres') &&
                !process.env.DATABASE_URL.startsWith('postgresql'))) {

            console.error('ERROR: PostgreSQL DATABASE_URL not found. Please set it in your .env file.');
            console.error('Example: DATABASE_URL="postgresql://user:password@host:port/database"');
            console.error('Current DATABASE_URL:', process.env.DATABASE_URL);

            // List all environment files to help with debugging
            console.log('\nFound environment files:');
            if (fs.existsSync('.env')) console.log('- .env');
            if (fs.existsSync('.env.local')) console.log('- .env.local');
            if (fs.existsSync('.env.development')) console.log('- .env.development');
            if (fs.existsSync('.env.production')) console.log('- .env.production');

            console.log('\nTrying to manually read DATABASE_URL from files:');
            if (fs.existsSync('.env.local')) {
                const content = fs.readFileSync('.env.local', 'utf8');
                console.log('.env.local content (first 300 chars):', content.substring(0, 300));
            }

            return;
        }

        console.log('PostgreSQL connection string found:', process.env.DATABASE_URL.substring(0, 30) + '...');

        // Step 2: Generate migration files
        console.log('Generating Prisma migration files...');
        execSync('npx prisma migrate dev --name postgres-migration', { stdio: 'inherit' });

        // Step 3: Push schema to PostgreSQL
        console.log('Pushing schema to PostgreSQL...');
        execSync('npx prisma db push', { stdio: 'inherit' });

        // Step 4: Generate Prisma client
        console.log('Generating Prisma client...');
        execSync('npx prisma generate', { stdio: 'inherit' });

        console.log('\n✅ Migration completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Test your application with the PostgreSQL database');
        console.log('2. Deploy your application with the updated DATABASE_URL environment variable');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateToPostgres(); 