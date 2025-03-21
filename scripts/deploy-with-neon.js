#!/usr/bin/env node

// Deploy script for Vercel with Neon serverless driver
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment with Neon serverless driver');

// 1. Make sure @neondatabase/serverless is installed
try {
    console.log('Checking for Neon serverless driver...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));

    if (!packageJson.dependencies['@neondatabase/serverless']) {
        console.log('Installing @neondatabase/serverless...');
        execSync('npm install @neondatabase/serverless', { stdio: 'inherit' });
        console.log('✅ Neon serverless driver installed');
    } else {
        console.log('✅ Neon serverless driver already installed');
    }
} catch (error) {
    console.error('❌ Error checking/installing dependencies:', error.message);
    process.exit(1);
}

// 2. Pull latest environment variables from Vercel
try {
    console.log('\nPulling latest environment variables from Vercel...');
    execSync('vercel env pull .env.production.local', { stdio: 'inherit' });
    console.log('✅ Environment variables updated');
} catch (error) {
    console.warn('⚠️ Error pulling environment variables:', error.message);
    console.log('Continuing with deployment...');
}

// 3. Generate Prisma client for deployment
try {
    console.log('\nGenerating Prisma client...');
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: {
            ...process.env,
            SKIP_DB_VALIDATION: 'true'
        }
    });
    console.log('✅ Prisma client generated');
} catch (error) {
    console.error('❌ Error generating Prisma client:', error.message);
    process.exit(1);
}

// 4. Deploy to Vercel production
console.log('\n🚀 Deploying to Vercel production...');
try {
    execSync('vercel --prod', {
        stdio: 'inherit',
        timeout: 300000 // 5-minute timeout
    });
    console.log('✅ Deployment completed successfully');
} catch (error) {
    console.error('❌ Deployment error:', error.message);

    console.log('\n💡 Troubleshooting steps:');
    console.log('1. Verify database connection at /neon-test');
    console.log('2. Check that all environment variables are set correctly');
    console.log('3. If problems persist, try deploying from the Vercel dashboard');

    process.exit(1);
} 