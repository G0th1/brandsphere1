"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Hash, Copy, Check, TrendingUp, Users } from "lucide-react";
import AIService from "@/services/ai-service";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define the HashtagAnalysis interface
interface HashtagAnalysis {
    hashtag: string;
    popularity: number;
    reachPotential: string;
    competitionLevel: string;
    relevanceTips: string;
}

export function HashtagGenerator() {
    const [topic, setTopic] = useState("");
    const [hashtagCount, setHashtagCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
    const [allHashtags, setAllHashtags] = useState<string[]>([]);
    const [hashtagCategories, setHashtagCategories] = useState<{
        popular: HashtagAnalysis[];
        niche: HashtagAnalysis[];
        trending: HashtagAnalysis[];
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerateHashtags = async () => {
        if (!topic) {
            toast({
                variant: "destructive",
                title: "Missing topic",
                description: "Please provide a topic to generate hashtags"
            });
            return;
        }

        setIsGenerating(true);
        setSelectedHashtag(null);
        setAllHashtags([]);
        setHashtagCategories(null);
        setCopied(false);

        try {
            // Get hashtags from AI service
            const generatedHashtags = await AIService.generateHashtags(topic, Math.floor(hashtagCount));
            setAllHashtags(generatedHashtags);

            // Get hashtag analysis
            const analysis = await AIService.analyzeHashtagPerformance(generatedHashtags);

            // Categorize hashtags based on their metrics
            const popular: HashtagAnalysis[] = [];
            const niche: HashtagAnalysis[] = [];
            const trending: HashtagAnalysis[] = [];

            analysis.forEach(tag => {
                if (tag.popularity > 70) {
                    popular.push(tag);
                } else if (tag.popularity < 30) {
                    niche.push(tag);
                } else {
                    trending.push(tag);
                }
            });

            setHashtagCategories({
                popular,
                niche,
                trending
            });

            toast({
                title: "Hashtags generated",
                description: `Generated ${generatedHashtags.length} hashtags for your topic`
            });
        } catch (error) {
            console.error("Error generating hashtags:", error);
            toast({
                variant: "destructive",
                title: "Generation failed",
                description: "Failed to generate hashtags. Please try again later."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyAllHashtags = async () => {
        const hashtags = allHashtags.map(tag => `#${tag}`).join(' ');

        try {
            await navigator.clipboard.writeText(hashtags);
            setCopied(true);
            toast({
                title: "Hashtags copied",
                description: "All hashtags have been copied to your clipboard"
            });

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            toast({
                variant: "destructive",
                title: "Copy failed",
                description: "Failed to copy hashtags to clipboard"
            });
        }
    };

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Hashtag Generator</CardTitle>
                        <CardDescription>
                            Generate optimized hashtags for your content
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                placeholder="e.g., Digital marketing strategies"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="count">Number of Hashtags</Label>
                            <div className="flex items-center space-x-4">
                                <Slider
                                    id="count"
                                    min={5}
                                    max={30}
                                    step={1}
                                    value={[hashtagCount]}
                                    onValueChange={(value: number[]) => setHashtagCount(value[0])}
                                    className="flex-1"
                                />
                                <span className="text-sm font-medium w-12 text-center">
                                    {hashtagCount}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleGenerateHashtags}
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
            </div>

            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Generated Hashtags</CardTitle>
                        <CardDescription>
                            {allHashtags.length > 0
                                ? `Showing ${allHashtags.length} optimized hashtags`
                                : "Your generated hashtags will appear here"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                <p className="text-center text-lg">Generating hashtags...</p>
                                <p className="text-center text-sm text-muted-foreground mt-2">
                                    Analyzing popularity and reach potential
                                </p>
                            </div>
                        ) : allHashtags.length > 0 ? (
                            <div className="space-y-6">
                                {hashtagCategories && (
                                    <>
                                        <div className="flex justify-end mb-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={copyAllHashtags}
                                                className="flex items-center"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy All
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Popular Hashtags</h3>
                                                <Badge variant="outline" className="ml-2">
                                                    {hashtagCategories.popular.length} tags
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {hashtagCategories.popular.map((tag) => (
                                                    <Button
                                                        key={tag.hashtag}
                                                        variant={selectedHashtag === tag.hashtag ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedHashtag(tag.hashtag)}
                                                    >
                                                        #{tag.hashtag}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Trending Hashtags</h3>
                                                <Badge variant="outline" className="ml-2">
                                                    {hashtagCategories.trending.length} tags
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {hashtagCategories.trending.map((tag) => (
                                                    <Button
                                                        key={tag.hashtag}
                                                        variant={selectedHashtag === tag.hashtag ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedHashtag(tag.hashtag)}
                                                    >
                                                        #{tag.hashtag}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Niche Hashtags</h3>
                                                <Badge variant="outline" className="ml-2">
                                                    {hashtagCategories.niche.length} tags
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {hashtagCategories.niche.map((tag) => (
                                                    <Button
                                                        key={tag.hashtag}
                                                        variant={selectedHashtag === tag.hashtag ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedHashtag(tag.hashtag)}
                                                    >
                                                        #{tag.hashtag}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="rounded-full p-3 bg-primary/10 mb-4">
                                    <Hash className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-center text-lg">Ready to generate hashtags</p>
                                <p className="text-center text-sm text-muted-foreground mt-1 max-w-md">
                                    Enter your topic and click 'Generate' to create optimized hashtags with performance insights.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {selectedHashtag && (
                    <Card className="w-full mt-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                                <Hash className="h-5 w-5 mr-2" />
                                #{selectedHashtag}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hashtagCategories && (
                                <div className="space-y-4">
                                    {Object.entries(hashtagCategories).map(([category, tags]) => {
                                        const found = tags.find(tag =>
                                            (typeof tag === 'string' ? tag : tag.hashtag) === selectedHashtag
                                        );

                                        if (found && typeof found !== 'string') {
                                            return (
                                                <div key={category} className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Popularity</span>
                                                        <span className="text-sm">{found.popularity}%</span>
                                                    </div>
                                                    <Progress value={found.popularity} className="h-2" />

                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center">
                                                                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                                                                <span className="text-sm font-medium">Reach Potential</span>
                                                            </div>
                                                            <p className="text-sm">{found.reachPotential}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <div className="flex items-center">
                                                                <Users className="h-4 w-4 mr-2 text-primary" />
                                                                <span className="text-sm font-medium">Competition</span>
                                                            </div>
                                                            <p className="text-sm">{found.competitionLevel}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-muted/50 p-3 rounded-md mt-2">
                                                        <p className="text-sm">{found.relevanceTips}</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 