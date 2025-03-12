/**
 * SKAPA TESTANVÄNDARE I NEXTAUTH
 * ==============================
 * 
 * Detta script skapar en testanvändare direkt i NextAuth-databasen.
 * Kör med Node.js:
 * 
 * node scripts/create-test-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('====================================================');
    console.log('🔄 SKAPAR TESTANVÄNDARE FÖR INLOGGNING 🔄');
    console.log('====================================================');

    try {
        // Kontrollera om testanvändaren redan finns
        const existingUser = await prisma.user.findUnique({
            where: {
                email: 'test@example.com',
            },
        });

        if (existingUser) {
            console.log('ℹ️ Testanvändare finns redan. Återställer lösenord...');

            // Hasha lösenordet
            const hashedPassword = await bcrypt.hash('Password123', 10);

            // Uppdatera användaren
            await prisma.user.update({
                where: {
                    email: 'test@example.com',
                },
                data: {
                    password: hashedPassword,
                },
            });

            console.log('✅ Testanvändare uppdaterad!');
        } else {
            console.log('ℹ️ Skapar ny testanvändare...');

            // Hasha lösenordet
            const hashedPassword = await bcrypt.hash('Password123', 10);

            // Skapa användaren
            const user = await prisma.user.create({
                data: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: hashedPassword,
                    emailVerified: new Date(),
                },
            });

            // Skapa en prenumeration för användaren
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    plan: 'Free',
                    status: 'active',
                    billingCycle: 'monthly',
                },
            });

            console.log('✅ Testanvändare skapad!');
        }

        console.log('\n📝 INLOGGNINGSUPPGIFTER:');
        console.log('------------------------------------');
        console.log('E-post: test@example.com');
        console.log('Lösenord: Password123');
        console.log('------------------------------------');

        console.log('\n🌐 Du kan nu logga in på:');
        console.log('http://localhost:3001/auth/login');
        console.log('====================================================');
    } catch (error) {
        console.error('❌ Fel vid skapande av testanvändare:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 