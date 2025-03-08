"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    FileEdit,
    BarChart3,
    PieChart,
    User,
    CalendarClock,
    Settings,
    Zap,
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
import { DemoSidebar } from "@/components/demo/sidebar";
import { DemoHeader } from "@/components/demo/header";

// Translations
const translations = {
    en: {
        pageTitle: "Analytics & Insights",
        overview: "Overview",
        followers: "Followers Growth",
        performance: "Post Performance",
        reach: "Reach & Impressions",
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
            impressions: "Total Impressions",
            clicks: "Link Clicks",
            period: "Last 30 days"
        },
        growth: {
            title: "Audience Growth",
            newFollowers: "New Followers",
            percentChange: "Change compared to previous period",
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
        demographics: {
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
        demographics: {
            title: "Målgruppsdemografi",
            age: "Åldersfördelning",
            gender: "Könsfördelning",
            location: "Vanligaste platser",
            interests: "Främsta intressen"
        }
    }
};

// Types
interface DemoUser {
    id: string;
    email: string;
    name: string;
    subscription_tier: string;
    avatar_url: string;
    demo_mode: boolean;
    language?: string;
}

// Avatar components
const Avatar = ({ children, className, ...props }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`} {...props}>
        {children}
    </div>
);

const AvatarImage = ({ src, alt, className, ...props }: { src: string, alt: string, className?: string }) => (
    <img src={src} alt={alt} className={`aspect-square h-full w-full ${className || ''}`} {...props} />
);

const AvatarFallback = ({ children, className, ...props }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className || ''}`} {...props}>
        {children}
    </div>
);

export default function DemoInsightsPage() {
    const { language } = useLanguage();
    const t = translations[language === 'sv' ? 'sv' : 'en'];
    const router = useRouter();
    const [user, setUser] = useState<DemoUser | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Set mounted to true when component mounts
        setMounted(true);

        // Check if user is in demo mode
        const demoUserStr = localStorage.getItem('demoUser');
        if (!demoUserStr) {
            // If no demo user, redirect to demo login
            router.push('/demo/login');
            return;
        }

        try {
            const demoUser = JSON.parse(demoUserStr) as DemoUser;
            // Save the current language preference
            demoUser.language = language;
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
            setUser(demoUser);
        } catch (error) {
            console.error('Error parsing demo user:', error);
            router.push('/demo/login');
        }
    }, [router, language]);

    // If component not mounted yet, show nothing
    if (!mounted) return null;

    // If user not logged in, show nothing (we're redirecting anyway)
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
                            <TabsTrigger value="demographics">{t.demographics}</TabsTrigger>
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
                                    <div className="text-2xl font-bold">12,547</div>
                                    <div className="flex items-center text-sm text-green-500 mt-1">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        <span>+5.2%</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.engagement}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3.8%</div>
                                    <div className="flex items-center text-sm text-green-500 mt-1">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        <span>+0.7%</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.impressions}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">235,892</div>
                                    <div className="flex items-center text-sm text-green-500 mt-1">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        <span>+12.4%</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{t.summary.clicks}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4,271</div>
                                    <div className="flex items-center text-sm text-red-500 mt-1">
                                        <ArrowDownRight className="h-4 w-4 mr-1" />
                                        <span>-2.1%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Platform breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.platforms.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-4 w-4 rounded-full bg-pink-500 mr-2"></div>
                                                <span>{t.platforms.instagram}</span>
                                            </div>
                                            <span className="font-medium">5,427</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                                                <span>{t.platforms.facebook}</span>
                                            </div>
                                            <span className="font-medium">4,192</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-4 w-4 rounded-full bg-sky-400 mr-2"></div>
                                                <span>{t.platforms.twitter}</span>
                                            </div>
                                            <span className="font-medium">1,895</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-sky-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                                                <span>{t.platforms.youtube}</span>
                                            </div>
                                            <span className="font-medium">1,033</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
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
                </main>
            </div>
        </div>
    );
} 