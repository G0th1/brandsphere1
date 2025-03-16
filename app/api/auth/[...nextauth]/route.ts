import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Förbättrad felhantering för NextAuth
const handler = async (req: Request, context: { params: { nextauth: string[] } }) => {
    const authHandler = NextAuth(authOptions);

    try {
        console.log(`🔐 NextAuth API route: ${req.method} ${context.params.nextauth.join('/')}`);

        // Wrap the handler in try/catch to ensure proper JSON response
        try {
            return await authHandler(req, context);
        } catch (handlerError: any) {
            console.error(`⛔ NextAuth handler error:`, handlerError);

            // Return a proper JSON response
            return new Response(
                JSON.stringify({
                    error: "AuthHandlerError",
                    message: "Authentication handler error",
                    details: process.env.NODE_ENV === 'development' ? handlerError.message : undefined
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    } catch (error: any) {
        console.error(`⛔ NextAuth API error: ${error.message}`, error);
        // Logga detaljer för bättre felsökning
        console.error('Request path:', req.url);
        console.error('Request method:', req.method);
        console.error('NextAuth path param:', context.params.nextauth.join('/'));

        // Returnera ett användbart felmeddelande
        return new Response(
            JSON.stringify({
                error: "AuthServerError",
                message: "Autentiseringsservern stötte på ett problem.",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

export { handler as GET, handler as POST }; 