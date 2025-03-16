import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Define the request schema
const analyzeRequestSchema = z.object({
    content: z.string().min(1, "Content is required"),
    platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok"]),
    includeHashtags: z.boolean().optional().default(true),
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
        const validationResult = analyzeRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid request", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { content, platform, includeHashtags } = validationResult.data;

        // In a real implementation, you would:
        // 1. Check user's AI usage quota
        // 2. Call an AI service (OpenAI, etc.)
        // 3. Log the usage
        // 4. Return the analysis results

        // Calculate a mock score based on content length and some basic factors
        const contentLength = content.length;
        const hasHashtags = content.includes('#');
        const hasEmojis = /[\p{Emoji}]/u.test(content);
        const hasMentions = content.includes('@');

        // Base score out of 100
        let score = Math.min(100, Math.max(50, 60 + contentLength / 20));

        // Adjust score based on factors
        if (hasHashtags) score += 5;
        if (hasEmojis) score += 5;
        if (hasMentions) score += 5;
        if (contentLength > 50 && contentLength < 200) score += 10;

        // Cap at 100
        score = Math.min(100, score);

        const analysis = {
            overall: {
                score: Math.round(score),
                rating: score >= 80 ? "Excellent" : score >= 70 ? "Good" : score >= 60 ? "Average" : "Needs Improvement",
            },
            details: {
                length: {
                    value: contentLength,
                    recommendation: contentLength < 50
                        ? "Your post is quite short. Consider adding more context to engage your audience."
                        : contentLength > 300
                            ? "Your post is quite long. Consider breaking it up or making it more concise for better engagement."
                            : "Your post length is good for engagement.",
                },
                sentiment: {
                    value: "Positive",
                    recommendation: "The positive tone is good for engagement."
                },
                engagement: {
                    value: hasHashtags && hasEmojis ? "High" : hasHashtags || hasEmojis ? "Medium" : "Low",
                    recommendation: !hasHashtags
                        ? "Consider adding relevant hashtags to increase discoverability."
                        : !hasEmojis
                            ? "Adding some emojis can make your post more engaging and eye-catching."
                            : "Good use of engagement elements."
                }
            },
            improvement: {
                suggestions: [
                    contentLength < 50 ? "Add more context to tell a complete story." : "Keep your post concise while covering key points.",
                    !hasHashtags ? "Include 3-5 relevant hashtags to increase visibility." : "Your hashtag usage looks good.",
                    !hasEmojis ? "Add emojis to make your post more visually appealing." : "Good use of emojis!",
                    "Consider adding a call-to-action to encourage engagement.",
                ].filter(s => !s.includes("looks good") && !s.includes("Good use")),
            }
        };

        // If hashtags were requested and not enough present
        if (includeHashtags && !hasHashtags) {
            const suggestedHashtags = generateMockHashtags(content, platform);
            analysis.improvement.suggestedHashtags = suggestedHashtags;
        }

        // Update user's AI usage in the database (mock)
        // In a real implementation, you would update the user's usage in the database

        return NextResponse.json({
            analysis,
            usage: {
                current: 12,
                limit: 20
            }
        });

    } catch (error) {
        console.error("Error analyzing post:", error);
        return NextResponse.json(
            { error: "Failed to analyze post" },
            { status: 500 }
        );
    }
}

// Helper function to generate mock hashtags based on content
function generateMockHashtags(content: string, platform: string) {
    const commonWords = content
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 3);

    const industryHashtags = ["marketing", "business", "socialmedia", "digitalmarketing"];
    const platformSpecificHashtags: Record<string, string[]> = {
        instagram: ["instadaily", "instagood", "photooftheday"],
        facebook: ["facebooklive", "facebookmarketing"],
        twitter: ["twittermarketing", "tweet", "twitterstrategy"],
        linkedin: ["linkedintips", "networking", "business"],
        tiktok: ["tiktokmarketing", "tiktokcreator", "tiktokbusiness"]
    };

    // Create hashtags from content words
    const contentHashtags = commonWords
        .slice(0, 3)
        .map(word => `#${word}`);

    // Add industry hashtags
    const selectedIndustryHashtags = industryHashtags
        .slice(0, 2)
        .map(tag => `#${tag}`);

    // Add platform-specific hashtags
    const selectedPlatformHashtags = platformSpecificHashtags[platform]
        .slice(0, 2)
        .map(tag => `#${tag}`);

    return [
        ...contentHashtags,
        ...selectedIndustryHashtags,
        ...selectedPlatformHashtags
    ];
} 