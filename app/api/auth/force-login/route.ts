import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

// Secret key for JWT signing
const getJwtSecretKey = () => {
    const secret = process.env.NEXTAUTH_SECRET || "DEVELOPMENT_SECRET_KEY";
    const encoder = new TextEncoder();
    return encoder.encode(secret);
};

/**
 * Force Login API
 * 
 * An emergency login endpoint that bypasses NextAuth completely.
 * It directly creates a session token and sets cookies.
 */
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        console.log(`Force login requested for email: ${email}`);

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Generate a simple password for emergency access
        const tempPassword = "BrandSphere!123";

        // Update the user's password
        const hashedPassword = await hash(tempPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
            },
        });

        // Generate a JWT token for the user (signed with the same secret as NextAuth)
        const token = await new SignJWT({
            sub: user.id,
            email: user.email,
            name: user.name || "",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
            jti: uuidv4(),
        })
            .setProtectedHeader({ alg: "HS256" })
            .sign(await getJwtSecretKey());

        // Set multiple cookies for maximum compatibility
        const cookieStore = cookies();

        // Set NextAuth session token
        cookieStore.set('next-auth.session-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax'
        });

        // Set direct auth token
        cookieStore.set('direct-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax'
        });

        // Set a callback cookie to simulate NextAuth behavior
        cookieStore.set('next-auth.callback-url', '/dashboard', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax'
        });

        // Also set a CSRF token cookie
        cookieStore.set('next-auth.csrf-token', uuidv4(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax'
        });

        console.log(`Emergency access granted for: ${email}`);

        return NextResponse.json({
            success: true,
            message: "Emergency access granted",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token: token,
            tempPassword: tempPassword,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 1 day
        });
    } catch (error) {
        console.error("Force login error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to grant emergency access" },
            { status: 500 }
        );
    }
} 