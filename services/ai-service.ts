import { toast } from "@/components/ui/use-toast";
import { AIUsage } from "@/types/ai";

export interface ContentSuggestion {
    content: string;
    hashtags: string[];
    bestPostingTime?: string;
    imagePrompt?: string;
}

export interface HashtagResponse {
    hashtags: string[];
    recommended: string[];
    trending: string[];
}

export interface PostAnalysisResponse {
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestions: string[];
    predictedEngagement: 'high' | 'medium' | 'low';
    recommendedTime?: string;
}

// Define the API limits for different subscription tiers
const TIER_LIMITS = {
    free: {
        contentSuggestions: 10, // 10 AI-generated suggestions per month
        hashtagSuggestions: 20, // 20 hashtag generations per month
        postAnalysis: 15, // 15 post analyses per month
    },
    pro: {
        contentSuggestions: 100, // 100 AI-generated suggestions per month
        hashtagSuggestions: 200, // 200 hashtag generations per month
        postAnalysis: 150, // 150 post analyses per month
    }
};

/**
 * Service for handling AI-related functionality
 */
class AIService {
    private baseUrl = 'https://openrouter.ai/api/v1';
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        if (!this.apiKey) {
            console.warn('OpenRouter API key is not set. AI features will not work.');
        }
    }

    /**
     * Generate content suggestions based on a topic
     * @param topic The topic to generate content for
     * @param platform The social media platform
     * @param contentType The type of content (post, story, etc.)
     */
    async generateContentSuggestions(topic: string, platform: string, contentType: string) {
        try {
            const response = await fetch('/api/ai/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    platform,
                    contentType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate content');
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating content:', error);
            throw error;
        }
    }

    /**
     * Generate hashtag suggestions based on a topic
     * @param topic The topic to generate hashtags for
     * @param platform The social media platform
     * @param count The number of hashtags to generate
     */
    async generateHashtags(topic: string, platform: string, count: number = 15) {
        try {
            const response = await fetch('/api/ai/hashtags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    platform,
                    count,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate hashtags');
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating hashtags:', error);
            throw error;
        }
    }

    /**
     * Analyze a post for engagement potential and improvement suggestions
     * @param content The post content to analyze
     * @param platform The social media platform
     */
    async analyzePost(content: string, platform: string) {
        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    platform,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze post');
            }

            return await response.json();
        } catch (error) {
            console.error('Error analyzing post:', error);
            throw error;
        }
    }

    /**
     * Get the current AI usage for the user
     */
    async getAIUsage(): Promise<AIUsage> {
        try {
            const response = await fetch('/api/ai/usage', {
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get AI usage');
            }

            const data = await response.json();
            return data.usage;
        } catch (error) {
            console.error('Error getting AI usage:', error);
            throw error;
        }
    }

    /**
     * Get the limits for each AI feature based on the user's subscription tier
     * @param tier The user's subscription tier (free, pro)
     */
    getLimitsForTier(tier: 'free' | 'pro'): Record<string, number> {
        const limits: Record<string, Record<string, number>> = {
            free: {
                contentSuggestions: 20,
                hashtagSuggestions: 15,
                postAnalysis: 10,
            },
            pro: {
                contentSuggestions: 100,
                hashtagSuggestions: 100,
                postAnalysis: 50,
            },
        };

        return limits[tier];
    }
}

// Export as singleton
export default new AIService(); 