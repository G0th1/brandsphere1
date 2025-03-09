import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient;
}

// Omfattande loggningsfunktion för databasproblem
function logDatabaseIssue(message: string, error?: any) {
    console.error(`🔴 DATABAS KRITISKT FEL: ${message}`);
    if (error) {
        console.error(`💥 Feldetaljer:`, error);
        if (error.code) {
            console.error(`💥 Felkod: ${error.code}`);
        }
        if (error.meta) {
            console.error(`💥 Metainformation:`, error.meta);
        }
    }
}

// KRITISK FIX FÖR SUPABASE-VERCEL KOMPATIBILITET
// Vi måste manuellt sätta miljövariablerna för Prisma om de inte redan är satta
function ensureSupabaseVars() {
    // Kritiska Supabase variabler för Vercel deployment
    if (!process.env.POSTGRES_PRISMA_URL && process.env.DATABASE_URL) {
        console.warn('⚠️ POSTGRES_PRISMA_URL saknas, använder DATABASE_URL istället');
        process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL;
    }

    if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL) {
        console.warn('⚠️ POSTGRES_URL_NON_POOLING saknas, använder DATABASE_URL istället');
        process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL;
    }

    // Kritisk kontroll om vi har lokal URL i produktion
    if (process.env.NODE_ENV === 'production') {
        const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
        if (dbUrl && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'))) {
            console.error('🔴 KRITISKT: Försöker använda lokal databas i produktion!');
            console.error('🔴 Detta kommer inte att fungera på Vercel!');

            // Kolla om vi har Supabase variabler
            if (process.env.POSTGRES_HOST) {
                // Försök konstruera en korrekt Supabase URL
                const host = process.env.POSTGRES_HOST;
                const user = process.env.POSTGRES_USER || 'postgres';
                const pass = process.env.POSTGRES_PASSWORD || 'password';
                const db = process.env.POSTGRES_DATABASE || 'postgres';

                const fixedUrl = `postgresql://${user}:${pass}@${host}:5432/${db}`;
                console.warn('⚠️ AUTO-FIX: Ersätter lokal URL med:', fixedUrl);

                process.env.POSTGRES_PRISMA_URL = fixedUrl;
                process.env.POSTGRES_URL_NON_POOLING = `${fixedUrl}?connect_timeout=30`;
            }
        }
    }
}

// Säkerställ att vi har Supabase-variabler
ensureSupabaseVars();

// Kontrollera att nödvändiga databasvariabler finns
function validateDatabaseEnv() {
    const hasPoolingUrl = !!process.env.POSTGRES_PRISMA_URL;
    const hasDirectUrl = !!process.env.POSTGRES_URL_NON_POOLING;
    const hasLegacyUrl = !!process.env.DATABASE_URL;

    // Om vi saknar båda Postgres-specifika URLs, fallback till legacy URL
    if (!hasPoolingUrl && hasLegacyUrl) {
        console.warn('⚠️ VARNING: POSTGRES_PRISMA_URL saknas, använder fallback DATABASE_URL');
        process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL;
    }

    if (!hasDirectUrl && hasLegacyUrl) {
        console.warn('⚠️ VARNING: POSTGRES_URL_NON_POOLING saknas, använder fallback DATABASE_URL');
        process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL;
    }

    // Kritisk validering - om vi fortfarande saknar nödvändiga URL:er
    if (!process.env.POSTGRES_PRISMA_URL) {
        logDatabaseIssue('Ingen databasanslutning (POSTGRES_PRISMA_URL) konfigurerad!');
    }
}

// Validera databasmiljövariabler
validateDatabaseEnv();

