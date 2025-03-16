/**
 * Interface for AI usage statistics
 */
export interface AIUsage {
    contentSuggestions: number;
    contentSuggestionsLimit: number;
    hashtagSuggestions: number;
    hashtagSuggestionsLimit: number;
    postAnalysis: number;
    postAnalysisLimit: number;
    isPro: boolean;
}

/**
 * Interface for content suggestion response
 */
export interface ContentSuggestionResponse {
    success: boolean;
    suggestions: ContentSuggestion[];
    usage: AIUsage;
}

/**
 * Interface for a content suggestion
 */
export interface ContentSuggestion {
    id: string;
    content: string;
    platform: string;
    type: string;
}

/**
 * Interface for hashtag generator response
 */
export interface HashtagResponse {
    success: boolean;
    hashtags: string[];
    groupedHashtags: HashtagGroup;
    usage: AIUsage;
}

/**
 * Interface for grouped hashtags
 */
export interface HashtagGroup {
    topical: string[];
    platform: string[];
    general: string[];
}

/**
 * Interface for post analysis response
 */
export interface PostAnalysisResponse {
    success: boolean;
    analysis: PostAnalysis;
    usage: AIUsage;
}

/**
 * Interface for post analysis
 */
export interface PostAnalysis {
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestions: string[];
    predictedEngagement: 'high' | 'medium' | 'low';
    recommendedTime?: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
} 