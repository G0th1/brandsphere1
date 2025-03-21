import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { cookies } from "next/headers";
import { SignJWT } from "jose";

// Create a direct database connection
const sql = neon(process.env.DATABASE_URL || '');

/**
 * BYPASS LOGIN
 * 
 * This is an ultra-simplified login endpoint that can be accessed directly through a URL.
 * It will automatically authenticate the user without any password checks.
 * 
 * Usage: /api/auth/bypass-login?email=user@example.com
 */
export async function GET(req: NextRequest) {
    try {
        // Get email from query params
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        console.log(`🔑 BYPASS LOGIN attempt for: ${email}`);

        if (!email) {
            return new NextResponse('Email parameter is required', { status: 400 });
        }

        // Find user in database
        const users = await sql`
            SELECT id, email, role
            FROM "Users"
            WHERE email = ${email}
        `;

        if (!users || users.length === 0) {
            console.log(`❌ User not found: ${email}`);
            return new NextResponse(`User not found: ${email}`, { status: 404 });
        }

        const user = users[0];
        console.log(`✅ User found, creating session token for: ${user.email}`);

        // Create session token
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role || 'user'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'));

        // Set both direct auth token and NextAuth token
        cookies().set({
            name: 'direct-auth-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        cookies().set({
            name: 'next-auth.session-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Redirect to dashboard
        console.log(`✅ Bypass login successful, redirecting to dashboard`);
        return NextResponse.redirect(new URL('/dashboard', req.url));
    } catch (error) {
        console.error(`❌ Bypass login error:`, error);
        return new NextResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
} 