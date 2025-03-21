#!/usr/bin/env node

console.log('Starting Prisma client generation...');

// Set environment variables to skip database checks
process.env.SKIP_DB_VALIDATION = 'true';
process.env.PRISMA_SKIP_DATABASE_CHECK = 'true';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { execSync } = require('child_process');

try {
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
} catch (error) {
    console.error('⚠️ Error generating Prisma client:', error.message);
    // Don't fail the build
    console.log('Continuing with build despite Prisma generation error');
} 