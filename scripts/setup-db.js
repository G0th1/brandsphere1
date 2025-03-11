/**
 * SETUP OCH MIGRATION AV PRISMA-DATABAS
 * =====================================
 * 
 * Detta script kör Prisma-migrationer och setup för NextAuth-databasen.
 * Kör med Node.js:
 * 
 * node scripts/setup-db.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Ladda miljövariabler från .env.local om den finns, annars från .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

console.log(`Laddar miljövariabler från ${envPath}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

// Funktion för att exekvera kommandon
function runCommand(command) {
    console.log(`\n🔄 Kör: ${command}`);
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`❌ Kommandot misslyckades: ${command}`);
        console.error(error.message);
        return false;
    }
}

async function setupDatabase() {
    console.log('🚀 Påbörjar databas-setup...');

    // Steg 1: Validera Prisma-schema
    if (!runCommand('npx prisma validate')) {
        console.error('❌ Prisma schema-validering misslyckades. Åtgärda felen och försök igen.');
        process.exit(1);
    }
    console.log('✅ Prisma schema validerat.');

    // Steg 2: Generera Prisma-klient
    if (!runCommand('npx prisma generate')) {
        console.error('❌ Kunde inte generera Prisma-klient.');
        process.exit(1);
    }
    console.log('✅ Prisma-klient genererad.');

    // Steg 3: Kör db push för att skapa databasen
    if (!runCommand('npx prisma db push --accept-data-loss')) {
        console.error('❌ Kunde inte skapa databas-schema.');
        process.exit(1);
    }
    console.log('✅ Databas-schema skapat med db push.');

    console.log('\n🎉 Databas-setup slutförd!');
    console.log('\nFör att migrera användare från Supabase, kör:');
    console.log('node scripts/migrate-to-nextauth.js');
}

// Kör setup
setupDatabase(); 