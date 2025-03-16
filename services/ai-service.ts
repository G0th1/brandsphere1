import { toast } from "@/components/ui/use-toast";
import { AIUsage } from "@/types/ai";

/**
 * AI Service for BrandSphereAI
 * Handles interactions with AI APIs for content generation, hashtags, and post analysis
 */

// Types for API requests and responses
export interface ContentSuggestionRequest {
    topic: string;
    industry: string;
    platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
    tone?: string;
}

export interface ContentSuggestion {
    id: string;
    platform: string;
    content: string;
    hashtags: string[];
    bestPostingTime: string;
}

export interface HashtagRequest {
    topic: string;
    platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
    count?: number;
}

export interface Hashtag {
    name: string;
    popularity: string;
    posts: string;
}

export interface HashtagCategories {
    popular: Hashtag[];
    niche: Hashtag[];
    trending: Hashtag[];
}

export interface PostAnalysisRequest {
    content: string;
    platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
    includeHashtags?: boolean;
}

export interface PostAnalysis {
    overall: {
        score: number;
        rating: string;
    };
    details: {
        length: {
            value: number;
            recommendation: string;
        };
        sentiment: {
            value: string;
            recommendation: string;
        };
        engagement: {
            value: string;
            recommendation: string;
        };
    };
    improvement: {
        suggestions: string[];
        suggestedHashtags?: string[];
    };
}

export interface AIUsage {
    usage: {
        contentSuggestions: {
            used: number;
            limit: number;
        };
        hashtagSuggestions: {
            used: number;
            limit: number;
        };
        postAnalysis: {
            used: number;
            limit: number;
        };
    };
    resetDate: string;
    lastUpdated: string;
}

/**
 * AIService class for handling AI functionality
 */
class AIService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = '/api/ai';
    }

    /**
     * Generate content suggestions based on provided parameters
     */
    async generateContentSuggestions(params: ContentSuggestionRequest): Promise<{
        suggestions: ContentSuggestion[];
        usage: { current: number; limit: number };
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/content-suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate content suggestions');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in generateContentSuggestions:', error);
            throw error;
        }
    }

    /**
     * Generate hashtags based on provided parameters
     */
    async generateHashtags(params: HashtagRequest): Promise<{
        categories: HashtagCategories;
        allHashtags: Hashtag[];
        usage: { current: number; limit: number };
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/generate-hashtags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate hashtags');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in generateHashtags:', error);
            throw error;
        }
    }

    /**
     * Analyze a post based on provided parameters
     */
    async analyzePost(params: PostAnalysisRequest): Promise<{
        analysis: PostAnalysis;
        usage: { current: number; limit: number };
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/analyze-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze post');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in analyzePost:', error);
            throw error;
        }
    }

    /**
     * Get the current user's AI usage
     */
    async getUserAIUsage(): Promise<AIUsage> {
        try {
            const response = await fetch(`${this.baseUrl}/usage`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch AI usage');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getUserAIUsage:', error);
            throw error;
        }
    }
}

export default new AIService(); 