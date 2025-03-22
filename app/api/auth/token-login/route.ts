import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

/**
 * Token Login API
 * 
 * A reliable authentication method that uses email+password
 * to look up the user and generate a session token.
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, password } = body;

        console.log(`🔐 Token login: Starting login attempt for ${email}`);

        if (!email || !password) {
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Email and password are required",
                status: "error"
            }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                password_hash: true,
                role: true,
                name: true
            }
        });

        if (!user) {
            console.log(`❌ Token login: User not found with email: ${email}`);
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Invalid login credentials",
                status: "error"
            }, { status: 401 });
        }

        console.log(`✅ Token login: Found user: ${user.id}`);

        // Standard password verification with bcrypt
        const isAuthenticated = await compare(password, user.password_hash);
        console.log(`Token login: Password verification result: ${isAuthenticated ? '✅ Valid' : '❌ Invalid'}`);

        if (!isAuthenticated) {
            console.log(`❌ Token login: Invalid password for user: ${user.id}`);
            return safeJsonResponse({
                error: "InvalidCredentials",
                message: "Invalid login credentials",
                status: "error"
            }, { status: 401 });
        }

        // User authenticated, create a session token
        console.log(`✅ Token login: Authentication successful, creating session token`);
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role || 'user',
            name: user.name
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

        // Also set the next-auth.session-token for compatibility
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
        console.error("Token login error:", error);
        return safeJsonResponse({
            error: "ServerError",
            message: "Authentication server error. Please try again later.",
            status: "error"
        }, { status: 500 });
    }
} 