import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createSafeSupabaseClient } from '@/app/utils/supabase-client';
import AIService from '@/services/ai-service';
import SubscriptionService from '@/services/subscription-service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // Get user session
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Parse request body
        const { topic, industry, platform, tone } = await request.json();

        if (!topic || !industry || !platform) {
            return NextResponse.json(
                { error: 'Missing required fields: topic, industry, and platform are required' },
                { status: 400 }
            );
        }

        // Get user's subscription tier
        const subscription = await SubscriptionService.getUserSubscription();
        const tier = subscription.plan === 'pro' ? 'pro' : 'free';

        // Get user's usage for the current month
        const supabase = createSafeSupabaseClient();
        const userId = session.user.id;

        const { data: usageData, error: usageError } = await supabase
            .from('ai_usage')
            .select('content_suggestions_count')
            .eq('user_id', userId)
            .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (usageError && usageError.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
            console.error('Error fetching user AI usage:', usageError);
            return NextResponse.json(
                { error: 'Failed to check usage limits' },
                { status: 500 }
            );
        }

        // Check if user has exceeded their monthly limit
        const currentUsage = usageData?.content_suggestions_count || 0;
        const limits = AIService.getLimitsForTier(tier);

        if (currentUsage >= limits.contentSuggestions) {
            return NextResponse.json(
                {
                    error: 'Monthly limit exceeded',
                    message: `You've reached your monthly limit of ${limits.contentSuggestions} content suggestions. Upgrade to Pro for more.`,
                    limit: limits.contentSuggestions,
                    usage: currentUsage
                },
                { status: 403 }
            );
        }

        // Generate content suggestions
        const suggestions = await AIService.generateContentSuggestions(
            topic,
            industry,
            platform,
            tone || 'professional'
        );

        // Update usage count
        const { error: updateError } = await supabase
            .from('ai_usage')
            .upsert({
                user_id: userId,
                content_suggestions_count: currentUsage + 1,
                created_at: new Date().toISOString()
            });

        if (updateError) {
            console.error('Error updating AI usage:', updateError);
            // We'll still return the suggestions even if tracking fails
        }

        return NextResponse.json({
            suggestions,
            usage: {
                current: currentUsage + 1,
                limit: limits.contentSuggestions
            }
        });
    } catch (error) {
        console.error('Error processing content suggestions request:', error);
        return NextResponse.json(
            { error: 'Failed to generate content suggestions' },
            { status: 500 }
        );
    }
} 