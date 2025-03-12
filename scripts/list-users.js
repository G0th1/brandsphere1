/**
 * LISTA ANVÄNDARE I DATABASEN
 * ==============================
 * 
 * Detta script listar alla användare i databasen för att verifiera 
 * att autentiseringssystemet fungerar korrekt.
 * 
 * Kör med Node.js:
 * 
 * node scripts/list-users.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('====================================================');
    console.log('📋 LISTAR ALLA ANVÄNDARE I DATABASEN 📋');
    console.log('====================================================');

    try {
        console.log('🔄 Testar databasanslutningen...');
        try {
            const result = await prisma.$queryRaw`SELECT 1 as test`;
            console.log('✅ Databasanslutningen fungerar:', result);
        } catch (dbTestError) {
            console.error('❌ Kunde inte ansluta till databasen:', dbTestError);
            return;
        }

        console.log('🔄 Hämtar alla användare från databasen...');

        // Hämta alla användare direkt med SQL för att diagnostisera
        const rawUsers = await prisma.$queryRaw`SELECT id, email FROM "User"`;
        console.log('📊 Raw SQL resultat:', rawUsers);

        // Hämta alla användare med Prisma
        const users = await prisma.user.findMany({
            include: {
                subscription: true,
            },
        });

        console.log('📊 Prisma resultat:', users.map(u => ({ id: u.id, email: u.email })));

        if (users.length === 0) {
            console.log('⚠️ Inga användare hittades i databasen.');
            console.log('Kör node scripts/create-test-user.js för att skapa en testanvändare.');
        } else {
            console.log(`✅ Hittade ${users.length} användare i databasen:`);
            console.log('------------------------------------');

            users.forEach((user, index) => {
                console.log(`👤 Användare #${index + 1}:`);
                console.log(`ID: ${user.id}`);
                console.log(`Namn: ${user.name || 'Ej angivet'}`);
                console.log(`E-post: ${user.email}`);
                console.log(`E-post verifierad: ${user.emailVerified ? 'Ja' : 'Nej'}`);
                console.log(`Lösenord satt: ${user.password ? 'Ja' : 'Nej'}`);
                console.log(`Prenumeration: ${user.subscription ? user.subscription.plan : 'Ingen'}`);
                console.log(`Skapad: ${user.createdAt}`);
                console.log('------------------------------------');
            });
        }
    } catch (error) {
        console.error('❌ Fel vid hämtning av användare:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 