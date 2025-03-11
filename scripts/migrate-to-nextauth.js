/**
 * MIGRERING FRÅN SUPABASE TILL NEXTAUTH
 * =====================================
 * 
 * Detta script hjälper till att migrera användare från Supabase till NextAuth.
 * Det behöver köras med Node.js:
 * 
 * node scripts/migrate-to-nextauth.js
 * 
 * Scriptet gör följande:
 * 1. Hämtar alla användare från Supabase Auth
 * 2. Kontrollerar om de redan finns i Prisma-databasen
 * 3. Skapar/uppdaterar användare i Prisma-databasen
 * 4. Migrera relaterade data om det behövs (sessions, accounts etc.)
 */

const fs = require('fs');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

// Ladda miljövariabler från .env.local om den finns, annars från .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });
console.log(`Laddar miljövariabler från ${envPath}`);

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Kontrollera att nödvändiga miljövariabler finns
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase miljövariabler saknas. Se till att NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY är konfigurerade.');
    process.exit(1);
}

// Skapa Supabase Admin-klient och Prisma-klient
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

async function migrateUsers() {
    console.log('🔄 Påbörjar migrering från Supabase till NextAuth...');

    try {
        // 1. Hämta alla användare från Supabase
        console.log('📊 Hämtar användare från Supabase...');
        const { data: supabaseUsers, error } = await supabase.auth.admin.listUsers();

        if (error) {
            throw new Error(`Kunde inte hämta användare från Supabase: ${error.message}`);
        }

        console.log(`✅ Hittade ${supabaseUsers.users.length} användare i Supabase.`);

        // 2. Iterera över alla användare och migrera dem
        for (const supabaseUser of supabaseUsers.users) {
            try {
                console.log(`🔄 Bearbetar användare: ${supabaseUser.email}`);

                // Kontrollera om användaren redan finns i Prisma-databasen
                const existingUser = await prisma.user.findUnique({
                    where: { email: supabaseUser.email.toLowerCase() },
                    include: { accounts: true }
                });

                if (existingUser) {
                    console.log(`ℹ️ Användare ${supabaseUser.email} finns redan i Prisma-databasen.`);

                    // Uppdatera eventuella saknade fält
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
                            name: existingUser.name || supabaseUser.user_metadata?.name || null,
                            image: existingUser.image || supabaseUser.user_metadata?.avatar_url || null,
                        }
                    });

                    console.log(`✅ Uppdaterade användare ${supabaseUser.email} i Prisma-databasen.`);
                } else {
                    // Skapa ny användare i Prisma-databasen
                    const newUser = await prisma.user.create({
                        data: {
                            id: supabaseUser.id,
                            email: supabaseUser.email.toLowerCase(),
                            emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
                            name: supabaseUser.user_metadata?.name || null,
                            image: supabaseUser.user_metadata?.avatar_url || null,
                        }
                    });

                    console.log(`✅ Skapade ny användare ${supabaseUser.email} i Prisma-databasen.`);

                    // Om användaren hade prenumeration, skapa även det
                    await prisma.subscription.create({
                        data: {
                            userId: newUser.id,
                            plan: "Free",
                            status: "active",
                            billingCycle: "monthly",
                        }
                    });
                }

                // 3. Hantera OAuth-providerkonton om det behövs
                // Kolla om användaren har OAuth providers i Supabase
                const providers = supabaseUser.identities?.filter(i => i.provider !== 'email') || [];

                for (const provider of providers) {
                    const providerName = provider.provider; // t.ex. 'google'

                    // Kontrollera om kontot redan finns i Prisma
                    const existingAccount = existingUser?.accounts?.find(
                        a => a.provider === providerName && a.providerAccountId === provider.identity_data.sub
                    );

                    if (!existingAccount) {
                        // Skapa nytt OAuth-konto i Prisma
                        await prisma.account.create({
                            data: {
                                userId: existingUser?.id || supabaseUser.id,
                                type: 'oauth',
                                provider: providerName,
                                providerAccountId: provider.identity_data.sub,
                                // Lägg till andra relevanta data från provider.identity_data om det behövs
                            }
                        });

                        console.log(`✅ Lade till ${providerName}-konto för användaren ${supabaseUser.email}.`);
                    }
                }
            } catch (userError) {
                console.error(`❌ Fel vid bearbetning av användare ${supabaseUser.email}:`, userError);
            }
        }

        console.log('✅ Migrering slutförd!');
    } catch (error) {
        console.error('❌ Migrering misslyckades:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Kör migreringen
migrateUsers(); 