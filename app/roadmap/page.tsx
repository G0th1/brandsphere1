"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

// Översättningar
const translations = {
    en: {
        title: "Product Roadmap",
        subtitle: "See what we're building and our plans for the future",
        current: "Current",
        planned: "Planned",
        considering: "Considering",
        completed: "Completed",
        voteFeatures: "Vote for features",
        voteSubtitle: "We value your input! Let us know which features are most important to you.",
        suggestFeature: "Suggest a feature",
        quarter: "Q",
        viewFeatures: "View all features",
        roadmapItems: [
            {
                title: "Instagram Integration",
                description: "Connect and manage Instagram accounts directly from our platform.",
                status: "planned",
                quarter: "3 2023"
            },
            {
                title: "LinkedIn Integration",
                description: "Connect and manage LinkedIn pages and profiles.",
                status: "planned",
                quarter: "4 2023"
            },
            {
                title: "Advanced Analytics Dashboard",
                description: "Deeper insights into your social media performance with custom reporting.",
                status: "current",
                quarter: "2 2023"
            },
            {
                title: "AI-Powered Content Suggestions",
                description: "Get intelligent suggestions for content based on your audience engagement.",
                status: "current",
                quarter: "2 2023"
            },
            {
                title: "Facebook Integration",
                description: "Connect and manage Facebook pages and groups.",
                status: "completed",
                quarter: "1 2023"
            },
            {
                title: "YouTube Integration",
                description: "Connect and manage YouTube channels.",
                status: "completed",
                quarter: "1 2023"
            },
            {
                title: "TikTok Integration",
                description: "Connect and manage TikTok accounts.",
                status: "considering",
                quarter: "1 2024"
            },
            {
                title: "Team Collaboration Tools",
                description: "Enhanced tools for teams to work together on content planning and creation.",
                status: "planned",
                quarter: "3 2023"
            },
            {
                title: "Content Calendar",
                description: "A visual calendar for planning and scheduling your content.",
                status: "completed",
                quarter: "4 2022"
            },
            {
                title: "Mobile App",
                description: "Access BrandSphereAI on the go with our mobile app.",
                status: "planned",
                quarter: "1 2024"
            }
        ]
    },
    sv: {
        title: "Produktplan",
        subtitle: "Se vad vi bygger och våra planer för framtiden",
        current: "Pågående",
        planned: "Planerad",
        considering: "Överväger",
        completed: "Genomförd",
        voteFeatures: "Rösta på funktioner",
        voteSubtitle: "Vi värdesätter din åsikt! Låt oss veta vilka funktioner som är viktigast för dig.",
        suggestFeature: "Föreslå en funktion",
        quarter: "Kv",
        viewFeatures: "Visa alla funktioner",
        roadmapItems: [
            {
                title: "Instagram-integration",
                description: "Anslut och hantera Instagram-konton direkt från vår plattform.",
                status: "planned",
                quarter: "3 2023"
            },
            {
                title: "LinkedIn-integration",
                description: "Anslut och hantera LinkedIn-sidor och profiler.",
                status: "planned",
                quarter: "4 2023"
            },
            {
                title: "Avancerad analysdashboard",
                description: "Djupare insikter om dina sociala mediers prestanda med anpassad rapportering.",
                status: "current",
                quarter: "2 2023"
            },
            {
                title: "AI-drivna innehållsförslag",
                description: "Få intelligenta förslag på innehåll baserat på ditt publikengagemang.",
                status: "current",
                quarter: "2 2023"
            },
            {
                title: "Facebook-integration",
                description: "Anslut och hantera Facebook-sidor och grupper.",
                status: "completed",
                quarter: "1 2023"
            },
            {
                title: "YouTube-integration",
                description: "Anslut och hantera YouTube-kanaler.",
                status: "completed",
                quarter: "1 2023"
            },
            {
                title: "TikTok-integration",
                description: "Anslut och hantera TikTok-konton.",
                status: "considering",
                quarter: "1 2024"
            },
            {
                title: "Teamsamarbetsverktyg",
                description: "Förbättrade verktyg för team att samarbeta kring innehållsplanering och skapande.",
                status: "planned",
                quarter: "3 2023"
            },
            {
                title: "Innehållskalender",
                description: "En visuell kalender för planering och schemaläggning av ditt innehåll.",
                status: "completed",
                quarter: "4 2022"
            },
            {
                title: "Mobilapp",
                description: "Få tillgång till BrandSphereAI på språng med vår mobilapp.",
                status: "planned",
                quarter: "1 2024"
            }
        ]
    }
};

export default function RoadmapPage() {
    const { language } = useLanguage();
    const t = translations[language];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'current':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'planned':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'considering':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'current':
                return t.current;
            case 'planned':
                return t.planned;
            case 'considering':
                return t.considering;
            case 'completed':
                return t.completed;
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                                {t.title}
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
                            <div className="p-4 border rounded-lg bg-blue-50/50">
                                <h3 className="font-semibold text-blue-700 mb-2">{t.current}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t.roadmapItems.filter(item => item.status === 'current').length} {language === 'en' ? 'features' : 'funktioner'}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg bg-purple-50/50">
                                <h3 className="font-semibold text-purple-700 mb-2">{t.planned}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t.roadmapItems.filter(item => item.status === 'planned').length} {language === 'en' ? 'features' : 'funktioner'}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg bg-amber-50/50">
                                <h3 className="font-semibold text-amber-700 mb-2">{t.considering}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t.roadmapItems.filter(item => item.status === 'considering').length} {language === 'en' ? 'features' : 'funktioner'}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg bg-green-50/50">
                                <h3 className="font-semibold text-green-700 mb-2">{t.completed}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t.roadmapItems.filter(item => item.status === 'completed').length} {language === 'en' ? 'features' : 'funktioner'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                            {['current', 'planned', 'considering', 'completed'].map((status) => (
                                <div key={status}>
                                    <h2 className="text-2xl font-bold mb-4">{getStatusText(status)}</h2>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {t.roadmapItems
                                            .filter(item => item.status === status)
                                            .map((item, index) => (
                                                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Badge className={`${getStatusColor(item.status)}`}>
                                                            {getStatusText(item.status)}
                                                        </Badge>
                                                        <Badge variant="outline" className="ml-2">
                                                            {t.quarter} {item.quarter}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 p-6 border rounded-lg bg-muted/30 animate-fade-in" style={{ animationDelay: "300ms" }}>
                            <div className="text-center max-w-2xl mx-auto">
                                <h2 className="text-2xl font-bold mb-4">{t.voteFeatures}</h2>
                                <p className="text-muted-foreground mb-6">
                                    {t.voteSubtitle}
                                </p>
                                <Button asChild>
                                    <Link href="/contact">
                                        {t.suggestFeature}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 