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

        // In a real implementation, you would:
        // 1. Query the database for the user's AI usage
        // 2. Get the user's subscription tier
        // 3. Return the usage data with limits based on the tier

        // For now, we'll return mock data
        const mockUsage = {
            contentSuggestions: 12,
            contentSuggestionsLimit: 20,
            hashtagSuggestions: 9,
            hashtagSuggestionsLimit: 15,
            postAnalysis: 5,
            postAnalysisLimit: 10,
            isPro: false
        };

        return NextResponse.json({
            success: true,
            usage: mockUsage
        });

    } catch (error) {
        console.error("Error fetching AI usage:", error);
        return NextResponse.json(
            { error: "Failed to fetch AI usage" },
            { status: 500 }
        );
    }
} 