import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Define the request schema
const hashtagRequestSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok"]),
    count: z.number().min(1).max(30).optional().default(15),
});

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const validationResult = hashtagRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid request", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { topic, platform, count } = validationResult.data;

        // In a real implementation, you would:
        // 1. Check user's AI usage quota
        // 2. Call an AI service (OpenAI, etc.)
        // 3. Log the usage
        // 4. Return the generated hashtags

        // Mock data for different categories of hashtags
        const mockHashtagCategories = {
            popular: [
                { name: `#${topic.replace(/\s+/g, '')}`, popularity: "Very High", posts: "2.3M+" },
                { name: `#${platform}marketing`, popularity: "High", posts: "1.5M+" },
                { name: `#${topic.replace(/\s+/g, '')}tips`, popularity: "High", posts: "892K+" },
                { name: `#${platform}tips`, popularity: "Medium", posts: "450K+" },
                { name: `#${topic.replace(/\s+/g, '')}strategy`, popularity: "Medium", posts: "320K+" }
            ],
            niche: [
                { name: `#${topic.replace(/\s+/g, '')}expert`, popularity: "Low", posts: "89K+" },
                { name: `#${platform}growth`, popularity: "Low", posts: "76K+" },
                { name: `#${topic.replace(/\s+/g, '')}hacks`, popularity: "Low", posts: "45K+" },
                { name: `#small${topic.replace(/\s+/g, '')}`, popularity: "Low", posts: "32K+" },
                { name: `#${topic.replace(/\s+/g, '')}community`, popularity: "Very Low", posts: "12K+" }
            ],
            trending: [
                { name: `#${topic.replace(/\s+/g, '')}2024`, popularity: "Rising", posts: "156K+" },
                { name: `#ai${topic.replace(/\s+/g, '')}`, popularity: "Rising", posts: "87K+" },
                { name: `#${platform}algorithm`, popularity: "Rising", posts: "65K+" },
                { name: `#${topic.replace(/\s+/g, '')}trends`, popularity: "Rising", posts: "43K+" },
                { name: `#${topic.replace(/\s+/g, '')}inspiration`, popularity: "Rising", posts: "28K+" }
            ]
        };

        // Flatten all categories and take the requested count
        const allHashtags = [
            ...mockHashtagCategories.popular,
            ...mockHashtagCategories.niche,
            ...mockHashtagCategories.trending
        ].slice(0, Math.min(count, 15));

        // Update user's AI usage in the database (mock)
        // In a real implementation, you would update the user's usage in the database

        return NextResponse.json({
            categories: mockHashtagCategories,
            allHashtags: allHashtags,
            usage: {
                current: 7,
                limit: 20
            }
        });

    } catch (error) {
        console.error("Error generating hashtags:", error);
        return NextResponse.json(
            { error: "Failed to generate hashtags" },
            { status: 500 }
        );
    }
} 