"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, Clock, ThumbsUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PostAnalysis } from "@/types/ai";

interface AIUsage {
    contentSuggestions: number;
    contentSuggestionsLimit: number;
    hashtagSuggestions: number;
    hashtagSuggestionsLimit: number;
    postAnalysis: number;
    postAnalysisLimit: number;
    isPro: boolean;
}

export function PostAnalyzer() {
    const [content, setContent] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<PostAnalysis | null>(null);
    const [usage, setUsage] = useState<AIUsage | null>(null);

    const handleAnalyze = async () => {
        if (!content) {
            toast.error("Please enter content to analyze");
            return;
        }

        setIsAnalyzing(true);

        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    platform,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze post');
            }

            const data = await response.json();

            if (data.success) {
                setAnalysis(data.analysis);
                setUsage(data.usage);
            } else {
                throw new Error(data.error || 'Failed to analyze post');
            }
        } catch (error) {
            console.error('Error analyzing post:', error);
            toast.error(error instanceof Error ? error.message : "Failed to analyze post. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive':
                return 'text-green-500';
            case 'negative':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    };

    const getEngagementColor = (engagement: string) => {
        switch (engagement) {
            case 'high':
                return 'text-green-500';
            case 'medium':
                return 'text-yellow-500';
            default:
                return 'text-red-500';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Post Analyzer
                </CardTitle>
                <CardDescription>
                    Get AI-powered insights to improve your social media content
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="content">Enter your post content</Label>
                    <Textarea
                        id="content"
                        placeholder="Paste your post content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[150px]"
                    />
                </div>

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

                {usage && (
                    <div className="text-sm text-muted-foreground">
                        Post analyses: {usage.postAnalysis}/{usage.postAnalysisLimit}
                        {usage.postAnalysis >= usage.postAnalysisLimit && !usage.isPro && (
                            <span className="ml-2 text-red-500">
                                Limit reached. <a href="/dashboard/upgrade" className="underline">Upgrade to Pro</a>
                            </span>
                        )}
                    </div>
                )}

                <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !content || (usage && usage.postAnalysis >= usage.postAnalysisLimit && !usage.isPro)}
                    className="w-full"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            Analyze Post
                        </>
                    )}
                </Button>

                {analysis && (
                    <div className="mt-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Analysis Results</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-muted/30 p-4 rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Engagement Score</span>
                                        <span className="text-lg font-bold">{analysis.score}%</span>
                                    </div>
                                    <Progress value={analysis.score} className="h-2" />
                                </div>

                                <div className="bg-muted/30 p-4 rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Sentiment</span>
                                        <span className={`text-sm font-medium ${getSentimentColor(analysis.sentiment)}`}>
                                            {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Predicted Engagement</span>
                                        <span className={`text-sm font-medium ${getEngagementColor(analysis.predictedEngagement)}`}>
                                            {analysis.predictedEngagement.charAt(0).toUpperCase() + analysis.predictedEngagement.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {analysis.recommendedTime && (
                                <div className="bg-muted/30 p-4 rounded-md">
                                    <div className="flex items-start space-x-3">
                                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium">Recommended Posting Time</h4>
                                            <p className="text-sm">{analysis.recommendedTime}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-muted/30 p-4 rounded-md space-y-3">
                                    <h4 className="text-sm font-medium flex items-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                        Strengths
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysis.strengths.map((strength, index) => (
                                            <li key={index} className="text-sm flex items-start">
                                                <span className="text-green-500 mr-2">•</span>
                                                {strength}
                                            </li>
                                        ))}
                                        {analysis.strengths.length === 0 && (
                                            <li className="text-sm text-muted-foreground">No strengths identified</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-md space-y-3">
                                    <h4 className="text-sm font-medium flex items-center">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                                        Areas to Improve
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysis.weaknesses.map((weakness, index) => (
                                            <li key={index} className="text-sm flex items-start">
                                                <span className="text-yellow-500 mr-2">•</span>
                                                {weakness}
                                            </li>
                                        ))}
                                        {analysis.weaknesses.length === 0 && (
                                            <li className="text-sm text-muted-foreground">No weaknesses identified</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-md space-y-3">
                                <h4 className="text-sm font-medium flex items-center">
                                    <ThumbsUp className="h-4 w-4 text-primary mr-2" />
                                    Suggestions for Improvement
                                </h4>
                                <ul className="space-y-2">
                                    {analysis.suggestions.map((suggestion, index) => (
                                        <li key={index} className="text-sm flex items-start">
                                            <span className="text-primary mr-2">{index + 1}.</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                    {analysis.suggestions.length === 0 && (
                                        <li className="text-sm text-muted-foreground">No suggestions available</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 