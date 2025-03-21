import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { neon } from '@neondatabase/serverless';
import { cookies } from "next/headers";
import { SignJWT } from "jose";

// Create a direct database connection
const sql = neon(process.env.DATABASE_URL || '');

/**
 * Emergency Direct Authentication API
 * 
 * This is a simplified, direct authentication endpoint that bypasses 
 * all normal checks and gives emergency access to specific accounts.
 * Used only when all other authentication methods are failing.
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email } = body;

        console.log(`🆘 Emergency direct auth attempt for: ${email}`);

        if (!email) {
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Email is required",
                status: "error"
            }, { status: 400 });
        }

        // Direct database lookup
        const users = await sql`
            SELECT id, email, role, name
            FROM "Users"
            WHERE email = ${email}
        `;

        if (!users || users.length === 0) {
            return safeJsonResponse({
                error: "UserNotFound",
                message: "User not found",
                status: "error"
            }, { status: 404 });
        }

        const user = users[0];
        console.log(`Found user: ${user.email}, id: ${user.id}`);

        // Ultra-simplified approach: check if this is one of our specific users
        // No password check at all - just based on email
        const allowedEmails = [
            'edvin',
            'gothager',
            'g0th',
            'kebabisenen@proton.me',
            'test@example'
        ];

        const isAllowedEmail = allowedEmails.some(pattern =>
            user.email.toLowerCase().includes(pattern.toLowerCase())
        );

        if (!isAllowedEmail) {
            console.log(`❌ Emergency auth not allowed for: ${user.email}`);
            return safeJsonResponse({
                error: "Unauthorized",
                message: "Emergency access not allowed for this account",
                status: "error"
            }, { status: 403 });
        }

        console.log(`✅ Emergency access granted to: ${user.email}`);

        // Generate a session token
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role || 'user',
            name: user.name,
            emergency: true
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d') // 30 days
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'));

        // Set cookies for authentication
        cookies().set({
            name: 'direct-auth-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Also set the next-auth session token for compatibility
        cookies().set({
            name: 'next-auth.session-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Return success
        return safeJsonResponse({
            user: {
                id: user.id,
                email: user.email,
                role: user.role || 'user',
                name: user.name || null
            },
            status: "success"
        });
    } catch (error) {
        console.error(`❌ Emergency direct auth error:`, error);

        return safeJsonResponse({
            error: "AuthError",
            message: "An error occurred during emergency authentication",
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
            status: "error"
        }, { status: 500 });
    }
} 