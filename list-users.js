// List all users in the database
// Run with: node list-users.js
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Create a SQL executor for direct database access
const sql = neon(process.env.DATABASE_URL);

async function listUsers() {
    console.log('📋 Listing all users in the database:');
    console.log('===================================');

    // Print Database URL (without password)
    const dbUrl = process.env.DATABASE_URL || '';
    const sanitizedDbUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
    console.log(`Database URL: ${sanitizedDbUrl}`);

    try {
        // First test connection 
        console.log('\n🔌 Testing database connection...');
        const testResult = await sql`SELECT 1 as test`;
        console.log(`Connection test: ${testResult ? '✅ Success' : '❌ Failed'}`);

        // Query all tables
        console.log('\n📊 Database Tables:');
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        if (tables && tables.length > 0) {
            tables.forEach(table => {
                console.log(`• ${table.table_name}`);
            });
        } else {
            console.log('No tables found');
        }

        // Query users directly - avoid dynamic table name
        console.log('\n👥 Querying users...');

        // Try a simple query first
        const users = await sql`SELECT * FROM "Users"`;

        if (!users || users.length === 0) {
            console.log('❌ No users found in the database');
            return;
        }

        console.log(`✅ Found ${users.length} users:`);

        // Display complete user information
        users.forEach((user, index) => {
            console.log(`\n--- USER #${index + 1} ---`);
            // Print all properties of the user object
            Object.keys(user).forEach(key => {
                if (key === 'password_hash') {
                    console.log(`• ${key}: ${user[key] ? `${user[key].substring(0, 15)}...` : 'Not set'}`);
                    console.log(`  Hash Format Valid: ${user[key]?.startsWith('$2') ? 'Yes' : 'No'}`);
                } else {
                    console.log(`• ${key}: ${user[key]}`);
                }
            });
        });

    } catch (error) {
        console.error('❌ Error listing users:', error);

        // Try a more direct approach if the first one fails
        try {
            console.log('\n👥 Trying alternative query approach...');
            const users = await sql`SELECT * FROM Users`;

            if (!users || users.length === 0) {
                console.log('❌ No users found in the database');
                return;
            }

            console.log(`✅ Found ${users.length} users:`);

            // Display complete user information
            users.forEach((user, index) => {
                console.log(`\n--- USER #${index + 1} ---`);
                Object.keys(user).forEach(key => {
                    if (key === 'password_hash') {
                        console.log(`• ${key}: ${user[key] ? `${user[key].substring(0, 15)}...` : 'Not set'}`);
                        console.log(`  Hash Format Valid: ${user[key]?.startsWith('$2') ? 'Yes' : 'No'}`);
                    } else {
                        console.log(`• ${key}: ${user[key]}`);
                    }
                });
            });
        } catch (alternativeError) {
            console.error('❌ Alternative query also failed:', alternativeError);
        }
    }
}

// Run the function
listUsers(); 