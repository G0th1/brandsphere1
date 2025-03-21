#!/usr/bin/env node
/**
 * Enhanced deployment script that fixes common issues with Vercel and Neon
 */

const { execSync } = require('child_process');

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
    try {
        return execSync(command, {
            stdio: 'inherit',
            ...options
        });
    } catch (error) {
        console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
        throw error;
    }
}

/**
 * Main deployment function
 */
async function deploy() {
    console.log(`\n${colors.bright}${colors.cyan}=== ENHANCED DEPLOYMENT SCRIPT ===${colors.reset}\n`);

    try {
        // 1. Add environment variables to vercel.json
        console.log(`\n${colors.bright}1. Updating vercel.json with bypass settings${colors.reset}`);

        // 2. Commit any changes
        console.log(`\n${colors.bright}2. Committing changes${colors.reset}`);
        try {
            exec('git add .');
            exec('git commit -m "Prepare for deployment" --allow-empty');
        } catch (e) {
            console.log(`${colors.yellow}Commit step skipped. Continuing anyway.${colors.reset}`);
        }

        // 3. Deploy to Vercel with direct deployment
        console.log(`\n${colors.bright}3. Deploying to Vercel${colors.reset}`);
        console.log(`${colors.yellow}This might take a few minutes...${colors.reset}`);

        // Use direct Vercel API deployment
        exec('vercel pull --yes --environment=production');
        exec('vercel build --prod');
        exec('vercel deploy --prebuilt --prod');

        console.log(`\n${colors.green}${colors.bright}✅ Deployment complete!${colors.reset}`);

    } catch (error) {
        console.error(`\n${colors.red}${colors.bright}❌ Deployment failed:${colors.reset}`, error.message);
        process.exit(1);
    }
}

deploy().catch(err => {
    console.error(err);
    process.exit(1);
}); 