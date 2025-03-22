// Direct password verification test
// Run with: node verify-login.js email password
require('dotenv').config();
const bcrypt = require('bcrypt');
const { neon } = require('@neondatabase/serverless');

// Create a SQL executor for direct database access
const sql = neon(process.env.DATABASE_URL);

async function verifyCredentials(email, password) {
    console.log(`🔐 Testing login for email: ${email}`);

    try {
        // Step 1: Get user by email directly from database
        const users = await sql`
            SELECT id, email, password_hash 
            FROM "Users" 
            WHERE email = ${email}
        `;

        if (!users || users.length === 0) {
            console.log(`❌ User not found with email: ${email}`);
            return false;
        }

        const user = users[0];
        console.log(`✅ Found user: ${user.id}`);

        // Step 2: Detailed password hash analysis
        console.log(`\nPassword Hash Details:`);
        console.log(`• Hash: ${user.password_hash}`);
        console.log(`• Length: ${user.password_hash.length}`);
        console.log(`• Format valid: ${user.password_hash.startsWith('$2') ? 'Yes' : 'No'}`);

        // Step 3: Try all possible comparison methods
        console.log(`\nTesting password verification methods...`);

        // Method 1: Standard bcrypt compare
        try {
            console.log(`\nMethod 1: Standard bcrypt.compare()`);
            const isValid1 = await bcrypt.compare(password, user.password_hash);
            console.log(`Result: ${isValid1 ? '✅ Valid' : '❌ Invalid'}`);

            if (isValid1) {
                console.log(`\n🎉 SUCCESS: Standard bcrypt verification works!`);
                console.log(`This indicates the auth system should also work with NextAuth.`);
            }
        } catch (error) {
            console.log(`❌ Error with standard bcrypt compare: ${error.message}`);
        }

        // Method 2: Manual hash and string comparison
        try {
            console.log(`\nMethod 2: Manual string comparison of hash components`);

            // Extract salt from stored hash
            const saltRounds = 10;
            const salt = user.password_hash.split('$')[2];

            if (salt) {
                // Hash the input password with the same salt
                const hashedInput = await bcrypt.hash(password, `$2${salt}`);
                const stringMatch = hashedInput === user.password_hash;

                console.log(`Input password hashed: ${hashedInput}`);
                console.log(`Stored hash:          ${user.password_hash}`);
                console.log(`String equality:     ${stringMatch ? '✅ Match' : '❌ No match'}`);
            } else {
                console.log(`❌ Could not extract salt from hash for manual comparison`);
            }
        } catch (error) {
            console.log(`❌ Error with manual comparison: ${error.message}`);
        }

        // Method 3: Generate a fresh hash and compare
        try {
            console.log(`\nMethod 3: Comparing freshly hashed password`);
            const freshHash = await bcrypt.hash(password, 10);
            console.log(`Fresh hash: ${freshHash}`);
            console.log(`Stored hash: ${user.password_hash}`);

            // Fresh hashes will be different due to salt, but both should verify the same password
            const verifyFresh = await bcrypt.compare(password, freshHash);
            console.log(`Verifying with fresh hash: ${verifyFresh ? '✅ Valid' : '❌ Invalid'}`);
        } catch (error) {
            console.log(`❌ Error with fresh hash: ${error.message}`);
        }

        // Step 4: Print auth-related files information
        console.log(`\nAuth-related files check (if they exist):`);
        const fs = require('fs');
        const authFiles = [
            'lib/auth.ts',
            'pages/api/auth/[...nextauth].js',
            'app/api/auth/[...nextauth]/route.ts',
            'app/api/auth/login-direct/route.ts',
            'app/api/auth/token-login/route.ts'
        ];

        for (const file of authFiles) {
            if (fs.existsSync(file)) {
                console.log(`✅ ${file} exists`);
            } else {
                console.log(`❌ ${file} not found`);
            }
        }

        return true;
    } catch (error) {
        console.error(`❌ Error verifying credentials:`, error);
        return false;
    }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('Please provide both email and password:');
    console.log('node verify-login.js your@email.com yourpassword');
    process.exit(1);
}

console.log(`Starting credential verification for ${email}`);
verifyCredentials(email, password); 