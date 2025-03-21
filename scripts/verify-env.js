require('dotenv').config();

// Kritiska databas-miljövariabler
const CRITICAL_ENV_VARS = [
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'POSTGRES_URL',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_DATABASE',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NODE_ENV'
];

console.log('🔍 KRITISK MILJÖVARIABELDIAGNOS');
console.log('============================');

let missingVars = 0;

CRITICAL_ENV_VARS.forEach(varName => {
    if (process.env[varName]) {
        const value = varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('URL') ?
            '********' : process.env[varName];
        console.log(`✅ ${varName}: ${value}`);
    } else {
        console.log(`❌ ${varName}: SAKNAS - KRITISKT FEL`);
        missingVars++;
    }
});

console.log('============================');

if (missingVars > 0) {
    console.error(`⚠️ KRITISK VARNING: ${missingVars} miljövariabler saknas. Detta orsakar sannolikt registreringsfelet.`);
    process.exit(1);
} else {
    console.log('✅ Alla kritiska miljövariabler finns. Kontrollera nu värden och databastillgänglighet.');
}

// Försök att ansluta till databasen för att verifiera anslutningen
const { PrismaClient } = require('@prisma/client');
console.log('🔄 Försöker ansluta till databasen...');

(async () => {
    const prisma = new PrismaClient();
    try {
        // Försök köra en enkel query
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log('✅ DATABASANSLUTNING LYCKADES!');
    } catch (error) {
        console.error('❌ KRITISKT DATABASFEL:', error.message);
        console.error('Detta är med största sannolikhet orsaken till registreringsfelet.');
    } finally {
        await prisma.$disconnect();
    }
})();

// Verify environment variables before deployment
console.log('Environment Variable Verification');
console.log('===============================');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check database variables
console.log('\nDatabase Configuration:');
const dbUrl = process.env.DATABASE_URL || 'NOT SET';
console.log('DATABASE_URL:', dbUrl.substring(0, 30) + '...');

// Check NextAuth variables
console.log('\nNextAuth Configuration:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT SET');

// Summary
console.log('\nVerification Summary:');
const missingVars = [];
if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
if (!process.env.NEXTAUTH_URL) missingVars.push('NEXTAUTH_URL');
if (!process.env.NEXTAUTH_SECRET) missingVars.push('NEXTAUTH_SECRET');

if (missingVars.length === 0) {
    console.log('✅ All critical environment variables are set');
} else {
    console.log('❌ Missing critical variables:', missingVars.join(', '));
}

// Exit with appropriate code
process.exit(missingVars.length === 0 ? 0 : 1); 