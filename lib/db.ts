import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
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

function createPrismaClient() {
    console.log("Skapar ny PrismaClient");

    // Kontrollera miljövariabler
    console.log("Databas miljövariabler:", {
        DATABASE_URL: Boolean(process.env.DATABASE_URL),
        POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
        POSTGRES_URL_NON_POOLING: Boolean(process.env.POSTGRES_URL_NON_POOLING),
        VERCEL: Boolean(process.env.VERCEL)
    });

    // För Vercel, används POSTGRES_URL_NON_POOLING
    if (process.env.VERCEL) {
        console.log("Använder Vercel Postgres-konfiguration");
        return new PrismaClient({
            datasources: {
                db: {
                    url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
                }
            }
        });
    }

    // För lokal utveckling och andra miljöer
    return new PrismaClient();
}

// PrismaClient är fäst till den globala objektet i utveckling för att förhindra
// utmattning av anslutningspooler på grund av hot reloads
const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
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
            console.error('🚨 REKOMMENDATION: Kontrollera att databasmiljövariablerna är korrekt inställda');
            console.error('🚨 Miljövariabler som bör finnas på Vercel:');
            console.error('   - POSTGRES_PRISMA_URL (för pooled anslutningar)');
            console.error('   - POSTGRES_URL_NON_POOLING (för direktanslutningar, migrations, etc)');
        } else {
            console.error('🚨 REKOMMENDATION: Kontrollera att SQLite-databasen är korrekt initierad');
        }
    }
})();

export const db = prisma; 