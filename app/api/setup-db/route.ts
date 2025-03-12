import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
    try {
        console.log("🔍 API: Kör databaskonfiguration");
        console.log("Miljövaribler för databas:");
        console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "Inställd" : "Saknas");
        console.log("- POSTGRES_PRISMA_URL:", process.env.POSTGRES_PRISMA_URL ? "Inställd" : "Saknas");
        console.log("- POSTGRES_URL_NON_POOLING:", process.env.POSTGRES_URL_NON_POOLING ? "Inställd" : "Saknas");

        // Skapa en Prisma-klient med direktanslutning
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
                }
            }
        });

        // Testa grundläggande anslutning
        console.log("🔄 Testar databasanslutning...");
        const testResult = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("✅ Databasanslutningstest lyckades:", testResult);

        // Försöker köra databasmigrering
        console.log("🔄 Kör databasmigrering...");
        try {
            // Kolla om User-tabellen finns
            const tablesExist = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'User'
        );
      `;

            console.log("Tabellkontroll:", tablesExist);

            if (!tablesExist[0].exists) {
                console.log("🔄 Användartabellen existerar inte, kör databasinitialisering...");

                // Skapa användartabeller direkt via SQL för enklare kontroll
                await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "User" (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            "emailVerified" TIMESTAMP,
            password TEXT,
            image TEXT,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL
          );
          
          CREATE TABLE IF NOT EXISTS "Subscription" (
            id TEXT PRIMARY KEY,
            "userId" TEXT UNIQUE NOT NULL,
            "stripeCustomerId" TEXT UNIQUE,
            "stripeSubscriptionId" TEXT UNIQUE,
            "stripePriceId" TEXT,
            "stripeCurrentPeriodEnd" TIMESTAMP,
            status TEXT NOT NULL DEFAULT 'inactive',
            plan TEXT NOT NULL DEFAULT 'Free',
            "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
          );
        `;

                console.log("✅ Bastabeller skapade");
            } else {
                console.log("✅ Tabeller finns redan");
            }
        } catch (migrationError) {
            console.error("⚠️ Fel vid migrering:", migrationError);
        }

        // Kontrollera om det finns användare
        console.log("🔄 Kontrollerar användare...");
        const userCount = await prisma.user.count();
        console.log(`ℹ️ Antal användare i databasen: ${userCount}`);

        // Skapa en testanvändare om det behövs
        if (userCount === 0) {
            console.log("🔄 Skapar testanvändare...");

            try {
                // Skapa admin
                const admin = await prisma.user.create({
                    data: {
                        id: "admin-" + Date.now().toString(),
                        name: "Admin User",
                        email: "admin@example.com",
                        password: await hash("Admin123!", 10),
                        emailVerified: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });

                console.log("✅ Admin-användare skapad:", admin.id);

                // Skapa prenumeration
                await prisma.subscription.create({
                    data: {
                        id: "sub-" + Date.now().toString(),
                        userId: admin.id,
                        plan: "Business",
                        status: "active",
                        billingCycle: "monthly",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });

                console.log("✅ Prenumeration skapad för admin");
            } catch (userError) {
                console.error("❌ Fel vid skapande av användare:", userError);
            }
        }

        // Hämta användare för att verifiera
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        // Stäng anslutningen
        await prisma.$disconnect();

        // Returnera diagnostisk information
        return NextResponse.json({
            success: true,
            message: "Databaskonfiguration slutförd",
            connectionTest: testResult,
            userCount,
            users,
            databaseVariables: {
                DATABASE_URL: process.env.DATABASE_URL ? "Inställd" : "Saknas",
                POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "Inställd" : "Saknas",
                POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? "Inställd" : "Saknas",
            }
        });
    } catch (error) {
        console.error("❌ Fel vid databaskonfiguration:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stack: error.stack,
            },
            { status: 500 }
        );
    }
} 