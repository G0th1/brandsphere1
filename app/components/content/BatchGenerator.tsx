"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Download, Trash, Clock, Plus, X, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import AIService, { ContentSuggestion } from "@/services/ai-service";

// Platform types for batch generation
const platformOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" }
];

// Tone options
const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" },
    { value: "educational", label: "Educational" }
];

export function BatchGenerator() {
    const [topic, setTopic] = useState("");
    const [industry, setIndustry] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
    const [tone, setTone] = useState("professional");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<Record<string, ContentSuggestion[]>>({});
    const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

    // Validate if form is ready to submit
    const isValid = topic && industry && selectedPlatforms.length > 0;

    // Handle platform selection
    const togglePlatform = (platform: string) => {
        if (selectedPlatforms.includes(platform)) {
            if (selectedPlatforms.length > 1) { // Prevent deselecting all platforms
                setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
            }
        } else {
            setSelectedPlatforms([...selectedPlatforms, platform]);
        }
    };

    // Handle batch generation
    const handleGenerate = async () => {
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Missing information",
                description: "Please provide a topic, industry, and select at least one platform"
            });
            return;
        }

        setIsGenerating(true);
        setGeneratedContent({});
        setCopied({});

        try {
            // Generate content for each selected platform
            const results: Record<string, ContentSuggestion[]> = {};

            // Process platforms sequentially to avoid rate limits
            for (const platform of selectedPlatforms) {
                try {
                    const result = await AIService.generateContentSuggestions({
                        topic,
                        industry,
                        platform: platform as any,
                        tone
                    });

                    results[platform] = result.suggestions;
                } catch (error) {
                    console.error(`Error generating content for ${platform}:`, error);
                    results[platform] = [];
                }
            }

            setGeneratedContent(results);

            toast({
                title: "Batch generation completed",
                description: `Generated content for ${selectedPlatforms.length} platform(s)`
            });
        } catch (error) {
            console.error("Error in batch generation:", error);
            toast({
                variant: "destructive",
                title: "Generation failed",
                description: "Failed to generate content. Please try again later."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Copy content to clipboard
    const handleCopy = (platform: string, id: string, content: string) => {
        navigator.clipboard.writeText(content).catch(err => {
            console.error('Failed to copy:', err);
            return;
        });

        setCopied({ ...copied, [`${platform}-${id}`]: true });

        toast({
            title: "Content copied",
            description: "The content has been copied to your clipboard"
        });

        setTimeout(() => {
            setCopied(prev => ({ ...prev, [`${platform}-${id}`]: false }));
        }, 2000);
    };

    // Download all content as CSV
    const handleDownloadCSV = () => {
        const rows = [
            ['Platform', 'Content', 'Hashtags', 'Best Posting Time']
        ];

        // Add all content to CSV
        Object.entries(generatedContent).forEach(([platform, suggestions]) => {
            suggestions.forEach(suggestion => {
                rows.push([
                    platform,
                    suggestion.content,
                    suggestion.hashtags.join(' '),
                    suggestion.bestPostingTime || ''
                ]);
            });
        });

        // Convert to CSV
        const csvContent = rows
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `content-batch-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Download started",
            description: "Your content has been downloaded as CSV"
        });
    };

    // Clear all generated content
    const handleClear = () => {
        setGeneratedContent({});
        setCopied({});
    };

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Batch Content Generator</CardTitle>
                        <CardDescription>
                            Generate content for multiple platforms at once
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                placeholder="e.g., Customer engagement strategies"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                placeholder="e.g., E-commerce, Healthcare, Finance"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Platforms</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {platformOptions.map((platform) => (
                                    <div
                                        key={platform.value}
                                        className={`
                                            flex items-center justify-between p-2 rounded-md border cursor-pointer
                                            ${selectedPlatforms.includes(platform.value)
                                                ? 'bg-primary/10 border-primary'
                                                : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'}
                                        `}
                                        onClick={() => togglePlatform(platform.value)}
                                    >
                                        <span>{platform.label}</span>
                                        {selectedPlatforms.includes(platform.value) && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                ))}
                            </div>
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
                                    {toneOptions.map((tone) => (
                                        <SelectItem key={tone.value} value={tone.value}>
                                            {tone.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleGenerate}
                            disabled={isGenerating || !isValid}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating for {selectedPlatforms.length} platform(s)...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Batch Content
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Generated Content</CardTitle>
                            <div className="flex gap-2">
                                {Object.keys(generatedContent).length > 0 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownloadCSV}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export CSV
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleClear}
                                        >
                                            <Trash className="h-4 w-4 mr-2" />
                                            Clear All
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <CardDescription>
                            {Object.keys(generatedContent).length > 0
                                ? `Showing content generated for ${Object.keys(generatedContent).length} platform(s)`
                                : "Your batch-generated content will appear here"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                <p className="text-center text-lg">Generating content across platforms...</p>
                                <p className="text-center text-sm text-muted-foreground mt-2">
                                    This may take a moment as we create optimized content for each platform
                                </p>
                            </div>
                        ) : Object.keys(generatedContent).length > 0 ? (
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-6">
                                    {Object.entries(generatedContent).map(([platform, suggestions]) => (
                                        <div key={platform} className="space-y-3">
                                            <div className="flex items-center">
                                                <h3 className="text-lg font-semibold capitalize">{platform}</h3>
                                                <Badge variant="outline" className="ml-2">
                                                    {suggestions.length} posts
                                                </Badge>
                                            </div>
                                            <div className="space-y-3">
                                                {suggestions.map((suggestion) => (
                                                    <div key={suggestion.id} className="rounded-lg border p-4">
                                                        <div className="flex items-center justify-end mb-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleCopy(platform, suggestion.id, suggestion.content)}
                                                            >
                                                                {copied[`${platform}-${suggestion.id}`] ? (
                                                                    <Check className="h-4 w-4" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        <p className="text-base">{suggestion.content}</p>
                                                        {suggestion.hashtags && suggestion.hashtags.length > 0 && (
                                                            <div className="mt-3 flex flex-wrap gap-1">
                                                                {suggestion.hashtags.map((tag, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {suggestion.bestPostingTime && (
                                                            <div className="mt-3 flex items-center text-xs text-muted-foreground">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                <span>Best time to post: {suggestion.bestPostingTime}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="my-4" />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="rounded-full p-3 bg-primary/10 mb-4">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-center text-lg">Ready to generate batch content</p>
                                <p className="text-center text-sm text-muted-foreground mt-1 max-w-md">
                                    Select your platforms, fill in the topic and industry, and click 'Generate' to create optimized content for multiple platforms at once.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 