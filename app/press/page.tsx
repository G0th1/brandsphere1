"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"

// Översättningar
const translations = {
    en: {
        title: "Press & Media",
        subtitle: "Resources and information for press and media inquiries",
        contactTitle: "Media Contact",
        contactName: "Maria Andersson",
        contactRole: "Head of PR & Communications",
        contactEmail: "press@brandsphereai.com",
        pressKit: "Download Press Kit",
        newsTitle: "Press Releases",
        mediaResources: "Media Resources",
        inTheNews: "BrandSphereAI in the News",
        pressReleases: [
            {
                title: "BrandSphereAI Raises $5M in Seed Funding to Transform Social Media Marketing with AI",
                date: "April 15, 2023",
                summary: "BrandSphereAI announces the completion of a $5M seed funding round led by Tech Ventures Capital with participation from several angel investors to accelerate platform development and market expansion.",
                link: "#"
            },
            {
                title: "BrandSphereAI Launches Revolutionary AI-Powered Social Media Management Platform",
                date: "January 10, 2023",
                summary: "Today marks the official launch of BrandSphereAI, a groundbreaking platform that uses artificial intelligence to streamline social media content creation, scheduling, and analytics for businesses of all sizes.",
                link: "#"
            },
            {
                title: "BrandSphereAI Introduces YouTube and Facebook Integration",
                date: "June 22, 2023",
                summary: "BrandSphereAI expands its platform capabilities with comprehensive YouTube and Facebook integration, allowing users to manage video content and engagement across multiple platforms from a single dashboard.",
                link: "#"
            }
        ],
        newsArticles: [
            {
                title: "The Future of Social Media Management: How AI is Changing the Game",
                publication: "Tech Insider",
                date: "May 28, 2023",
                link: "#"
            },
            {
                title: "10 AI Tools That Are Revolutionizing Digital Marketing in 2023",
                publication: "Marketing Weekly",
                date: "March 12, 2023",
                link: "#"
            },
            {
                title: "BrandSphereAI Named One of the Most Promising AI Startups to Watch",
                publication: "StartupWatch",
                date: "February 5, 2023",
                link: "#"
            }
        ],
        resources: [
            {
                title: "Logo & Brand Assets",
                description: "Download our logo in various formats, brand guidelines, and approved imagery for publication.",
                buttonText: "Download Assets"
            },
            {
                title: "Executive Bios & Photos",
                description: "Professional biographies and high-resolution photos of our leadership team.",
                buttonText: "View Team"
            },
            {
                title: "Product Screenshots",
                description: "High-resolution screenshots of the BrandSphereAI platform and its key features.",
                buttonText: "View Gallery"
            }
        ]
    },
    sv: {
        title: "Press & Media",
        subtitle: "Resurser och information för press- och medieförfrågningar",
        contactTitle: "Mediekontakt",
        contactName: "Maria Andersson",
        contactRole: "Chef för PR & Kommunikation",
        contactEmail: "press@brandsphereai.com",
        pressKit: "Ladda ned presskit",
        newsTitle: "Pressmeddelanden",
        mediaResources: "Medieresurser",
        inTheNews: "BrandSphereAI i nyheterna",
        pressReleases: [
            {
                title: "BrandSphereAI samlar in 5 miljoner dollar i såddfinansiering för att förvandla marknadsföring i sociala medier med AI",
                date: "15 april, 2023",
                summary: "BrandSphereAI meddelar slutförandet av en såddfinansieringsrunda på 5 miljoner dollar ledd av Tech Ventures Capital med deltagande från flera affärsänglar för att accelerera plattformsutveckling och marknadsexpansion.",
                link: "#"
            },
            {
                title: "BrandSphereAI lanserar revolutionerande AI-driven plattform för hantering av sociala medier",
                date: "10 januari, 2023",
                summary: "Idag markerar den officiella lanseringen av BrandSphereAI, en banbrytande plattform som använder artificiell intelligens för att effektivisera innehållsskapande, schemaläggning och analys av sociala medier för företag av alla storlekar.",
                link: "#"
            },
            {
                title: "BrandSphereAI introducerar YouTube- och Facebook-integration",
                date: "22 juni, 2023",
                summary: "BrandSphereAI utökar sina plattformsfunktioner med omfattande YouTube- och Facebook-integration, vilket gör det möjligt för användare att hantera videoinnehåll och engagemang över flera plattformar från en enda instrumentpanel.",
                link: "#"
            }
        ],
        newsArticles: [
            {
                title: "Framtiden för hantering av sociala medier: Hur AI förändrar spelet",
                publication: "Tech Insider",
                date: "28 maj, 2023",
                link: "#"
            },
            {
                title: "10 AI-verktyg som revolutionerar digital marknadsföring 2023",
                publication: "Marketing Weekly",
                date: "12 mars, 2023",
                link: "#"
            },
            {
                title: "BrandSphereAI utsedd till ett av de mest lovande AI-startups att hålla ögonen på",
                publication: "StartupWatch",
                date: "5 februari, 2023",
                link: "#"
            }
        ],
        resources: [
            {
                title: "Logotyp & varumärkestillgångar",
                description: "Ladda ned vår logotyp i olika format, varumärkesriktlinjer och godkända bilder för publicering.",
                buttonText: "Ladda ned tillgångar"
            },
            {
                title: "Ledningsbiografier & foton",
                description: "Professionella biografier och högupplösta foton av vårt ledningsteam.",
                buttonText: "Visa team"
            },
            {
                title: "Produktskärmbilder",
                description: "Högupplösta skärmbilder av BrandSphereAI-plattformen och dess nyckelfunktioner.",
                buttonText: "Visa galleri"
            }
        ]
    }
};

