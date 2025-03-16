import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { openRouterAI } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

// Define the request schema
const contentRequestSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    industry: z.string().min(1, "Industry is required"),
    platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok"]),
    tone: z.string().optional(),
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
        const validationResult = contentRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid request", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { topic, industry, platform, tone } = validationResult.data;

        // Initialize the OpenRouter AI client
        if (!openRouterAI.initialize()) {
            return NextResponse.json(
                { error: "AI Service not properly configured" },
                { status: 500 }
            );
        }

        // Generate content using OpenRouter AI
        const contentType = tone || "engaging";
        const systemPrompt = `
        You are a social media expert who creates ${contentType} content for ${platform}.
        Generate 3 high-quality post ideas about ${topic} in the ${industry} industry.
        Each post should include:
        1. Engaging main content
        2. 3-5 relevant hashtags
        3. A recommended posting time
        Make the content authentic, creative, and optimized for ${platform}.
        `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Create ${contentType} post ideas about ${topic} in the ${industry} industry for ${platform}` }
        ];

        const completion = await openRouterAI.generateCompletion({ messages });

        // Process the response to extract structured content
        const posts = completion
            .split(/\n{2,}|\d+\.\s+/)
            .map(item => item.trim())
            .filter(item => item.length > 20)
            .map(content => {
                // Extract hashtags if present
                const hashtagRegex = /#[a-zA-Z0-9]+/g;
                const hashtags = (content.match(hashtagRegex) || [])
                    .map(tag => tag.replace('#', ''));

                // Remove hashtags from content if we extracted them
                let cleanContent = content;
                if (hashtags.length > 0) {
                    // Remove the hashtag section if it exists
                    cleanContent = content.replace(/(?:Hashtags|Tags):\s*.*$/i, '').trim();
                }

                return {
                    id: uuidv4(),
                    platform,
                    content: cleanContent,
                    hashtags: hashtags.length ? hashtags : generateDefaultHashtags(topic, industry),
                    bestPostingTime: getDefaultPostingTime(platform)
                };
            })
            .slice(0, 3); // Ensure we return at most 3 suggestions

        // Update user's AI usage in the database (mock)
        // In a real implementation, you would update the user's usage in the database

        return NextResponse.json({
            suggestions: posts,
            usage: {
                current: 9,
                limit: 20
            }
        });

    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json(
            { error: "Failed to generate content suggestions" },
            { status: 500 }
        );
    }
}

// Helper function to generate default hashtags if extraction fails
function generateDefaultHashtags(topic: string, industry: string): string[] {
    return [
        topic.replace(/\s+/g, ''),
        `${topic.replace(/\s+/g, '')}Tips`,
        industry.replace(/\s+/g, ''),
        'SocialMedia',
        'Tips'
    ];
}

// Helper function to get default posting times
function getDefaultPostingTime(platform: string): string {
    const times = {
        instagram: "11:00 AM",
        facebook: "1:00 PM",
        twitter: "9:00 AM",
        linkedin: "10:00 AM",
        tiktok: "7:00 PM"
    };
    return times[platform as keyof typeof times] || "12:00 PM";
} 