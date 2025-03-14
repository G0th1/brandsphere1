"use client";

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUp,
    ArrowDown,
    Calendar,
    BarChart2,
    Activity,
    Users,
    TrendingUp,
    MessageSquare,
    Heart,
    Share2,
    RefreshCw,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Filter,
} from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';

// Types
interface AnalyticsData {
    followers: {
        total: number;
        change: number;
        platforms: {
            [key: string]: {
                total: number;
                change: number;
                history: number[];
            };
        };
    };
    engagement: {
        rate: number;
        change: number;
        platforms: {
            [key: string]: {
                rate: number;
                change: number;
            };
        };
        metrics: {
            likes: number;
            comments: number;
            shares: number;
        };
    };
    posts: {
        total: number;
        scheduled: number;
        published: number;
        bestPerforming: {
            id: string;
            title: string;
            platform: string;
            engagement: number;
            likes: number;
            comments: number;
            date: Date;
            imageUrl?: string;
        }[];
    };
    reach: {
        total: number;
        change: number;
        platforms: {
            [key: string]: {
                total: number;
                change: number;
            };
        };
    };
}

// Mock data
const MOCK_ANALYTICS: AnalyticsData = {
    followers: {
        total: 7450,
        change: 3.2,
        platforms: {
            instagram: {
                total: 4320,
                change: 2.7,
                history: [4120, 4150, 4190, 4235, 4270, 4295, 4320]
            },
            twitter: {
                total: 2150,
                change: 1.2,
                history: [2110, 2120, 2125, 2130, 2140, 2145, 2150]
            },
            linkedin: {
                total: 980,
                change: 5.6,
                history: [920, 930, 940, 950, 960, 970, 980]
            }
        }
    },
    engagement: {
        rate: 2.8,
        change: 0.5,
        platforms: {
            instagram: {
                rate: 3.2,
                change: 0.7
            },
            twitter: {
                rate: 1.8,
                change: -0.2
            },
            linkedin: {
                rate: 3.4,
                change: 1.1
            }
        },
        metrics: {
            likes: 685,
            comments: 142,
            shares: 78
        }
    },
    posts: {
        total: 87,
        scheduled: 5,
        published: 82,
        bestPerforming: [
            {
                id: '1',
                title: 'New Product Launch',
                platform: 'Instagram',
                engagement: 4.7,
                likes: 253,
                comments: 47,
                date: new Date(Date.now() - 86400000 * 7), // 7 days ago
                imageUrl: '/images/mock/post1.jpg'
            },
            {
                id: '2',
                title: 'Customer Success Story',
                platform: 'LinkedIn',
                engagement: 3.9,
                likes: 125,
                comments: 32,
                date: new Date(Date.now() - 86400000 * 14), // 14 days ago
                imageUrl: '/images/mock/post2.jpg'
            },
            {
                id: '3',
                title: 'Industry Insights',
                platform: 'Twitter',
                engagement: 2.8,
                likes: 87,
                comments: 19,
                date: new Date(Date.now() - 86400000 * 10), // 10 days ago
            }
        ]
    },
    reach: {
        total: 28750,
        change: 12.5,
        platforms: {
            instagram: {
                total: 18200,
                change: 15.3
            },
            twitter: {
                total: 7500,
                change: 8.2
            },
            linkedin: {
                total: 3050,
                change: 14.7
            }
        }
    }
};

// Platform colors
const PLATFORM_COLORS = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    twitter: 'bg-sky-500',
    facebook: 'bg-blue-600',
    linkedin: 'bg-blue-700'
};

// Platform icons
const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return <Instagram className="h-4 w-4" />;
        case 'twitter':
            return <Twitter className="h-4 w-4" />;
        case 'facebook':
            return <Facebook className="h-4 w-4" />;
        case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
        default:
            return null;
    }
};

// Format date
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    }).format(date);
};

