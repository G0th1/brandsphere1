#!/usr/bin/env node

/**
 * Password Hash Repair Tool
 * 
 * This script diagnoses and fixes issues with password hashes stored in the database.
 * It identifies incorrectly formatted hashes and regenerates them with proper bcrypt formatting.
 */

const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
const readline = require('readline');
require('dotenv').config();

// Helper for interactive prompts
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
        console.log('🔄 Password Hash Repair Tool');
        console.log('===========================\n');

        console.log('🔐 Connecting to database...');
        const sql = neon(process.env.DATABASE_URL);

        // Test connection
        const testResult = await sql`SELECT 1 as test`;
        console.log(`✅ Database connection successful\n`);

        // Check database schema
        console.log('📊 Checking database schema...');
        const schemaCheck = await sql`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'Users' 
            AND column_name = 'password_hash'
        `;

        if (schemaCheck.length === 0) {
            console.error('❌ password_hash column not found in Users table');
            process.exit(1);
        }

        const passwordColumn = schemaCheck[0];
        console.log(`✅ Found password_hash column: ${passwordColumn.data_type}` +
            (passwordColumn.character_maximum_length ?
                ` (max length: ${passwordColumn.character_maximum_length})` : ''));

        // Get all users
        console.log('\n👥 Fetching all users...');
        const users = await sql`SELECT id, email, password_hash FROM "Users"`;
        console.log(`Found ${users.length} users in database`);

        // Validate and fix password hashes
        console.log('\n🔍 Checking and fixing password hashes...');

        let validHashes = 0;
        let fixedHashes = 0;
        let skippedHashes = 0;

        for (const user of users) {
            process.stdout.write(`Processing ${user.email}... `);

            // Check if hash exists
            if (!user.password_hash) {
                console.log('❌ No password hash found, setting default password');

                // Set default password
                const newHash = await bcrypt.hash('password', 10);
                try {
                    await sql`
                        UPDATE "Users"
                        SET password_hash = ${newHash}
                        WHERE id = ${user.id}
                    `;
                    console.log('  ✅ Default password set successfully');
                    fixedHashes++;
                } catch (updateError) {
                    console.error('  ❌ Failed to set default password:', updateError);
                }
                continue;
            }

            // Check hash format
            const validHashFormat = /^\$2[aby]\$\d+\$/.test(user.password_hash);

            if (validHashFormat) {
                // Hash looks valid, but let's verify it works with bcrypt
                try {
                    // Test if the hash can be used with bcrypt at all
                    const testResult = await bcrypt.compare('test-password-that-wont-match', user.password_hash);
                    console.log('✅ Hash has valid format and works with bcrypt');
                    validHashes++;
                } catch (error) {
                    console.log('⚠️ Hash has valid format but fails with bcrypt');

                    // Fix: regenerate hash
                    const shouldFix = await question('  Do you want to reset the password? (y/n): ');
                    if (shouldFix.toLowerCase() === 'y') {
                        const newPassword = await question('  Enter new password: ');
                        if (!newPassword || newPassword.length < 6) {
                            console.log('  ❌ Password must be at least 6 characters, using "password"');
                            const defaultHash = await bcrypt.hash('password', 10);
                            try {
                                await sql`
                                    UPDATE "Users"
                                    SET password_hash = ${defaultHash}
                                    WHERE id = ${user.id}
                                `;
                                console.log('  ✅ Default password set successfully');
                                fixedHashes++;
                            } catch (updateError) {
                                console.error('  ❌ Failed to update password:', updateError);
                            }
                        } else {
                            const newHash = await bcrypt.hash(newPassword, 10);
                            try {
                                await sql`
                                    UPDATE "Users"
                                    SET password_hash = ${newHash}
                                    WHERE id = ${user.id}
                                `;
                                console.log('  ✅ Password updated successfully');
                                fixedHashes++;
                            } catch (updateError) {
                                console.error('  ❌ Failed to update password:', updateError);
                            }
                        }
                    } else {
                        skippedHashes++;
                    }
                }
            } else {
                console.log('❌ Invalid hash format');

                // Show hash details
                console.log(`  Hash: ${user.password_hash.substring(0, 10)}... (length: ${user.password_hash.length})`);

                // Fix: regenerate hash
                const shouldFix = await question('  Do you want to reset the password? (y/n): ');
                if (shouldFix.toLowerCase() === 'y') {
                    const newPassword = await question('  Enter new password: ');
                    if (!newPassword || newPassword.length < 6) {
                        console.log('  ❌ Password must be at least 6 characters, using "password"');
                        const defaultHash = await bcrypt.hash('password', 10);
                        try {
                            await sql`
                                UPDATE "Users"
                                SET password_hash = ${defaultHash}
                                WHERE id = ${user.id}
                            `;
                            console.log('  ✅ Default password set successfully');
                            fixedHashes++;
                        } catch (updateError) {
                            console.error('  ❌ Failed to update password:', updateError);
                        }
                    } else {
                        const newHash = await bcrypt.hash(newPassword, 10);
                        try {
                            await sql`
                                UPDATE "Users"
                                SET password_hash = ${newHash}
                                WHERE id = ${user.id}
                            `;
                            console.log('  ✅ Password updated successfully');
                            fixedHashes++;
                        } catch (updateError) {
                            console.error('  ❌ Failed to update password:', updateError);
                        }
                    }
                } else {
                    skippedHashes++;
                }
            }
        }

        // Summary
        console.log('\n📊 Summary:');
        console.log(`  ✅ Valid hashes: ${validHashes}`);
        console.log(`  🔄 Fixed hashes: ${fixedHashes}`);
        console.log(`  ⏭️ Skipped hashes: ${skippedHashes}`);

        // Create test user
        console.log('\n🧪 Creating test user to verify authentication flow...');

        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'testpassword123';

        try {
            // Hash the password
            const testHash = await bcrypt.hash(testPassword, 10);
            console.log(`Generated hash for test: ${testHash.substring(0, 20)}...`);

            // Check if user already exists
            const existingUser = await sql`
                SELECT id FROM "Users" WHERE email = ${testEmail}
            `;

            if (existingUser.length > 0) {
                // Update existing user
                await sql`
                    UPDATE "Users"
                    SET password_hash = ${testHash}
                    WHERE email = ${testEmail}
                `;
                console.log(`✅ Updated existing test user: ${testEmail}`);
            } else {
                // Create new user
                await sql`
                    INSERT INTO "Users" (
                        id, 
                        email,
                        password_hash,
                        role,
                        created_at
                    ) VALUES (
                        gen_random_uuid(),
                        ${testEmail},
                        ${testHash},
                        'user',
                        NOW()
                    )
                `;
                console.log(`✅ Test user created: ${testEmail}`);
            }

            // Verify retrieval
            const testUser = await sql`
                SELECT id, email, password_hash FROM "Users" WHERE email = ${testEmail}
            `;

            if (testUser.length > 0) {
                console.log('✅ Test user retrieved from database');

                // Test hash verification
                const retrievedHash = testUser[0].password_hash;
                console.log(`Retrieved hash: ${retrievedHash.substring(0, 20)}...`);

                try {
                    const verifyResult = await bcrypt.compare(testPassword, retrievedHash);
                    console.log(`Verification test: ${verifyResult ? '✅ Success' : '❌ Failed'}`);

                    if (!verifyResult) {
                        throw new Error('Verification failed');
                    }
                } catch (verifyError) {
                    console.error('❌ Verification error:', verifyError);
                    console.log('Trying to fix test user password...');

                    // Try fixing the test user
                    const fixHash = await bcrypt.hash(testPassword, 10);
                    await sql`
                        UPDATE "Users"
                        SET password_hash = ${fixHash}
                        WHERE email = ${testEmail}
                    `;

                    // Verify again
                    const fixedUser = await sql`
                        SELECT password_hash FROM "Users" WHERE email = ${testEmail}
                    `;

                    if (fixedUser.length > 0) {
                        const fixedVerify = await bcrypt.compare(testPassword, fixedUser[0].password_hash);
                        console.log(`Fixed verification test: ${fixedVerify ? '✅ Success' : '❌ Failed'}`);
                    }
                }
            }

            console.log(`\n🔑 Test credentials: ${testEmail} / ${testPassword}`);
        } catch (testError) {
            console.error('❌ Error creating test user:', testError);
        }

        rl.close();
        console.log('\n✅ Password hash repair completed successfully');
    } catch (error) {
        console.error('\n❌ Error:', error);
        rl.close();
        process.exit(1);
    }
}

// Run the main function
main(); 