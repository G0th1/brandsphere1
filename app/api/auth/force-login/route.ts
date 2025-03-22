import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { safeJsonResponse } from "@/lib/api-utils";

// Secret used to sign the token
const SECRET_KEY = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production"
);

/**
 * Force Login API
 * 
 * An emergency login endpoint that bypasses NextAuth completely.
 * It directly creates a session token and sets cookies.
 */
export async function POST(req: NextRequest) {
    try {
        // Extract login details
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return safeJsonResponse(
                {
                    status: "error",
                    message: "Email is required"
                },
                { status: 400 }
            );
        }

        console.log(`🔑 Force Login: Attempting direct login for ${email}`);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        if (!user) {
            return safeJsonResponse(
                {
                    status: "error",
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        // Reset user's password to a known value for emergency access
        const fixedPassword = "BrandSphere!123";
        const hashedPassword = await hash(fixedPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password_hash: hashedPassword }
        });

        // Create a session token for the user
        const token = await new SignJWT({
            sub: user.id,
            email: user.email,
            name: user.name || "",
            role: user.role || "user"
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h") // 24 hour expiration
            .sign(SECRET_KEY);

        // Set all cookie variants to ensure compatibility
        const cookieStore = cookies();

        // Set the session token as a cookie - using both names for compatibility
        cookieStore.set("next-auth.session-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/"
        });

        cookieStore.set("__Secure-next-auth.session-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/"
        });

        // Also set our direct auth token for middleware
        cookieStore.set("direct-auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/"
        });

        console.log(`✅ Emergency access granted for ${email}`);

        // Return success response with redirect
        return safeJsonResponse({
            status: "success",
            message: "Emergency access granted",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            resetPassword: fixedPassword,
            redirectTo: "/dashboard"
        });
    } catch (error) {
        console.error("Force login error:", error);

        return safeJsonResponse(
            {
                status: "error",
                message: "Error during emergency login"
            },
            { status: 500 }
        );
    }
} 