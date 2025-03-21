/**
 * Simple deployment script
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting simplified deployment process');

// Ensure .env.production exists
if (!fs.existsSync('.env.production')) {
    console.error('❌ Missing .env.production file');
    process.exit(1);
}

// Copy .env.production to .env.local to ensure variables are loaded
console.log('📋 Copying .env.production to .env.local');
fs.copyFileSync('.env.production', '.env.local');

// Generate Prisma client
console.log('🔧 Generating Prisma client');
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Failed to generate Prisma client');
    process.exit(1);
}

// Deploy to Vercel
console.log('🚀 Deploying to Vercel');
try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('✅ Deployment completed');
} catch (error) {
    console.error('❌ Deployment failed');
    process.exit(1);
} 