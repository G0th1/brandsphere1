// Run with: node inspect-user.js your@email.com
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function inspectUser(email) {
    try {
        console.log(`Looking up user with email: ${email}`);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password_hash: true,
                role: true,
                created_at: true
            }
        });

        if (!user) {
            console.log(`⚠️ User not found with email: ${email}`);
            return;
        }

        console.log(`\n===== USER INFORMATION =====`);
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role || 'user'}`);
        console.log(`Created: ${user.created_at}`);

        // Password hash diagnostics
        console.log(`\n===== PASSWORD HASH DETAILS =====`);
        if (!user.password_hash) {
            console.log(`⚠️ No password hash found!`);
        } else {
            console.log(`Hash: ${user.password_hash}`);
            console.log(`Hash length: ${user.password_hash.length}`);
            console.log(`Hash format valid: ${user.password_hash.startsWith('$2') ? 'Yes' : 'No'}`);

            // Test password validation with a test password
            const testPassword = 'password123';
            try {
                const isValid = await bcrypt.compare(testPassword, user.password_hash);
                console.log(`\nTest bcrypt validation (with "${testPassword}"): ${isValid ? 'Works' : 'Fails'}`);
            } catch (error) {
                console.log(`\n⚠️ Bcrypt validation error: ${error.message}`);
            }
        }

        console.log(`\n===== RECOMMENDATIONS =====`);
        if (!user.password_hash) {
            console.log(`• Set a password hash with: node fix-password.js ${email} yourNewPassword`);
        } else if (!user.password_hash.startsWith('$2')) {
            console.log(`• Reset password hash with: node fix-password.js ${email} yourNewPassword`);
        } else {
            console.log(`• Password hash appears to be valid.`);
            console.log(`• If login still fails, try: node fix-password.js ${email} yourNewPassword`);
        }
    } catch (error) {
        console.error("Error inspecting user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
    console.log("Please provide an email address: node inspect-user.js your@email.com");
    process.exit(1);
}

inspectUser(email);