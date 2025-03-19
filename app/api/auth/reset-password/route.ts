import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { hash } from "bcrypt";

// Schema för validering av återställningsdata
const resetSchema = z.object({
    token: z.string().min(1, { message: "Token krävs" }),
    password: z.string().min(8, { message: "Lösenordet måste vara minst 8 tecken långt" }),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validera data
        const result = resetSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Ogiltig data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { token, password } = result.data;

        // Hitta token i databasen
        const resetToken = await db.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        // Kontrollera om token finns och är giltig
        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json(
                { message: "Ogiltig eller utgången återställningslänk" },
                { status: 400 }
            );
        }

        // Hasha det nya lösenordet
        const hashedPassword = await hash(password, 10);

        // Uppdatera användarens lösenord
        await db.user.update({
            where: { id: resetToken.userId },
            data: { password_hash: hashedPassword },
        });

        // Ta bort den använda token
        await db.passwordResetToken.delete({
            where: { id: resetToken.id },
        });

        return NextResponse.json(
            { message: "Lösenordet har återställts framgångsrikt" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fel vid återställning av lösenord:", error);
        return NextResponse.json(
            { message: "Internt serverfel" },
            { status: 500 }
        );
    }
} 