#!/usr/bin/env node

// Advanced Vercel deployment script with resilient error handling
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting enhanced Vercel deployment process');

// 1. First, generate Prisma client
try {
    console.log('Generating Prisma client...');
    execSync('node scripts/prisma-generate.js', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
} catch (error) {
    console.error('❌ Error generating Prisma client:', error.message);
    process.exit(1);
}

// 2. Make sure environment variables are set correctly
console.log('\n🔧 Checking environment variables...');
try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Not set');
} catch (error) {
    console.error('❌ Error checking environment variables:', error.message);
}

// 3. Deploy to Vercel with max timeout
console.log('\n🚀 Starting deployment...');
try {
    // Run with forced production deployment
    execSync('vercel --prod', {
        stdio: 'inherit',
        timeout: 120000 // 2 minutes timeout
    });
    console.log('✅ Deployment command completed');
} catch (error) {
    console.error('❌ Vercel deployment error:', error.message);

    // Even if the command fails, the deployment might still be in progress
    console.log('\n🔍 Checking recent deployments...');
    try {
        execSync('vercel ls', { stdio: 'inherit' });
    } catch (innerError) {
        console.error('Could not fetch recent deployments:', innerError.message);
    }

    console.log('\n💡 Troubleshooting:');
    console.log('  1. Check Vercel dashboard for more details');
    console.log('  2. Try using the offline mode for testing');
    console.log('  3. Ensure database connection is working');

    process.exit(1);
} 