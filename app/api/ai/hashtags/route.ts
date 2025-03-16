import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Define the request schema
const hashtagRequestSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok"]),
    count: z.number().min(5).max(30).optional().default(15),
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

        // Generate mock hashtags based on the topic
        const baseHashtags = [
            `#${topic.replace(/\s+/g, '')}`,
            `#${topic.replace(/\s+/g, '')}Tips`,
            `#${topic.replace(/\s+/g, '')}Ideas`,
            `#${topic.replace(/\s+/g, '')}Inspiration`,
            `#${topic.replace(/\s+/g, '')}Guide`,
        ];

        // Platform-specific hashtags
        const platformHashtags: Record<string, string[]> = {
            instagram: ['#instagood', '#instadaily', '#photooftheday', '#picoftheday', '#instamood'],
            facebook: ['#facebook', '#facebooklive', '#facebookmarketing', '#socialmedia', '#community'],
            twitter: ['#twittermarketing', '#twitterstrategy', '#twittergrowth', '#twittertrends', '#tweetoftheday'],
            linkedin: ['#linkedintips', '#linkedinmarketing', '#networking', '#business', '#professional'],
            tiktok: ['#tiktok', '#tiktokviral', '#tiktoktrend', '#fyp', '#foryoupage'],
        };

        // General hashtags
        const generalHashtags = [
            '#socialmedia',
            '#marketing',
            '#digital',
            '#content',
            '#strategy',
            '#growth',
            '#trending',
            '#viral',
            '#engagement',
            '#community',
            '#follow',
            '#like',
            '#share',
            '#comment',
            '#explore'
        ];

        // Combine and shuffle hashtags
        const allHashtags = [
            ...baseHashtags,
            ...platformHashtags[platform].slice(0, 5),
            ...generalHashtags.slice(0, count - 10)
        ];

        // Shuffle array
        const shuffledHashtags = allHashtags.sort(() => 0.5 - Math.random());

        // Take the requested number of hashtags
        const resultHashtags = shuffledHashtags.slice(0, count);

        // Group hashtags by category for UI display
        const groupedHashtags = {
            topical: baseHashtags,
            platform: platformHashtags[platform].slice(0, 5),
            general: generalHashtags.slice(0, 5)
        };

        // Update user's AI usage in the database (mock)
        // In a real implementation, you would update the user's usage in the database

        return NextResponse.json({
            success: true,
            hashtags: resultHashtags,
            groupedHashtags,
            usage: {
                contentSuggestions: 12,
                contentSuggestionsLimit: 20,
                hashtagSuggestions: 9, // Incremented by 1 from the previous 8
                hashtagSuggestionsLimit: 15,
                postAnalysis: 5,
                postAnalysisLimit: 10,
                isPro: false
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