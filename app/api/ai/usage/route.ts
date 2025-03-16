import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Mock data for user's AI usage
        // In a real implementation, you would fetch this from the database
        const mockUsage = {
            userId: session.user.id,
            isPro: false,
            usage: {
                contentSuggestions: {
                    used: 9,
                    limit: 20
                },
                hashtagSuggestions: {
                    used: 7,
                    limit: 20
                },
                postAnalysis: {
                    used: 12,
                    limit: 20
                }
            },
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(mockUsage);
    } catch (error) {
        console.error("Error fetching AI usage:", error);
        return NextResponse.json(
            { error: "Failed to fetch AI usage data" },
            { status: 500 }
        );
    }
} 