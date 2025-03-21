import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Login with a token endpoint
export async function GET(req: NextRequest) {
    try {
        // Get the token from the query string
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        console.log(`🔐 Login with token attempt`);

        if (!token) {
            console.log("❌ No token provided");
            return new NextResponse("No token provided", { status: 400 });
        }

        // Verify the token
        try {
            const secret = new TextEncoder().encode(
                process.env.NEXTAUTH_SECRET || 'fallback-secret-only-for-development'
            );

            const { payload } = await jwtVerify(token, secret);
            console.log("✅ Token verified:", {
                id: payload.id,
                email: payload.email,
                emergencyLogin: payload.emergencyLogin
            });

            // Ensure this is an emergency login token
            if (!payload.emergencyLogin) {
                console.log("❌ Not an emergency login token");
                return new NextResponse("Invalid token type", { status: 400 });
            }

            // Set the session cookie
            const thirtyDays = 30 * 24 * 60 * 60;
            const session = await new TextEncoder().encode(JSON.stringify({
                user: {
                    id: payload.id,
                    email: payload.email,
                    role: payload.role || 'user',
                    name: payload.name
                },
                expires: new Date(Date.now() + thirtyDays * 1000).toISOString()
            }));

            const sessionToken = await new TextEncoder().encode(JSON.stringify({
                email: payload.email
            }));

            // Set session cookies
            cookies().set({
                name: 'next-auth.session-token',
                value: Buffer.from(sessionToken).toString('base64'),
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: thirtyDays,
            });

            cookies().set({
                name: 'direct-auth-token',
                value: token,
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: thirtyDays,
            });

            // Redirect to the dashboard
            console.log("✅ Login successful, redirecting to dashboard");
            return NextResponse.redirect(new URL("/dashboard", req.url));
        } catch (verifyError) {
            console.error("❌ Token verification failed:", verifyError);
            return new NextResponse("Invalid or expired token", { status: 401 });
        }
    } catch (error) {
        console.error("❌ Unexpected error:", error);
        return new NextResponse("An unexpected error occurred", { status: 500 });
    }
} 