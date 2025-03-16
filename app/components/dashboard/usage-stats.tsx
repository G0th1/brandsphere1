"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, RefreshCw, BarChart2, Hash, Newspaper } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AIUsage {
    userId: string;
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

export function UsageStats() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usage, setUsage] = useState<AIUsage | null>(null);
    const { toast } = useToast();

    const fetchUsageData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/ai/usage');

            if (!response.ok) {
                throw new Error('Failed to fetch usage data');
            }

            const data = await response.json();
            setUsage(data);
        } catch (err) {
            setError('Could not load your usage statistics. Please try again.');
            console.error('Error fetching usage data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsageData();
    }, []);

    // Calculate percentage for progress bars
    const getPercentage = (used: number, limit: number) => {
        return Math.min(Math.round((used / limit) * 100), 100);
    };

    // Determine color based on usage percentage
    const getProgressColor = (percentage: number) => {
        if (percentage < 60) return 'bg-emerald-500';
        if (percentage < 85) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    // Format the reset date
    const formatResetDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    if (isLoading) {
        return (
            <Card className="w-full h-[300px] animate-pulse">
                <CardHeader>
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center text-amber-500">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Error Loading Usage Data
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-muted-foreground">{error}</p>
                    <Button
                        onClick={fetchUsageData}
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!usage) return null;

    const contentPercentage = getPercentage(
        usage.usage.contentSuggestions.used,
        usage.usage.contentSuggestions.limit
    );

    const hashtagPercentage = getPercentage(
        usage.usage.hashtagSuggestions.used,
        usage.usage.hashtagSuggestions.limit
    );

    const analysisPercentage = getPercentage(
        usage.usage.postAnalysis.used,
        usage.usage.postAnalysis.limit
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>AI Features Usage</CardTitle>
                <CardDescription>
                    Your monthly AI feature usage. Resets on {formatResetDate(usage.resetDate)}.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <TooltipProvider>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Newspaper className="mr-2 h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Content Suggestions</span>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                        {usage.usage.contentSuggestions.used}/{usage.usage.contentSuggestions.limit}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>AI-generated content ideas for your social media</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Progress
                            value={contentPercentage}
                            className="h-2"
                            indicatorClassName={getProgressColor(contentPercentage)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Hash className="mr-2 h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium">Hashtag Suggestions</span>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                        {usage.usage.hashtagSuggestions.used}/{usage.usage.hashtagSuggestions.limit}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>AI-generated hashtags for better post visibility</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Progress
                            value={hashtagPercentage}
                            className="h-2"
                            indicatorClassName={getProgressColor(hashtagPercentage)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BarChart2 className="mr-2 h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium">Post Analysis</span>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                        {usage.usage.postAnalysis.used}/{usage.usage.postAnalysis.limit}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>AI analysis of your content for engagement optimization</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Progress
                            value={analysisPercentage}
                            className="h-2"
                            indicatorClassName={getProgressColor(analysisPercentage)}
                        />
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
} 