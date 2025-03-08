"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    BarChart3,
    FileEdit,
    PlusCircle,
    Instagram,
    Twitter,
    Facebook,
    LogOut,
    ArrowRight,
    CheckCircle,
    Lock,
    Zap,
    X,
    Youtube,
    Layers,
    Info,
    Bell,
    Settings,
    User,
    LayoutDashboard,
    PieChart,
    Palette,
    MessageCircle,
    Inbox,
    BookOpen,
    CalendarClock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/components/ui/use-toast";
import { DemoSidebar } from "@/components/demo/sidebar";
import { DemoHeader } from "@/components/demo/header";

// Komponent för Avatar
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

// Översättningar
const translations = {
    en: {
        demoMode: "Premium Demo Mode",
        welcomeTitle: "Welcome to your BrandSphereAI dashboard",
        welcomeDescription: "Manage and analyze your social media content from one place.",
        totalPosts: "Total posts",
        engagement: "Engagement",
        activeAccounts: "Active accounts",
        scheduledPosts: "Scheduled posts",
        last30Days: "Last 30 days",
        engagementDescription: "Likes, comments, shares",
        connectedPlatforms: "Connected to the platform",
        upcomingPublications: "Upcoming publications",
        upcomingPostsTitle: "Upcoming posts",
        upcomingPostsDescription: "Manage your scheduled content",
        createPostButton: "Create new post",
        viewAllButton: "View all",
        today: "Today",
        tomorrow: "Tomorrow",
        connectAccounts: "Connected accounts",
        connectAccountsDesc: "You can connect more social media accounts in the settings",
        analytics: "Analytics",
        analyticsDescription: "Your social media performance",
        contentIdeas: "Content ideas",
        contentIdeasDescription: "AI-generated content based on your audience",
        recentActivities: "Recent activities",
        recentActivitiesDescription: "Latest actions and updates",
        trendingTopics: "Trending topics",
        trendingTopicsDescription: "Popular topics in your niche",
        aiAssistant: "AI Assistant",
        aiAssistantDescription: "Get help with content creation",
        settings: "Settings",
        profile: "Profile",
        logout: "Logout",
        exitDemo: "Exit Demo",
        backToHome: "Back to home",
        dashboard: "Dashboard",
        content: "Content",
        calendar: "Calendar",
        insights: "Insights",
        userProfile: "User Profile",
        premium: "Premium",
        followers: "Followers growth",
        postPerformance: "Post performance",
        reachAndImpressions: "Reach & impressions",
        audienceDemo: "Audience demographics"
    },
    sv: {
        demoMode: "Premium Demo-läge",
        welcomeTitle: "Välkommen till din BrandSphereAI-kontrollpanel",
        welcomeDescription: "Hantera och analysera ditt innehåll på sociala medier från en plats.",
        totalPosts: "Totala inlägg",
        engagement: "Engagemang",
        activeAccounts: "Aktiva konton",
        scheduledPosts: "Schemalagda inlägg",
        last30Days: "Senaste 30 dagarna",
        engagementDescription: "Likes, kommentarer, delningar",
        connectedPlatforms: "Anslutna till plattformen",
        upcomingPublications: "Kommande publiceringar",
        upcomingPostsTitle: "Kommande inlägg",
        upcomingPostsDescription: "Hantera ditt schemalagda innehåll",
        createPostButton: "Skapa nytt inlägg",
        viewAllButton: "Visa alla",
        today: "Idag",
        tomorrow: "Imorgon",
        connectAccounts: "Anslutna konton",
        connectAccountsDesc: "Du kan ansluta fler sociala mediekonton i inställningarna",
        analytics: "Analytik",
        analyticsDescription: "Din prestanda på sociala medier",
        contentIdeas: "Innehållsidéer",
        contentIdeasDescription: "AI-genererat innehåll baserat på din publik",
        recentActivities: "Senaste aktiviteter",
        recentActivitiesDescription: "Senaste åtgärder och uppdateringar",
        trendingTopics: "Trendande ämnen",
        trendingTopicsDescription: "Populära ämnen inom din nisch",
        aiAssistant: "AI-assistent",
        aiAssistantDescription: "Få hjälp med innehållsskapande",
        settings: "Inställningar",
        profile: "Profil",
        logout: "Logga ut",
        exitDemo: "Avsluta demo",
        backToHome: "Tillbaka till hem",
        dashboard: "Kontrollpanel",
        content: "Innehåll",
        calendar: "Kalender",
        insights: "Insikter",
        userProfile: "Användarprofil",
        premium: "Premium",
        followers: "Följartillväxt",
        postPerformance: "Inläggsprestanda",
        reachAndImpressions: "Räckvidd och visningar",
        audienceDemo: "Målgruppens demografi"
    }
};

