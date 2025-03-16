import { toast } from "@/components/ui/use-toast";

// Types
export interface SocialMediaAccount {
    id: string;
    platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';
    username: string;
    profileUrl: string;
    avatarUrl: string;
    status: 'connected' | 'expired' | 'pending';
    lastSync: Date;
    metrics?: {
        followers: number;
        engagement: number;
        posts: number;
    };
}

export interface SocialMediaPost {
    id: string;
    platform: string;
    content: string;
    mediaUrls: string[];
    scheduledFor?: Date;
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    stats?: {
        likes: number;
        comments: number;
        shares: number;
        engagement: number;
    };
    createdAt: Date;
    publishedAt?: Date;
}

// API configuration
const API_CONFIG = {
    instagram: {
        baseUrl: 'https://graph.instagram.com/v12.0',
        scopes: ['user_profile', 'user_media'],
    },
    facebook: {
        baseUrl: 'https://graph.facebook.com/v12.0',
        scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
    },
    twitter: {
        baseUrl: 'https://api.twitter.com/2',
        scopes: ['tweet.read', 'tweet.write', 'users.read'],
    },
    linkedin: {
        baseUrl: 'https://api.linkedin.com/v2',
        scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
    },
    tiktok: {
        baseUrl: 'https://open-api.tiktok.com/v2',
        scopes: ['user.info.basic', 'video.list', 'video.upload'],
    },
};

// Mock accounts for development
const MOCK_ACCOUNTS: SocialMediaAccount[] = [
    {
        id: '1',
        platform: 'instagram',
        username: 'handmadecandles',
        profileUrl: 'https://instagram.com/handmadecandles',
        avatarUrl: '/images/mock/instagram-avatar.jpg',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
        metrics: {
            followers: 4320,
            engagement: 3.2,
            posts: 56,
        },
    },
    {
        id: '2',
        platform: 'twitter',
        username: 'handmade_candles',
        profileUrl: 'https://twitter.com/handmade_candles',
        avatarUrl: '/images/mock/twitter-avatar.jpg',
        status: 'connected',
        lastSync: new Date(Date.now() - 7200000), // 2 hours ago
        metrics: {
            followers: 2150,
            engagement: 1.8,
            posts: 112,
        },
    },
    {
        id: '3',
        platform: 'facebook',
        username: 'Handmade Candles Store',
        profileUrl: 'https://facebook.com/handmadecandlesstore',
        avatarUrl: '/images/mock/facebook-avatar.jpg',
        status: 'expired',
        lastSync: new Date(Date.now() - 604800000), // 7 days ago
        metrics: {
            followers: 8750,
            engagement: 2.4,
            posts: 94,
        },
    },
];

/**
 * Social Media Service
 * Handles integration with various social media platforms
 */
class SocialMediaService {
    // Get accounts for the current user
    async getAccounts(): Promise<SocialMediaAccount[]> {
        try {
            // In production, this would be an API call
            // const response = await fetch('/api/social-accounts');
            // return await response.json();

            // For now, return mock data
            return new Promise((resolve) => {
                setTimeout(() => resolve(MOCK_ACCOUNTS), 500);
            });
        } catch (error) {
            console.error('Error fetching social accounts:', error);
            toast({
                title: "Error",
                description: "Failed to fetch social media accounts",
                variant: "destructive",
            });
            return [];
        }
    }

    // Get authorization URL for a specific platform
    getAuthorizationUrl(platform: string): string {
        const config = API_CONFIG[platform as keyof typeof API_CONFIG];
        if (!config) return '';

        // In a real implementation, this would generate a proper OAuth URL
        // with proper scopes, redirect URI, etc.

        // Mock URL for demonstration
        return `/api/auth/${platform}?scopes=${config.scopes.join(',')}`;
    }

    // Connect a social media account (mock implementation)
    async connect(platform: string, authCode: string): Promise<SocialMediaAccount | null> {
        try {
            // This would actually exchange the auth code for tokens
            // and store them securely

            // Mock implementation
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newAccount: SocialMediaAccount = {
                        id: `new-${Date.now()}`,
                        platform: platform as any,
                        username: `new_${platform}_user`,
                        profileUrl: `https://${platform}.com/new_user`,
                        avatarUrl: `/images/mock/${platform}-avatar.jpg`,
                        status: 'connected',
                        lastSync: new Date(),
                        metrics: {
                            followers: 0,
                            engagement: 0,
                            posts: 0,
                        },
                    };
                    resolve(newAccount);
                }, 1000);
            });
        } catch (error) {
            console.error('Error connecting account:', error);
            toast({
                title: "Connection Failed",
                description: `Failed to connect your ${platform} account`,
                variant: "destructive",
            });
            return null;
        }
    }

    // Disconnect a social media account
    async disconnect(accountId: string): Promise<boolean> {
        try {
            // In production, this would be an API call
            // await fetch(`/api/social-accounts/${accountId}`, {
            //   method: 'DELETE',
            // });

            // Mock implementation
            return new Promise((resolve) => {
                setTimeout(() => resolve(true), 500);
            });
        } catch (error) {
            console.error('Error disconnecting account:', error);
            toast({
                title: "Error",
                description: "Failed to disconnect account",
                variant: "destructive",
            });
            return false;
        }
    }

    // Schedule a post to social media
    async schedulePost(post: Omit<SocialMediaPost, 'id' | 'createdAt' | 'status'>): Promise<SocialMediaPost | null> {
        try {
            // In production, this would be an API call
            // const response = await fetch('/api/posts', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(post),
            // });
            // return await response.json();

            // Mock implementation
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newPost: SocialMediaPost = {
                        ...post,
                        id: `post-${Date.now()}`,
                        status: 'scheduled',
                        createdAt: new Date(),
                    };
                    resolve(newPost);
                }, 800);
            });
        } catch (error) {
            console.error('Error scheduling post:', error);
            toast({
                title: "Error",
                description: "Failed to schedule post",
                variant: "destructive",
            });
            return null;
        }
    }

    // Get analytics for a platform
    async getAnalytics(platform: string, timeframe: string): Promise<any> {
        try {
            // In production, this would be an API call
            // const response = await fetch(`/api/analytics/${platform}?timeframe=${timeframe}`);
            // return await response.json();

            // Mock implementation with realistic data
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockData = {
                        followers: {
                            count: platform === 'instagram' ? 4320 :
                                platform === 'twitter' ? 2150 :
                                    platform === 'facebook' ? 8750 : 980,
                            growth: Math.random() * 5,
                            history: Array.from({ length: 30 }, (_, i) => ({
                                date: new Date(Date.now() - (29 - i) * 86400000),
                                value: 4000 + Math.floor(Math.random() * 500),
                            })),
                        },
                        engagement: {
                            rate: 2 + Math.random() * 3,
                            change: -1 + Math.random() * 2,
                        },
                        posts: {
                            count: 50 + Math.floor(Math.random() * 70),
                            performance: Array.from({ length: 5 }, (_, i) => ({
                                id: `post-${i}`,
                                content: `Sample post ${i}`,
                                publishedAt: new Date(Date.now() - i * 86400000 * 3),
                                stats: {
                                    likes: Math.floor(Math.random() * 200),
                                    comments: Math.floor(Math.random() * 50),
                                    shares: Math.floor(Math.random() * 30),
                                }
                            })),
                        },
                    };
                    resolve(mockData);
                }, 800);
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast({
                title: "Error",
                description: "Failed to fetch analytics data",
                variant: "destructive",
            });
            return null;
        }
    }
}

// Create and export a singleton instance
export const socialMediaService = new SocialMediaService(); 