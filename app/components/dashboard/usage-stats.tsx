"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, RefreshCw, SparkleIcon } from 'lucide-react';
import AIService, { AIUsage } from '@/services/ai-service';
import { useToast } from '@/components/ui/use-toast';

export function UsageStats() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usage, setUsage] = useState<AIUsage | null>(null);
    const { toast } = useToast();

    const fetchUsageData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const usageData = await AIService.getUserAIUsage();
            setUsage(usageData);
        } catch (err) {
            setError("Failed to load usage data");
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load AI usage statistics"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsageData();
    }, []);

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">AI Usage Statistics</CardTitle>
                    <CardDescription>Loading your AI usage data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mt-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                                <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !usage) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">AI Usage Statistics</CardTitle>
                    <CardDescription>There was an error loading your usage data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
                        <p className="mb-2">{error || "Failed to load usage data"}</p>
                        <Button variant="outline" size="sm" onClick={fetchUsageData}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate percentages for progress bars
    const contentPercent = Math.min(100, Math.round((usage.usage.contentSuggestions.used / usage.usage.contentSuggestions.limit) * 100));
    const hashtagPercent = Math.min(100, Math.round((usage.usage.hashtagSuggestions.used / usage.usage.hashtagSuggestions.limit) * 100));
    const analysisPercent = Math.min(100, Math.round((usage.usage.postAnalysis.used / usage.usage.postAnalysis.limit) * 100));

    // Helper to get color based on percentage
    const getProgressColor = (percent: number) => {
        if (percent < 50) return "bg-green-500";
        if (percent < 80) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">AI Usage Statistics</CardTitle>
                <CardDescription>
                    Your usage resets on {new Date(usage.resetDate).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <TooltipProvider>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>Content Suggestions</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI-generated content ideas for your social media posts</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span>
                                    {usage.usage.contentSuggestions.used} / {usage.usage.contentSuggestions.limit}
                                </span>
                            </div>
                            <Progress
                                value={contentPercent}
                                className="h-2"
                                indicatorClassName={getProgressColor(contentPercent)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>Hashtag Suggestions</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI-generated hashtags for improved content discoverability</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span>
                                    {usage.usage.hashtagSuggestions.used} / {usage.usage.hashtagSuggestions.limit}
                                </span>
                            </div>
                            <Progress
                                value={hashtagPercent}
                                className="h-2"
                                indicatorClassName={getProgressColor(hashtagPercent)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>Post Analysis</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>AI analysis of your posts for engagement optimization</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span>
                                    {usage.usage.postAnalysis.used} / {usage.usage.postAnalysis.limit}
                                </span>
                            </div>
                            <Progress
                                value={analysisPercent}
                                className="h-2"
                                indicatorClassName={getProgressColor(analysisPercent)}
                            />
                        </div>
                    </TooltipProvider>
                </div>
            </CardContent>
            {!usage.isPro && (
                <CardFooter>
                    <Button className="w-full" variant="default">
                        <SparkleIcon className="mr-2 h-4 w-4" />
                        Upgrade to Pro for Unlimited AI Features
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
} 