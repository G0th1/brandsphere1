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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Registreringsförsök med:", { ...body, password: "[HIDDEN]" });

        // Validera användardata
        const result = userSchema.safeParse(body);
        if (!result.success) {
            console.error("Valideringsfel:", result.error.errors);
            return NextResponse.json(
                { message: "Ogiltig data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Kontrollera om användaren redan finns
        console.log(`Kontrollerar om användare med e-post ${email} redan finns`);
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`Användare med e-post ${email} finns redan`);
            return NextResponse.json(
                { message: "En användare med denna e-postadress finns redan" },
                { status: 409 }
            );
        }

        // Hasha lösenordet
        const hashedPassword = await hash(password, 10);
        console.log("Lösenord hashat. Försöker skapa användare i databasen...");

        // Skapa användaren i databasen
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Skapa gratis prenumeration för användaren
        console.log(`Användare skapad med ID: ${user.id}. Skapar gratis prenumeration...`);
        await db.subscription.create({
            data: {
                userId: user.id,
                plan: "Free",
                status: "active",
                billingCycle: "monthly",
            }
        });

        // Ta bort lösenordet från svaret
        const { password: _, ...userWithoutPassword } = user;

        console.log(`Registrering slutförd för användare: ${email}`);
        return NextResponse.json(
            { message: "Användaren har registrerats", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error("Detaljerat registreringsfel:", error);
        return NextResponse.json(
            { message: "Internt serverfel vid registrering", error: (error as Error).message },
            { status: 500 }
        );
    }
} 