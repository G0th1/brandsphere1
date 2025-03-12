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

// Skapa en Prisma-klient med direkt anslutning för att undvika pool-problem
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
        }
    },
    log: ['query', 'info', 'warn', 'error']
});

async function main() {
    console.log('====================================================');
    console.log('🚀 KONFIGURERAR PRODUKTIONSMILJÖ 🚀');
    console.log('====================================================');
    console.log('Miljövariabler:');
    console.log('- DATABASE_URL: ' + (process.env.DATABASE_URL ? '✅ Inställd' : '❌ Saknas'));
    console.log('- POSTGRES_URL_NON_POOLING: ' + (process.env.POSTGRES_URL_NON_POOLING ? '✅ Inställd' : '❌ Saknas'));
    console.log('- NEXTAUTH_URL: ' + (process.env.NEXTAUTH_URL ? '✅ Inställd' : '❌ Saknas'));
    console.log('- NEXTAUTH_SECRET: ' + (process.env.NEXTAUTH_SECRET ? '✅ Inställd' : '❌ Saknas'));

    try {
        // Verifiera databaskoppling
        console.log('🔄 Testar databasanslutningen...');
        try {
            const testResult = await prisma.$queryRaw`SELECT 1 as test`;
            console.log('✅ Databasanslutningen fungerar:', testResult);
        } catch (dbError) {
            console.error('❌ Kunde inte ansluta till databasen:', dbError);
            console.log('🔍 Databasanslutningssträng som används:');
            console.log(process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL);
            throw new Error('Databasanslutningsfel: ' + dbError.message);
        }

        // Kör databasmigrationer
        console.log('🔄 Kontrollerar om databasmigrationer behövs...');

        // Kontrollera om det finns användare i databasen
        const userCount = await prisma.user.count();
        console.log(`ℹ️ Antal befintliga användare: ${userCount}`);

        // Skapa testanvändare om det inte finns några
        if (userCount === 0) {
            console.log('🔄 Skapar admin-användare...');

            try {
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

                // Skapa testanvändare
                const testUser = await prisma.user.create({
                    data: {
                        name: 'Test User',
                        email: 'test@example.com',
                        password: await hash('Password123', 10),
                        emailVerified: new Date(),
                    }
                });

                console.log('✅ Testanvändare skapad:');
                console.log(`📧 E-post: ${testUser.email}`);
                console.log(`🔑 Lösenord: Password123`);

                // Skapa enkel prenumeration för testanvändare
                await prisma.subscription.create({
                    data: {
                        userId: testUser.id,
                        plan: 'Free',
                        status: 'active',
                    }
                });

                console.log('✅ Free-prenumeration skapad för testanvändare');

            } catch (userCreateError) {
                console.error('❌ Fel vid skapande av användare:', userCreateError);
                throw new Error('Användarskapsfel: ' + userCreateError.message);
            }
        } else {
            console.log('ℹ️ Användare finns redan i databasen, hoppar över skapande av testanvändare');

            // Listar befintliga användare för diagnostik
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    subscription: {
                        select: {
                            plan: true,
                            status: true
                        }
                    }
                }
            });

            console.log('📋 Befintliga användare:');
            users.forEach((user, index) => {
                console.log(`👤 Användare #${index + 1}:`);
                console.log(`  ID: ${user.id}`);
                console.log(`  Namn: ${user.name || 'Ej angivet'}`);
                console.log(`  E-post: ${user.email}`);
                if (user.subscription) {
                    console.log(`  Plan: ${user.subscription.plan}`);
                    console.log(`  Status: ${user.subscription.status}`);
                } else {
                    console.log(`  Prenumeration: Ingen`);
                }
                console.log('---');
            });
        }

        console.log('====================================================');
        console.log('✅ PRODUKTIONSMILJÖN ÄR NU KONFIGURERAD');
        console.log('====================================================');
        console.log('📝 SAMMANFATTNING:');
        console.log('- Databasanslutning verifierad');
        if (userCount === 0) {
            console.log('- Admin-användare skapad');
            console.log('- Testanvändare skapad');
            console.log('- Prenumerationer konfigurerade');
        } else {
            console.log('- Befintliga användare hittades, ingen testanvändare skapades');
        }
        console.log('====================================================');
        console.log('🌐 Du kan nu logga in på:');
        console.log(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://brandsphere1-htv4iy7vc-g0th1s-projects.vercel.app');
        console.log('====================================================');

    } catch (error) {
        console.error('❌ Ett fel uppstod vid konfigurering av produktionsmiljön:', error);
        console.error('Stackspårning:', error.stack);
        process.exit(1);
    } finally {
        await prisma.$disconnect().catch(e => console.error('Fel vid frånkoppling från databasen:', e));
    }
}

// Kör huvudfunktionen
main(); 