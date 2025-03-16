import { Metadata } from "next";
import { ContentSuggestion } from "@/app/components/content/ContentSuggestion";
import { HashtagGenerator } from "@/app/components/content/HashtagGenerator";
import { PostAnalyzer } from "@/app/components/content/PostAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Hash, FileText, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "AI Content | BrandSphereAI",
    description: "Generate AI-powered content for your social media",
};

export default function AIContentPage() {
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">AI Content Generator</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Content Ideas
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12/20</div>
                        <p className="text-xs text-muted-foreground">
                            Monthly usage
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Hashtag Suggestions
                        </CardTitle>
                        <Hash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8/15</div>
                        <p className="text-xs text-muted-foreground">
                            Monthly usage
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Post Analysis
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5/10</div>
                        <p className="text-xs text-muted-foreground">
                            Monthly usage
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            AI Credits
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25/45</div>
                        <p className="text-xs text-muted-foreground">
                            Total remaining
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="content" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="content">Content Ideas</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtag Generator</TabsTrigger>
                    <TabsTrigger value="analysis">Post Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <ContentSuggestion />
                </TabsContent>

                <TabsContent value="hashtags" className="space-y-4">
                    <HashtagGenerator />
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                    <PostAnalyzer />
                </TabsContent>
            </Tabs>
        </div>
    );
} 