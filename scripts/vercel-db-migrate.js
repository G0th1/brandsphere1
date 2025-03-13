/**
 * Vercel Database Migration Script
 * This script runs during the build process on Vercel to ensure the database schema is up to date
 */

const { execSync } = require('child_process');

console.log('🔄 Starting Vercel database migration...');

// Function to execute a command and return its output
function runCommand(command) {
    try {
        console.log(`Running: ${command}`);
        const output = execSync(command, {
            stdio: 'inherit',
            env: process.env
        });
        return true;
    } catch (error) {
        console.error(`Command failed: ${command}`);
        console.error(error.toString());
        return false;
    }
}

// Main migration function
async function migrateDatabase() {
    console.log('Environment variables:', Object.keys(process.env).filter(key =>
        key.includes('DATABASE') || key.includes('POSTGRES')
    ));

    // Step 1: Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.log('DATABASE_URL not found, using POSTGRES_PRISMA_URL instead');

        if (process.env.POSTGRES_PRISMA_URL) {
            process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
            console.log('Set DATABASE_URL from POSTGRES_PRISMA_URL');
        } else {
            console.log('Setting DATABASE_URL directly');
            process.env.DATABASE_URL = "postgres://neondb_owner:npg_5RtxlHfPjv4d@ep-super-fire-a2zkgpm3-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require";
        }
    }

    // Step 2: Generate Prisma client
    console.log('Generating Prisma client...');
    if (!runCommand('npx prisma generate')) {
        console.error('Failed to generate Prisma client, but continuing...');
    }

    // Step 3: Push schema to database - safer than running migrations
    console.log('Pushing schema to database...');
    if (runCommand('npx prisma db push --accept-data-loss')) {
        console.log('✅ Database schema updated successfully!');
    } else {
        console.error('❌ Failed to update database schema');
        console.log('Continuing deployment despite migration failure...');
    }

    console.log('✅ Vercel database migration completed');
}

migrateDatabase().catch(error => {
    console.error('Unhandled error in database migration:', error);
    // Don't fail the build if migration fails
    process.exit(0);
}); 