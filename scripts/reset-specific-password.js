#!/usr/bin/env node

/**
 * Reset Password for Specific User
 * 
 * This script resets the password for a specific user by email
 * to help recover from authentication issues.
 */

const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
const readline = require('readline');
require('dotenv').config();

// Helpers
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Main function
async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ ERROR: DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    try {
        console.log('🔐 Connecting to database...');
        const sql = neon(process.env.DATABASE_URL);

        // Test connection
        const testResult = await sql`SELECT 1 as test`;
        console.log(`✅ Database connection successful`);

        // Get email input
        const targetEmail = await question('Enter the email of the user whose password you want to reset: ');
        if (!targetEmail) {
            console.error('❌ Email is required');
            process.exit(1);
        }

        // Check if user exists
        const users = await sql`
      SELECT id, email FROM "Users" WHERE email = ${targetEmail}
    `;

        if (!users || users.length === 0) {
            console.error(`❌ User with email ${targetEmail} not found`);
            process.exit(1);
        }

        const user = users[0];
        console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

        // Confirm password reset
        const confirmReset = await question(`Are you sure you want to reset the password for ${user.email}? (y/n): `);
        if (confirmReset.toLowerCase() !== 'y') {
            console.log('Password reset cancelled');
            process.exit(0);
        }

        // Get new password
        const newPassword = await question('Enter new password: ');
        if (!newPassword || newPassword.length < 6) {
            console.error('❌ Password must be at least 6 characters');
            process.exit(1);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`Generated new password hash: ${hashedPassword.substring(0, 10)}...`);

        // Update the password
        await sql`
      UPDATE "Users"
      SET password_hash = ${hashedPassword}
      WHERE id = ${user.id}
    `;

        console.log(`✅ Password reset successful for ${user.email}`);
        console.log(`New login credentials:`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${newPassword}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        rl.close();
    }
}

main(); 