// Skapa PrismaClient med utökad loggning
function createPrismaClient() {
    try {
        console.log(`🔄 Initierar Prisma-anslutning, miljö: ${process.env.NODE_ENV}`);

        // Log important vars for debugging
        console.log('🔍 Använder följande anslutningsvariabler:');
        console.log(`🔹 DATABASE_URL: ${process.env.DATABASE_URL ? '✓ (konfigurerad)' : '✗ (saknas)'}`);
        console.log(`🔹 POSTGRES_PRISMA_URL: ${process.env.POSTGRES_PRISMA_URL ? '✓ (konfigurerad)' : '✗ (saknas)'}`);
        console.log(`🔹 POSTGRES_URL_NON_POOLING: ${process.env.POSTGRES_URL_NON_POOLING ? '✓ (konfigurerad)' : '✗ (saknas)'}`);

        // Masking host for security reasons
        const prismaUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || '';
        if (prismaUrl) {
            const maskedUrl = prismaUrl.replace(/\/\/([^:]+):[^@]+@/, '//***:***@');
            console.log(`🔸 Använder anslutning: ${maskedUrl}`);
        }

        const client = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
                }
            },
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
                {
                    emit: 'event',
                    level: 'error',
                },
                {
                    emit: 'event',
                    level: 'info',
                },
                {
                    emit: 'event',
                    level: 'warn',
                },
            ],
        });

        // Lyssna på databasevent för djupare felsökning
        client.$on('error', (e) => {
            logDatabaseIssue('Prisma klient felmeddelande:', e);
        });

        client.$on('warn', (e) => {
            console.warn('⚠️ Prisma varning:', e);
        });

        // Endast i utvecklingsläge: Logga alla queries
        if (process.env.NODE_ENV === 'development') {
            client.$on('query', (e) => {
                console.log(`🔍 Prisma Query (${e.duration}ms):`, e.query);
            });
        }

        return client;
    } catch (initError) {
        logDatabaseIssue('Kunde inte initiera PrismaClient:', initError);

        // Försök skapa en minimal klient utan loggning som fallback
        console.log('🔄 Försöker skapa minimal Prisma-klient som fallback...');
        try {
            // Använder explicit URL för att diagnostisera problem
            return new PrismaClient({
                datasources: {
                    db: {
                        url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
                    }
                }
            });
        } catch (fallbackError) {
            logDatabaseIssue('Kritiskt: Kunde inte skapa minimal Prisma-klient', fallbackError);

            // Som sista utväg, returnera ett proxy-objekt som loggar alla anrop
            console.error('💥 FATAL: Returnerar dummy-klient för att undvika appkrasch');
            return new Proxy({}, {
                get: function (target, prop) {
                    if (typeof prop === 'string') {
                        console.error(`🔴 KRITISKT: Försökte anropa ${String(prop)} på icke-existerande Prisma-klient`);
                    }
                    return () => Promise.reject(new Error('Databasklient är inte tillgänglig'));
                }
            }) as unknown as PrismaClient;
        }
    }
}

let prisma: PrismaClient;

// I produktion, använd alltid en ny instans
if (process.env.NODE_ENV === "production") {
    console.log('🌐 PRODUKTION: Skapar dedikerad Prisma-klient');
    prisma = createPrismaClient();
} else {
    // I utveckling, använd caching för att undvika för många anslutningar
    console.log('🛠️ UTVECKLING: Kontrollerar cachat Prisma-anslutning');
    if (!global.cachedPrisma) {
        console.log('🛠️ UTVECKLING: Skapar och cachar ny Prisma-klient');
        global.cachedPrisma = createPrismaClient();
    }
    prisma = global.cachedPrisma;
}

// Testa databasanslutningen när modulen laddas
(async () => {
    try {
        console.log('🔄 Testar databasanslutning...');
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Databasanslutning lyckades!', result);
    } catch (connectionError) {
        logDatabaseIssue('Kunde inte ansluta till databasen vid initiering:', connectionError);
        console.error('🚨 REKOMMENDATION: Kontrollera att POSTGRES_PRISMA_URL är korrekt konfigurerad');
        console.error('🚨 Om du använder Vercel, skapa en "Supabase Integration" från marketplace');
    }
})();

export const db = prisma; 