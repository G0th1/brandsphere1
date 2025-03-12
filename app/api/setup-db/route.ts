import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

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

        // Kontrollera om User-tabellen finns
        const tableExists = await prisma.$queryRaw`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'User'
            ) as exists;
        `;

        if (!tableExists[0].exists) {
            console.log("🔄 Skapar tabeller...");

            // Skapa User-tabell
            await prisma.$executeRaw`
                CREATE TABLE IF NOT EXISTS "User" (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    email TEXT UNIQUE NOT NULL,
                    "emailVerified" TIMESTAMP,
                    password TEXT,
                    image TEXT,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `;

            // Skapa Subscription-tabell
            await prisma.$executeRaw`
                CREATE TABLE IF NOT EXISTS "Subscription" (
                    id TEXT PRIMARY KEY,
                    "userId" TEXT UNIQUE NOT NULL,
                    "stripeCustomerId" TEXT,
                    "stripeSubscriptionId" TEXT,
                    "stripePriceId" TEXT,
                    "stripeCurrentPeriodEnd" TIMESTAMP,
                    status TEXT NOT NULL DEFAULT 'inactive',
                    plan TEXT NOT NULL DEFAULT 'Free',
                    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
                    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
                );
            `;

            console.log("✅ Tabeller skapade");
        }

        // Kontrollera om det finns användare
        const userCount = await prisma.user.count();

        if (userCount === 0) {
            console.log("🔄 Skapar testanvändare...");

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

            // Skapa testanvändare
            const testUser = await prisma.user.create({
                data: {
                    id: "test-" + Date.now().toString(),
                    name: "Test User",
                    email: "test@example.com",
                    password: await hash("Password123", 10),
                    emailVerified: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            // Skapa prenumeration för testanvändare
            await prisma.subscription.create({
                data: {
                    id: "sub-test-" + Date.now().toString(),
                    userId: testUser.id,
                    plan: "Free",
                    status: "active",
                    billingCycle: "monthly",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            console.log("✅ Användare skapade");
        }

        // Hämta användare
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        return NextResponse.json({
            success: true,
            message: "DB-setup slutförd",
            userCount,
            users,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        }, { headers: CORS_HEADERS });

    } catch (error) {
        console.error("❌ DB-setup fel:", error);

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