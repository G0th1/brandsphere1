import { Metadata } from "next";
import { ContentSuggestion } from "@/app/components/content/ContentSuggestion";
import { HashtagGenerator } from "@/app/components/content/HashtagGenerator";
import { PostAnalyzer } from "@/app/components/content/PostAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageStats } from "@/app/components/dashboard/usage-stats";
import { BatchGenerator } from "@/app/components/content/BatchGenerator";

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

            <UsageStats />

            <Tabs defaultValue="content" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="content">Content Ideas</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtag Generator</TabsTrigger>
                    <TabsTrigger value="analysis">Post Analysis</TabsTrigger>
                    <TabsTrigger value="batch">Batch Generator</TabsTrigger>
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

                <TabsContent value="batch" className="space-y-4">
                    <BatchGenerator />
                </TabsContent>
            </Tabs>
        </div>
    );
} 