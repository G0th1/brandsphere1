"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Språkdata
const translations = {
    en: {
        title: "Features",
        subtitle: "Discover all the powerful features BrandSphereAI offers",
        cta: "Ready to get started?",
        ctaButton: "Sign up now",
        dashboardButton: "Go to dashboard",
        languageToggle: "Switch to Swedish",
        features: [
            {
                title: "AI-Powered Content Generation",
                description: "Create high-quality, engaging content in seconds with our advanced AI technology.",
                icon: CheckCircle2,
            },
            {
                title: "Brand Voice Customization",
                description: "Ensure all your content maintains a consistent brand voice across all channels.",
                icon: CheckCircle2,
            },
            {
                title: "Multi-Platform Support",
                description: "Generate content optimized for social media, blogs, emails, and more.",
                icon: CheckCircle2,
            },
            {
                title: "Analytics Dashboard",
                description: "Track performance and engagement metrics for all your content.",
                icon: CheckCircle2,
            },
            {
                title: "SEO Optimization",
                description: "Automatically optimize your content for better search engine rankings.",
                icon: CheckCircle2,
            },
            {
                title: "Collaborative Workspace",
                description: "Work with your team in real-time to create and edit content.",
                icon: CheckCircle2,
            },
            {
                title: "Content Calendar",
                description: "Plan and schedule your content across multiple platforms.",
                icon: CheckCircle2,
            },
            {
                title: "Custom Templates",
                description: "Create and save templates for frequently used content types.",
                icon: CheckCircle2,
            },
        ]
    },
    sv: {
        title: "Funktioner",
        subtitle: "Upptäck alla kraftfulla funktioner som BrandSphereAI erbjuder",
        cta: "Redo att komma igång?",
        ctaButton: "Registrera dig nu",
        dashboardButton: "Gå till instrumentpanelen",
        languageToggle: "Byt till engelska",
        features: [
            {
                title: "AI-driven innehållsgenerering",
                description: "Skapa högkvalitativt, engagerande innehåll på sekunder med vår avancerade AI-teknik.",
                icon: CheckCircle2,
            },
            {
                title: "Anpassning av varumärkesröst",
                description: "Säkerställ att allt ditt innehåll behåller en konsekvent varumärkesröst över alla kanaler.",
                icon: CheckCircle2,
            },
            {
                title: "Stöd för flera plattformar",
                description: "Generera innehåll optimerat för sociala medier, bloggar, e-post och mer.",
                icon: CheckCircle2,
            },
            {
                title: "Analysinstrumentpanel",
                description: "Spåra prestanda- och engagemangsmått för allt ditt innehåll.",
                icon: CheckCircle2,
            },
            {
                title: "SEO-optimering",
                description: "Optimera automatiskt ditt innehåll för bättre placeringar i sökmotorer.",
                icon: CheckCircle2,
            },
            {
                title: "Kollaborativt arbetsområde",
                description: "Arbeta med ditt team i realtid för att skapa och redigera innehåll.",
                icon: CheckCircle2,
            },
            {
                title: "Innehållskalender",
                description: "Planera och schemalägg ditt innehåll över flera plattformar.",
                icon: CheckCircle2,
            },
            {
                title: "Anpassade mallar",
                description: "Skapa och spara mallar för frekvent använda innehållstyper.",
                icon: CheckCircle2,
            },
        ]
    }
};

export default function FeaturesPage() {
    const [language, setLanguage] = useState<"en" | "sv">("en");
    const t = translations[language];

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "sv" : "en");
    };

    return (
        <div className="container max-w-7xl py-12">
            <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={toggleLanguage}>
                    {t.languageToggle}
                </Button>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">{t.title}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    {t.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {t.features.map((feature, index) => (
                    <Card key={index} className="flex flex-col h-full">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <feature.icon className="h-6 w-6 text-primary" />
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p>{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-muted rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">{t.cta}</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup">
                        <Button size="lg">{t.ctaButton}</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg">
                            {t.dashboardButton}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 