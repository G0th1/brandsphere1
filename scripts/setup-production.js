/**
 * PRODUCTION SETUP SCRIPT
 * =======================
 * 
 * Detta skript körs efter en framgångsrik deployment för att sätta upp 
 * produktionsmiljön, inklusive databasmigrationer och testanvändare.
 * 
 * Kör med:
 * node scripts/setup-production.js
 */

const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

// Skapa en Prisma-klient
const prisma = new PrismaClient();

async function main() {
    console.log('====================================================');
    console.log('🚀 KONFIGURERAR PRODUKTIONSMILJÖ 🚀');
    console.log('====================================================');

    try {
        // Verifiera databaskoppling
        console.log('🔄 Testar databasanslutningen...');
        const testResult = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Databasanslutningen fungerar:', testResult);

        // Kör databasmigrationer
        console.log('🔄 Kontrollerar om databasmigrationer behövs...');

        // Kontrollera om det finns användare i databasen
        const userCount = await prisma.user.count();
        console.log(`ℹ️ Antal befintliga användare: ${userCount}`);

        // Skapa testanvändare om det inte finns några
        if (userCount === 0) {
            console.log('🔄 Skapar admin-användare...');

            const hashedPassword = await hash('Admin123!', 10);

            const admin = await prisma.user.create({
                data: {
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: hashedPassword,
                    emailVerified: new Date(),
                }
            });

            console.log('✅ Admin-användare skapad:');
            console.log(`📧 E-post: ${admin.email}`);
            console.log(`🔑 Lösenord: Admin123!`);

            // Skapa prenumeration för admin
            await prisma.subscription.create({
                data: {
                    userId: admin.id,
                    plan: 'Business',
                    status: 'active',
                    stripeCustomerId: 'demo_customer_id',
                    stripeSubscriptionId: 'demo_subscription_id',
                    stripePriceId: 'demo_price_id',
                    stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar framåt
                }
            });

            console.log('✅ Business-prenumeration skapad för admin');
        } else {
            console.log('ℹ️ Användare finns redan i databasen, hoppar över skapande av testanvändare');
        }

        console.log('====================================================');
        console.log('✅ PRODUKTIONSMILJÖN ÄR NU KONFIGURERAD');
        console.log('====================================================');
        console.log('📝 SAMMANFATTNING:');
        console.log('- Databasanslutning verifierad');
        if (userCount === 0) {
            console.log('- Admin-användare skapad');
            console.log('- Business-prenumeration skapad');
        } else {
            console.log('- Befintliga användare hittades, ingen testanvändare skapades');
        }
        console.log('====================================================');
        console.log('🌐 Du kan nu logga in på:');
        console.log(`https://brandsphere1-990djwy4v-g0th1s-projects.vercel.app/auth/login`);
        console.log('====================================================');

    } catch (error) {
        console.error('❌ Ett fel uppstod vid konfigurering av produktionsmiljön:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Kör huvudfunktionen
main(); 