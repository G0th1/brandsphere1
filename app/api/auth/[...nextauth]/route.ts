import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { safeJsonResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";

// Enhanced error handling for NextAuth
const handler = async (req: Request, context: { params: { nextauth: string[] } }) => {
    const authHandler = NextAuth(authOptions);

    try {
        console.log(`🔐 NextAuth API route: ${req.method} ${context.params.nextauth.join('/')}`);
        console.log('Request URL:', req.url);

        // Check if DATABASE_URL is available
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL environment variable is missing');
            return safeJsonResponse({
                error: "Configuration error",
                message: "Database configuration is missing",
                status: "error"
            }, { status: 500 });
        }

        // Log essential env vars for debugging (without exposing secrets)
        console.log('Environment check:', {
            NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
            DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
            NODE_ENV: process.env.NODE_ENV
        });

        // Handle the signin and callback cases specially
        const actionType = context.params.nextauth.join('/');
        const isSignInOrCallback = actionType === 'signin' || actionType === 'callback';

        console.log(`🔄 Action type: ${actionType}, Special handling: ${isSignInOrCallback}`);

        // Direct handling for basic operations to avoid response issues
        try {
            const response = await authHandler(req, context);

            // Log response info for debugging
            console.log(`🔄 NextAuth response status: ${response.status}`);
            console.log(`🔄 NextAuth response headers:`, Object.fromEntries(response.headers.entries()));

            // For signin and callback, ensure we have a valid response
            if (isSignInOrCallback && response.status >= 400) {
                const errorText = await response.text().catch(() => 'Error reading response body');
                console.error(`Error in ${actionType} response (${response.status}):`, errorText);

                // Return a clean error response
                return safeJsonResponse({
                    error: "AuthenticationError",
                    message: "Authentication failed. Please check your credentials and try again.",
                    status: "error"
                }, { status: 401 });
            }

            // Ensure the response is valid
            return response;
        } catch (handlerError: any) {
            console.error(`⛔ NextAuth handler error:`, handlerError);

            // Check for specific error types
            let errorMessage = "Authentication handler error";
            let errorStatus = 500;

            if (handlerError.message && handlerError.message.includes("database")) {
                errorMessage = "Database connection error";
            } else if (handlerError.message && handlerError.message.includes("token")) {
                errorMessage = "Invalid authentication token";
                errorStatus = 401;
            } else if (handlerError.message && handlerError.message.includes("credentials")) {
                errorMessage = "Invalid login credentials";
                errorStatus = 401;
            }

            // Return a proper JSON response
            return safeJsonResponse({
                error: "AuthHandlerError",
                message: errorMessage,
                details: process.env.NODE_ENV === 'development' ? handlerError.message : undefined,
                status: "error"
            }, { status: errorStatus });
        }
    } catch (error: any) {
        console.error(`⛔ NextAuth API error: ${error.message}`, error);
        // Log details for better troubleshooting
        console.error('Request path:', req.url);
        console.error('Request method:', req.method);
        console.error('NextAuth path param:', context.params.nextauth.join('/'));

        // Return a useful error message
        return safeJsonResponse({
            error: "AuthServerError",
            message: "The authentication server encountered a problem.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            status: "error"
        }, { status: 500 });
    }
};

export { handler as GET, handler as POST }; 