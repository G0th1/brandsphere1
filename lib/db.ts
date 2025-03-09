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
        const client = new PrismaClient({
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
            return new PrismaClient();
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
    }
})();

export const db = prisma; 