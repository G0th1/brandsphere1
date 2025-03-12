import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
    try {
        console.log("🔍 API: Testar databasanslutning");
        console.log("Miljövaribler för databas:");
        console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "Inställd" : "Saknas");
        console.log("- POSTGRES_PRISMA_URL:", process.env.POSTGRES_PRISMA_URL ? "Inställd" : "Saknas");
        console.log("- POSTGRES_URL_NON_POOLING:", process.env.POSTGRES_URL_NON_POOLING ? "Inställd" : "Saknas");

        // Skapa en Prisma-klient med direktanslutning för att undvika pooling-problem
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
                }
            }
        });

        // Testa grundläggande anslutning
        const testResult = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("✅ Databasanslutningstest lyckades:", testResult);

        // Testa grundläggande databasoperationer
        let userCount = 0;
        try {
            userCount = await prisma.user.count();
            console.log(`✅ Användartabellen finns med ${userCount} användare`);
        } catch (userError) {
            console.error("❌ Kunde inte hämta användare:", userError);
            return NextResponse.json(
                {
                    success: false,
                    error: "Användarmodellfel: " + userError.message,
                    connectionTest: testResult,
                },
                { status: 500 }
            );
        }

        // Stäng anslutningen
        await prisma.$disconnect();

        // Returnera diagnostisk information
        return NextResponse.json({
            success: true,
            message: "Databasanslutning fungerar korrekt",
            connectionTest: testResult,
            userCount: userCount,
            databaseVariables: {
                DATABASE_URL: process.env.DATABASE_URL ? "Inställd" : "Saknas",
                POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "Inställd" : "Saknas",
                POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? "Inställd" : "Saknas",
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("❌ Fel vid databasanslutning:", error);
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