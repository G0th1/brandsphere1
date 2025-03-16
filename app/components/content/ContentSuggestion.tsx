"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Copy, Check, RefreshCw, Clock, CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AIService, { ContentSuggestion as ContentSuggestionType } from "@/services/ai-service";

export function ContentSuggestion() {
    const [topic, setTopic] = useState("");
    const [industry, setIndustry] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [tone, setTone] = useState("professional");
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState<ContentSuggestionType[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null);

    const handleGenerate = async () => {
        if (!topic || !industry) {
            toast({
                variant: "destructive",
                title: "Missing information",
                description: "Please enter both a topic and an industry for your content"
            });
            return;
        }

        setIsGenerating(true);

        try {
            const result = await AIService.generateContentSuggestions({
                topic,
                industry,
                platform: platform as any,
                tone
            });

            setSuggestions(result.suggestions);
            setUsageInfo(result.usage);
            
            toast({
                title: "Content generated",
                description: `Generated ${result.suggestions.length} content suggestions for your topic`
            });
        } catch (error) {
            console.error("Error generating content:", error);
            
            if (error instanceof Error && error.message.includes("Monthly limit exceeded")) {
                toast({
                    variant: "destructive",
                    title: "Usage limit reached",
                    description: "You've reached your monthly limit for content suggestions. Upgrade to Pro for more."
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to generate content",
                    description: "There was an error generating your content. Please try again later."
                });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopied(id);
        
        toast({
            title: "Content copied",
            description: "The content has been copied to your clipboard"
        });
        
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl">Generate Content Ideas</CardTitle>
                    <CardDescription>
                        Get AI-powered content suggestions for your social media posts
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                            id="topic"
                            placeholder="e.g., Social media marketing tips"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                            id="industry"
                            placeholder="e.g., Fashion, Technology, Finance"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
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
                        <Label htmlFor="tone">Content Tone</Label>
                        <Select
                            value={tone}
                            onValueChange={setTone}
                        >
                            <SelectTrigger id="tone">
                                <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="humorous">Humorous</SelectItem>
                                <SelectItem value="inspirational">Inspirational</SelectItem>
                                <SelectItem value="educational">Educational</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic || !industry}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Ideas
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Content Suggestions</CardTitle>
                        {usageInfo && (
                            <div className="text-sm text-muted-foreground">
                                Usage: {usageInfo.current}/{usageInfo.limit}
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        {suggestions.length > 0 
                            ? `Showing ${suggestions.length} suggestions for "${topic}" on ${platform}`
                            : "Your AI-generated content ideas will appear here"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-center text-lg">Generating creative content ideas...</p>
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                This may take a few moments
                            </p>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="space-y-4">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium capitalize">
                                            {suggestion.platform}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {suggestion.bestPostingTime && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {suggestion.bestPostingTime}
                                                </div>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopy(suggestion.content, suggestion.id)}
                                            >
                                                {copied === suggestion.id ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="whitespace-pre-line text-sm">
                                        {suggestion.content}
                                    </div>
                                    {suggestion.hashtags && suggestion.hashtags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {suggestion.hashtags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No content suggestions yet</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                Fill in the form on the left and click "Generate Ideas" to get AI-powered content suggestions for your social media.
                            </p>
                        </div>
                    )}
                </CardContent>
                {suggestions.length > 0 && (
                    <CardFooter className="justify-center">
                        <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate More Ideas
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
} 