import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema för validering av användardata
const userSchema = z.object({
    name: z.string().min(2, { message: "Namnet måste vara minst 2 tecken" }),
    email: z.string().email({ message: "Ogiltig e-postadress" }),
    password: z.string().min(8, { message: "Lösenordet måste vara minst 8 tecken" }),
});

// Funktioner för teknisk problemlösning
const logError = (stage: string, error: any) => {
    console.error(`🔴 KRITISKT REGISTRERINGSFEL [${stage}]:`, error);
    console.error(`🔍 Stack trace:`, error.stack);

    // Analysera specifika feltyper
    if (error.code) {
        console.error(`🔍 Felkod: ${error.code}`);

        // Vanliga Prisma-fel
        if (error.code === 'P1001') {
            console.error('💥 KRITISKT: Kan inte ansluta till databasen. Kontrollera POSTGRES_* miljövariabler');
        }
        else if (error.code === 'P1003') {
            console.error('⚠️ Databasen eller tabellen finns inte. Kontrollera att migrationer har körts.');
        }
        else if (error.code === 'P2002') {
            console.error(`⚠️ Konflikt med unik begränsning: ${error.meta?.target}`);
        }
    }

    return {
        error: String(error),
        message: "Ett allvarligt fel uppstod vid registrering",
        code: error.code,
        meta: error.meta,
        timestamp: new Date().toISOString(),
        stage
    };
};

// Verifiera databasanslutning innan registrering
async function verifyDatabaseConnection() {
    try {
        console.log("🔄 Verifierar databasanslutning före registrering...");
        const result = await db.$queryRaw`SELECT 1`;
        console.log("✅ Databasanslutning OK:", result);
        return true;
    } catch (error) {
        console.error("❌ KRITISKT: Kunde inte ansluta till databasen:", error);
        return false;
    }
}

export async function POST(req: Request) {
    try {
        // 1. Hämta och validera användardata
        const body = await req.json();
        const result = userSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Ogiltig data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // 2. Kontrollera om användaren redan finns
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "En användare med denna e-postadress finns redan" },
                { status: 409 }
            );
        }

        // 3. Hasha lösenordet
        const hashedPassword = await hash(password, 10);

        // 4. Skapa användaren i databasen
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // 5. Skapa prenumeration för användaren
        try {
            await db.subscription.create({
                data: {
                    userId: user.id,
                    plan: "Free",
                    status: "active",
                    billingCycle: "monthly",
                },
            });
        } catch (error) {
            console.error("Kunde inte skapa prenumeration:", error);
            // Fortsätt trots fel med prenumerationen
        }

        // 6. Ta bort lösenordet från svaret
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: "Användaren har registrerats framgångsrikt",
                user: userWithoutPassword
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Fel vid registrering:", error);

        return NextResponse.json(
            {
                message: "Ett fel uppstod vid registrering",
                error: process.env.NODE_ENV === "development" ? String(error) : undefined
            },
            { status: 500 }
        );
    }
} 