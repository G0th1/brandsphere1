import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Define the request schema
const analyzeRequestSchema = z.object({
    content: z.string().min(1, "Content is required"),
    platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok"]),
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

        const { content, platform } = validationResult.data;

        // In a real implementation, you would:
        // 1. Check user's AI usage quota
        // 2. Call an AI service (OpenAI, etc.)
        // 3. Log the usage
        // 4. Return the analysis

        // Generate mock analysis based on the content
        const contentLength = content.length;
        const hasHashtags = content.includes('#');
        const hasEmojis = /[\p{Emoji}]/u.test(content);
        const hasQuestions = content.includes('?');
        const hasCTA = /\b(check out|click|visit|follow|share|comment|like|subscribe)\b/i.test(content);

        // Calculate a mock score based on content features
        let score = 0;
        if (contentLength > 50 && contentLength < 300) score += 20; // Ideal length
        if (hasHashtags) score += 15; // Has hashtags
        if (hasEmojis) score += 15; // Has emojis
        if (hasQuestions) score += 10; // Has questions (engagement)
        if (hasCTA) score += 15; // Has call to action

        // Add random factor
        score += Math.floor(Math.random() * 25);

        // Cap at 100
        score = Math.min(score, 100);

        // Determine engagement level based on score
        let predictedEngagement = 'low';
        if (score > 70) predictedEngagement = 'high';
        else if (score > 40) predictedEngagement = 'medium';

        // Generate strengths and weaknesses
        const strengths = [];
        const weaknesses = [];

        if (contentLength > 50 && contentLength < 300) {
            strengths.push('Good content length for this platform');
        } else if (contentLength <= 50) {
            weaknesses.push('Content is too short for optimal engagement');
        } else {
            weaknesses.push('Content may be too long for this platform');
        }

        if (hasHashtags) {
            strengths.push('Good use of hashtags to increase discoverability');
        } else {
            weaknesses.push('No hashtags found - consider adding relevant hashtags');
        }

        if (hasEmojis) {
            strengths.push('Emojis help make your content more engaging');
        } else {
            weaknesses.push('Consider adding emojis to make your content more visually appealing');
        }

        if (hasQuestions) {
            strengths.push('Questions encourage audience engagement');
        } else {
            weaknesses.push('Consider adding a question to encourage comments');
        }

        if (hasCTA) {
            strengths.push('Clear call-to-action helps drive engagement');
        } else {
            weaknesses.push('No clear call-to-action - tell your audience what to do next');
        }

        // Generate suggestions based on weaknesses
        const suggestions = weaknesses.map(weakness => {
            if (weakness.includes('too short')) {
                return 'Add more context or details to make your content more valuable';
            } else if (weakness.includes('too long')) {
                return 'Consider shortening your content or breaking it into multiple posts';
            } else if (weakness.includes('hashtags')) {
                return `Add 3-5 relevant hashtags to increase your ${platform} post visibility`;
            } else if (weakness.includes('emojis')) {
                return 'Add relevant emojis to make your content more visually appealing';
            } else if (weakness.includes('question')) {
                return 'End your post with a question to encourage comments';
            } else if (weakness.includes('call-to-action')) {
                return 'Add a clear call-to-action like "Double tap if you agree" or "Share with someone who needs to see this"';
            } else {
                return weakness;
            }
        });

        // Determine sentiment based on content
        let sentiment = 'neutral';
        const positiveWords = ['amazing', 'awesome', 'great', 'love', 'happy', 'excited', 'best', 'wonderful'];
        const negativeWords = ['bad', 'hate', 'terrible', 'worst', 'sad', 'disappointed', 'awful'];

        const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length;
        const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length;

        if (positiveCount > negativeCount) sentiment = 'positive';
        else if (negativeCount > positiveCount) sentiment = 'negative';

        // Generate recommended posting time based on platform
        const recommendedTimes = {
            instagram: '11:00 AM or 7:00 PM',
            facebook: '1:00 PM or 3:00 PM',
            twitter: '9:00 AM or 6:00 PM',
            linkedin: '9:00 AM or 12:00 PM',
            tiktok: '7:00 PM or 9:00 PM',
        };

        const mockAnalysis = {
            sentiment,
            suggestions,
            predictedEngagement,
            recommendedTime: recommendedTimes[platform as keyof typeof recommendedTimes],
            score,
            strengths,
            weaknesses
        };

        // Update user's AI usage in the database (mock)
        // In a real implementation, you would update the user's usage in the database

        return NextResponse.json({
            success: true,
            analysis: mockAnalysis,
            usage: {
                contentSuggestions: 12,
                contentSuggestionsLimit: 20,
                hashtagSuggestions: 9,
                hashtagSuggestionsLimit: 15,
                postAnalysis: 6, // Incremented by 1 from the previous 5
                postAnalysisLimit: 10,
                isPro: false
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