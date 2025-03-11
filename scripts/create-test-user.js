/**
 * SKAPA TESTANVÄNDARE I NEXTAUTH
 * ==============================
 * 
 * Detta script skapar en testanvändare direkt i NextAuth-databasen.
 * Kör med Node.js:
 * 
 * node scripts/create-test-user.js
 */

const fs = require('fs');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

// Ladda miljövariabler från .env.local om den finns, annars från .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });
console.log(`Laddar miljövariabler från ${envPath}`);

// Skapa Prisma-klient
const prisma = new PrismaClient();

async function createTestUser() {
    console.log('🔄 Skapar testanvändare i NextAuth-databasen...');

    try {
        // Skapa testanvändare
        const email = 'test@example.com';
        const password = 'password123';
        const hashedPassword = await hash(password, 10);

        // Kontrollera om användaren redan finns
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`ℹ️ Användare ${email} finns redan i databasen.`);

            // Uppdatera lösenordet
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    password: hashedPassword,
                    emailVerified: new Date(),
                }
            });

            console.log(`✅ Uppdaterade lösenord för användare ${email}.`);
        } else {
            // Skapa ny användare
            const newUser = await prisma.user.create({
                data: {
                    email,
                    name: 'Test User',
                    password: hashedPassword,
                    emailVerified: new Date(), // Markera som verifierad
                }
            });

            console.log(`✅ Skapade ny användare ${email} med ID: ${newUser.id}`);

            // Skapa prenumeration för användaren
            await prisma.subscription.create({
                data: {
                    userId: newUser.id,
                    plan: "Free",
                    status: "active",
                    billingCycle: "monthly",
                }
            });

            console.log(`✅ Skapade prenumeration för användare ${email}.`);
        }

        console.log('\n🎉 Testanvändare skapad!');
        console.log('\nAnvändaruppgifter:');
        console.log(`E-post: ${email}`);
        console.log(`Lösenord: ${password}`);
        console.log('\nDu kan nu logga in med dessa uppgifter.');

    } catch (error) {
        console.error('❌ Kunde inte skapa testanvändare:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Kör funktionen
createTestUser(); 