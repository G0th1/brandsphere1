import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// CORS headers
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
    // Skapa en ren PrismaClient för denna request
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
            }
        }
    });

    try {
        console.log("🔍 Testar databasanslutning...");

        // Testa grundläggande anslutning
        const testResult = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("✅ Anslutning OK");

        // Testa användartabell
        let userCount = 0;
        try {
            userCount = await prisma.user.count();
            console.log(`✅ Användartabell OK (${userCount} användare)`);
        } catch (userError) {
            console.error("❌ Kunde inte hämta användare:", userError);
            return NextResponse.json(
                {
                    success: false,
                    error: "Användarfel: " + userError.message,
                    connectionTest: testResult,
                    timestamp: new Date().toISOString()
                },
                {
                    status: 500,
                    headers: CORS_HEADERS
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Databasanslutning fungerar",
            connectionTest: testResult,
            userCount,
            databaseVariables: {
                DATABASE_URL: process.env.DATABASE_URL ? "Inställd" : "Saknas",
                POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "Inställd" : "Saknas",
                POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? "Inställd" : "Saknas",
            },
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        }, { headers: CORS_HEADERS });

    } catch (error) {
        console.error("❌ Databasfel:", error);

        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }, {
            status: 500,
            headers: CORS_HEADERS
        });

    } finally {
        await prisma.$disconnect();
    }
} 