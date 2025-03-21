#!/usr/bin/env node

// This script generates Prisma client for deployment without requiring database connections
// It helps overcome deployment timeouts by pre-generating the client
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Prisma client generation for deployment...');

// Set SKIP_DB_VALIDATION to true for offline generation
process.env.SKIP_DB_VALIDATION = 'true';

// Define the schemas
const prismaSchema = path.join(process.cwd(), 'prisma', 'schema.prisma');

try {
    // Make sure schema file exists
    if (!fs.existsSync(prismaSchema)) {
        console.error('Prisma schema file not found:', prismaSchema);
        process.exit(1);
    }

    console.log('Generating Prisma client...');

    // Generate client
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: {
            ...process.env,
            SKIP_DB_VALIDATION: 'true'
        }
    });

    console.log('✅ Prisma client generated successfully');

    // Check if client was generated
    const generatedClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
    if (fs.existsSync(generatedClientPath)) {
        console.log('✅ Client location verified:', generatedClientPath);
    } else {
        console.warn('⚠️ Client folder not found at expected location');
    }

} catch (error) {
    console.error('Error generating Prisma client:', error);
    process.exit(1);
} 