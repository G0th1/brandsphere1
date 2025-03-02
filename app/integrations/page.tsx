"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Facebook, Youtube, Instagram, Linkedin, Twitter, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Översättningar
const translations = {
    en: {
        title: "Integrations",
        subtitle: "Connect your social media accounts and other tools with BrandSphereAI",
        availableNow: "Available Now",
        comingSoon: "Coming Soon",
        viewDoc: "View Documentation",
        getStarted: "Get Started",
        readMore: "Read More",
        requestIntegration: "Request Integration",
        requestDescription: "Don't see the integration you need? Let us know and we'll consider adding it to our roadmap.",
        contact: "Contact Us",
        integrations: {
            available: [
                {
                    name: "Facebook",
                    description: "Connect your Facebook Pages to schedule posts, analyze performance, and engage with your audience.",
                    icon: Facebook,
                    color: "text-blue-600",
                    features: [
                        "Schedule and publish posts",
                        "Analyze reach and engagement",
                        "Manage comments and messages",
                        "Track audience growth"
                    ]
                },
                {
                    name: "YouTube",
                    description: "Manage your YouTube channel, schedule video uploads, and track performance metrics.",
                    icon: Youtube,
                    color: "text-red-600",
                    features: [
                        "Schedule video uploads",
                        "Monitor comments and engagement",
                        "Track subscriber growth",
                        "Analyze video performance"
                    ]
                }
            ],
            coming: [
                {
                    name: "Instagram",
                    description: "Connect your Instagram business account to schedule posts, stories, and analyze engagement.",
                    icon: Instagram,
                    color: "text-pink-600",
                    features: [
                        "Schedule feed posts and stories",
                        "Manage comments",
                        "Analyze follower growth",
                        "Track hashtag performance"
                    ]
                },
                {
                    name: "LinkedIn",
                    description: "Publish content to your LinkedIn profile and company pages, track performance, and grow your professional network.",
                    icon: Linkedin,
                    color: "text-blue-700",
                    features: [
                        "Schedule posts to profiles and pages",
                        "Track engagement metrics",
                        "Analyze audience demographics",
                        "Monitor company page growth"
                    ]
                },
                {
                    name: "Twitter",
                    description: "Schedule tweets, monitor mentions, and engage with your audience on Twitter.",
                    icon: Twitter,
                    color: "text-sky-500",
                    features: [
                        "Schedule and publish tweets",
                        "Monitor mentions and replies",
                        "Track follower growth",
                        "Analyze tweet performance"
                    ]
                }
            ]
        }
    },
    sv: {
        title: "Integrationer",
        subtitle: "Anslut dina sociala mediekonton och andra verktyg med BrandSphereAI",
        availableNow: "Tillgängliga nu",
        comingSoon: "Kommer snart",
        viewDoc: "Visa dokumentation",
        getStarted: "Kom igång",
        readMore: "Läs mer",
        requestIntegration: "Föreslå integration",
        requestDescription: "Saknar du en integration? Låt oss veta så överväger vi att lägga till den i vår utvecklingsplan.",
        contact: "Kontakta oss",
        integrations: {
            available: [
                {
                    name: "Facebook",
                    description: "Anslut dina Facebook-sidor för att schemalägga inlägg, analysera prestanda och interagera med din publik.",
                    icon: Facebook,
                    color: "text-blue-600",
                    features: [
                        "Schemalägga och publicera inlägg",
                        "Analysera räckvidd och engagemang",
                        "Hantera kommentarer och meddelanden",
                        "Spåra publiktillväxt"
                    ]
                },
                {
                    name: "YouTube",
                    description: "Hantera din YouTube-kanal, schemalägga videouppladdningar och spåra prestationsmetrik.",
                    icon: Youtube,
                    color: "text-red-600",
                    features: [
                        "Schemalägga videouppladdningar",
                        "Övervaka kommentarer och engagemang",
                        "Spåra prenumeranttillväxt",
                        "Analysera videoprestanda"
                    ]
                }
            ],
            coming: [
                {
                    name: "Instagram",
                    description: "Anslut ditt Instagram-företagskonto för att schemalägga inlägg, stories och analysera engagemang.",
                    icon: Instagram,
                    color: "text-pink-600",
                    features: [
                        "Schemalägga flödesinlägg och stories",
                        "Hantera kommentarer",
                        "Analysera följartillväxt",
                        "Spåra hashtagprestanda"
                    ]
                },
                {
                    name: "LinkedIn",
                    description: "Publicera innehåll till din LinkedIn-profil och företagssidor, spåra prestanda och växa ditt professionella nätverk.",
                    icon: Linkedin,
                    color: "text-blue-700",
                    features: [
                        "Schemalägga inlägg till profiler och sidor",
                        "Spåra engagemangsmetrik",
                        "Analysera publikdemografi",
                        "Övervaka företagssidans tillväxt"
                    ]
                },
                {
                    name: "Twitter",
                    description: "Schemalägga tweets, övervaka omnämningar och interagera med din publik på Twitter.",
                    icon: Twitter,
                    color: "text-sky-500",
                    features: [
                        "Schemalägga och publicera tweets",
                        "Övervaka omnämningar och svar",
                        "Spåra följartillväxt",
                        "Analysera tweet-prestanda"
                    ]
                }
            ]
        }
    }
};

