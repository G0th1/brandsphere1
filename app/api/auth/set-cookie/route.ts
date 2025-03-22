import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        // Create a secure cookie with the token
        const cookieStore = cookies();

        // Set multiple cookie formats to ensure cross-browser compatibility
        cookieStore.set('direct-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax'
        });

        // Set a NextAuth format cookie as well (for compatibility with auth provider)
        cookieStore.set('next-auth.session-token', token, {
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

        console.log('Successfully set cookies via API');

        return NextResponse.json({
            status: "success",
            message: "Cookies set successfully"
        });
    } catch (error) {
        console.error("Error setting cookies:", error);
        return NextResponse.json({
            error: "Failed to set cookies"
        }, {
            status: 500
        });
    }
} 