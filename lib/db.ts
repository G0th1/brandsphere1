import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient;
}

// Enkel funktion för att logga databasfel
function logDatabaseError(message: string, error?: any) {
    console.error(`[Databas Fel] ${message}`);
    if (error) {
        console.error(error);
    }
}

// Skapa en enkel PrismaClient-instans
function createPrismaClient() {
    try {
        console.log("Initierar Prisma-anslutning");

        // Skapa en ny Prisma-klient
        const client = new PrismaClient({
            log: [
                { emit: 'event', level: 'error' },
            ],
        });

        // Logga databasfel
        client.$on('error', (e) => {
            logDatabaseError('Prisma Query Error', e);
        });

        return client;
    } catch (error) {
        logDatabaseError("Kunde inte skapa Prisma-klient", error);
        throw error;
    }
}

// Exportera en delad Prisma-instans för att undvika för många anslutningar
export const db = global.cachedPrisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    global.cachedPrisma = db;
} 