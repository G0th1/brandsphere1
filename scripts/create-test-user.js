const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function createTestUser() {
    console.log('Creating test user...');

    try {
        // Kontrollera om användaren redan finns
        const existingUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' },
        });

        if (existingUser) {
            console.log('Test user already exists, updating password...');

            // Hasha lösenordet
            const hashedPassword = await bcrypt.hash('Password123', 10);

            // Uppdatera användaren
            await prisma.user.update({
                where: { email: 'test@example.com' },
                data: { password: hashedPassword },
            });

            console.log('Test user password updated.');
            return;
        }

        // Skapa en ny användare
        const hashedPassword = await bcrypt.hash('Password123', 10);

        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                emailVerified: new Date(),
            },
        });

        console.log('Test user created:', user);
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser(); 