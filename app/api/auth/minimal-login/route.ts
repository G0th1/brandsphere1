import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { cookies } from "next/headers";
import { SignJWT } from "jose";

// Create a direct database connection
const sql = neon(process.env.DATABASE_URL || '');

/**
 * MINIMAL LOGIN
 * 
 * This is the most minimal login endpoint possible.
 * It uses only the most essential fields from the Users table.
 * 
 * Usage: /api/auth/minimal-login?email=user@example.com
 */
export async function GET(req: NextRequest) {
    try {
        // Get email from query params
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        console.log(`🔑 MINIMAL LOGIN attempt for: ${email}`);

        if (!email) {
            return new NextResponse('Email parameter is required', { status: 400 });
        }

        // Find user in database with only id and email
        const users = await sql`
            SELECT id, email 
            FROM "Users"
            WHERE email = ${email}
        `;

        console.log(`Query result: ${JSON.stringify(users)}`);

        if (!users || users.length === 0) {
            console.log(`❌ User not found: ${email}`);
            return new NextResponse(`User not found: ${email}`, { status: 404 });
        }

        const user = users[0];
        console.log(`✅ User found: ${JSON.stringify(user)}`);

        // Create minimal session token with just id and email
        const token = await new SignJWT({
            id: user.id,
            email: user.email
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'));

        // Set cookies
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

        // Return success page with login info
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login Successful</title>
            <meta http-equiv="refresh" content="5;url=/dashboard" />
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; }
                .card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .success { color: #28a745; }
                code { background: #eee; padding: 2px 5px; border-radius: 4px; font-family: monospace; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1 class="success">✅ Login Successful!</h1>
                <p>Successfully logged in as: <code>${user.email}</code></p>
                <p>User ID: <code>${user.id}</code></p>
                <p>You will be redirected to the dashboard in 5 seconds...</p>
                <p>If you are not redirected, <a href="/dashboard">click here</a>.</p>
            </div>
        </body>
        </html>
        `;

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            }
        });
    } catch (error) {
        console.error(`❌ Minimal login error:`, error);

        // Return error page
        const errorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login Error</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; }
                .card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .error { color: #dc3545; }
                code { background: #eee; padding: 2px 5px; border-radius: 4px; font-family: monospace; overflow-wrap: break-word; word-wrap: break-word; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1 class="error">❌ Login Error</h1>
                <p>An error occurred during login:</p>
                <p><code>${error instanceof Error ? error.message : String(error)}</code></p>
                <p>Please <a href="/auth/login">try again</a> or contact support.</p>
            </div>
        </body>
        </html>
        `;

        return new NextResponse(errorHtml, {
            status: 500,
            headers: {
                'Content-Type': 'text/html',
            }
        });
    }
} 