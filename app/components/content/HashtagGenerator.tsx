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
    const [allHashtags, setAllHashtags] = useState<Hashtag[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [copied, setCopied] = useState(false);
    const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null);

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
                toast({
                    variant: "destructive",
                    title: "Usage limit reached",
                    description: "You've reached your monthly limit for hashtag suggestions. Upgrade to Pro for more."
                });
            } else {
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
        const hashtagsText = getFilteredHashtags().map(h => h.name).join(' ');
        navigator.clipboard.writeText(hashtagsText);
        setCopied(true);

        toast({
            title: "Hashtags copied",
            description: "All hashtags have been copied to your clipboard"
        });

        setTimeout(() => setCopied(false), 2000);
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
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
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
                    ) : allHashtags.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
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
                                    <div key={index} className="relative group">
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1.5 text-sm hover:bg-secondary cursor-pointer"
                                        >
                                            {hashtag.name}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {hashtag.popularity}
                                            </span>
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Hash className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No hashtag suggestions yet</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                Fill in the form on the left and click "Generate Hashtags" to get AI-powered hashtag suggestions for your social media.
                            </p>
                        </div>
                    )}
                </CardContent>
                {allHashtags.length > 0 && (
                    <CardFooter className="justify-center">
                        <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate More Hashtags
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
} 