#!/usr/bin/env node

/**
 * Authentication Diagnostic & Repair Tool
 * 
 * This script diagnoses and repairs issues with authentication in the system.
 * It checks database schema, validates password hashes, and fixes issues.
 */

const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const readline = require('readline');
require('dotenv').config();

// Helpers
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ ERROR: DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    try {
        console.log('🔄 Authentication System Diagnostic & Repair Tool');
        console.log('================================================\n');

        console.log('🔐 Connecting to database...');
        const sql = neon(process.env.DATABASE_URL);

        // Test connection
        const testResult = await sql`SELECT 1 as test`;
        console.log(`✅ Database connection successful\n`);

        // 1. Check database schema
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
        console.log(`Found password_hash column: ${passwordColumn.data_type}` +
            (passwordColumn.character_maximum_length ?
                ` (max length: ${passwordColumn.character_maximum_length})` : ''));

        // If not TEXT/VARCHAR with sufficient length, prompt to fix
        if ((passwordColumn.data_type !== 'text' &&
            (passwordColumn.data_type !== 'character varying' ||
                passwordColumn.character_maximum_length < 100))) {
            console.log('\n⚠️ WARNING: password_hash column might not be optimal for storing bcrypt hashes');
            console.log('Bcrypt hashes are typically 60 characters long and should be stored in TEXT or VARCHAR(100+)');

            const shouldFix = await question('Do you want to alter the column type to TEXT? (y/n): ');
            if (shouldFix.toLowerCase() === 'y') {
                try {
                    await sql`ALTER TABLE "Users" ALTER COLUMN password_hash TYPE TEXT`;
                    console.log('✅ Column type changed to TEXT');
                } catch (alterError) {
                    console.error('❌ Failed to alter column:', alterError);
                }
            }
        } else {
            console.log('✅ Password column type is appropriate');
        }

        // 2. Fetch all users and validate their password hashes
        console.log('\n👥 Fetching all users...');
        const users = await sql`
      SELECT id, email, password_hash FROM "Users"
    `;

        console.log(`Found ${users.length} users in database`);

        // 3. Validate password hashes
        console.log('\n🔍 Validating password hashes...');

        let validHashes = 0;
        let invalidHashes = 0;
        let fixedHashes = 0;

        for (const user of users) {
            process.stdout.write(`Checking ${user.email}... `);

            if (!user.password_hash) {
                console.log('❌ No password hash found');
                invalidHashes++;
                continue;
            }

            // Check if hash format is valid
            const validHashFormat = /^\$2[aby]\$\d+\$/.test(user.password_hash);

            if (validHashFormat) {
                console.log('✅ Valid hash format');
                validHashes++;
            } else {
                console.log('❌ Invalid hash format');
                invalidHashes++;

                // Show hash details
                console.log(`  Hash: ${user.password_hash.substring(0, 10)}... (length: ${user.password_hash.length})`);

                // Prompt to fix
                const shouldFix = await question('  Do you want to set a new password for this user? (y/n): ');
                if (shouldFix.toLowerCase() === 'y') {
                    const newPassword = await question('  Enter new password: ');
                    if (!newPassword || newPassword.length < 6) {
                        console.log('  ❌ Password must be at least 6 characters, skipping');
                        continue;
                    }

                    try {
                        // Hash the new password and update
                        const newHash = await bcrypt.hash(newPassword, 10);
                        await sql`
              UPDATE "Users"
              SET password_hash = ${newHash}
              WHERE id = ${user.id}
            `;
                        console.log('  ✅ Password updated successfully');
                        fixedHashes++;

                        // Verify the update
                        const updated = await sql`
              SELECT password_hash FROM "Users" WHERE id = ${user.id}
            `;

                        if (updated.length > 0) {
                            const hash = updated[0].password_hash;
                            const verifyResult = await bcrypt.compare(newPassword, hash);
                            console.log(`  Verification test: ${verifyResult ? '✅ Success' : '❌ Failed'}`);

                            // If verification fails, try testing with clean string
                            if (!verifyResult) {
                                const cleanHash = Buffer.from(hash).toString('utf-8');
                                const cleanVerify = await bcrypt.compare(newPassword, cleanHash);
                                console.log(`  Clean string verification test: ${cleanVerify ? '✅ Success' : '❌ Failed'}`);
                            }
                        }
                    } catch (updateError) {
                        console.error(`  ❌ Failed to update password:`, updateError);
                    }
                }
            }
        }

        // 4. Create test user to verify authentication flow
        console.log('\n🧪 Creating test user to verify authentication flow...');

        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'testpassword123';
        let testUserId;

        try {
            // Hash the password
            const testHash = await bcrypt.hash(testPassword, 10);
            console.log(`Generated hash for test: ${testHash.substring(0, 10)}...`);

            // Create the user
            testUserId = crypto.randomUUID();
            await sql`
        INSERT INTO "Users" (
          id, 
          email,
          password_hash,
          role,
          created_at
        ) VALUES (
          ${testUserId}::uuid,
          ${testEmail},
          ${testHash},
          'user',
          NOW()
        )
      `;
            console.log(`✅ Test user created: ${testEmail}`);

            // Verify retrieval
            const testUser = await sql`
        SELECT email, password_hash FROM "Users" WHERE id = ${testUserId}
      `;

            if (testUser.length > 0) {
                console.log('✅ Test user retrieved from database');

                // Test hash verification
                const retrievedHash = testUser[0].password_hash;
                console.log(`Retrieved hash: ${retrievedHash.substring(0, 10)}...`);

                const verifyResult = await bcrypt.compare(testPassword, retrievedHash);
                console.log(`Verification test: ${verifyResult ? '✅ Success' : '❌ Failed'}`);

                if (!verifyResult) {
                    // Try with buffer conversion
                    const cleanHash = Buffer.from(retrievedHash).toString('utf-8');
                    const cleanVerify = await bcrypt.compare(testPassword, cleanHash);
                    console.log(`Clean string verification: ${cleanVerify ? '✅ Success' : '❌ Failed'}`);
                }
            }
        } catch (testUserError) {
            console.error('❌ Failed to create or verify test user:', testUserError);
        }

        // 5. Create compatibility layer
        console.log('\n🛠️ Creating auth compatibility layer...');
        const createCompatLayer = await question('Do you want to create an auth compatibility layer? (y/n): ');

        if (createCompatLayer.toLowerCase() === 'y') {
            try {
                // Check if the auth_compat table exists
                const tableCheck = await sql`
          SELECT to_regclass('public.auth_compat') as table_exists
        `;

                const tableExists = tableCheck[0].table_exists !== null;

                if (!tableExists) {
                    // Create a compatibility table for authentication
                    await sql`
            CREATE TABLE auth_compat (
              id SERIAL PRIMARY KEY,
              user_id UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
              auth_token TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
              UNIQUE(user_id)
            )
          `;
                    console.log('✅ Created auth_compat table');
                } else {
                    console.log('ℹ️ auth_compat table already exists');
                }

                // Generate auth tokens for all users
                console.log('Generating auth tokens for all users...');

                for (const user of users) {
                    // Check if user already has a token
                    const existingToken = await sql`
            SELECT id FROM auth_compat WHERE user_id = ${user.id}
          `;

                    if (existingToken.length === 0) {
                        // Generate a secure token
                        const token = crypto.randomBytes(32).toString('hex');
                        const oneYearFromNow = new Date();
                        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

                        await sql`
              INSERT INTO auth_compat (user_id, auth_token, expires_at)
              VALUES (${user.id}, ${token}, ${oneYearFromNow.toISOString()})
            `;
                        console.log(`✅ Created token for ${user.email}`);
                    } else {
                        console.log(`ℹ️ Token already exists for ${user.email}`);
                    }
                }

                console.log('✅ Auth compatibility layer created successfully');
            } catch (compatError) {
                console.error('❌ Failed to create compatibility layer:', compatError);
            }
        }

        // 6. Summary
        console.log('\n📋 SUMMARY');
        console.log('==========');
        console.log(`Total users: ${users.length}`);
        console.log(`Valid hashes: ${validHashes}`);
        console.log(`Invalid hashes: ${invalidHashes}`);
        console.log(`Fixed hashes: ${fixedHashes}`);

        if (validHashes === users.length) {
            console.log('\n✅ All password hashes are valid');
        } else {
            console.log('\n⚠️ Some password hashes are still invalid');
        }

        // Cleanup
        if (testUserId) {
            const shouldDelete = await question('\nDo you want to delete the test user? (y/n): ');
            if (shouldDelete.toLowerCase() === 'y') {
                await sql`DELETE FROM "Users" WHERE id = ${testUserId}`;
                console.log('✅ Test user deleted');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        rl.close();
    }
}

main(); 