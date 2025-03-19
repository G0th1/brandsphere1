#!/usr/bin/env node

/**
 * Reset User Password
 * 
 * A simple tool to directly reset a user's password in the database.
 * This bypasses the application login flow and directly sets a new password hash.
 */

const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Simple command line arguments parsing
const args = process.argv.slice(2);
const EMAIL = args[0];
const PASSWORD = args[1];

// Exit with error if no DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable not set');
    console.error('Please create a .env file with your database URL');
    process.exit(1);
}

// Exit with error if email or password is missing
if (!EMAIL || !PASSWORD) {
    console.error('❌ ERROR: Email and password arguments required');
    console.error('Usage: node reset-user-password.js <email> <password>');
    process.exit(1);
}

// Password validation
if (PASSWORD.length < 6) {
    console.error('❌ ERROR: Password must be at least 6 characters');
    process.exit(1);
}

async function resetPassword() {
    console.log(`🔄 Attempting to reset password for user: ${EMAIL}`);

    try {
        // Connect to the database using Neon serverless driver
        const sql = neon(process.env.DATABASE_URL);

        // Verify database connection
        console.log('🔌 Testing database connection...');
        const dbTest = await sql`SELECT 1 as test`;
        if (!dbTest || dbTest.length === 0 || !dbTest[0].test) {
            throw new Error('Failed to connect to database');
        }
        console.log('✅ Database connection successful');

        // Check if user exists
        console.log(`🔍 Looking for user with email: ${EMAIL}`);
        const users = await sql`
      SELECT id, email, password_hash FROM "Users" WHERE email = ${EMAIL}
    `;

        if (!users || users.length === 0) {
            console.error(`❌ User not found: ${EMAIL}`);
            process.exit(1);
        }

        const user = users[0];
        console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

        // Generate password hash
        console.log('🔐 Generating new password hash...');
        const passwordHash = await bcrypt.hash(PASSWORD, 10);

        // Update the user's password hash
        console.log('🔄 Updating password in database...');
        await sql`
      UPDATE "Users"
      SET password_hash = ${passwordHash}
      WHERE id = ${user.id}
    `;

        // Verify the password was updated correctly
        const updatedUser = await sql`
      SELECT password_hash FROM "Users" WHERE id = ${user.id}
    `;

        if (!updatedUser || updatedUser.length === 0) {
            throw new Error('Failed to retrieve updated user');
        }

        // Test if the new password works with bcrypt.compare
        const verifyResult = await bcrypt.compare(PASSWORD, updatedUser[0].password_hash);

        if (!verifyResult) {
            console.error('❌ Password verification failed. Hash may be corrupted.');
            process.exit(1);
        }

        console.log('✅ Password updated and verified successfully');
        console.log('\n🔑 New credentials:');
        console.log(`Email: ${EMAIL}`);
        console.log(`Password: ${PASSWORD}`);
        console.log('\nYou can now log in with these credentials.');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the password reset function
resetPassword(); 