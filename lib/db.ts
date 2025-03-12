import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient;
}

// Loggfunktion för databasproblem
function logDatabaseIssue(message: string, error?: any) {
    console.error(`🔴 DATABAS FEL: ${message}`);
    if (error) {
        console.error(`💥 Feldetaljer:`, error);
        if (error.code) {
            console.error(`💥 Felkod: ${error.code}`);
        }
    }
}

// Skapa PrismaClient med anpassad loggning
function createPrismaClient() {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        const dbType = isProduction ? "PostgreSQL" : "SQLite";

        console.log(`🔄 Initierar ${dbType}-anslutning, miljö: ${process.env.NODE_ENV}`);

        const client = new PrismaClient({
            log: [
                {
                    emit: 'event',
                    level: 'error',
                },
                {
                    emit: 'event',
                    level: 'warn',
                },
            ],
        });

        // Lyssna på databasevent för felsökning
        client.$on('error', (e) => {
            logDatabaseIssue('Prisma klient felmeddelande:', e);
        });

        client.$on('warn', (e) => {
            console.warn('⚠️ Prisma varning:', e);
        });

        // OBS: Loggning av alla queries har tagits bort pga typkompatibilitetsproblem
        // Loggning sker nu bara för fel och varningar
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Utvecklingsläge: Utökad loggning aktiverad för Prisma');
        }

        return client;
    } catch (initError) {
        logDatabaseIssue('Kunde inte initiera PrismaClient:', initError);
        throw initError;
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
        const isProduction = process.env.NODE_ENV === "production";
        const dbType = isProduction ? "PostgreSQL" : "SQLite";

        console.log(`🔄 Testar ${dbType}-databasanslutning...`);
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log(`✅ ${dbType}-databasanslutning lyckades!`, result);
    } catch (connectionError) {
        const isProduction = process.env.NODE_ENV === "production";
        const dbType = isProduction ? "PostgreSQL" : "SQLite";

        logDatabaseIssue(`Kunde inte ansluta till ${dbType}-databasen:`, connectionError);

        if (isProduction) {
            console.error('🚨 REKOMMENDATION: Kontrollera att DATABASE_URL miljövariabeln är korrekt inställd');
            console.error('🚨 Om du använder Vercel, kontrollera att Supabase-integrationen är korrekt konfigurerad');
        } else {
            console.error('🚨 REKOMMENDATION: Kontrollera att SQLite-databasen är korrekt initierad');
        }
    }
})();

export const db = prisma; 