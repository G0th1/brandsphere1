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
const readline = require('readline');

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

// Skapa en rl interface för användarinput
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fråga användaren om information
function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

async function deploy() {
    console.log('====================================================');
    console.log('🚀 STARTAR VERCEL DEVELOPMENT DEPLOYMENT 🚀');
    console.log('====================================================');

    try {
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

        // Fråga användaren om de vill skapa en ny projektinstans eller använda en befintlig
        const useExisting = await askQuestion('Vill du använda ett befintligt Vercel-projekt? (y/n): ');

        if (useExisting.toLowerCase() === 'y') {
            // Kör normal vercel deploy
            console.log('🔄 Deploying till befintligt Vercel-projekt...');
            try {
                execSync('vercel --prod', { stdio: 'inherit' });
                console.log('✅ Deployment till Vercel slutförd!');
            } catch (error) {
                console.error('❌ Vercel deployment misslyckades:', error);
                throw error;
            }
        } else {
            // Skapa nytt projekt och ställ frågor om miljövariabler
            console.log('🔄 Skapar nytt Vercel-projekt...');

            // Skapa projektet
            try {
                execSync('vercel', { stdio: 'inherit' });
                console.log('✅ Vercel-projekt skapat!');
            } catch (error) {
                console.error('❌ Vercel projekt skapande misslyckades:', error);
                throw error;
            }

            // Fråga om användaren vill konfigurera miljövariabler
            const setupEnv = await askQuestion('Vill du konfigurera miljövariabler för projektet? (y/n): ');

            if (setupEnv.toLowerCase() === 'y') {
                console.log('�� Konfigurerar miljövariabler...');

                for (const envVar of ENV_VARS_TO_SET) {
                    if (process.env[envVar]) {
                        console.log(`Ställer in ${envVar}...`);
                        // Stänger inte rl här eftersom vi behöver den för nästa iteration
                        try {
                            execSync(`echo "${process.env[envVar]}" | vercel env add ${envVar} production`, { stdio: 'inherit' });
                            console.log(`✅ ${envVar} konfigurerad`);
                        } catch (error) {
                            console.log(`⚠️ Kunde inte konfigurera ${envVar}: ${error.message}`);
                        }
                    }
                }

                console.log('✅ Miljövariabler konfigurerade');

                // Kör deployment igen med de nya miljövariablerna
                console.log('🔄 Deploying med nya miljövariabler...');
                try {
                    execSync('vercel --prod', { stdio: 'inherit' });
                    console.log('✅ Deployment till Vercel slutförd!');
                } catch (error) {
                    console.error('❌ Vercel deployment misslyckades:', error);
                    throw error;
                }
            }
        }

        console.log('\n✅ DEPLOYMENT PROCESSEN SLUTFÖRD');
        console.log('====================================================');
        console.log('🌐 Kör nu följande för post-deploy setup på Vercel:');
        console.log('vercel run post-deploy');
        console.log('====================================================');
    } catch (error) {
        console.error('❌ Deployment misslyckades:', error);
    } finally {
        rl.close();
    }
}

deploy(); 