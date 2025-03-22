import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { compare } from "bcrypt";
import { getUserByEmail } from "@/lib/auth";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// Direct login endpoint that bypasses NextAuth for simpler debugging
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, password } = body;

        console.log(`🔐 Direct login attempt for: ${email}`);

        if (!email || !password) {
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Email and password are required",
                status: "error"
            }, { status: 400 });
        }

        // Try standard auth lookup
        const user = await getUserByEmail(email);

        if (!user) {
            console.log("❌ User not found");
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Invalid login credentials",
                status: "error"
            }, { status: 401 });
        }

        console.log(`✅ User found: ${user.id}`);

        // Standard password verification
        console.log(`Verifying password with bcrypt.compare()`);
        const passwordValid = await compare(password, user.password_hash);
        console.log(`Password verification result: ${passwordValid ? '✅ Valid' : '❌ Invalid'}`);

        if (!passwordValid) {
            console.log("❌ Invalid password");
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Invalid login credentials",
                status: "error"
            }, { status: 401 });
        }

        // Create a token
        console.log(`✅ Authentication successful, creating session token`);
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role || 'user'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'));

        // Set cookie
        cookies().set({
            name: 'direct-auth-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 hours
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
        console.error("Direct login error:", error);
        return safeJsonResponse({
            error: "ServerError",
            message: "Authentication server error. Please try again later.",
            status: "error"
        }, { status: 500 });
    }
} 