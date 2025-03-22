// Database connection diagnostic script
// Run with: node check-database.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { neon } = require('@neondatabase/serverless');

console.log('🔍 Database Connection Diagnostics');
console.log('=================================\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`POSTGRES_PRISMA_URL: ${process.env.POSTGRES_PRISMA_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`POSTGRES_URL_NON_POOLING: ${process.env.POSTGRES_URL_NON_POOLING ? '✅ Set' : '❌ Missing'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log();

// Try direct connection with neon
async function testNeonConnection() {
    console.log('🔌 Testing direct Neon connection...');
    try {
        const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING);
        const result = await sql`SELECT NOW() as time`;
        console.log(`✅ Direct connection successful! Server time: ${result[0].time}`);
        return true;
    } catch (error) {
        console.log(`❌ Direct connection failed: ${error.message}`);
        return false;
    }
}

// Try Prisma connection
async function testPrismaConnection() {
    console.log('\n🔌 Testing Prisma connection...');
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log('✅ Prisma connection successful!');

        // Try a simple query
        try {
            const userCount = await prisma.user.count();
            console.log(`✅ Database query successful! Found ${userCount} users.`);
        } catch (queryError) {
            console.log(`❌ Database query failed: ${queryError.message}`);
        }

        return true;
    } catch (error) {
        console.log(`❌ Prisma connection failed: ${error.message}`);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

// Check database health by settings a sample user password
async function checkUserAccess() {
    console.log('\n🔐 Testing user access...');
    const prisma = new PrismaClient();
    try {
        // Get a user from the database
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                email: true
            }
        });

        if (user) {
            console.log(`✅ Successfully found user: ${user.email}`);
            return true;
        } else {
            console.log('⚠️ No users found in the database.');
            return false;
        }
    } catch (error) {
        console.log(`❌ User access test failed: ${error.message}`);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

// Print recommendations based on test results
function printRecommendations(neonSuccess, prismaSuccess, userSuccess) {
    console.log('\n🩺 Diagnosis and Recommendations:');

    if (neonSuccess && prismaSuccess && userSuccess) {
        console.log('✅ All tests passed! Database connection is working properly.');
        console.log('   If you are still experiencing issues, it might be related to specific queries or application logic.');
    } else if (!neonSuccess) {
        console.log('❌ Database connection failed at the most basic level.');
        console.log('   Recommendations:');
        console.log('   1. Check if your database is online and accessible');
        console.log('   2. Verify DATABASE_URL is correct in your .env file');
        console.log('   3. Check firewall settings or network connectivity');
        console.log('   4. For Neon database, check if the database is active (not in sleep mode)');
    } else if (neonSuccess && !prismaSuccess) {
        console.log('❌ Direct database connection works, but Prisma connection failed.');
        console.log('   Recommendations:');
        console.log('   1. Check if your Prisma schema matches the database schema');
        console.log('   2. Run prisma generate to update Prisma client');
        console.log('   3. Verify that you have the correct Prisma version installed');
    } else if (prismaSuccess && !userSuccess) {
        console.log('⚠️ Database connection works, but user access test failed.');
        console.log('   This could be due to permissions issues or data-specific problems.');
        console.log('   Recommendations:');
        console.log('   1. Check if your database has any users created');
        console.log('   2. Verify table permissions for the database user');
    }
}

// Run all tests sequentially
async function runTests() {
    const neonSuccess = await testNeonConnection();
    const prismaSuccess = await testPrismaConnection();
    const userSuccess = await checkUserAccess();

    printRecommendations(neonSuccess, prismaSuccess, userSuccess);

    console.log('\n🏁 Database diagnostics complete!');
}

runTests().catch(console.error); 