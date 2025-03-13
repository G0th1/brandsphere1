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

async function migrateToPostgres() {
    console.log('Starting migration from SQLite to PostgreSQL...');

    try {
        // Step 1: Verify PostgreSQL connection string
        if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
            console.error('ERROR: PostgreSQL DATABASE_URL not found. Please set it in your .env file.');
            console.error('Example: DATABASE_URL="postgresql://user:password@host:port/database"');
            return;
        }

        console.log('PostgreSQL connection string found.');

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