export default function PressPage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center max-w-[800px] mx-auto mb-10">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                                {t.title}
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl">
                                {t.subtitle}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 md:grid-cols-2 items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight mb-6">{t.contactTitle}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-semibold text-lg">{t.contactName}</p>
                                        <p className="text-primary">{t.contactRole}</p>
                                        <p className="text-muted-foreground mt-1">{t.contactEmail}</p>
                                    </div>
                                    <div className="mt-6">
                                        <Button>
                                            {t.pressKit} <span className="ml-2">↓</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[300px] bg-muted/30 rounded-lg overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-4xl font-bold text-primary/30">
                                        BrandSphereAI
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8">
                            {t.newsTitle}
                        </h2>
                        <div className="space-y-8">
                            {t.pressReleases.map((release, index) => (
                                <Card key={index} className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        <div className="md:w-28 flex-shrink-0">
                                            <p className="text-sm text-muted-foreground">
                                                {release.date}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">
                                                {release.title}
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                {release.summary}
                                            </p>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={release.link}>
                                                    {language === 'en' ? 'Read More' : 'Läs mer'}
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8">
                            {t.inTheNews}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {t.newsArticles.map((article, index) => (
                                <Card key={index} className="p-6">
                                    <h3 className="font-bold mb-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                                        <span>{article.publication}</span>
                                        <span className="mx-2">•</span>
                                        <span>{article.date}</span>
                                    </div>
                                    <Button variant="link" className="p-0" asChild>
                                        <Link href={article.link}>
                                            {language === 'en' ? 'Read Article' : 'Läs artikel'} →
                                        </Link>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8">
                            {t.mediaResources}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {t.resources.map((resource, index) => (
                                <Card key={index} className="p-6">
                                    <h3 className="font-bold text-lg mb-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {resource.description}
                                    </p>
                                    <Button variant="outline">
                                        {resource.buttonText}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-[800px] mx-auto text-center">
                            <h2 className="text-2xl font-bold tracking-tight mb-4">
                                {language === 'en' ? 'Need more information?' : 'Behöver du mer information?'}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {language === 'en'
                                    ? "If you're a journalist or media representative and need additional information, please reach out to our media contact or visit our contact page."
                                    : "Om du är journalist eller medierepresentant och behöver ytterligare information, vänligen kontakta vår mediekontakt eller besök vår kontaktsida."}
                            </p>
                            <Button asChild>
                                <Link href="/contact">
                                    {language === 'en' ? 'Contact Us' : 'Kontakta oss'}
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