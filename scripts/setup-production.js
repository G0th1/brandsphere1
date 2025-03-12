/**
 * PRODUKTIONSMILJÖINSTÄLLNINGAR
 * ==============================
 * 
 * Detta script förbereder produktionsmiljön med testanvändare
 * och grundläggande konfigurationer. Körs efter deployment.
 * 
 * Kör med Node.js efter deployment:
 * 
 * node scripts/setup-production.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupProduction() {
    console.log('====================================================');
    console.log('🌐 FÖRBEREDER PRODUKTIONSMILJÖ 🌐');
    console.log('====================================================');

    try {
        console.log('🔄 Kontrollerar databasanslutning...');
        try {
            const result = await prisma.$queryRaw`SELECT 1 as test`;
            console.log('✅ Databasanslutning fungerar:', result);
        } catch (dbError) {
            console.error('❌ KRITISKT: Kunde inte ansluta till databasen:', dbError);
            return;
        }

        // Skapa admin-användare om den inte finns
        const adminEmail = 'admin@brandsphereai.com';

        console.log(`🔄 Kontrollerar om administratör (${adminEmail}) redan finns...`);

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('ℹ️ Administratör finns redan. Uppdaterar lösenord...');

            // Hasha ett nytt lösenord
            const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

            // Uppdatera användaren
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    password: hashedPassword,
                    emailVerified: new Date()
                }
            });

            console.log('✅ Administratör uppdaterad!');
        } else {
            console.log('ℹ️ Skapar administratör...');

            // Hasha lösenordet
            const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

            // Skapa användaren
            const user = await prisma.user.create({
                data: {
                    name: 'Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    emailVerified: new Date()
                }
            });

            // Skapa prenumeration
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    plan: 'Business',
                    status: 'active',
                    billingCycle: 'monthly'
                }
            });

            console.log('✅ Administratör skapad!');
        }

        console.log('\n📝 ADMIN-INLOGGNINGSUPPGIFTER:');
        console.log('------------------------------------');
        console.log('E-post: admin@brandsphereai.com');
        console.log('Lösenord: AdminPassword123!');
        console.log('------------------------------------');

        // Skapa även testanvändare
        const testEmail = 'test@example.com';
        console.log(`🔄 Kontrollerar om testanvändare (${testEmail}) finns...`);

        const existingTest = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (existingTest) {
            console.log('ℹ️ Testanvändare finns redan.');
        } else {
            console.log('ℹ️ Skapar testanvändare...');

            // Hasha lösenordet
            const hashedPassword = await bcrypt.hash('Password123', 10);

            // Skapa användaren
            const user = await prisma.user.create({
                data: {
                    name: 'Test User',
                    email: testEmail,
                    password: hashedPassword,
                    emailVerified: new Date()
                }
            });

            // Skapa prenumeration
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    plan: 'Free',
                    status: 'active',
                    billingCycle: 'monthly'
                }
            });

            console.log('✅ Testanvändare skapad!');
        }

        console.log('\n📝 TEST-INLOGGNINGSUPPGIFTER:');
        console.log('------------------------------------');
        console.log('E-post: test@example.com');
        console.log('Lösenord: Password123');
        console.log('------------------------------------');

        console.log('\n✅ PRODUKTIONSMILJÖN ÄR NU FÖRBEREDD');
        console.log('====================================================');
    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

setupProduction(); 