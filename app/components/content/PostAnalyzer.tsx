"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileSparkles, AlertTriangle, ThumbsUp, BadgeCheck, SparkleIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AIService, { PostAnalysis } from "@/services/ai-service";

export function PostAnalyzer() {
    const [content, setContent] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<PostAnalysis | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null);

    const handleAnalyze = async () => {
        if (!content) {
            toast({
                variant: "destructive",
                title: "Missing content",
                description: "Please enter some content to analyze"
            });
            return;
        }

        setIsAnalyzing(true);

        try {
            const result = await AIService.analyzePost({
                content,
                platform: platform as any,
                includeHashtags
            });

            setAnalysis(result.analysis);
            setUsageInfo(result.usage);

            toast({
                title: "Analysis complete",
                description: `Your post has been analyzed with a score of ${result.analysis.overall.score}/100`
            });
        } catch (error) {
            console.error("Error analyzing post:", error);

            if (error instanceof Error && error.message.includes("Monthly limit exceeded")) {
                toast({
                    variant: "destructive",
                    title: "Usage limit reached",
                    description: "You've reached your monthly limit for post analyses. Upgrade to Pro for more."
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to analyze post",
                    description: "There was an error analyzing your post. Please try again later."
                });
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-amber-500";
        return "text-red-500";
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Analyze Your Post</CardTitle>
                    <CardDescription>
                        Get AI-powered insights to improve your content's performance
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">Post Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Paste your social media post here to analyze it..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px]"
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

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="include-hashtags"
                            checked={includeHashtags}
                            onCheckedChange={(checked) => setIncludeHashtags(checked as boolean)}
                        />
                        <Label htmlFor="include-hashtags">Include hashtag suggestions if needed</Label>
                    </div>

                    {usageInfo && (
                        <div className="text-sm text-muted-foreground">
                            Usage: {usageInfo.current}/{usageInfo.limit}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !content}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <FileSparkles className="mr-2 h-4 w-4" />
                                Analyze Post
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Analysis Results</CardTitle>
                    <CardDescription>
                        {analysis ? "Insights and recommendations for your post" : "Your analysis results will appear here"}
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
                    ) : analysis ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-1">
                                    <span className={getScoreColor(analysis.overall.score)}>
                                        {analysis.overall.score}
                                    </span>
                                    <span className="text-2xl text-muted-foreground">/100</span>
                                </div>
                                <div className="text-lg font-medium mb-2">{analysis.overall.rating}</div>
                                <Progress
                                    value={analysis.overall.score}
                                    className="h-2 w-full max-w-md mx-auto"
                                    indicatorClassName={getProgressColor(analysis.overall.score)}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="text-lg font-medium">Detailed Analysis</div>

                                <div className="grid gap-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">Length</div>
                                            <div className="text-sm text-muted-foreground">
                                                {analysis.details.length.recommendation}
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {analysis.details.length.value} characters
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">Sentiment</div>
                                            <div className="text-sm text-muted-foreground">
                                                {analysis.details.sentiment.recommendation}
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {analysis.details.sentiment.value}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">Engagement Potential</div>
                                            <div className="text-sm text-muted-foreground">
                                                {analysis.details.engagement.recommendation}
                                            </div>
                                        </div>
                                        <Badge variant={analysis.details.engagement.value === "High" ? "default" : "outline"}>
                                            {analysis.details.engagement.value}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {analysis.improvement.suggestions && analysis.improvement.suggestions.length > 0 && (
                                <div>
                                    <div className="text-lg font-medium mb-2">Improvement Suggestions</div>
                                    <ul className="space-y-2">
                                        {analysis.improvement.suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-start">
                                                <SparkleIcon className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {analysis.improvement.suggestedHashtags && (
                                <div>
                                    <div className="text-lg font-medium mb-2">Suggested Hashtags</div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.improvement.suggestedHashtags.map((hashtag, index) => (
                                            <Badge key={index} variant="outline" className="px-2.5 py-1">
                                                {hashtag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileSparkles className="h-12 w-12 text-muted-foreground mb-4" />
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