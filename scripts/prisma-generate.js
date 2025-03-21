#!/usr/bin/env node

// This script sets up Prisma client for deployment environments
console.log('Starting Prisma client generation for deployment...');

// Check for Vercel deployment
const isVercel = process.env.VERCEL === '1';
const skipGeneration = process.env.SKIP_DB_VALIDATION === 'true';

// Don't run actual DB validation on Vercel
if (isVercel) {
    console.log('Detected Vercel environment, skipping database validation');
    process.env.SKIP_DB_VALIDATION = 'true';
    process.env.PRISMA_SKIP_DATABASE_CHECK = 'true';
}

if (skipGeneration) {
    console.log('Skipping Prisma generation based on environment config');
    process.exit(0);
}

const { execSync } = require('child_process');

try {
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
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