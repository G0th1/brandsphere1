import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";
import { createTransport } from "nodemailer";

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

        // Konfigurera e-postprovider
        const emailConfig = {
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT) || 587,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        };

        // Skapa e-posttransport
        const transporter = createTransport(emailConfig);

        // E-postämne och innehåll
        const subject = "Återställ ditt lösenord på BrandSphereAI";

        // Skapa HTML-e-postinnehåll
        const html = `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Återställ ditt lösenord</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0070f3;
            }
            .button {
              background-color: #0070f3;
              color: white !important;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              display: inline-block;
              font-weight: 500;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #777;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BrandSphereAI</div>
            </div>
            
            <p>Hej,</p>
            <p>Vi har tagit emot en begäran om att återställa ditt lösenord. Klicka på knappen nedan för att fortsätta.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Återställ lösenord</a>
            </div>
            
            <p>Eller kopiera och klistra in denna URL i din webbläsare:</p>
            <p style="overflow-wrap: break-word; word-wrap: break-word; word-break: break-all;">${resetUrl}</p>
            
            <p>Om du inte begärde denna återställning kan du ignorera detta meddelande.</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} BrandSphereAI. Alla rättigheter förbehållna.</p>
            </div>
          </div>
        </body>
        </html>
        `;

        // Skapa textversion för e-postklienter som inte stöder HTML
        const text = `
          Återställ ditt lösenord på BrandSphereAI
          
          Hej,
          
          Vi har tagit emot en begäran om att återställa ditt lösenord. Klicka på länken nedan för att fortsätta:
          ${resetUrl}
          
          Om du inte begärde denna återställning kan du ignorera detta meddelande.
          
          © ${new Date().getFullYear()} BrandSphereAI. Alla rättigheter förbehållna.
        `;

        // Skicka e-post
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@brandsphereai.com',
                to: email,
                subject,
                text,
                html,
            });
        } catch (error) {
            console.error("Fel vid skickande av e-post:", error);
        }

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