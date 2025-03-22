// Run with: node list-users.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
    try {
        console.log(`Fetching all users from the database...`);

        // Get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (users.length === 0) {
            console.log(`\n⚠️ No users found in the database.`);
            return;
        }

        console.log(`\n===== USERS IN DATABASE (${users.length}) =====`);
        users.forEach((user, index) => {
            console.log(`\n[${index + 1}] User ID: ${user.id}`);
            console.log(`    Email: ${user.email}`);
            console.log(`    Role: ${user.role || 'user'}`);
            console.log(`    Created: ${user.created_at}`);
        });

        console.log(`\n===== NEXT STEPS =====`);
        console.log(`• To inspect a user: node inspect-user.js [email]`);
        console.log(`• To fix a password: node fix-password.js [email] [newpassword]`);

    } catch (error) {
        console.error("Error listing users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers(); 