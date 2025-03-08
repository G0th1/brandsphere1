"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, Zap, Calendar, BarChart3, FileEdit, MessageSquare, Settings2, Check } from "lucide-react";

// Översättningar
const translations = {
    en: {
        title: "Premium Demo Experience",
        description: "Try all premium features without signing up or providing payment information",
        googleLogin: "Start Premium Demo",
        backToHome: "Back to home",
        loading: "Starting demo...",
        welcome: "Welcome to BrandSphereAI Premium",
        featuresTitle: "Experience these premium features",
        features: [
            "AI-powered content generation",
            "Advanced analytics dashboard",
            "Unlimited social media scheduling",
            "Custom content calendar",
            "Multi-platform publishing",
            "Team collaboration tools"
        ],
        note: "This is a demo environment. No real actions will be taken on your social media accounts."
    },
    sv: {
        title: "Premium Demo-upplevelse",
        description: "Testa alla premiumfunktioner utan att registrera dig eller ange betalningsinformation",
        googleLogin: "Starta Premium Demo",
        backToHome: "Tillbaka till startsidan",
        loading: "Startar demo...",
        welcome: "Välkommen till BrandSphereAI Premium",
        featuresTitle: "Upplev dessa premiumfunktioner",
        features: [
            "AI-driven innehållsgenerering",
            "Avancerad analysdashboard",
            "Obegränsad schemaläggning för sociala medier",
            "Anpassad innehållskalender",
            "Publicering på flera plattformar",
            "Verktyg för teamsamarbete"
        ],
        note: "Detta är en demomiljö. Inga verkliga åtgärder kommer att utföras på dina sociala mediekonton."
    }
};

export default function DemoLoginPage() {
    const { language } = useLanguage();
    const t = translations[language === 'sv' ? 'sv' : 'en'];
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Simulera inloggning med Google
    const handleStartDemo = () => {
        setIsLoading(true);

        // Lagra demo-användarinformation i localStorage
        localStorage.setItem('demoUser', JSON.stringify({
            id: 'demo-user-123',
            email: 'demo@example.com',
            name: 'Demo User',
            subscription_tier: 'premium',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo123',
            demo_mode: true,
            language: language // Lagra användarens språkpreferens
        }));

        // Simulera inladdningstid för att göra det mer realistiskt
        setTimeout(() => {
            // Omdirigera till demo-dashboard
            router.push("/demo/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-10">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center max-w-5xl mx-auto">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                                <Zap className="h-4 w-4" />
                                <span>Premium Demo</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                {t.title}
                            </h1>
                            <p className="text-muted-foreground md:text-xl">
                                {t.description}
                            </p>

                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    onClick={handleStartDemo}
                                    disabled={isLoading}
                                    className="w-full md:w-auto"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            {t.loading}
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                                            {t.googleLogin}
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground pt-2">
                                {t.note}
                            </p>
                        </div>

                        <Card className="border-2 border-muted">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    {t.featuresTitle}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <span className="font-medium">{t.features[0]}</span>
                                            <p className="text-sm text-muted-foreground">
                                                {language === 'sv' ?
                                                    'Skapa engagerande innehåll automatiskt med vår AI' :
                                                    'Automatically create engaging content with our AI'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <span className="font-medium">{t.features[1]}</span>
                                            <p className="text-sm text-muted-foreground">
                                                {language === 'sv' ?
                                                    'Få detaljerade insikter om din prestanda' :
                                                    'Get detailed insights about your performance'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FileEdit className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <span className="font-medium">{t.features[2]}</span>
                                            <p className="text-sm text-muted-foreground">
                                                {language === 'sv' ?
                                                    'Schemalägg inlägg utan begränsningar' :
                                                    'Schedule posts without limitations'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <span className="font-medium">{t.features[3]}</span>
                                            <p className="text-sm text-muted-foreground">
                                                {language === 'sv' ?
                                                    'Visualisera din innehållsstrategi med vår kalender' :
                                                    'Visualize your content strategy with our calendar'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Settings2 className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <span className="font-medium">{t.features[5]}</span>
                                            <p className="text-sm text-muted-foreground">
                                                {language === 'sv' ?
                                                    'Samarbeta med ditt team i realtid' :
                                                    'Collaborate with your team in real-time'}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <Button variant="outline" className="w-full" onClick={handleStartDemo} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.loading}
                                        </>
                                    ) : (
                                        t.googleLogin
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 