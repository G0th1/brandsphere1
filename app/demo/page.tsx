"use client"

import { useState } from "react"
import Link from "next/link"
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
    ArrowLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Demo-översättningar
const translations = {
    en: {
        demoTitle: "BrandSphereAI Demo",
        demoDescription: "This is a preview of the BrandSphereAI dashboard. In the full version, you can manage your social media accounts, create and schedule posts, and analyze your performance.",
        welcomeTitle: "Welcome to the BrandSphereAI Demo",
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
        connectAccounts: "Connect Accounts",
        connectAccountsDesc: "Connect your social media accounts to get started",
        connectButton: "Connect",
        facebookConnect: "Connect Facebook",
        youtubeConnect: "Connect YouTube",
        demoMode: "Demo Mode",
        getStarted: "Sign up to get started",
        backToHome: "Back to home",
        createContent: "Create Content",
        analyzePerformance: "Analyze Performance",
        manageAccounts: "Manage Accounts"
    },
    sv: {
        demoTitle: "BrandSphereAI Demo",
        demoDescription: "Detta är en förhandsvisning av BrandSphereAI:s kontrollpanel. I den fullständiga versionen kan du hantera dina sociala mediekonton, skapa och schemalägga inlägg och analysera din prestanda.",
        welcomeTitle: "Välkommen till BrandSphereAI Demo",
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
        connectAccounts: "Anslut konton",
        connectAccountsDesc: "Anslut dina sociala mediekonton för att komma igång",
        connectButton: "Anslut",
        facebookConnect: "Anslut Facebook",
        youtubeConnect: "Anslut YouTube",
        demoMode: "Demo-läge",
        getStarted: "Registrera dig för att komma igång",
        backToHome: "Tillbaka till startsidan",
        createContent: "Skapa innehåll",
        analyzePerformance: "Analysera prestanda",
        manageAccounts: "Hantera konton"
    }
};

// Dummy data för demo
const demoData = {
    stats: {
        totalPosts: 24,
        engagement: 1250,
        activeAccounts: 2,
        scheduledPosts: 5
    },
    upcomingPosts: [
        {
            id: 1,
            title: "Nytt inlägg om AI-trender",
            platforms: ["facebook", "instagram"],
            scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 timmar framåt
        },
        {
            id: 2,
            title: "Inspirerande citat för måndagar",
            platforms: ["instagram"],
            scheduledFor: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 timmar framåt
        },
        {
            id: 3,
            title: "Ny produkt sneak peek",
            platforms: ["facebook", "instagram", "youtube"],
            scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 dag framåt
        }
    ]
};

export default function DemoPage() {
    const { language } = useLanguage();
    const t = translations[language];
    const [activeTab, setActiveTab] = useState('dashboard');

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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col">
                {/* Demo notis */}
                <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>{t.demoMode}</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t.demoTitle}</h1>
                            <p className="text-muted-foreground mt-1 max-w-2xl">{t.demoDescription}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t.backToHome}
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">
                                    {t.getStarted}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Navigeringstabs */}
                    <div className="flex border-b mb-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            {t.createContent}
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 font-medium ${activeTab === 'analytics' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            {t.analyzePerformance}
                        </button>
                        <button
                            onClick={() => setActiveTab('accounts')}
                            className={`px-4 py-2 font-medium ${activeTab === 'accounts' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            {t.manageAccounts}
                        </button>
                    </div>

                    {/* Dashboard innehåll */}
                    {activeTab === 'dashboard' && (
                        <div className="grid gap-6">
                            {/* Välkomsthälsning */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.welcomeTitle}</CardTitle>
                                    <CardDescription>{t.welcomeDescription}</CardDescription>
                                </CardHeader>
                            </Card>

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

                            {/* Kommande inlägg */}
                            <Card className="col-span-1 lg:col-span-3">
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

                            {/* Anslut konton */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.connectAccounts}</CardTitle>
                                    <CardDescription>{t.connectAccountsDesc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button className="flex items-center justify-center gap-2" variant="outline">
                                            <Facebook className="h-4 w-4 text-blue-600" />
                                            {t.facebookConnect}
                                        </Button>
                                        <Button className="flex items-center justify-center gap-2" variant="outline">
                                            <Youtube className="h-4 w-4 text-red-600" />
                                            {t.youtubeConnect}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Innehåll för andra flikar (bara platshållare) */}
                    {activeTab === 'content' && (
                        <div className="p-8 text-center border rounded-lg bg-card">
                            <FileEdit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{t.createContent}</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                I den fullständiga versionen kan du skapa och schemalägga inlägg för alla dina sociala medier från en plats.
                            </p>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="p-8 text-center border rounded-lg bg-card">
                            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{t.analyzePerformance}</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                I den fullständiga versionen får du tillgång till detaljerad analys av dina sociala mediepresterande.
                            </p>
                        </div>
                    )}

                    {activeTab === 'accounts' && (
                        <div className="p-8 text-center border rounded-lg bg-card">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{t.manageAccounts}</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                I den fullständiga versionen kan du hantera alla dina sociala mediekonton och integrera dem med vår plattform.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Icon component för Users (saknas i importen ovan)
function Users(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
} 