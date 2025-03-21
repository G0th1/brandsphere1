#!/usr/bin/env node
/**
 * Enhanced deployment script that fixes common issues with Vercel and Neon
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Add environment variables to prevent database branching
process.env.SKIP_DB_VALIDATION = 'true';
process.env.PRISMA_SKIP_DATABASE_CHECK = 'true';
process.env.VERCEL_PROJECT_ID = 'prj_sEHZURg6B3TQEuNBm1OwXIRd6vL8';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

/**
 * Execute a command and return its output
 */
function exec(command, options = {}) {
    console.log(`${colors.cyan}> ${command}${colors.reset}`);
    return execSync(command, {
        stdio: 'inherit',
        ...options,
        env: {
            ...process.env,
            ...options.env
        }
    });
}

/**
 * Main deployment function
 */
async function deploy() {
    console.log(`\n${colors.bright}${colors.cyan}=== ENHANCED DEPLOYMENT SCRIPT ===${colors.reset}\n`);

    try {
        // 1. Verify build can complete locally
        console.log(`\n${colors.bright}1. Building project locally${colors.reset}`);
        exec('npm run build', {
            env: {
                SKIP_DB_VALIDATION: 'true',
                PRISMA_SKIP_DATABASE_CHECK: 'true'
            }
        });

        // 2. Commit any changes
        console.log(`\n${colors.bright}2. Committing changes${colors.reset}`);
        try {
            exec('git add .');
            exec('git commit -m "Prepare for deployment" --allow-empty');
        } catch (e) {
            // Ignore commit errors
            console.log(`${colors.yellow}Could not commit changes. Continuing anyway.${colors.reset}`);
        }

        // 3. Deploy to Vercel
        console.log(`\n${colors.bright}3. Deploying to Vercel${colors.reset}`);
        console.log(`${colors.yellow}This might take a few minutes...${colors.reset}`);
        try {
            // Use -b flag to force build on Vercel side
            exec('vercel --prod -b SKIP_DB_VALIDATION=true -b PRISMA_SKIP_DATABASE_CHECK=true');
        } catch (e) {
            console.error(`${colors.red}Deployment error. Trying alternative method...${colors.reset}`);
            // Try alternative deployment method
            exec('vercel --prod');
        }

        console.log(`\n${colors.green}${colors.bright}✅ Deployment complete!${colors.reset}`);
        console.log(`${colors.yellow}Note: If you see timeout errors, check your Vercel dashboard.`);
        console.log(`The deployment might have succeeded despite reported errors.${colors.reset}\n`);

    } catch (error) {
        console.error(`\n${colors.red}${colors.bright}❌ Deployment failed:${colors.reset}`, error.message);
        process.exit(1);
    }
}

deploy().catch(err => {
    console.error(err);
    process.exit(1);
}); 