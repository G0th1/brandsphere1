/**
 * VERCEL DATABASE MIGRATION SCRIPT
 * ================================
 * 
 * Detta skript körs efter deployment för att hantera databasmigrationer på Vercel.
 * Det använder Prisma CLI för att köra migrationerna och tillåter direktanslutning
 * utan connection pooling, vilket kan orsaka problem med Vercel.
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('====================================================');
    console.log('🔄 INITIERAR DATABASMIGRERING PÅ VERCEL 🔄');
    console.log('====================================================');

    try {
        // Kör databasmigrering
        console.log('🔄 Kör Prisma migrering...');

        try {
            // Använd direktanslutning för migrations
            execSync('DATABASE_URL="$POSTGRES_URL_NON_POOLING" npx prisma migrate deploy', {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    DATABASE_URL: process.env.POSTGRES_URL_NON_POOLING
                }
            });
            console.log('✅ Databasmigrering slutförd');
        } catch (error) {
            console.error('⚠️ Fel vid databasmigrering:', error);
            console.log('🔄 Försöker ansluta till databasen direkt för att verifiera anslutningen...');
        }

        // Skapa en Prisma-klient med direktanslutning
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.POSTGRES_URL_NON_POOLING
                }
            }
        });

        try {
            // Kontrollera anslutningen
            console.log('🔄 Testar databasanslutningen...');
            const result = await prisma.$queryRaw`SELECT 1 as test`;
            console.log('✅ Databasanslutning fungerar:', result);

            // Kolla om det finns användare
            const userCount = await prisma.user.count();
            console.log(`ℹ️ Antal användare i databasen: ${userCount}`);

            console.log('====================================================');
            console.log('✅ DATABASKONTROLL SLUTFÖRD');
            console.log('====================================================');
        } catch (error) {
            console.error('❌ Fel vid kontroll av databasen:', error);
            console.log('🔍 DEBUG INFO:');
            console.log('DATABASE_URL:', process.env.DATABASE_URL);
            console.log('POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING);

            throw error;
        } finally {
            await prisma.$disconnect();
        }
    } catch (error) {
        console.error('❌ KRITISKT FEL:', error);
        process.exit(1);
    }
}

main(); 