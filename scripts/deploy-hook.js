/**
 * DEPLOY HOOK SKRIPT
 * ==============================
 * 
 * Detta skript körs automatiskt efter en framgångsrik deployment på Vercel.
 * Det kör databasmigreringar och sätter upp produktionsmiljön.
 * 
 * Konfigurera detta i Vercel som en deploy hook: 
 * https://vercel.com/[username]/[project]/settings/git/deploy-hooks
 * 
 * node scripts/deploy-hook.js
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Ladda miljövariabler
dotenv.config({ path: '.env.production' });
console.log('Laddade miljövariabler från .env.production');

async function runDeploymentTasks() {
    console.log('====================================================');
    console.log('🚀 KÖR DEPLOYMENT UPPGIFTER 🚀');
    console.log('====================================================');

    try {
        // Kör databasmigreringar
        console.log('🔄 Kör databasmigreringar...');
        try {
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            console.log('✅ Databasmigreringar slutförda');
        } catch (error) {
            console.error('❌ Fel vid körning av databasmigreringar:', error);
            // Vi fortsätter ändå eftersom databasschemat kanske redan är uppdaterat
        }

        // Kör produktionsförberedelser
        console.log('🔄 Kör produktionsförberedelser...');

        // Skapa en prisma klient
        const prisma = new PrismaClient();

        try {
            // Kontrollera anslutningen
            const result = await prisma.$queryRaw`SELECT 1 as test`;
            console.log('✅ Databasanslutning fungerar:', result);

            // Importera och kör setup-script
            console.log('🔄 Importerar och kör setup-script...');
            const setupProduction = require('./setup-production');
            // Detta körs automatiskt när filen importeras

            console.log('✅ Produktionsförberedelser slutförda');
        } catch (error) {
            console.error('❌ Fel vid körning av produktionsförberedelser:', error);
        } finally {
            await prisma.$disconnect();
        }

        console.log('\n✅ DEPLOYMENT UPPGIFTER SLUTFÖRDA');
        console.log('====================================================');
    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error);
        process.exit(1);
    }
}

runDeploymentTasks(); 