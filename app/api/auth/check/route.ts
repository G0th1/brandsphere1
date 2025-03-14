import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * API route to check if a user is authenticated
 * Returns authenticated: true/false and optional user data
 */
export async function GET(request: NextRequest) {
    try {
        // Get session using NextAuth
        const session = await getServerSession(authOptions);

        // Check if we're in development mode with offline mode enabled
        const isOfflineMode = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_OFFLINE_MODE === "true";

        if (session?.user) {
            // User is authenticated
            return NextResponse.json({
                authenticated: true,
                user: {
                    email: session.user.email,
                    name: session.user.name,
                    role: session.user.role || "user"
                }
            });
        } else if (isOfflineMode) {
            // Development offline mode - return mock authenticated response
            console.log("[Auth Check API] Using offline development mode");
            return NextResponse.json({
                authenticated: true,
                user: {
                    email: "dev@example.com",
                    name: "Developer",
                    role: "admin"
                },
                mode: "offline"
            });
        } else {
            // User is not authenticated
            return NextResponse.json({ authenticated: false });
        }
    } catch (error) {
        console.error("[Auth Check API] Error:", error);

        // If we're in development, always return authenticated in case of error
        if (process.env.NODE_ENV === "development") {
            console.log("[Auth Check API] Development mode fallback");
            return NextResponse.json({
                authenticated: true,
                user: {
                    email: "dev@example.com",
                    name: "Developer",
                    role: "admin"
                },
                mode: "fallback"
            });
        }

        return NextResponse.json(
            {
                authenticated: false,
                error: "Internal server error"
            },
            { status: 500 }
        );
    }
}

/**
 * Allow OPTIONS requests for CORS
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
} 