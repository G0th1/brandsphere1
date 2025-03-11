import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Verifieringstoken saknas" },
                { status: 400 }
            );
        }

        // Hitta verifieringstoken i databasen
        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { success: false, message: "Ogiltig eller utgången token" },
                { status: 400 }
            );
        }

        // Kontrollera om token har gått ut
        if (new Date() > verificationToken.expires) {
            return NextResponse.json(
                { success: false, message: "Verifieringslänken har gått ut" },
                { status: 400 }
            );
        }

        // Hitta användaren med angiven e-post
        const user = await db.user.findFirst({
            where: { email: verificationToken.identifier },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Användaren hittades inte" },
                { status: 404 }
            );
        }

        // Uppdatera användarens e-postverifiering
        await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
        });

        // Ta bort den använda token
        await db.verificationToken.delete({
            where: { token },
        });

        return NextResponse.json(
            { success: true, message: "E-postadressen har verifierats" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json(
            { success: false, message: "Ett fel uppstod vid verifiering" },
            { status: 500 }
        );
    }
} 