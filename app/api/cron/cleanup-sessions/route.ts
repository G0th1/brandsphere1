import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        console.log("🧹 Cron: Rensar utgångna sessioner...");

        // Rensa utgångna sessioner
        const { count: sessionCount } = await db.session.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });

        console.log(`✅ Borttagna sessioner: ${sessionCount}`);

        // Rensa utgångna tokens för e-postverifiering
        const { count: verificationCount } = await db.verificationToken.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });

        console.log(`✅ Borttagna verifieringstokens: ${verificationCount}`);

        // Rensa utgångna tokens för lösenordsåterställning
        const { count: resetTokenCount } = await db.passwordResetToken.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });

        console.log(`✅ Borttagna lösenordsåterställningstokens: ${resetTokenCount}`);

        return NextResponse.json({
            success: true,
            cleanedUp: {
                sessions: sessionCount,
                verificationTokens: verificationCount,
                resetTokens: resetTokenCount
            }
        });
    } catch (error) {
        console.error("❌ Fel vid rensning av sessioner:", error);

        return NextResponse.json(
            { error: "Fel vid rensning av sessioner" },
            { status: 500 }
        );
    }
} 