// Run with: node fix-password.js your@email.com newpassword
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixPassword(email, newPassword) {
    try {
        console.log(`Looking up user with email: ${email}`);

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password_hash: true
            }
        });

        if (!user) {
            console.log(`⚠️ User not found with email: ${email}`);
            return;
        }

        console.log(`✅ User found: ${user.id}`);
        console.log(`Current password hash: ${user.password_hash ?
            user.password_hash.substring(0, 10) + '...' : 'missing'}`);

        // Generate new bcrypt hash with salt rounds of 10
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`New password hash generated: ${hashedPassword.substring(0, 10)}...`);

        // Update the user's password
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash: hashedPassword
            },
            select: {
                id: true,
                email: true
            }
        });

        console.log(`✅ Password updated successfully for user: ${updatedUser.id}`);

        // Verify the password update
        const verifiedUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                password_hash: true
            }
        });

        if (verifiedUser.password_hash === hashedPassword) {
            console.log(`✅ Password hash verified in database`);

            // Test password validation
            const isValid = await bcrypt.compare(newPassword, verifiedUser.password_hash);
            console.log(`Password validation test: ${isValid ? 'PASSED' : 'FAILED'}`);

            if (isValid) {
                console.log(`\n🎉 SUCCESS: Password has been updated. You can now log in with your new password.`);
            } else {
                console.log(`\n⚠️ WARNING: Password was updated but validation test failed. Contact support.`);
            }
        } else {
            console.log(`\n⚠️ WARNING: Password hash in database doesn't match expected value.`);
        }
    } catch (error) {
        console.error("Error updating password:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get email and password from command line arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
    console.log("Please provide both email and new password:");
    console.log("node fix-password.js your@email.com newpassword");
    process.exit(1);
}

// Validate password length
if (newPassword.length < 8) {
    console.log("Password must be at least 8 characters long");
    process.exit(1);
}

console.log(`Starting password reset for: ${email}`);
fixPassword(email, newPassword); 