export default function IntegrationsPage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="py-12 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="text-center max-w-[800px] mx-auto mb-10 animate-fade-in">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                                {t.title}
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {t.subtitle}
                            </p>
                        </div>

                        <Tabs defaultValue="available" className="w-full animate-fade-in" style={{ animationDelay: "100ms" }}>
                            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-8">
                                <TabsTrigger value="available">{t.availableNow}</TabsTrigger>
                                <TabsTrigger value="coming">{t.comingSoon}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="available" className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {t.integrations.available.map((integration, index) => {
                                        const Icon = integration.icon;
                                        return (
                                            <Card key={index} className="overflow-hidden">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-md flex items-center justify-center bg-muted ${integration.color}`}>
                                                            <Icon className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <CardTitle>{integration.name}</CardTitle>
                                                            <CardDescription className="line-clamp-1">{integration.description}</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2 mb-4">
                                                        {integration.features.map((feature, fIndex) => (
                                                            <div key={fIndex} className="flex items-center gap-2">
                                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                                <span className="text-sm">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3 mt-6">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/docs/integrations/${integration.name.toLowerCase()}`}>
                                                                {t.viewDoc}
                                                            </Link>
                                                        </Button>
                                                        <Button asChild size="sm">
                                                            <Link href="/dashboard">
                                                                {t.getStarted}
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </TabsContent>

                            <TabsContent value="coming" className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {t.integrations.coming.map((integration, index) => {
                                        const Icon = integration.icon;
                                        return (
                                            <Card key={index} className="overflow-hidden relative">
                                                <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md">
                                                    {t.comingSoon}
                                                </div>
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-md flex items-center justify-center bg-muted ${integration.color}`}>
                                                            <Icon className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <CardTitle>{integration.name}</CardTitle>
                                                            <CardDescription className="line-clamp-1">{integration.description}</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2 mb-4">
                                                        {integration.features.map((feature, fIndex) => (
                                                            <div key={fIndex} className="flex items-center gap-2">
                                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                                <span className="text-sm">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Button asChild size="sm" variant="outline" className="w-full mt-4">
                                                        <Link href="/roadmap">
                                                            {t.readMore}
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-20 max-w-3xl mx-auto text-center bg-muted/30 p-8 rounded-lg animate-fade-in" style={{ animationDelay: "300ms" }}>
                            <h2 className="text-2xl font-bold mb-3">{t.requestIntegration}</h2>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                {t.requestDescription}
                            </p>
                            <Button asChild>
                                <Link href="/contact">
                                    {t.contact}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 