import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Förbättrad felhantering för NextAuth
const handler = async (req: Request, context: { params: { nextauth: string[] } }) => {
    const authHandler = NextAuth(authOptions);

    try {
        console.log(`🔐 NextAuth API route: ${req.method} ${context.params.nextauth.join('/')}`);
        return await authHandler(req, context);
    } catch (error: any) {
        console.error(`⛔ NextAuth API error: ${error.message}`, error);
        // Returnera ett användbart felmeddelande
        return new Response(
            JSON.stringify({
                error: "AuthServerError",
                message: "Autentiseringsservern stötte på ett problem."
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

export { handler as GET, handler as POST }; 