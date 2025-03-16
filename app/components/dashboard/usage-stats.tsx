"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Hash, BarChart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

interface AIUsage {
    contentSuggestions: {
        current: number;
        limit: number;
    };
    hashtagSuggestions: {
        current: number;
        limit: number;
    };
    postAnalysis: {
        current: number;
        limit: number;
    };
    isProUser: boolean;
}

export function UsageStats() {
    const { toast } = useToast();
    const [usage, setUsage] = useState<AIUsage | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                setIsLoading(true);
                // In a real app, this would be an API call
                // For demo purposes, we'll simulate the data

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - in real app, fetch from api/ai/usage
                setUsage({
                    contentSuggestions: {
                        current: 8,
                        limit: 10
                    },
                    hashtagSuggestions: {
                        current: 12,
                        limit: 20
                    },
                    postAnalysis: {
                        current: 5,
                        limit: 15
                    },
                    isProUser: false
                });
            } catch (error) {
                console.error('Error fetching usage stats:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load usage statistics.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsage();
    }, [toast]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span>AI Features Usage</span>
                    </CardTitle>
                    <CardDescription>Your monthly usage of AI-powered features</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <div className="text-muted-foreground animate-pulse bg-muted h-4 w-32 rounded"></div>
                                    <div className="text-muted-foreground animate-pulse bg-muted h-4 w-16 rounded"></div>
                                </div>
                                <div className="animate-pulse bg-muted h-2 w-full rounded"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!usage) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>Error Loading Usage Data</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Failed to load your usage statistics. Please try refreshing the page.</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const getProgressColor = (current: number, limit: number) => {
        const percentage = (current / limit) * 100;
        if (percentage < 60) return 'bg-green-500';
        if (percentage < 80) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span>AI Features Usage</span>
                </CardTitle>
                <CardDescription>
                    Your monthly usage of AI-powered features
                    {!usage.isProUser && (
                        <span className="inline-block ml-2 text-primary font-medium">
                            (Free Plan)
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Content Suggestions */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-green-500" />
                                <span>Content Suggestions</span>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="text-muted-foreground">
                                            {usage.contentSuggestions.current} / {usage.contentSuggestions.limit}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI-generated post content suggestions</p>
                                        {!usage.isProUser && (
                                            <p className="text-xs mt-1">
                                                Upgrade to Pro for {10 * 10} suggestions/month
                                            </p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Progress
                            value={(usage.contentSuggestions.current / usage.contentSuggestions.limit) * 100}
                            className="h-2"
                            indicatorClassName={cn(
                                getProgressColor(usage.contentSuggestions.current, usage.contentSuggestions.limit)
                            )}
                        />
                    </div>

                    {/* Hashtag Suggestions */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1.5">
                                <Hash className="h-4 w-4 text-blue-500" />
                                <span>Hashtag Suggestions</span>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="text-muted-foreground">
                                            {usage.hashtagSuggestions.current} / {usage.hashtagSuggestions.limit}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI-generated hashtag recommendations</p>
                                        {!usage.isProUser && (
                                            <p className="text-xs mt-1">
                                                Upgrade to Pro for {20 * 10} suggestions/month
                                            </p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Progress
                            value={(usage.hashtagSuggestions.current / usage.hashtagSuggestions.limit) * 100}
                            className="h-2"
                            indicatorClassName={cn(
                                getProgressColor(usage.hashtagSuggestions.current, usage.hashtagSuggestions.limit)
                            )}
                        />
                    </div>

                    {/* Post Analysis */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1.5">
                                <BarChart className="h-4 w-4 text-purple-500" />
                                <span>Post Analysis</span>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="text-muted-foreground">
                                            {usage.postAnalysis.current} / {usage.postAnalysis.limit}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI-powered content analysis and optimization</p>
                                        {!usage.isProUser && (
                                            <p className="text-xs mt-1">
                                                Upgrade to Pro for {15 * 10} analyses/month
                                            </p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Progress
                            value={(usage.postAnalysis.current / usage.postAnalysis.limit) * 100}
                            className="h-2"
                            indicatorClassName={cn(
                                getProgressColor(usage.postAnalysis.current, usage.postAnalysis.limit)
                            )}
                        />
                    </div>

                    {!usage.isProUser && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => window.location.href = '/dashboard/upgrade'}
                        >
                            Upgrade to Pro
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 