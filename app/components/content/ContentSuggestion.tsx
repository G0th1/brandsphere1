"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Copy, Check, RefreshCw, Clock, CalendarIcon, Save, BookmarkIcon, TrashIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AIService, { ContentSuggestion as ContentSuggestionType } from "@/services/ai-service";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Local storage keys
const SAVED_TEMPLATES_KEY = "brandsphere_saved_templates";

// Template interface
interface SavedTemplate {
    id: string;
    name: string;
    topic: string;
    industry: string;
    platform: string;
    tone: string;
    createdAt: string;
}

// Utility function for debounce - prevents too many renders
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function ContentSuggestion() {
    const [topic, setTopic] = useState("");
    const [industry, setIndustry] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [tone, setTone] = useState("professional");
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState<ContentSuggestionType[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null);
    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [templateName, setTemplateName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Debounce input values to reduce unnecessary renders
    const debouncedTopic = useDebounce(topic, 300);
    const debouncedIndustry = useDebounce(industry, 300);

    // Load saved templates on component mount
    useEffect(() => {
        const loadSavedTemplates = () => {
            try {
                const savedData = localStorage.getItem(SAVED_TEMPLATES_KEY);
                if (savedData) {
                    setSavedTemplates(JSON.parse(savedData));
                }
            } catch (error) {
                console.error("Error loading saved templates:", error);
            }
        };

        loadSavedTemplates();
    }, []);

    // Memoized validation to prevent unnecessary re-renders
    const isValid = useMemo(() => {
        return Boolean(debouncedTopic && debouncedIndustry);
    }, [debouncedTopic, debouncedIndustry]);

    const handleGenerate = useCallback(async () => {
        if (!isValid) {
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
                topic: debouncedTopic,
                industry: debouncedIndustry,
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
    }, [debouncedTopic, debouncedIndustry, platform, tone, isValid]);

    const handleCopy = useCallback((content: string, id: string) => {
        navigator.clipboard.writeText(content).catch(err => {
            console.error('Failed to copy text:', err);
            toast({
                variant: "destructive",
                title: "Copy failed",
                description: "Could not copy to clipboard. Please try again."
            });
            return;
        });

        setCopied(id);

        toast({
            title: "Content copied",
            description: "The content has been copied to your clipboard"
        });

        setTimeout(() => setCopied(null), 2000);
    }, []);

    const handleSaveTemplate = () => {
        // Validate template name
        if (!templateName.trim()) {
            toast({
                variant: "destructive",
                title: "Template name required",
                description: "Please enter a name for your template"
            });
            return;
        }

        // Create new template
        const newTemplate: SavedTemplate = {
            id: crypto.randomUUID(),
            name: templateName,
            topic,
            industry,
            platform,
            tone,
            createdAt: new Date().toISOString()
        };

        // Add to templates list
        const updatedTemplates = [...savedTemplates, newTemplate];
        setSavedTemplates(updatedTemplates);

        // Save to local storage
        try {
            localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(updatedTemplates));

            toast({
                title: "Template saved",
                description: "Your content template has been saved successfully"
            });

            // Reset form
            setTemplateName("");
            setShowSaveDialog(false);
        } catch (error) {
            console.error("Error saving template:", error);
            toast({
                variant: "destructive",
                title: "Failed to save template",
                description: "An error occurred while saving your template"
            });
        }
    };

    const handleLoadTemplate = (template: SavedTemplate) => {
        setTopic(template.topic);
        setIndustry(template.industry);
        setPlatform(template.platform);
        setTone(template.tone);

        toast({
            title: "Template loaded",
            description: `Loaded template: ${template.name}`
        });
    };

    const handleDeleteTemplate = (templateId: string) => {
        const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
        setSavedTemplates(updatedTemplates);

        // Update local storage
        try {
            localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(updatedTemplates));

            toast({
                title: "Template deleted",
                description: "Your content template has been deleted"
            });
        } catch (error) {
            console.error("Error deleting template:", error);
        }
    };

    // Template selector component
    const TemplateSelector = useMemo(() => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="ml-2 whitespace-nowrap">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    Templates
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-medium text-sm">Saved Templates</h4>
                    <p className="text-xs text-muted-foreground">
                        {savedTemplates.length > 0
                            ? `You have ${savedTemplates.length} saved template(s)`
                            : "No saved templates yet"}
                    </p>
                </div>
                {savedTemplates.length > 0 ? (
                    <ScrollArea className="max-h-80">
                        <div className="p-2">
                            {savedTemplates.map(template => (
                                <div
                                    key={template.id}
                                    className="flex items-center justify-between rounded-md p-2 hover:bg-muted transition-colors"
                                >
                                    <div className="flex-1 cursor-pointer" onClick={() => handleLoadTemplate(template)}>
                                        <h5 className="font-medium text-sm">{template.name}</h5>
                                        <p className="text-xs text-muted-foreground">
                                            {template.topic} • {template.platform}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteTemplate(template.id)}
                                    >
                                        <TrashIcon className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Save your current settings as a template to quickly reuse them later
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    ), [savedTemplates]);

    // Save template dialog
    const SaveTemplateDialog = useMemo(() => (
        <Popover open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="ml-2">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <h4 className="font-medium">Save as Template</h4>
                    <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                            id="template-name"
                            placeholder="My Content Template"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <p>This will save your current settings:</p>
                        <ul className="mt-2 space-y-1">
                            <li>• Topic: {topic}</li>
                            <li>• Industry: {industry}</li>
                            <li>• Platform: {platform}</li>
                            <li>• Tone: {tone}</li>
                        </ul>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveTemplate}>
                            Save Template
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ), [showSaveDialog, templateName, topic, industry, platform, tone]);

    // Memoize the content form to prevent unnecessary rerenders
    const ContentForm = useMemo(() => (
        <Card className="md:col-span-1 lg:col-span-1">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Generate Content Ideas</CardTitle>
                    <div className="flex gap-2">
                        {SaveTemplateDialog}
                        {TemplateSelector}
                    </div>
                </div>
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
                    disabled={isGenerating || !isValid}
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
    ), [topic, industry, platform, tone, isGenerating, handleGenerate, isValid, SaveTemplateDialog, TemplateSelector]);

    // Memoize the suggestions display to prevent unnecessary rerenders
    const SuggestionsDisplay = useMemo(() => (
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
                        ? `Showing ${suggestions.length} suggestions for "${debouncedTopic}" on ${platform}`
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
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(suggestion.content, suggestion.id)}
                                        >
                                            {copied === suggestion.id ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-1 text-base">{suggestion.content}</p>
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
                                {suggestion.bestPostingTime && (
                                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                                        <Clock className="mr-1 h-3 w-3" />
                                        <span>Best time to post: {suggestion.bestPostingTime}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full p-3 bg-primary/10 mb-4">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-center text-lg">No content suggestions yet</p>
                        <p className="text-center text-sm text-muted-foreground mt-1">
                            Fill out the form and click 'Generate Ideas' to create content suggestions
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    ), [suggestions, isGenerating, usageInfo, debouncedTopic, platform, handleCopy, copied]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ContentForm}
            {SuggestionsDisplay}
        </div>
    );
} 