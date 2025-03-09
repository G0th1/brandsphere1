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
    console.log("🔄 Registrering påbörjad:", new Date().toISOString());

    // Kontrollera databasanslutningen innan vi fortsätter
    const isDbConnected = await verifyDatabaseConnection();
    if (!isDbConnected) {
        console.error("❌ KRITISKT: Avbryter registrering pga databasproblem");
        return NextResponse.json(
            {
                message: "Internt serverfel: Kunde inte ansluta till databasen",
                dbStatus: "disconnected",
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }

    try {
        // 1. Extrahera och logga användardata
        let body;
        try {
            body = await req.json();
            console.log("📝 Registreringsdata mottagen:", { ...body, password: "[DOLD]" });
        } catch (parseError) {
            console.error("❌ Kunde inte tolka request body:", parseError);
            return NextResponse.json(
                { message: "Ogiltig request: Kunde inte tolka JSON-data" },
                { status: 400 }
            );
        }

        // 2. Validera användardata
        console.log("🔍 Validerar användardata...");
        const result = userSchema.safeParse(body);
        if (!result.success) {
            console.error("❌ Valideringsfel:", result.error.errors);
            return NextResponse.json(
                { message: "Ogiltig data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // 3. Kontrollera om användaren redan finns
        console.log(`🔍 Söker efter befintlig användare: ${email}`);
        let existingUser;
        try {
            existingUser = await db.user.findUnique({
                where: { email },
            });
        } catch (dbError) {
            const errorInfo = logError("user-lookup", dbError);
            return NextResponse.json(
                { message: "Kunde inte söka efter befintlig användare", details: errorInfo },
                { status: 500 }
            );
        }

        if (existingUser) {
            console.log(`⚠️ Användare med e-post ${email} finns redan`);
            return NextResponse.json(
                { message: "En användare med denna e-postadress finns redan" },
                { status: 409 }
            );
        }

        // 4. Hasha lösenordet
        console.log("🔐 Hashar lösenord...");
        let hashedPassword;
        try {
            hashedPassword = await hash(password, 10);
            console.log("✅ Lösenord hashat framgångsrikt");
        } catch (hashError) {
            const errorInfo = logError("password-hashing", hashError);
            return NextResponse.json(
                { message: "Kunde inte hasha lösenordet", details: errorInfo },
                { status: 500 }
            );
        }

        // 5. Skapa användaren i databasen
        console.log("👤 Skapar användare i databasen...");
        let user;
        try {
            user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            console.log(`✅ Användare skapad med ID: ${user.id}`);
        } catch (createError) {
            const errorInfo = logError("user-creation", createError);
            return NextResponse.json(
                { message: "Kunde inte skapa användaren i databasen", details: errorInfo },
                { status: 500 }
            );
        }

        // 6. Skapa gratis prenumeration för användaren
        console.log(`🔄 Skapar gratisprenumeration för användare ${user.id}...`);
        try {
            await db.subscription.create({
                data: {
                    userId: user.id,
                    plan: "Free",
                    status: "active",
                    billingCycle: "monthly",
                },
            });
            console.log(`✅ Prenumeration skapad för användare ${user.id}`);
        } catch (subscriptionError) {
            // Logga felet men fortsätt - vi vill inte misslyckas med registreringen pga prenumeration
            console.error("⚠️ Kunde inte skapa prenumeration:", subscriptionError);
            // Vi fortsätter ändå eftersom användaren är skapad
        }

        // 7. Ta bort lösenordet från svaret
        const { password: _, ...userWithoutPassword } = user;

        console.log(`✅ Registrering slutförd för användare: ${email}`);
        return NextResponse.json(
            {
                message: "Användaren har registrerats",
                user: userWithoutPassword,
                timestamp: new Date().toISOString()
            },
            { status: 201 }
        );
    } catch (error) {
        const errorInfo = logError("uncaught", error as Error);
        console.error("💥 OKÄNT KRITISKT FEL VID REGISTRERING:", error);

        return NextResponse.json(
            {
                message: "Internt serverfel vid registrering",
                details: errorInfo
            },
            { status: 500 }
        );
    }
} 