export function InsightsDashboard() {
    const { toast } = useToast();
    const { isDemoActive } = useSubscription();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30d');
    const [selectedPlatform, setSelectedPlatform] = useState('all');

    // Fetch analytics data (using mock data for demo)
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // In a real app, this would be an API call with date range and platform filters
                setIsLoading(true);
                // Simulate API delay
                setTimeout(() => {
                    setAnalytics(MOCK_ANALYTICS);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load analytics data',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [toast, dateRange, selectedPlatform]);

    // Handle refresh
    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setAnalytics(MOCK_ANALYTICS);
            setIsLoading(false);
            toast({
                title: 'Analytics Updated',
                description: 'Analytics data has been refreshed.',
            });
        }, 800);
    };

    // Generate follower growth data for charts
    const generateFollowerData = () => {
        if (!analytics) return [];

        // In a real app, this would be actual time-series data
        const timeLabels = ['Apr 1', 'Apr 8', 'Apr 15', 'Apr 22', 'Apr 29', 'May 6', 'May 13'];

        // Create series data for chart, based on platform selection
        if (selectedPlatform === 'all') {
            // Combined growth
            const platforms = Object.keys(analytics.followers.platforms);
            return timeLabels.map((label, index) => {
                const dayTotal = platforms.reduce((sum, platform) => {
                    return sum + (analytics.followers.platforms[platform].history[index] || 0);
                }, 0);
                return { date: label, followers: dayTotal };
            });
        } else {
            // Single platform growth
            const platform = selectedPlatform.toLowerCase();
            if (analytics.followers.platforms[platform]) {
                return timeLabels.map((label, index) => {
                    return {
                        date: label,
                        followers: analytics.followers.platforms[platform].history[index] || 0
                    };
                });
            }
        }

        return [];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Analytics & Insights</h2>
                    <p className="text-muted-foreground">
                        View performance metrics across your social media accounts
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                        value={dateRange}
                        onValueChange={setDateRange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="ytd">Year to date</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedPlatform}
                        onValueChange={setSelectedPlatform}
                    >
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="All platforms" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All platforms</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                // Loading state
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader className="pb-2">
                                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-7 bg-muted rounded w-1/3 mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-1/4"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="md:col-span-1 animate-pulse">
                            <CardHeader>
                                <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] bg-muted rounded"></div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-1 animate-pulse">
                            <CardHeader>
                                <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-12 w-12 rounded bg-muted"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : !analytics ? (
                // Error state
                <Card className="border-dashed">
                    <CardContent className="py-10 text-center">
                        <div className="mx-auto rounded-full w-12 h-12 flex items-center justify-center bg-muted">
                            <BarChart2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No analytics data available</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                            Connect your social media accounts and start posting content to see analytics.
                        </p>
                        <Button onClick={handleRefresh} className="mt-4 flex items-center gap-1">
                            <RefreshCw className="h-4 w-4" /> Refresh
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                // Analytics display
                <div className="space-y-6">
                    {/* Key metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Followers card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    Followers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analytics.followers.total.toLocaleString()}
                                </div>
                                <div className="flex items-center mt-1">
                                    {analytics.followers.change > 0 ? (
                                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${analytics.followers.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {Math.abs(analytics.followers.change)}%
                                    </span>
                                    <span className="text-sm text-muted-foreground ml-1">vs. previous period</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engagement card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    Engagement Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analytics.engagement.rate}%
                                </div>
                                <div className="flex items-center mt-1">
                                    {analytics.engagement.change > 0 ? (
                                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${analytics.engagement.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {Math.abs(analytics.engagement.change)}%
                                    </span>
                                    <span className="text-sm text-muted-foreground ml-1">vs. previous period</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Posts card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Total Posts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analytics.posts.total}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                        {analytics.posts.published} published
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {analytics.posts.scheduled} scheduled
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reach card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    Total Reach
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analytics.reach.total.toLocaleString()}
                                </div>
                                <div className="flex items-center mt-1">
                                    {analytics.reach.change > 0 ? (
                                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${analytics.reach.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {Math.abs(analytics.reach.change)}%
                                    </span>
                                    <span className="text-sm text-muted-foreground ml-1">vs. previous period</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs for detailed metrics */}
                    <Tabs defaultValue="growth" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="growth">Follower Growth</TabsTrigger>
                            <TabsTrigger value="engagement">Engagement</TabsTrigger>
                            <TabsTrigger value="content">Content Performance</TabsTrigger>
                        </TabsList>

                        {/* Growth tab */}
                        <TabsContent value="growth" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Follower Growth</CardTitle>
                                        <CardDescription>
                                            {selectedPlatform === 'all'
                                                ? 'Total followers across all platforms'
                                                : `Followers on ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px] flex items-center justify-center">
                                        {/* In a real app, this would be an actual chart component */}
                                        <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                                            <BarChart2 className="h-12 w-12 text-muted opacity-50" />
                                            <div className="absolute">Chart Placeholder</div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="text-sm text-muted-foreground">
                                            Data represents {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : dateRange === '90d' ? '90 days' : 'year to date'}
                                        </div>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Platform Breakdown</CardTitle>
                                        <CardDescription>
                                            Followers by platform
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(analytics.followers.platforms).map(([platform, data]) => (
                                                <div key={platform} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS]}`}>
                                                            {getPlatformIcon(platform)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium capitalize">{platform}</div>
                                                            <div className="text-sm text-muted-foreground">{data.total.toLocaleString()} followers</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {data.change > 0 ? (
                                                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                                                        ) : (
                                                            <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                                        )}
                                                        <span className={`text-sm ${data.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {Math.abs(data.change)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Engagement tab */}
                        <TabsContent value="engagement" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Engagement Metrics</CardTitle>
                                        <CardDescription>
                                            {selectedPlatform === 'all'
                                                ? 'Total engagement across all platforms'
                                                : `Engagement on ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                            <div className="text-center">
                                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                                    <Heart className="h-5 w-5 text-red-500" />
                                                </div>
                                                <h3 className="mt-2 text-2xl font-bold">{analytics.engagement.metrics.likes.toLocaleString()}</h3>
                                                <p className="text-sm text-muted-foreground">Likes</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                    <MessageSquare className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <h3 className="mt-2 text-2xl font-bold">{analytics.engagement.metrics.comments.toLocaleString()}</h3>
                                                <p className="text-sm text-muted-foreground">Comments</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                    <Share2 className="h-5 w-5 text-green-500" />
                                                </div>
                                                <h3 className="mt-2 text-2xl font-bold">{analytics.engagement.metrics.shares.toLocaleString()}</h3>
                                                <p className="text-sm text-muted-foreground">Shares</p>
                                            </div>
                                        </div>

                                        {/* In a real app, this would be an actual chart component */}
                                        <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                                            <Activity className="h-12 w-12 text-muted opacity-50" />
                                            <div className="absolute">Engagement Chart Placeholder</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Platform Engagement</CardTitle>
                                        <CardDescription>
                                            Engagement rate by platform
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(analytics.engagement.platforms).map(([platform, data]) => (
                                                <div key={platform} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS]}`}>
                                                            {getPlatformIcon(platform)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium capitalize">{platform}</div>
                                                            <div className="text-sm text-muted-foreground">{data.rate}% engagement</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {data.change > 0 ? (
                                                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                                                        ) : (
                                                            <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                                        )}
                                                        <span className={`text-sm ${data.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {Math.abs(data.change)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-4 border-t">
                                            <h4 className="font-medium mb-2">Average Engagement</h4>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-2xl font-bold">{analytics.engagement.rate}%</div>
                                                    <div className="text-sm text-muted-foreground">Overall average</div>
                                                </div>
                                                <div className="flex items-center">
                                                    {analytics.engagement.change > 0 ? (
                                                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                                    ) : (
                                                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                                    )}
                                                    <span className={`text-sm ${analytics.engagement.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {Math.abs(analytics.engagement.change)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Content Performance tab */}
                        <TabsContent value="content" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Best Performing Content</CardTitle>
                                    <CardDescription>
                                        Your top performing posts based on engagement
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {analytics.posts.bestPerforming.map((post) => (
                                            <div key={post.id} className="flex space-x-4">
                                                <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                    {post.imageUrl ? (
                                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className={`w-full h-full flex items-center justify-center text-white ${post.platform === 'Instagram' ? PLATFORM_COLORS.instagram :
                                                                post.platform === 'Twitter' ? PLATFORM_COLORS.twitter :
                                                                    post.platform === 'LinkedIn' ? PLATFORM_COLORS.linkedin :
                                                                        PLATFORM_COLORS.facebook
                                                            }`}>
                                                            {getPlatformIcon(post.platform)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium">{post.title}</h3>
                                                        <Badge className="ml-2">
                                                            {post.engagement}% Engagement
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center mt-1 space-x-4">
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            {formatDate(post.date)}
                                                        </div>

                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            {getPlatformIcon(post.platform)}
                                                            <span className="ml-1">{post.platform}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex mt-2 space-x-4">
                                                        <div className="flex items-center text-sm">
                                                            <Heart className="mr-1 h-3 w-3 text-red-500" />
                                                            {post.likes} likes
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <MessageSquare className="mr-1 h-3 w-3 text-blue-500" />
                                                            {post.comments} comments
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        View All Posts
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}

export default InsightsDashboard; 