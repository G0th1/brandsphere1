// Komplett diagnostik av autentiseringssystemet
require('dotenv').config();
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');

console.log(`
====================================================
🩺 FULLSTÄNDIG TEKNISK DIAGNOS AV AUTENTISERING 🩺
====================================================
`);

// Steg 1: Kontrollera miljövariabler
console.log('STEG 1: KONTROLLERAR MILJÖVARIABLER');
console.log('------------------------------------');

const CRITICAL_ENV_VARS = [
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NODE_ENV'
];

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

if (missingVars > 0) {
    console.error(`⚠️ KRITISK VARNING: ${missingVars} miljövariabler saknas.`);
} else {
    console.log('✅ Alla kritiska miljövariabler finns.');
}

// Steg 2: Testa databasanslutning
console.log('\nSTEG 2: TESTAR DATABASANSLUTNING');
console.log('--------------------------------');

(async () => {
    const prisma = new PrismaClient();
    try {
        console.log('🔄 Försöker ansluta till databasen...');
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ DATABASANSLUTNING LYCKADES!', result);

        // Steg 3: Kontrollera databastabeller
        console.log('\nSTEG 3: KONTROLLERAR DATABASTABELLER');
        console.log('-----------------------------------');

        try {
            console.log('🔄 Kontrollerar User-tabell...');
            const userCount = await prisma.user.count();
            console.log(`✅ User-tabell OK (${userCount} användare)`);

            console.log('🔄 Kontrollerar Account-tabell...');
            const accountCount = await prisma.account.count();
            console.log(`✅ Account-tabell OK (${accountCount} konton)`);

            console.log('🔄 Kontrollerar Session-tabell...');
            const sessionCount = await prisma.session.count();
            console.log(`✅ Session-tabell OK (${sessionCount} sessioner)`);

            console.log('🔄 Kontrollerar Subscription-tabell...');
            const subscriptionCount = await prisma.subscription.count();
            console.log(`✅ Subscription-tabell OK (${subscriptionCount} prenumerationer)`);

        } catch (tablesError) {
            console.error('❌ FEL VID KONTROLL AV TABELLER:', tablesError);
        }

        // Steg 4: Simulera registreringsprocess
        console.log('\nSTEG 4: SIMULERAR REGISTRERINGSPROCESS');
        console.log('-------------------------------------');

        const testEmail = `test-${Date.now()}@example.com`;
        console.log(`🔄 Försöker registrera testanvändare: ${testEmail}`);

        try {
            // Kontrollera om användaren redan finns
            const existingUser = await prisma.user.findUnique({
                where: { email: testEmail }
            });

            if (existingUser) {
                console.log('⚠️ Testanvändare finns redan, använder denna för diagnos');
            } else {
                // Skapa testanvändare direkt i databasen
                console.log('🔄 Skapar testanvändare direkt i databasen...');
                const user = await prisma.user.create({
                    data: {
                        name: 'Test User',
                        email: testEmail,
                        password: 'fakehashedpassword', // Normalt skulle detta vara hashat
                    }
                });
                console.log('✅ Testanvändare skapad:', user.id);

                // Skapa en prenumeration
                console.log('🔄 Skapar testprenumeration...');
                const subscription = await prisma.subscription.create({
                    data: {
                        userId: user.id,
                        plan: 'Free',
                        status: 'active',
                        billingCycle: 'monthly'
                    }
                });
                console.log('✅ Testprenumeration skapad');
            }

            console.log('✅ DIAGNOS SLUTFÖRD');
            console.log(`📊 RESULTAT: Systemet ser ut att vara korrekt konfigurerat på databasnivå.`);
            console.log(`📊 Om registrering fortfarande misslyckas, kontrollera API-anrop och frontend-validering.`);

        } catch (simError) {
            console.error('❌ FEL VID SIMULERING AV REGISTRERING:', simError);
            console.log(`📊 RESULTAT: Problem detekterades i registreringsprocessen.`);
        }

    } catch (dbError) {
        console.error('❌ KRITISKT DATABASFEL:', dbError.message);
        if (dbError.code === 'P1001') {
            console.error('🔍 DIAGNOS: Kan inte ansluta till databasen. Kontrollera POSTGRES_* miljövariabler.');
            console.error('🔧 LÖSNING: Säkerställ att databasanslutningssträngen är korrekt och att databasen är tillgänglig.');
        }
        else if (dbError.code === 'P1003') {
            console.error('🔍 DIAGNOS: Databasen eller tabellen finns inte. Kontrollera att migrationer har körts.');
            console.error('🔧 LÖSNING: Kör `npx prisma migrate deploy` eller `npx prisma db push`.');
        }
        console.log(`📊 RESULTAT: Kritiska databasfel detekterades. Åtgärda detta innan du fortsätter.`);
    } finally {
        await prisma.$disconnect();
    }
})(); 