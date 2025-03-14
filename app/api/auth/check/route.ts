import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({
                authenticated: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        // Return authenticated status and minimal user info
        return NextResponse.json({
            authenticated: true,
            user: {
                id: session.user.id,
                email: session.user.email,
            },
            sessionType: "nextauth",
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({
            authenticated: false,
            error: "Error checking authentication",
        }, { status: 500 });
    }
} 