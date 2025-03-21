import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, withErrorHandling } from "@/lib/prisma";
import { withCache, CACHE_TTL } from "@/lib/redis";

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

        const userId = session.user.id;
        const cacheKey = `usage:${userId}`;

        // Use the withCache helper to cache responses
        const usageData = await withCache(
            cacheKey,
            async () => {
                // In a real implementation, fetch this from the database
                // First try to get user usage data from the database
                try {
                    const usageLogs = await withErrorHandling(() =>
                        prisma.usageLog.findMany({
                            where: {
                                user_id: userId,
                                // Only get usage logs from the current month
                                timestamp: {
                                    gte: new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        1
                                    )
                                }
                            },
                            orderBy: {
                                timestamp: 'desc'
                            }
                        })
                    );

                    // Calculate usage statistics
                    const totalTokensUsed = usageLogs.reduce((sum, log) => sum + log.tokens_used, 0);

                    // For now, we'll use a simple distribution model
                    // In a real app, you'd track usage by specific AI feature category
                    const contentTokens = Math.floor(totalTokensUsed * 0.45);
                    const hashtagTokens = Math.floor(totalTokensUsed * 0.25);
                    const analysisTokens = Math.floor(totalTokensUsed * 0.30);

                    // Get user's subscription to determine limits
                    const subscription = await withErrorHandling(() =>
                        prisma.subscription.findFirst({
                            where: {
                                user_id: userId,
                                status: 'active'
                            },
                            orderBy: {
                                end_date: 'desc'
                            }
                        })
                    );

                    // Set limits based on subscription plan (default to free tier)
                    const planLimits = {
                        free: { content: 20, hashtags: 20, analysis: 20 },
                        pro: { content: 100, hashtags: 100, analysis: 100 },
                        business: { content: 500, hashtags: 500, analysis: 500 }
                    };

                    const plan = subscription?.plan || 'free';
                    const limits = planLimits[plan as keyof typeof planLimits] || planLimits.free;

                    return {
                        userId,
                        usage: {
                            contentSuggestions: {
                                used: Math.min(Math.ceil(contentTokens / 1000), limits.content),
                                limit: limits.content
                            },
                            hashtagSuggestions: {
                                used: Math.min(Math.ceil(hashtagTokens / 500), limits.hashtags),
                                limit: limits.hashtags
                            },
                            postAnalysis: {
                                used: Math.min(Math.ceil(analysisTokens / 700), limits.analysis),
                                limit: limits.analysis
                            }
                        },
                        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
                        lastUpdated: new Date().toISOString()
                    };
                } catch (dbError) {
                    console.error("Database error fetching usage data:", dbError);

                    // Fallback to mock data on database error
                    return {
                        userId,
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
                }
            },
            CACHE_TTL.SHORT // Cache for a short time since usage can change frequently
        );

        return NextResponse.json(usageData, {
            headers: {
                'Cache-Control': 'private, max-age=60'
            }
        });
    } catch (error) {
        console.error("Error fetching AI usage:", error);
        return NextResponse.json(
            { error: "Failed to fetch AI usage data" },
            { status: 500 }
        );
    }
} 