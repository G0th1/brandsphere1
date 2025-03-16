"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Hash, Copy, Check, RefreshCw, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AIService, { Hashtag } from "@/services/ai-service";

export function HashtagGenerator() {
    const [topic, setTopic] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [count, setCount] = useState(15);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hashtagCategories, setHashtagCategories] = useState<{
        popular: Hashtag[];
        niche: Hashtag[];
        trending: Hashtag[];
    } | null>(null);
    const [allHashtags, setAllHashtags] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [copied, setCopied] = useState(false);
    const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) {
            toast({
                variant: "destructive",
                title: "Missing information",
                description: "Please enter a topic for hashtag generation"
            });
            return;
        }

        setIsGenerating(true);
        setActiveFilter("all");
        setError(null);

        try {
            const result = await AIService.generateHashtags({
                topic,
                platform: platform as any,
                count
            });

            setHashtagCategories(result.categories);
            setAllHashtags(result.allHashtags);
            setUsageInfo(result.usage);

            toast({
                title: "Hashtags generated",
                description: `Generated hashtags for your topic "${topic}"`
            });
        } catch (error) {
            console.error("Error generating hashtags:", error);

            if (error instanceof Error && error.message.includes("Monthly limit exceeded")) {
                setError("You've reached your monthly limit for hashtag suggestions. Upgrade to Pro for more.");
                toast({
                    variant: "destructive",
                    title: "Usage limit reached",
                    description: "You've reached your monthly limit for hashtag suggestions"
                });
            } else {
                setError("There was an error generating hashtags. Please try again later.");
                toast({
                    variant: "destructive",
                    title: "Failed to generate hashtags",
                    description: "There was an error generating hashtags. Please try again later."
                });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const copyAllHashtags = () => {
        const hashtagsText = getFilteredHashtags().map(h => typeof h === 'string' ? `#${h}` : `#${h.name}`).join(' ');
        navigator.clipboard.writeText(hashtagsText);
        setCopied(true);

        toast({
            title: "Hashtags copied",
            description: "All hashtags have been copied to your clipboard"
        });

        setTimeout(() => setCopied(false), 2000);
    };

    const resetGenerator = () => {
        setHashtagCategories(null);
        setAllHashtags([]);
        setError(null);
    };

    const getFilteredHashtags = () => {
        if (!hashtagCategories) return [];

        switch (activeFilter) {
            case "popular":
                return hashtagCategories.popular;
            case "niche":
                return hashtagCategories.niche;
            case "trending":
                return hashtagCategories.trending;
            default:
                return allHashtags;
        }
    };

    // Helper to handle hashtag display
    const displayHashtag = (hashtag: Hashtag | string, index: number) => {
        if (typeof hashtag === 'string') {
            return (
                <Badge key={index} variant="outline" className="px-2.5 py-1.5 text-sm">
                    #{hashtag}
                </Badge>
            );
        }

        return (
            <Badge key={index} variant="outline" className="px-2.5 py-1.5 text-sm flex flex-col min-w-20">
                <span>#{hashtag.name}</span>
                {hashtag.posts && (
                    <span className="text-xs text-muted-foreground">
                        {hashtag.posts}
                    </span>
                )}
            </Badge>
        );
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl">Generate Hashtags</CardTitle>
                    <CardDescription>
                        Get AI-powered hashtag suggestions for your social media posts
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                            id="topic"
                            placeholder="e.g., Fitness, Photography, Fashion"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select
                            value={platform}
                            onValueChange={setPlatform}
                        >
                            <SelectTrigger id="platform">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="count">Number of Hashtags</Label>
                        <Select
                            value={count.toString()}
                            onValueChange={(value) => setCount(parseInt(value))}
                        >
                            <SelectTrigger id="count">
                                <SelectValue placeholder="Select count" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 hashtags</SelectItem>
                                <SelectItem value="10">10 hashtags</SelectItem>
                                <SelectItem value="15">15 hashtags</SelectItem>
                                <SelectItem value="20">20 hashtags</SelectItem>
                                <SelectItem value="30">30 hashtags</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={hashtagCategories ? resetGenerator : handleGenerate}
                        disabled={isGenerating || (!hashtagCategories && !topic)}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : hashtagCategories ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Generate New Hashtags
                            </>
                        ) : (
                            <>
                                <Hash className="mr-2 h-4 w-4" />
                                Generate Hashtags
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Hashtag Suggestions</CardTitle>
                        {usageInfo && (
                            <div className="text-sm text-muted-foreground">
                                Usage: {usageInfo.current}/{usageInfo.limit}
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        {allHashtags.length > 0
                            ? `Showing hashtags for "${topic}" on ${platform}`
                            : "Your AI-generated hashtags will appear here"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-center text-lg">Generating relevant hashtags...</p>
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                This may take a few moments
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-12 w-12 text-destructive mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <p className="text-center text-lg font-medium text-destructive">Generation Failed</p>
                            <p className="text-center text-sm mt-2 max-w-md">{error}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={resetGenerator}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : allHashtags.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <Button
                                    variant={activeFilter === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveFilter("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={activeFilter === "popular" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveFilter("popular")}
                                >
                                    Popular
                                </Button>
                                <Button
                                    variant={activeFilter === "niche" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveFilter("niche")}
                                >
                                    Niche
                                </Button>
                                <Button
                                    variant={activeFilter === "trending" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveFilter("trending")}
                                >
                                    Trending
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={copyAllHashtags}
                                >
                                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                    {copied ? "Copied" : "Copy All"}
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {getFilteredHashtags().map((hashtag, index) => (
                                    displayHashtag(hashtag, index)
                                ))}
                            </div>

                            {activeFilter !== "all" && hashtagCategories && (
                                <div className="pt-2 text-sm text-muted-foreground">
                                    {activeFilter === "popular" && "Popular hashtags have high visibility but more competition."}
                                    {activeFilter === "niche" && "Niche hashtags target specific audiences with less competition."}
                                    {activeFilter === "trending" && "Trending hashtags can temporarily increase visibility."}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Hash className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No hashtags generated yet</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                Enter a topic on the left and click "Generate Hashtags" to get AI-powered hashtag suggestions.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 