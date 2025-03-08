"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    LineChart,
    TrendingUp,
    Users,
    Globe,
    Clock,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { useDemo } from "@/contexts/demo-context";
import { DemoSidebar } from "@/components/demo/sidebar";
import { DemoHeader } from "@/components/demo/header";

// Translations
const translations = {
    en: {
        pageTitle: "Analytics & Insights",
        overview: "Overview",
        followers: "Follower Growth",
        performance: "Post Performance",
        reach: "Reach & Views",
        demographics: "Audience Demographics",
        platformInsights: "Platform Insights",
        loading: "Loading...",
        exitDemo: "Exit Demo",
        dashboard: "Dashboard",
        content: "Content",
        calendar: "Calendar",
        insights: "Insights",
        profile: "User Profile",
        settings: "Settings",
        summary: {
            title: "Performance Summary",
            followers: "Total Followers",
            engagement: "Engagement Rate",
            impressions: "Total Views",
            clicks: "Link Clicks",
            period: "Last 30 days"
        },
        growth: {
            title: "Audience Growth",
            newFollowers: "New Followers",
            percentChange: "Change from previous period",
            thisMonth: "This Month",
            lastMonth: "Last Month",
            period: "Last 30 days"
        },
        platforms: {
            title: "Platform Breakdown",
            instagram: "Instagram",
            facebook: "Facebook",
            twitter: "Twitter",
            youtube: "YouTube",
            followers: "Followers",
            engagement: "Engagement",
            posts: "Total Posts"
        },
        topPosts: {
            title: "Top Performing Posts",
            post: "Post",
            engagement: "Engagement",
            impressions: "Impressions",
            date: "Date",
            viewAll: "View all posts"
        },
        demographicsData: {
            title: "Audience Demographics",
            age: "Age Distribution",
            gender: "Gender Distribution",
            location: "Top Locations",
            interests: "Top Interests"
        }
    },
    sv: {
        pageTitle: "Analys & Insikter",
        overview: "Översikt",
        followers: "Följartillväxt",
        performance: "Inläggsprestation",
        reach: "Räckvidd & Visningar",
        demographics: "Målgruppsdemografi",
        platformInsights: "Plattformsinsikter",
        loading: "Laddar...",
        exitDemo: "Avsluta demo",
        dashboard: "Kontrollpanel",
        content: "Innehåll",
        calendar: "Kalender",
        insights: "Insikter",
        profile: "Användarprofil",
        settings: "Inställningar",
        summary: {
            title: "Prestationssammanfattning",
            followers: "Totalt antal följare",
            engagement: "Engagemangsnivå",
            impressions: "Totala visningar",
            clicks: "Länkklick",
            period: "Senaste 30 dagarna"
        },
        growth: {
            title: "Målgruppstillväxt",
            newFollowers: "Nya följare",
            percentChange: "Förändring jämfört med föregående period",
            thisMonth: "Denna månad",
            lastMonth: "Förra månaden",
            period: "Senaste 30 dagarna"
        },
        platforms: {
            title: "Plattformsfördelning",
            instagram: "Instagram",
            facebook: "Facebook",
            twitter: "Twitter",
            youtube: "YouTube",
            followers: "Följare",
            engagement: "Engagemang",
            posts: "Totalt antal inlägg"
        },
        topPosts: {
            title: "Bäst presterande inlägg",
            post: "Inlägg",
            engagement: "Engagemang",
            impressions: "Visningar",
            date: "Datum",
            viewAll: "Visa alla inlägg"
        },
        demographicsData: {
            title: "Målgruppsdemografi",
            age: "Åldersfördelning",
            gender: "Könsfördelning",
            location: "Vanligaste platser",
            interests: "Främsta intressen"
        }
    }
};

export default function DemoInsightsPage() {
    const { language } = useLanguage();
    const { user } = useDemo();
    const t = translations[language === 'sv' ? 'sv' : 'en'];
    const [activeTab, setActiveTab] = useState('overview');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Om komponenten inte är monterad än, visa inget
    if (!mounted) return null;

    // Om användaren inte är inloggad, visa inget
    if (!user) return null;

    return (
        <div className="min-h-screen flex">
            <DemoSidebar activeItem="insights" />

            <div className="flex-1 flex flex-col">
                <DemoHeader />

                <main className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList>
                            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                            <TabsTrigger value="followers">{t.followers}</TabsTrigger>
                            <TabsTrigger value="performance">{t.performance}</TabsTrigger>
                            <TabsTrigger value="reach">{t.reach}</TabsTrigger>
                            <TabsTrigger value="demographics">{t.demographicsData.title}</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Performance Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.followers}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12,458</div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="text-green-500 inline-flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            +2.5%
                                        </span>
                                        {" "}{t.summary.period}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.engagement}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3.2%</div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="text-red-500 inline-flex items-center">
                                            <ArrowDownRight className="h-3 w-3 mr-1" />
                                            -0.4%
                                        </span>
                                        {" "}{t.summary.period}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.impressions}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">178,249</div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="text-green-500 inline-flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            +12.3%
                                        </span>
                                        {" "}{t.summary.period}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.clicks}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4,738</div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="text-green-500 inline-flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            +7.1%
                                        </span>
                                        {" "}{t.summary.period}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Platform Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.platforms.title}</CardTitle>
                                <CardDescription>{t.summary.period}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                                            <div className="text-blue-500 mb-2">
                                                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-medium">{t.platforms.facebook}</h4>
                                                <p className="text-sm text-muted-foreground">{t.platforms.followers}: 5,243</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                                            <div className="text-pink-500 mb-2">
                                                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-medium">{t.platforms.instagram}</h4>
                                                <p className="text-sm text-muted-foreground">{t.platforms.followers}: 4,892</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                                            <div className="text-black dark:text-white mb-2">
                                                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-medium">{t.platforms.twitter}</h4>
                                                <p className="text-sm text-muted-foreground">{t.platforms.followers}: 3,211</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                                            <div className="text-red-500 mb-2">
                                                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-medium">{t.platforms.youtube}</h4>
                                                <p className="text-sm text-muted-foreground">{t.platforms.followers}: 1,543</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Content for other tabs can be implemented similarly */}
                    <TabsContent value="followers" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.growth.title}</CardTitle>
                                <CardDescription>{t.growth.period}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80 flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <LineChart className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                                        <p>{t.growth.thisMonth}: +423 {t.growth.newFollowers}</p>
                                        <p>{t.growth.lastMonth}: +387 {t.growth.newFollowers}</p>
                                        <p className="text-green-500 mt-2">+9.3% {t.growth.percentChange}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Demographics Section */}
                    <TabsContent value="demographics" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{t.demographicsData.title}</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.demographicsData.age}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Age distribution chart would go here */}
                                        <div className="h-48 bg-muted/20 rounded-md flex items-center justify-center">
                                            <BarChart className="h-8 w-8 text-muted" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.demographicsData.gender}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Gender distribution chart would go here */}
                                        <div className="h-48 bg-muted/20 rounded-md flex items-center justify-center">
                                            <Users className="h-8 w-8 text-muted" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.topPosts.title}</CardTitle>
                                <CardDescription>{t.summary.period}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80 flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <BarChart className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                                        <p>{language === 'sv' ? 'Visa dina bäst presterande inlägg' : 'View your top performing posts'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reach" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.reach}</CardTitle>
                                <CardDescription>{t.summary.period}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80 flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <Globe className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                                        <p>{language === 'sv' ? 'Utforska din räckvidd över olika plattformar' : 'Explore your reach across platforms'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </main>
            </div>
        </div>
    );
} 