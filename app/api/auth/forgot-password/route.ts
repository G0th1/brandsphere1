import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";
import { sendVerificationRequest } from "@/lib/email";

// Schema för validering av e-postadress
const emailSchema = z.object({
    email: z.string().email({ message: "Ogiltig e-postadress" }),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validera e-postadressen
        const result = emailSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Ogiltig e-postadress", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // Kontrollera om användaren finns
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Av säkerhetsskäl, returnera fortfarande 200 även om användaren inte finns
            return NextResponse.json(
                { message: "Om e-postadressen finns i vårt system kommer ett återställningsmail att skickas." },
                { status: 200 }
            );
        }

        // Generera en token för lösenordsåterställning
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000); // Token giltig i 1 timme

        // Spara token i databasen
        await db.passwordResetToken.upsert({
            where: { userId: user.id },
            update: {
                token,
                expires,
            },
            create: {
                userId: user.id,
                token,
                expires,
            },
        });

        // Skapa återställningslänk
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

        // Skicka e-post med återställningslänk
        await sendVerificationRequest({
            identifier: email,
            url: resetUrl,
            provider: {
                server: {
                    host: process.env.EMAIL_SERVER_HOST || '',
                    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
                    auth: {
                        user: process.env.EMAIL_SERVER_USER || '',
                        pass: process.env.EMAIL_SERVER_PASSWORD || '',
                    },
                },
                from: process.env.EMAIL_FROM || 'noreply@brandsphereai.com',
            },
        });

        return NextResponse.json(
            { message: "Om e-postadressen finns i vårt system kommer ett återställningsmail att skickas." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fel vid hantering av glömt lösenord:", error);
        return NextResponse.json(
            { message: "Internt serverfel" },
            { status: 500 }
        );
    }
} 