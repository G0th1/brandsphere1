"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Hash, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface HashtagGroup {
    topical: string[];
    platform: string[];
    general: string[];
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

export function HashtagGenerator() {
    const [topic, setTopic] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [count, setCount] = useState(15);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [groupedHashtags, setGroupedHashtags] = useState<HashtagGroup | null>(null);
    const [copied, setCopied] = useState(false);
    const [usage, setUsage] = useState<AIUsage | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const handleGenerate = async () => {
        if (!topic) {
            toast.error("Please enter a topic for your hashtags");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/api/ai/hashtags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    platform,
                    count,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate hashtags');
            }

            const data = await response.json();

            if (data.success) {
                setHashtags(data.hashtags);
                setGroupedHashtags(data.groupedHashtags);
                setUsage(data.usage);
            } else {
                throw new Error(data.error || 'Failed to generate hashtags');
            }
        } catch (error) {
            console.error('Error generating hashtags:', error);
            toast.error(error instanceof Error ? error.message : "Failed to generate hashtags. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Hashtags copied to clipboard");

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const getDisplayHashtags = () => {
        if (!groupedHashtags) return hashtags;

        switch (activeTab) {
            case "topical":
                return groupedHashtags.topical;
            case "platform":
                return groupedHashtags.platform;
            case "general":
                return groupedHashtags.general;
            default:
                return hashtags;
        }
    };

    const displayHashtags = getDisplayHashtags();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    Hashtag Generator
                </CardTitle>
                <CardDescription>
                    Generate relevant hashtags to increase your content's reach
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">What's your content about?</Label>
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
                        <div className="flex justify-between">
                            <Label htmlFor="count">Number of hashtags: {count}</Label>
                        </div>
                        <Slider
                            id="count"
                            min={5}
                            max={30}
                            step={1}
                            value={[count]}
                            onValueChange={(value) => setCount(value[0])}
                            className="py-4"
                        />
                    </div>
                </div>

                {usage && (
                    <div className="text-sm text-muted-foreground">
                        Hashtag generations: {usage.hashtagSuggestions}/{usage.hashtagSuggestionsLimit}
                        {usage.hashtagSuggestions >= usage.hashtagSuggestionsLimit && !usage.isPro && (
                            <span className="ml-2 text-red-500">
                                Limit reached. <a href="/dashboard/upgrade" className="underline">Upgrade to Pro</a>
                            </span>
                        )}
                    </div>
                )}

                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic || (usage && usage.hashtagSuggestions >= usage.hashtagSuggestionsLimit && !usage.isPro)}
                    className="w-full"
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

                {hashtags.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Generated Hashtags</h3>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(hashtags.join(' '))}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy All
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setHashtags([])}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {groupedHashtags && (
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid grid-cols-4 mb-4">
                                    <TabsTrigger value="all">All ({hashtags.length})</TabsTrigger>
                                    <TabsTrigger value="topical">Topical ({groupedHashtags.topical.length})</TabsTrigger>
                                    <TabsTrigger value="platform">Platform ({groupedHashtags.platform.length})</TabsTrigger>
                                    <TabsTrigger value="general">General ({groupedHashtags.general.length})</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )}

                        <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-md min-h-[200px]">
                            {displayHashtags.map((hashtag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-secondary"
                                    onClick={() => handleCopy(hashtag)}
                                >
                                    {hashtag}
                                </Badge>
                            ))}

                            {displayHashtags.length === 0 && (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No hashtags in this category
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Click on any hashtag to copy it individually, or use the "Copy All" button to copy all hashtags.
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 