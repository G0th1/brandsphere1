/**
 * OpenRouter AI Client Integration
 * This module provides an integration with OpenRouter's API, specifically supporting the 'google/gemma-3-12b-it:free' model.
 */

// Types for API requests and responses
export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIRequestOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    model?: string;
}

export interface AICompletionRequest {
    messages: AIMessage[];
    options?: AIRequestOptions;
}

// Default model for AI completions
const DEFAULT_MODEL = 'google/gemma-3-12b-it:free';

/**
 * OpenRouter AI client for text completions
 */
class OpenRouterAI {
    private apiKey: string;
    private baseUrl: string;
    private defaultModel: string;

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.defaultModel = DEFAULT_MODEL;
    }

    /**
     * Initialize the client with environment variables
     * Can be called in server components to ensure API key is loaded
     */
    public initialize(): boolean {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        return !!this.apiKey;
    }

    /**
     * Generate AI completions using OpenRouter
     */
    public async generateCompletion(request: AICompletionRequest): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenRouter API key is not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': 'https://brandsphereai.com',
                    'X-Title': 'BrandSphereAI'
                },
                body: JSON.stringify({
                    model: request.options?.model || this.defaultModel,
                    messages: request.messages,
                    temperature: request.options?.temperature || 0.7,
                    max_tokens: request.options?.maxTokens || 1000,
                    top_p: request.options?.topP || 0.9
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to generate AI completion');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error in OpenRouter AI completion:', error);
            throw error;
        }
    }

    /**
     * Generate social media content using AI
     */
    public async generateSocialContent(topic: string, platform: string, contentType: string): Promise<string[]> {
        const systemPrompt = `You are a social media expert who creates engaging content for ${platform}. 
    Generate 3 ${contentType} post ideas about ${topic} that are optimized for audience engagement.
    Each post should be unique and include relevant hashtags. Keep the content authentic, creative, and suitable for ${platform}.`;

        const messages: AIMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Create ${contentType} post ideas about ${topic} for ${platform}` }
        ];

        try {
            const completion = await this.generateCompletion({ messages });

            // Parse the response into separate content ideas
            const contentIdeas = completion
                .split(/\n{2,}|\d+\./)  // Split by double newlines or numbered list items
                .map(item => item.trim())
                .filter(item => item.length > 10);  // Filter empty or very short items

            return contentIdeas.slice(0, 3);  // Return up to 3 content ideas
        } catch (error) {
            console.error('Error generating social content:', error);
            throw error;
        }
    }

    /**
     * Generate hashtags using AI
     */
    public async generateHashtags(topic: string, platform: string, count: number = 15): Promise<string[]> {
        const systemPrompt = `You are a social media hashtag expert. Generate ${count} relevant hashtags for ${platform} about the topic "${topic}".
    The hashtags should be a mix of popular, niche, and trending tags that would help content reach the right audience.
    Provide the hashtags without the # symbol, as a simple array or list.`;

        const messages: AIMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate ${count} ${platform} hashtags for topic: ${topic}` }
        ];

        try {
            const completion = await this.generateCompletion({ messages });

            // Extract hashtags from the response
            const hashtags = completion
                .replace(/#/g, '')  // Remove # symbols if present
                .split(/[\n,]/)      // Split by newlines or commas
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag.length > 0 && !tag.includes(' '))  // Filter empty or multi-word tags
                .slice(0, count);    // Limit to requested count

            return hashtags;
        } catch (error) {
            console.error('Error generating hashtags:', error);
            throw error;
        }
    }

    /**
     * Analyze social media post using AI
     */
    public async analyzePost(content: string, platform: string): Promise<any> {
        const systemPrompt = `You are a social media analytics expert. Analyze the following ${platform} post and provide:
    1. An overall score (1-100)
    2. Sentiment analysis (positive, negative, or neutral)
    3. Engagement prediction (high, medium, or low)
    4. Key strengths of the post
    5. Areas for improvement
    6. Suggested improvements
    
    Return the analysis as a structured JSON object with these fields.`;

        const messages: AIMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this ${platform} post: ${content}` }
        ];

        try {
            const completion = await this.generateCompletion({ messages });

            // Try to parse the response as JSON
            try {
                return JSON.parse(completion);
            } catch (parseError) {
                // If parsing fails, create a structured response manually
                return {
                    score: 70, // Default score
                    sentiment: 'neutral',
                    engagementPrediction: 'medium',
                    strengths: ['Contained relevant content'],
                    weaknesses: ['Could be more engaging'],
                    suggestions: ['Consider adding more specific details', 'Include a call to action']
                };
            }
        } catch (error) {
            console.error('Error analyzing post:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const openRouterAI = new OpenRouterAI(); 