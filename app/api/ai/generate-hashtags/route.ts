import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { openRouterAI } from "@/lib/ai";

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

        // Initialize the OpenRouter AI client
        if (!openRouterAI.initialize()) {
            return NextResponse.json(
                { error: "AI Service not properly configured" },
                { status: 500 }
            );
        }

        // Generate hashtags using OpenRouter AI
        const systemPrompt = `
        You are a social media hashtag expert. Generate ${count} relevant hashtags for ${platform} about the topic "${topic}".
        Categorize the hashtags into three groups:
        1. Popular (high-volume hashtags with broad reach)
        2. Niche (specific to the topic with targeted audience)
        3. Trending (currently gaining popularity)
        
        For each hashtag, include an estimated post count and popularity rating (high, medium, low).
        Format your response as JSON with these categories.
        `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate and categorize ${count} ${platform} hashtags for topic: ${topic}` }
        ];

        const completion = await openRouterAI.generateCompletion({ messages });

        // Try to parse the result as JSON
        let allHashtags = [];
        let categories = { popular: [], niche: [], trending: [] };

        try {
            // First try to parse as JSON
            const jsonResponse = JSON.parse(completion);
            if (jsonResponse.popular && Array.isArray(jsonResponse.popular)) {
                categories.popular = jsonResponse.popular;
                allHashtags = [...allHashtags, ...jsonResponse.popular.map(h => h.name || h)];
            }
            if (jsonResponse.niche && Array.isArray(jsonResponse.niche)) {
                categories.niche = jsonResponse.niche;
                allHashtags = [...allHashtags, ...jsonResponse.niche.map(h => h.name || h)];
            }
            if (jsonResponse.trending && Array.isArray(jsonResponse.trending)) {
                categories.trending = jsonResponse.trending;
                allHashtags = [...allHashtags, ...jsonResponse.trending.map(h => h.name || h)];
            }
        } catch (parseError) {
            // If JSON parsing fails, extract hashtags from text
            console.log("JSON parsing failed, extracting hashtags from text");

            // Simple extraction of hashtags by splitting
            const extractedTags = completion
                .replace(/#/g, '')  // Remove # symbols if present
                .split(/[\n,]/)      // Split by newlines or commas
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag.length > 0 && !tag.includes(' '));  // Filter empty or multi-word tags

            // Create a simple structure
            allHashtags = extractedTags;

            // Divide into categories by position in the list
            const third = Math.ceil(extractedTags.length / 3);
            categories = {
                popular: extractedTags.slice(0, third).map(tag => ({ name: tag, popularity: "high", posts: "1M+" })),
                niche: extractedTags.slice(third, third * 2).map(tag => ({ name: tag, popularity: "medium", posts: "100K+" })),
                trending: extractedTags.slice(third * 2).map(tag => ({ name: tag, popularity: "low", posts: "10K+" }))
            };
        }

        // If we have fewer hashtags than requested, generate some defaults
        if (allHashtags.length < count) {
            const defaultTags = [
                topic.replace(/\s+/g, ''),
                `${topic}Tips`,
                `${topic}Advice`,
                'SocialMedia',
                'ContentCreation',
                'DigitalMarketing',
                platform
            ].filter(tag => !allHashtags.includes(tag));

            allHashtags = [...allHashtags, ...defaultTags].slice(0, count);

            // Add any defaults to the "popular" category
            categories.popular = [
                ...categories.popular,
                ...defaultTags.map(tag => ({ name: tag, popularity: "medium", posts: "500K+" }))
            ].slice(0, Math.ceil(count / 3));
        }

        // Update user's AI usage in the database (mock)
        // In a real implementation, you would update the user's usage in the database

        return NextResponse.json({
            categories,
            allHashtags: allHashtags.map(tag => typeof tag === 'object' ? tag.name : tag),
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