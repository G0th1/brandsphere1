// Supabase-Prisma Fix - Kritiskt för IPv4/IPv6 problem
require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

console.log(`
======================================================
🚨 KRITISK DIAGNOSTIK: SUPABASE POSTGRESQL ANSLUTNING 🚨
======================================================
`);

// 1. KONTROLLERA PRISMA KONFIGURATION
console.log('STEG 1: PRISMA SCHEMA ANALYS');
console.log('----------------------------');

let prismaSchema;
try {
    prismaSchema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    console.log('✅ Kunde läsa schema.prisma');

    // Kontrollera om det använder rätt miljövariabler
    if (prismaSchema.includes('url = env("POSTGRES_PRISMA_URL")')) {
        console.log('✅ Schema använder POSTGRES_PRISMA_URL (korrekt)');
    } else if (prismaSchema.includes('url = env("DATABASE_URL")')) {
        console.error('❌ Schema använder DATABASE_URL istället för POSTGRES_PRISMA_URL');
        console.log('🔄 Korrigering krävs i schema.prisma');
    }

    // Kontrollera om directUrl är konfigurerad
    if (prismaSchema.includes('directUrl = env("POSTGRES_URL_NON_POOLING")')) {
        console.log('✅ Schema använder POSTGRES_URL_NON_POOLING (korrekt)');
    } else {
        console.error('❌ Schema saknar directUrl konfiguration');
        console.log('🔄 Korrigering krävs i schema.prisma');
    }

} catch (err) {
    console.error('❌ Kunde inte läsa schema.prisma:', err.message);
}

// 2. KONTROLLERA MILJÖVARIABLER
console.log('\nSTEG 2: MILJÖVARIABELANALYS');
console.log('---------------------------');

const criticalEnvVars = [
    { name: 'POSTGRES_PRISMA_URL', fallback: 'DATABASE_URL' },
    { name: 'POSTGRES_URL_NON_POOLING', fallback: 'DATABASE_URL' },
    { name: 'POSTGRES_URL', fallback: 'DATABASE_URL' }
];

let fixApplied = false;

criticalEnvVars.forEach(envVar => {
    const value = process.env[envVar.name];
    const fallbackValue = process.env[envVar.fallback];

    if (value) {
        console.log(`✅ ${envVar.name}: Konfigurerad`);
        // Kontrollera om värdet pekar på localhost
        if (value.includes('localhost') || value.includes('127.0.0.1')) {
            console.error(`⚠️ ${envVar.name} pekar på lokal databas: ${value}`);
            console.log('   Detta fungerar INTE i produktion på Vercel!');
        }
    } else {
        console.error(`❌ ${envVar.name}: SAKNAS`);

        if (fallbackValue) {
            console.log(`ℹ️ Fallback ${envVar.fallback} finns: ${fallbackValue}`);
            // Automatiskt korrigera variabeln i runtime-miljön
            process.env[envVar.name] = fallbackValue;
            console.log(`🔄 Runtime-fix: ${envVar.name} = ${fallbackValue}`);
            fixApplied = true;
        } else {
            console.error(`❌ Ingen fallback hittades för ${envVar.name}`);
        }
    }
});

if (fixApplied) {
    console.log('\n✅ Runtime-fix har applicerats för att försöka lösa anslutningsproblem');
}

// 3. TESTA DATABASANSLUTNING
console.log('\nSTEG 3: DATABASANSLUTNINGSTEST');
console.log('------------------------------');

(async () => {
    const prisma = new PrismaClient();

    try {
        console.log('🔄 Försöker ansluta till Supabase PostgreSQL...');
        const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
        console.log('✅ ANSLUTNING LYCKADES!');
        console.log('📊 Databasinfo:', result);

        // Prova att hämta användardata
        try {
            console.log('\n🔄 Försöker fråga efter användartabellen...');
            const userCount = await prisma.user.count();
            console.log(`✅ Kunde fråga User-tabellen. Antal användare: ${userCount}`);
        } catch (userError) {
            console.error('❌ Kunde inte fråga User-tabellen:', userError.message);

            if (userError.message.includes('relation "User" does not exist')) {
                console.error('🔍 KRITISKT FEL: User-tabellen existerar inte i databasen!');
                console.log('🔧 LÖSNING: Kör `npx prisma db push` för att skapa tabellerna');
            } else if (userError.message.includes('permission denied')) {
                console.error('🔍 KRITISKT FEL: Saknar behörighet till databasen!');
                console.log('🔧 LÖSNING: Kontrollera dina Supabase behörigheter');
            }
        }

    } catch (error) {
        console.error('❌ KRITISKT ANSLUTNINGSFEL:', error.message);

        // Specifik diagnos baserat på feltyp
        if (error.message.includes('P1001')) {
            console.error('🔍 DIAGNOS: Kan inte ansluta till databasen. Kontrollera URL och nätverk.');
            console.log('🔧 LÖSNING: Verifiera att Supabase-URL är korrekt och att du använder IPv4.');
        }
        else if (error.message.includes('P1003')) {
            console.error('🔍 DIAGNOS: Databasen eller schemat finns inte.');
            console.log('🔧 LÖSNING: Kör `npx prisma db push` för att skapa tabellerna');
        }
        else if (error.message.includes('P1017')) {
            console.error('🔍 DIAGNOS: Server nekade anslutning. Sannolikt fel lösenord.');
            console.log('🔧 LÖSNING: Kontrollera databasens användarnamn och lösenord');
        }
        else if (error.message.includes('timeout')) {
            console.error('🔍 DIAGNOS: Anslutningen nådde timeout.');
            console.log('🔧 LÖSNING: Kontrollera brandväggsregler eller använd IPv4 explicit');
        }
    } finally {
        await prisma.$disconnect();
    }
})();

// 4. REKOMMENDATIONER FÖR SUPABASE POSTGRESQL PÅ VERCEL
console.log('\nSTEG 4: REKOMMENDATIONER');
console.log('------------------------');

console.log(`
1️⃣ VIKTIG ÅTGÄRD: Använd Supabase Integration från Vercel Marketplace
   - Gå till https://vercel.com/dashboard
   - Välj ditt projekt -> Integrations -> Browse Marketplace
   - Sök efter "Supabase" och installera integrationen
   - Detta lägger automatiskt till rätt miljövariabler

2️⃣ MANUELLA MILJÖVARIABLER: Om du inte använder integrationen
   - POSTGRES_PRISMA_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   - POSTGRES_URL_NON_POOLING=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?connect_timeout=30
   
3️⃣ PRISMA SCHEMA: Uppdatera schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
     directUrl = env("POSTGRES_URL_NON_POOLING")
   }

4️⃣ MIGRATIONER: Kör efter att miljövariabler är uppdaterade
   - npx prisma db push

5️⃣ KRITISKT FÖR VERCEL: IPv4/IPv6 kompatibilitet
   Supabase har migrerat till IPv6 men Vercel stöder bara IPv4.
   Använd Supavisor URLs (som tillhandahålls via Vercel-integration)
   som stöder IPv4-anslutning.
`); 