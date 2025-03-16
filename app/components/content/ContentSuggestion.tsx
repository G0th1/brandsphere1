"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ContentSuggestion {
    id: string;
    content: string;
    platform: string;
    type: string;
}

interface AIUsage {
    contentSuggestions: number;
    contentSuggestionsLimit: number;
    hashtagSuggestions: number;
    hashtagSuggestionsLimit: number;
    postAnalysis: number;
    postAnalysisLimit: number;
    isPro: boolean;
}

export function ContentSuggestion() {
    const [topic, setTopic] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [contentType, setContentType] = useState("post");
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [usage, setUsage] = useState<AIUsage | null>(null);

    const handleGenerate = async () => {
        if (!topic) {
            toast.error("Please enter a topic for your content");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/api/ai/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    platform,
                    contentType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate content');
            }

            const data = await response.json();

            if (data.success) {
                setSuggestions(data.suggestions);
                setUsage(data.usage);
            } else {
                throw new Error(data.error || 'Failed to generate content');
            }
        } catch (error) {
            console.error('Error generating content:', error);
            toast.error(error instanceof Error ? error.message : "Failed to generate suggestions. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (id: string, content: string) => {
        navigator.clipboard.writeText(content);
        setCopied(id);
        toast.success("Content copied to clipboard");

        setTimeout(() => {
            setCopied(null);
        }, 2000);
    };

    const handleSave = (suggestion: ContentSuggestion) => {
        // In a real implementation, this would save to your database
        toast.success("Content saved to your drafts");
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Content Suggestions
                </CardTitle>
                <CardDescription>
                    Generate creative content ideas for your social media posts
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">What would you like to post about?</Label>
                    <Input
                        id="topic"
                        placeholder="Enter a topic, product, or theme..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={platform} onValueChange={setPlatform}>
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
                        <Label htmlFor="content-type">Content Type</Label>
                        <Select value={contentType} onValueChange={setContentType}>
                            <SelectTrigger id="content-type">
                                <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="post">Regular Post</SelectItem>
                                <SelectItem value="story">Story</SelectItem>
                                <SelectItem value="reel">Reel/Video</SelectItem>
                                <SelectItem value="carousel">Carousel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {usage && (
                    <div className="text-sm text-muted-foreground">
                        Content suggestions: {usage.contentSuggestions}/{usage.contentSuggestionsLimit}
                        {usage.contentSuggestions >= usage.contentSuggestionsLimit && !usage.isPro && (
                            <span className="ml-2 text-red-500">
                                Limit reached. <a href="/dashboard/upgrade" className="underline">Upgrade to Pro</a>
                            </span>
                        )}
                    </div>
                )}

                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic || (usage && usage.contentSuggestions >= usage.contentSuggestionsLimit && !usage.isPro)}
                    className="w-full"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Suggestions
                        </>
                    )}
                </Button>

                {suggestions.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Suggestions</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSuggestions([])}
                            >
                                Clear
                            </Button>
                        </div>

                        <Tabs defaultValue="1" className="w-full">
                            <TabsList className="grid grid-cols-3 mb-4">
                                <TabsTrigger value="1">Option 1</TabsTrigger>
                                <TabsTrigger value="2">Option 2</TabsTrigger>
                                <TabsTrigger value="3">Option 3</TabsTrigger>
                            </TabsList>

                            {suggestions.map((suggestion) => (
                                <TabsContent key={suggestion.id} value={suggestion.id} className="space-y-4">
                                    <div className="relative">
                                        <Textarea
                                            className="min-h-[200px] p-4 text-base"
                                            value={suggestion.content}
                                            readOnly
                                        />
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopy(suggestion.id, suggestion.content)}
                                            >
                                                {copied === suggestion.id ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleGenerate}
                                                disabled={isGenerating}
                                            >
                                                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleCopy(suggestion.id, suggestion.content)}
                                        >
                                            {copied === suggestion.id ? "Copied!" : "Copy"}
                                        </Button>
                                        <Button
                                            onClick={() => handleSave(suggestion)}
                                        >
                                            Save to Drafts
                                        </Button>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 