// Demo-användartyp
interface DemoUser {
    id: string;
    email: string;
    name: string;
    subscription_tier: string;
    avatar_url: string;
    demo_mode: boolean;
    language: string;
}

// Dummy data för demo
const demoData = {
    user: {
        name: "Demo User",
        email: "demo@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo123",
        subscription: "premium"
    },
    stats: {
        totalPosts: 127,
        engagement: 5843,
        activeAccounts: 4,
        scheduledPosts: 12
    },
    upcomingPosts: [
        {
            id: 1,
            title: "Nytt inlägg om AI-trender inom marknadsföring",
            platforms: ["facebook", "instagram", "twitter"],
            scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 timmar framåt
        },
        {
            id: 2,
            title: "Inspirerande citat med grafik för måndagar",
            platforms: ["instagram"],
            scheduledFor: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 timmar framåt
        },
        {
            id: 3,
            title: "Lansering av ny produktlinje - sneak peek",
            platforms: ["facebook", "instagram", "youtube"],
            scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 dag framåt
        },
        {
            id: 4,
            title: "Branschtips och trix för e-commerce",
            platforms: ["facebook", "twitter"],
            scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 2 dagar framåt
        },
        {
            id: 5,
            title: "Bakom kulisserna - teamet på kontoret",
            platforms: ["instagram", "youtube"],
            scheduledFor: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 3 dagar framåt
        }
    ],
    connectedAccounts: [
        { id: 1, platform: "facebook", name: "BrandSphere Demo Page" },
        { id: 2, platform: "instagram", name: "@brandspheredemo" },
        { id: 3, platform: "twitter", name: "@BrandSphereDemo" },
        { id: 4, platform: "youtube", name: "BrandSphere Demo Channel" }
    ],
    recentActivities: [
        { id: 1, action: "Post scheduled", platform: "instagram", time: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { id: 2, action: "Content created", platform: "facebook", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 3, action: "Post published", platform: "twitter", time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
        { id: 4, action: "Analytics updated", platform: "all", time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
    ],
    contentIdeas: [
        "10 ways to boost engagement on Instagram with AI tools",
        "How successful businesses prepare for peak season",
        "Trending hashtags in your industry this week",
        "Behind the scenes - showcase your team in a personal way",
        "Customer satisfaction survey - ask followers what they want to see more of"
    ]
};

export default function DemoDashboardPage() {
    const { language } = useLanguage();
    const t = translations[language === 'sv' ? 'sv' : 'en'];
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<DemoUser | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Sätt mounted till true när komponenten har monterats
        setMounted(true);

        // Kontrollera om användaren är i demo-läge
        const demoUserStr = localStorage.getItem('demoUser');
        if (!demoUserStr) {
            // Om ingen demo-användare, omdirigera till demo-inloggning
            router.push('/demo/login');
            return;
        }

        try {
            const demoUser = JSON.parse(demoUserStr) as DemoUser;
            // Spara även vilket språk användaren hade valt
            demoUser.language = language;
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
            setUser(demoUser);
        } catch (error) {
            console.error('Error parsing demo user:', error);
            router.push('/demo/login');
        }
    }, [router, language]);

    // Om komponenten inte är monterad än, visa inget
    if (!mounted) return null;

    // Om användaren inte är inloggad, visa inget (vi omdirigerar ändå)
    if (!user) return null;

    // Funktion för att formatera datum
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === now.toDateString()) {
            return `${t.today}, ${date.toLocaleTimeString(language === 'sv' ? 'sv-SE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `${t.tomorrow}, ${date.toLocaleTimeString(language === 'sv' ? 'sv-SE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', { day: 'numeric', month: 'short' }) +
                `, ${date.toLocaleTimeString(language === 'sv' ? 'sv-SE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
        }
    };

    // Funktion för att visa plattformsikoner
    const renderPlatformIcons = (platforms: string[]) => {
        return (
            <div className="flex space-x-1">
                {platforms.map(platform => {
                    if (platform === 'facebook') return <Facebook key={platform} className="h-4 w-4 text-blue-600" />;
                    if (platform === 'instagram') return <Instagram key={platform} className="h-4 w-4 text-pink-600" />;
                    if (platform === 'youtube') return <Youtube key={platform} className="h-4 w-4 text-red-600" />;
                    if (platform === 'twitter') return <Twitter key={platform} className="h-4 w-4 text-blue-400" />;
                    return null;
                })}
            </div>
        );
    };

    // Funktion för att rendera plattformsikon för ett konto
    const renderPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'facebook':
                return <Facebook className="h-5 w-5 text-blue-600" />;
            case 'instagram':
                return <Instagram className="h-5 w-5 text-pink-600" />;
            case 'youtube':
                return <Youtube className="h-5 w-5 text-red-600" />;
            case 'twitter':
                return <Twitter className="h-5 w-5 text-blue-400" />;
            default:
                return null;
        }
    };

    // Funktion för att logga ut från demo
    const exitDemo = () => {
        localStorage.removeItem('demoUser');
        router.push('/');
        toast({
            title: "Demo avslutad",
            description: "Du har loggat ut från demo-versionen"
        });
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidopanel */}
            <div className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-4 flex justify-center">
                    <div className="text-xl font-bold">BrandSphereAI</div>
                </div>

                <div className="mt-2 px-3">
                    <div className="flex items-center justify-between rounded-md bg-accent/50 px-2 py-1.5">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{t.premium}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Demo</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2">
                        <Link href="/demo/dashboard">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                {t.dashboard}
                            </Button>
                        </Link>
                        <Link href="#content">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <FileEdit className="h-4 w-4" />
                                {t.content}
                            </Button>
                        </Link>
                        <Link href="#calendar">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <CalendarClock className="h-4 w-4" />
                                {t.calendar}
                            </Button>
                        </Link>
                        <Link href="#insights">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <PieChart className="h-4 w-4" />
                                {t.insights}
                            </Button>
                        </Link>
                        <Link href="#profile">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <User className="h-4 w-4" />
                                {t.userProfile}
                            </Button>
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                        <Avatar>
                            <AvatarImage src={demoData.user.avatar} alt={demoData.user.name} />
                            <AvatarFallback>DU</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{demoData.user.name}</div>
                            <div className="text-xs text-muted-foreground">{demoData.user.email}</div>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={exitDemo}>
                        {t.exitDemo}
                    </Button>
                </div>
            </div>

            {/* Huvudinnehåll */}
            <div className="flex-1 flex flex-col">
                {/* Toppnavigering */}
                <header className="border-b bg-card">
                    <div className="flex h-16 items-center px-4 justify-between">
                        <div className="md:hidden flex items-center gap-2">
                            <div className="text-xl font-bold">BrandSphereAI</div>
                        </div>

                        <div className="ml-auto flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                            </Button>

                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5" />
                            </Button>

                            <div className="md:hidden">
                                <Avatar>
                                    <AvatarImage src={demoData.user.avatar} alt={demoData.user.name} />
                                    <AvatarFallback>DU</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Demo-notis */}
                <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>{t.demoMode}</span>
                    </div>
                </div>

                {/* Innehåll */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {/* Översikt */}
                    <div className="space-y-6">
                        {/* Välkomsthälsning */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t.welcomeTitle}</h1>
                                <p className="text-muted-foreground">{t.welcomeDescription}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Button className="gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    {t.createPostButton}
                                </Button>
                            </div>
                        </div>

                        {/* Statistiköversikt */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {t.totalPosts}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{demoData.stats.totalPosts}</div>
                                    <p className="text-xs text-muted-foreground">{t.last30Days}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {t.engagement}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{demoData.stats.engagement}</div>
                                    <p className="text-xs text-muted-foreground">{t.engagementDescription}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {t.activeAccounts}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{demoData.stats.activeAccounts}</div>
                                    <p className="text-xs text-muted-foreground">{t.connectedPlatforms}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {t.scheduledPosts}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{demoData.stats.scheduledPosts}</div>
                                    <p className="text-xs text-muted-foreground">{t.upcomingPublications}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Huvudområden - två kolumner på större skärmar */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Vänsterkolumn */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Kommande inlägg */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>{t.upcomingPostsTitle}</CardTitle>
                                            <CardDescription>{t.upcomingPostsDescription}</CardDescription>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                {t.viewAllButton}
                                            </Button>
                                            <Button size="sm">
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                {t.createPostButton}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {demoData.upcomingPosts.map(post => (
                                                <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="rounded-full bg-primary/10 p-2">
                                                            <FileEdit className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{post.title}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {formatDate(post.scheduledFor)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        {renderPlatformIcons(post.platforms)}
                                                        <Button variant="ghost" size="sm">
                                                            <Layers className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Analytik */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.analytics}</CardTitle>
                                        <CardDescription>{t.analyticsDescription}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-md">
                                            <div className="font-medium mb-1">{t.followers}</div>
                                            <div className="h-40 w-full flex items-center justify-center text-muted-foreground">
                                                <BarChart3 className="h-32 w-32 opacity-30" />
                                            </div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <div className="font-medium mb-1">{t.postPerformance}</div>
                                            <div className="h-40 w-full flex items-center justify-center text-muted-foreground">
                                                <PieChart className="h-32 w-32 opacity-30" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* AI Innehåll */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.contentIdeas}</CardTitle>
                                        <CardDescription>{t.contentIdeasDescription}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {demoData.contentIdeas.map((idea, index) => (
                                                <div key={index} className="p-3 border rounded-md flex items-start justify-between hover:bg-accent/50 cursor-pointer" onClick={() => router.push(`/demo/content?idea=${encodeURIComponent(idea)}`)}>
                                                    <div className="flex gap-3">
                                                        <Palette className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                        <span>{idea}</span>
                                                    </div>
                                                    <Button size="sm" variant="ghost" onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/demo/content?idea=${encodeURIComponent(idea)}`);
                                                    }}>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Högerkolumn */}
                            <div className="space-y-6">
                                {/* Anslutna konton */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.connectAccounts}</CardTitle>
                                        <CardDescription>{t.connectAccountsDesc}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {demoData.connectedAccounts.map(account => (
                                                <div key={account.id} className="flex items-center justify-between p-2 border rounded-md">
                                                    <div className="flex items-center gap-2">
                                                        {renderPlatformIcon(account.platform)}
                                                        <span>{account.name}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Senaste aktiviteter */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.recentActivities}</CardTitle>
                                        <CardDescription>{t.recentActivitiesDescription}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {demoData.recentActivities.map(activity => (
                                                <div key={activity.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                                                    <div className="rounded-full bg-primary/10 p-1.5 h-6 w-6 flex items-center justify-center">
                                                        {activity.platform === 'all' ?
                                                            <BarChart3 className="h-3.5 w-3.5 text-primary" /> :
                                                            <FileEdit className="h-3.5 w-3.5 text-primary" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {activity.action}
                                                            {activity.platform !== 'all' && (
                                                                <span className="ml-1 inline-flex items-center">
                                                                    {activity.platform === 'facebook' && <Facebook className="h-3 w-3 text-blue-600 ml-1" />}
                                                                    {activity.platform === 'instagram' && <Instagram className="h-3 w-3 text-pink-600 ml-1" />}
                                                                    {activity.platform === 'twitter' && <Twitter className="h-3 w-3 text-blue-400 ml-1" />}
                                                                    {activity.platform === 'youtube' && <Youtube className="h-3 w-3 text-red-600 ml-1" />}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {formatDate(activity.time)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* AI-assistent */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t.aiAssistant}</CardTitle>
                                        <CardDescription>{t.aiAssistantDescription}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-md p-3 flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MessageCircle className="h-4 w-4 text-primary" />
                                                <span className="font-medium">AI-assistent</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Hej! Jag är din AI-assistent. Jag kan hjälpa dig att skapa innehåll, föreslå idéer eller svara på dina frågor.
                                            </p>
                                            <div className="mt-2">
                                                <Button className="w-full">
                                                    Starta konversation
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
