// Helper script to test Neon database connection
const { PrismaClient } = require('@prisma/client');
const { neon } = require('@neondatabase/serverless');

// Explicitly set environment variables
process.env.POSTGRES_PRISMA_URL = 'postgres://neondb_owner:npg_5RtxlHfPjv4d@ep-super-fire-a2zkgpm3-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require&pgbouncer=true&pool_timeout=15';
process.env.POSTGRES_URL_NON_POOLING = 'postgres://neondb_owner:npg_5RtxlHfPjv4d@ep-super-fire-a2zkgpm3.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require';
process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;

console.log('Environment variables set:');
console.log('- POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? '✅ Set' : '❌ Missing');
console.log('- POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING ? '✅ Set' : '❌ Missing');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');

async function testConnection() {
    console.log('\n============= TESTING DATABASE CONNECTION =============');

    // Test with Neon Serverless first (simpler)
    console.log('\n🔍 Testing with Neon Serverless:');
    try {
        console.log('Connecting with Neon Serverless...');
        const sql = neon(process.env.DATABASE_URL);

        console.log('Running query...');
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Neon query successful:', result);
    } catch (error) {
        console.error('❌ Neon connection error:', error);
    }

    // Test with Prisma
    console.log('\n🔍 Testing with Prisma Client:');
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.POSTGRES_PRISMA_URL
            }
        }
    });

    try {
        console.log('Connecting to database with Prisma...');
        await prisma.$connect();
        console.log('✅ Prisma connection successful');

        // Try a simple query
        console.log('Running Prisma query...');
        const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
        console.log('✅ Prisma query successful:', result);

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Prisma connection error:', error);
    }

    console.log('\n=============== TEST COMPLETED ===============');
}

testConnection(); 