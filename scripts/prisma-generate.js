#!/usr/bin/env node

// This script sets up Prisma client for deployment environments
console.log('Starting Prisma client generation for deployment...');

// Set environment variables explicitly for all environments
process.env.SKIP_DB_VALIDATION = 'true';
process.env.PRISMA_SKIP_DATABASE_CHECK = 'true';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Check for Vercel deployment
const isVercel = process.env.VERCEL === '1';
const skipGeneration = process.env.SKIP_DB_VALIDATION === 'true';

// Don't run actual DB validation on Vercel
if (isVercel) {
    console.log('Detected Vercel environment, skipping database validation');
}

if (skipGeneration) {
    console.log('Skipping database validation based on environment config');
}

const { execSync } = require('child_process');

try {
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: {
            ...process.env,
            SKIP_DB_VALIDATION: 'true',
            PRISMA_SKIP_DATABASE_CHECK: 'true'
        }
    });
    console.log('✅ Prisma client generated successfully');

    // Verify client location for debugging
    const fs = require('fs');
    const path = require('path');
    const clientPath = path.join(process.cwd(), 'node_modules/.prisma/client');

    if (fs.existsSync(clientPath)) {
        console.log(`✅ Client location verified: ${clientPath}`);
    } else {
        console.log(`⚠️ Client location not found at: ${clientPath}`);
    }
} catch (error) {
    console.error('❌ Error generating Prisma client:', error.message);

    // Don't fail the build on Vercel
    if (isVercel) {
        console.log('Continuing deployment despite Prisma generation error');
        process.exit(0);
    } else {
        process.exit(1);
    }
} 