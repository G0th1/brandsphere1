/**
 * VERCEL DEVELOPMENT DEPLOY
 * ==============================
 * 
 * Detta skript hjälper till att förbereda och deploya till Vercel från en lokal utvecklingsmiljö.
 * Det fokuserar på att hantera miljövariabler och databasmigrationer på ett pålitligt sätt.
 * 
 * Kör med Node.js:
 * 
 * node scripts/vercel-dev-deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Läs .env filen
dotenv.config();

const ENV_VARS_TO_SET = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_FROM',
    'NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY',
    'NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY'
];

// Skapa en temporär .env.vercel för användning med Vercel CLI
function createTempVercelEnv() {
    console.log('🔧 Skapar temporär .env.vercel fil...');

    const envContent = ENV_VARS_TO_SET
        .filter(key => process.env[key])
        .map(key => `${key}=${process.env[key]}`)
        .join('\n');

    fs.writeFileSync('.env.vercel', envContent, 'utf8');
    console.log('✅ Skapade .env.vercel med följande variabler:');
    console.log(ENV_VARS_TO_SET.filter(key => process.env[key]).map(key => `- ${key}`).join('\n'));
}

// Städa upp den temporära filen
function cleanupTempFile() {
    console.log('🧹 Städar upp temporära filer...');
    if (fs.existsSync('.env.vercel')) {
        fs.unlinkSync('.env.vercel');
    }
    console.log('✅ Städning klar');
}

async function deploy() {
    console.log('====================================================');
    console.log('🚀 STARTAR VERCEL DEVELOPMENT DEPLOYMENT 🚀');
    console.log('====================================================');

    try {
        // Skapa temporär miljöfil
        createTempVercelEnv();

        // Commit lokala ändringar i git
        console.log('🔄 Lägger till alla filer till git...');
        try {
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Förbereder för Vercel deployment"', { stdio: 'inherit' });
            console.log('✅ Git commit skapad');
        } catch (error) {
            console.log('⚠️ Git commit misslyckades, fortsätter ändå...');
            // Vi fortsätter ändå, det kanske inte fanns några ändringar
        }

        // Deploya till Vercel med miljövariabler
        console.log('🔄 Deploying to Vercel...');
        try {
            execSync('vercel --env-file=.env.vercel --prod', { stdio: 'inherit' });
            console.log('✅ Deployment till Vercel slutförd!');
        } catch (error) {
            console.error('❌ Vercel deployment misslyckades:', error);
            throw error;
        }

        console.log('\n✅ DEPLOYMENT PROCESSEN SLUTFÖRD');
        console.log('====================================================');
        console.log('🌐 Kör nu följande för post-deploy setup på Vercel:');
        console.log('vercel run post-deploy');
        console.log('====================================================');
    } catch (error) {
        console.error('❌ Deployment misslyckades:', error);
    } finally {
        cleanupTempFile();
    }
}

deploy(); 