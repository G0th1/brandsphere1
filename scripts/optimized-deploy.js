/**
 * Optimized deployment script with database initialization
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

console.log('🚀 Starting optimized deployment process');

// Load environment variables
require('dotenv').config({ path: '.env.production' });

// Copy .env.production to .env.local to ensure variables are loaded
console.log('📋 Copying environment config');
fs.copyFileSync('.env.production', '.env.local');

// Generate Prisma client
console.log('🔧 Generating Prisma client');
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Failed to generate Prisma client');
    process.exit(1);
}

// Initialize database
async function initializeDatabase() {
    console.log('🔌 Initializing database');

    const prisma = new PrismaClient();

    try {
        // Test connection
        console.log('Testing database connection...');
        await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Database connection successful');

        // Check if tables exist
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

        const tableNames = tables.map(t => t.table_name);
        console.log('Existing tables:', tableNames);

        // Check if we need to push the schema
        if (!tableNames.includes('Users') || !tableNames.includes('Subscriptions')) {
            console.log('⚠️ Required tables missing, pushing database schema...');
            execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
            console.log('✅ Schema pushed successfully');
        } else {
            console.log('✅ Required tables exist');
        }

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    }
}

// Deploy to Vercel function
async function deployToVercel() {
    console.log('🚀 Deploying to Vercel');
    try {
        execSync('vercel --prod', { stdio: 'inherit' });
        console.log('✅ Deployment completed');
    } catch (error) {
        console.error('❌ Deployment failed');
        process.exit(1);
    }
}

// Run the deployment process
async function run() {
    try {
        await initializeDatabase();
        await deployToVercel();
    } catch (error) {
        console.error('❌ Deployment process failed:', error);
        process.exit(1);
    }
}

run(); 