import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Auth check API
 * 
 * Simple endpoint to verify if the user is authenticated
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return safeJsonResponse({
                authenticated: false,
                message: "Not authenticated",
                status: "error"
            }, { status: 401 });
        }

        return safeJsonResponse({
            authenticated: true,
            user: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role || 'user',
                name: session.user.name || null
            },
            status: "success"
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return safeJsonResponse({
            authenticated: false,
            error: "ServerError",
            message: "Server error checking authentication",
            status: "error"
        }, { status: 500 });
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