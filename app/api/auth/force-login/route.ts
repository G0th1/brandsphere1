import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

/**
 * Force Login API
 * 
 * An emergency login endpoint that bypasses NextAuth completely.
 * It directly creates a session token and sets cookies.
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email } = body;

        console.log(`🚨 FORCE LOGIN: Emergency login attempt for ${email}`);

        if (!email) {
            return new Response(JSON.stringify({
                error: "Email required",
                message: "Email is required for this operation"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get or create user by email
        let user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password_hash: true,
                role: true,
                name: true
            }
        });

        // If user doesn't exist, return error
        if (!user) {
            return new Response(JSON.stringify({
                error: "UserNotFound",
                message: "No user found with this email address"
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log(`✅ Found user: ${user.id}`);

        // Always update the user's password to a known good value for emergency access
        const fixedPassword = "BrandSphere!123"; // Strong but predictable for this emergency login
        const newPasswordHash = await hash(fixedPassword, 10);

        // Update user with new password
        await prisma.user.update({
            where: { id: user.id },
            data: { password_hash: newPasswordHash }
        });

        console.log(`✅ Updated password for emergency access`);

        // Build the session token
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role || 'user',
            name: user.name
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d') // Long expiration for emergency access
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'));

        // Set multiple cookie formats to ensure compatibility
        const cookieOptions = {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            sameSite: 'lax' as const,
        };

        // Set standard session cookie
        cookies().set('next-auth.session-token', token, cookieOptions);

        // Set direct-auth-token for our custom handlers
        cookies().set('direct-auth-token', token, cookieOptions);

        // Set .session cookie for compatibility with hosts like Vercel
        cookies().set('.session', token, cookieOptions);

        // Return success with session info and instructions
        return new Response(JSON.stringify({
            success: true,
            message: "Emergency access granted",
            user: {
                id: user.id,
                email: user.email,
                role: user.role || 'user'
            },
            instructions: `Your password has been reset to: ${fixedPassword}`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Force login error:", error);
        return new Response(JSON.stringify({
            error: "ServerError",
            message: "Emergency login failed. Server error."
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 