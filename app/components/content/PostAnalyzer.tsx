"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import AIService from "@/services/ai-service";

// Interface for the updated analysis format from OpenRouter
interface PostAnalysisResult {
    id: string;
    engagementScore: number;
    sentiment: string;
    targetAudience: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    bestPostingTime: string[];
    hashtagEffectiveness: string;
}

export function PostAnalyzer() {
    const [postContent, setPostContent] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<PostAnalysisResult | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!postContent) {
            toast({
                variant: "destructive",
                title: "Missing content",
                description: "Please enter some content to analyze"
            });
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await AIService.analyzePost({
                content: postContent,
                platform: platform as any
            });

            // Handle the new analysis format
            setAnalysis(result.analysis);
            setUsageInfo(result.usage);

            toast({
                title: "Analysis complete",
                description: "Your post has been analyzed successfully"
            });
        } catch (error) {
            console.error("Error analyzing post:", error);

            if (error instanceof Error && error.message.includes("Monthly limit exceeded")) {
                setError("You've reached your monthly limit for post analysis. Upgrade to Pro for more.");
                toast({
                    variant: "destructive",
                    title: "Usage limit reached",
                    description: "You've reached your monthly limit for post analysis"
                });
            } else {
                setError("There was an error analyzing your post. Please try again later.");
                toast({
                    variant: "destructive",
                    title: "Analysis failed",
                    description: "There was an error analyzing your post"
                });
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setAnalysis(null);
        setError(null);
    };

    // Helper function to get color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    // Helper function to get color based on sentiment
    const getSentimentColor = (sentiment: string) => {
        if (sentiment.toLowerCase() === "positive") return "bg-green-500/20 text-green-700";
        if (sentiment.toLowerCase() === "negative") return "bg-red-500/20 text-red-700";
        return "bg-blue-500/20 text-blue-700";
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl">Analyze Your Post</CardTitle>
                    <CardDescription>
                        Get AI-powered insights on your social media content
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="post-content">Post Content</Label>
                        <Textarea
                            id="post-content"
                            placeholder="Enter your post content here..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            rows={6}
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
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={analysis ? resetAnalysis : handleAnalyze}
                        disabled={isAnalyzing || (!analysis && !postContent)}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : analysis ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Analyze New Post
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Analyze Post
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Post Analysis Results</CardTitle>
                        {usageInfo && (
                            <div className="text-sm text-muted-foreground">
                                Usage: {usageInfo.current}/{usageInfo.limit}
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        {analysis
                            ? `Analysis results for your ${platform} post`
                            : "Your AI-powered post analysis will appear here"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-center text-lg">Analyzing your post...</p>
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                This may take a few moments
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                            <p className="text-center text-lg font-medium text-destructive">Analysis Failed</p>
                            <p className="text-center text-sm mt-2 max-w-md">
                                {error}
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={resetAnalysis}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-6">
                            {/* Engagement Score */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-medium">Engagement Potential</h3>
                                    <span className="text-lg font-bold">{analysis.engagementScore}/100</span>
                                </div>
                                <Progress
                                    value={analysis.engagementScore}
                                    className="h-2"
                                    indicatorClassName={getScoreColor(analysis.engagementScore)}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Low</span>
                                    <span>Medium</span>
                                    <span>High</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Sentiment */}
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium">Sentiment</h3>
                                    <Badge className={`rounded-md px-3 py-1 capitalize ${getSentimentColor(analysis.sentiment)}`}>
                                        {analysis.sentiment}
                                    </Badge>
                                </div>

                                {/* Target Audience */}
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium">Target Audience</h3>
                                    <p className="text-sm">{analysis.targetAudience}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Strengths and Weaknesses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Strengths
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {analysis.strengths.map((strength, index) => (
                                            <li key={index} className="text-sm">{strength}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-base font-medium flex items-center">
                                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                        Weaknesses
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {analysis.weaknesses.map((weakness, index) => (
                                            <li key={index} className="text-sm">{weakness}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <Separator />

                            {/* Improvement Suggestions */}
                            <div className="space-y-3">
                                <h3 className="text-base font-medium">Improvement Suggestions</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    {analysis.improvements.map((suggestion, index) => (
                                        <li key={index} className="text-sm">{suggestion}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Best Posting Times */}
                            <div className="space-y-3">
                                <h3 className="text-base font-medium">Best Posting Times</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(analysis.bestPostingTime) ? (
                                        analysis.bestPostingTime.map((time, index) => (
                                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {time}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {analysis.bestPostingTime}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Hashtag Effectiveness */}
                            {analysis.hashtagEffectiveness && (
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium">Hashtag Effectiveness</h3>
                                    <p className="text-sm">{analysis.hashtagEffectiveness}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No analysis yet</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                Enter your post content on the left and click "Analyze Post" to get AI-powered insights.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 