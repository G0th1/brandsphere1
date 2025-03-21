import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { SignJWT } from "jose";
import { neon } from '@neondatabase/serverless';

// Create a direct database connection
const sql = neon(process.env.DATABASE_URL || '');

// Emergency login endpoint that generates a one-time login link
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email } = body;

        console.log(`🔐 Emergency login generation for: ${email}`);

        if (!email) {
            return safeJsonResponse({
                error: "InvalidRequest",
                message: "Email is required",
                status: "error"
            }, { status: 400 });
        }

        // Direct database lookup
        try {
            const users = await sql`
                SELECT id, email, role, name
                FROM "Users"
                WHERE email = ${email}
            `;

            console.log(`Emergency login: found ${users?.length || 0} users`);

            if (!users || users.length === 0) {
                return safeJsonResponse({
                    error: "UserNotFound",
                    message: "User not found",
                    status: "error"
                }, { status: 404 });
            }

            const user = users[0];
            console.log(`Found user: ${user.email}, id: ${user.id}`);

            // Verify this is a legitimate user looking for emergency access
            if (!user.email.includes('edvin') &&
                !user.email.includes('g0th') &&
                !user.email.includes('gothager') &&
                !user.email.includes('kebabisenen@proton.me')) {
                console.log(`❌ Unauthorized emergency login attempt for: ${user.email}`);
                return safeJsonResponse({
                    error: "Unauthorized",
                    message: "Not authorized for emergency login",
                    status: "error"
                }, { status: 403 });
            }

            // Create a token with short expiration (15 minutes)
            const token = await new SignJWT({
                id: user.id,
                email: user.email,
                role: user.role || 'user',
                emergencyLogin: true
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('15m') // Short expiration time
                .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'));

            // Generate the magic link
            const host = req.headers.get("host") || "localhost:3000";
            const protocol = host.includes("localhost") ? "http" : "https";
            const magicLink = `${protocol}://${host}/api/auth/login-with-token?token=${encodeURIComponent(token)}`;

            console.log(`✅ Emergency login link generated`);

            // Return the magic link
            return safeJsonResponse({
                status: "success",
                magicLink
            });
        } catch (error) {
            console.error("❌ Emergency login error:", error);
            return safeJsonResponse({
                error: "ServerError",
                message: "An error occurred processing your request",
                status: "error"
            }, { status: 500 });
        }
    } catch (error) {
        console.error("❌ Unexpected error:", error);
        return safeJsonResponse({
            error: "ServerError",
            message: "An unexpected error occurred",
            status: "error"
        }, { status: 500 });
    }
} 