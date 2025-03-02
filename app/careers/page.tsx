"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"

// Översättningar
const translations = {
    en: {
        title: "Join Our Team",
        subtitle: "Build the future of social media marketing with us",
        workWithUs: "Why Work With Us",
        workWithUsSubtitle: "We're on a mission to transform how businesses utilize social media, and we need talented individuals to help us get there.",
        benefits: "Benefits & Perks",
        openPositions: "Open Positions",
        apply: "Apply Now",
        noPositions: "No open positions at the moment. Check back later or send us your resume!",
        sendResume: "Send Your Resume",
        benefitsList: [
            {
                title: "Flexible Work",
                description: "Work from home, our office, or anywhere in between with our flexible work policy."
            },
            {
                title: "Competitive Salary",
                description: "We offer competitive compensation packages including equity options."
            },
            {
                title: "Health Benefits",
                description: "Comprehensive health, dental, and vision coverage for you and your dependents."
            },
            {
                title: "Learning Budget",
                description: "Annual budget for courses, books, and conferences to support your professional growth."
            },
            {
                title: "Team Events",
                description: "Regular team building activities, retreats, and social events."
            },
            {
                title: "Work-Life Balance",
                description: "We respect your time off and encourage a healthy work-life balance."
            }
        ],
        positions: [
            {
                title: "Senior Frontend Developer",
                location: "Remote (EU Time Zone)",
                type: "Full-time",
                description: "We're looking for an experienced frontend developer to help build beautiful, responsive, and accessible user interfaces for our platform using React, Next.js, and TypeScript.",
                requirements: [
                    "5+ years of experience with React and modern JavaScript",
                    "Experience with Next.js, TypeScript, and TailwindCSS",
                    "Strong understanding of web accessibility and performance optimization",
                    "Excellent communication skills and ability to work in a remote team"
                ]
            },
            {
                title: "AI/ML Engineer",
                location: "Remote (EU Time Zone)",
                type: "Full-time",
                description: "Join our AI team to develop and improve the machine learning models that power our content generation, scheduling optimization, and engagement analysis features.",
                requirements: [
                    "3+ years of experience in machine learning and natural language processing",
                    "Proficiency in Python and ML frameworks (PyTorch, TensorFlow)",
                    "Experience with large language models and content generation",
                    "Knowledge of data processing and model deployment pipelines"
                ]
            },
            {
                title: "Product Marketing Manager",
                location: "Remote (EU Time Zone)",
                type: "Full-time",
                description: "Help us tell the world about our product! You'll work closely with the product and marketing teams to develop messaging, create content, and drive user adoption.",
                requirements: [
                    "3+ years of experience in product marketing, preferably in SaaS or marketing tech",
                    "Excellent writing and communication skills",
                    "Experience with go-to-market strategies and product launches",
                    "Understanding of social media marketing landscape"
                ]
            }
        ]
    },
    sv: {
        title: "Bli en del av vårt team",
        subtitle: "Bygg framtidens sociala marknadsföring med oss",
        workWithUs: "Varför arbeta med oss",
        workWithUsSubtitle: "Vi har som uppdrag att förändra hur företag använder sociala medier, och vi behöver talangfulla individer för att hjälpa oss nå dit.",
        benefits: "Förmåner",
        openPositions: "Lediga tjänster",
        apply: "Ansök nu",
        noPositions: "Inga lediga tjänster för tillfället. Kom tillbaka senare eller skicka in ditt CV!",
        sendResume: "Skicka ditt CV",
        benefitsList: [
            {
                title: "Flexibelt arbete",
                description: "Arbeta hemifrån, från vårt kontor eller var som helst däremellan med vår flexibla arbetspolicy."
            },
            {
                title: "Konkurrenskraftig lön",
                description: "Vi erbjuder konkurrenskraftiga ersättningspaket inklusive optioner."
            },
            {
                title: "Hälsoförmåner",
                description: "Omfattande sjukvårds-, tandvårds- och synundersökningsskydd för dig och dina anhöriga."
            },
            {
                title: "Utbildningsbudget",
                description: "Årlig budget för kurser, böcker och konferenser för att stödja din professionella utveckling."
            },
            {
                title: "Teamaktiviteter",
                description: "Regelbundna teambuilding-aktiviteter, reträtter och sociala evenemang."
            },
            {
                title: "Balans mellan arbete och fritid",
                description: "Vi respekterar din lediga tid och uppmuntrar en hälsosam balans mellan arbete och fritid."
            }
        ],
        positions: [
            {
                title: "Senior Frontend-utvecklare",
                location: "Distans (EU-tidszon)",
                type: "Heltid",
                description: "Vi söker en erfaren frontend-utvecklare för att hjälpa till att bygga vackra, responsiva och tillgängliga användargränssnitt för vår plattform med React, Next.js och TypeScript.",
                requirements: [
                    "5+ års erfarenhet med React och modern JavaScript",
                    "Erfarenhet av Next.js, TypeScript och TailwindCSS",
                    "God förståelse för webbtillgänglighet och prestandaoptimering",
                    "Utmärkta kommunikationsförmågor och förmåga att arbeta i ett distansteam"
                ]
            },
            {
                title: "AI/ML-ingenjör",
                location: "Distans (EU-tidszon)",
                type: "Heltid",
                description: "Gå med i vårt AI-team för att utveckla och förbättra de maskininlärningsmodeller som driver våra funktioner för innehållsgenerering, schemaläggningsoptimering och engagemangsanalys.",
                requirements: [
                    "3+ års erfarenhet inom maskininlärning och naturlig språkbehandling",
                    "Skicklighet i Python och ML-ramverk (PyTorch, TensorFlow)",
                    "Erfarenhet av stora språkmodeller och innehållsgenerering",
                    "Kunskap om databehandling och modellspridningspipelines"
                ]
            },
            {
                title: "Produktmarknadsföringschef",
                location: "Distans (EU-tidszon)",
                type: "Heltid",
                description: "Hjälp oss berätta för världen om vår produkt! Du kommer att arbeta nära produkt- och marknadsföringsteamen för att utveckla budskap, skapa innehåll och driva användaracceptans.",
                requirements: [
                    "3+ års erfarenhet inom produktmarknadsföring, helst inom SaaS eller marknadsföringsteknik",
                    "Utmärkta skriv- och kommunikationsförmågor",
                    "Erfarenhet av go-to-market-strategier och produktlanseringar",
                    "Förståelse för sociala mediers marknadsföringslandskap"
                ]
            }
        ]
    }
};

export default function CareersPage() {
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
                        <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight mb-4">{t.workWithUs}</h2>
                                <p className="text-muted-foreground mb-6">
                                    {t.workWithUsSubtitle}
                                </p>
                                <p className="text-muted-foreground">
                                    {language === 'en'
                                        ? "Our team is distributed across Europe, with a hybrid work culture that values autonomy, collaboration, and work-life balance. We're a diverse group of individuals passionate about technology, marketing, and creating tools that make our users' lives easier."
                                        : "Vårt team är utspritt över Europa, med en hybridarbetskultur som värdesätter autonomi, samarbete och balans mellan arbete och fritid. Vi är en mångfaldig grupp individer som är passionerade inom teknik, marknadsföring och att skapa verktyg som gör våra användares liv enklare."}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        20+
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {language === 'en' ? "Team Members" : "Teammedlemmar"}
                                    </div>
                                </div>
                                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        8
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {language === 'en' ? "Countries" : "Länder"}
                                    </div>
                                </div>
                                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        4
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {language === 'en' ? "Years of Growth" : "År av tillväxt"}
                                    </div>
                                </div>
                                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        100%
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {language === 'en' ? "Remote Friendly" : "Distansvänligt"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
                            {t.benefits}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {t.benefitsList.map((benefit, index) => (
                                <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
                            {t.openPositions}
                        </h2>

                        {t.positions.length > 0 ? (
                            <div className="space-y-6">
                                {t.positions.map((position, index) => (
                                    <Card key={index} className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{position.title}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-sm text-muted-foreground">{position.location}</span>
                                                    <span className="text-sm text-muted-foreground">•</span>
                                                    <span className="text-sm text-muted-foreground">{position.type}</span>
                                                </div>
                                            </div>
                                            <Button className="mt-4 md:mt-0">
                                                {t.apply}
                                            </Button>
                                        </div>
                                        <p className="text-muted-foreground mb-4">
                                            {position.description}
                                        </p>
                                        <div>
                                            <h4 className="font-semibold mb-2">
                                                {language === 'en' ? "Requirements:" : "Krav:"}
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                                {position.requirements.map((req, reqIndex) => (
                                                    <li key={reqIndex}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-muted/20 rounded-lg">
                                <p className="text-muted-foreground mb-6">{t.noPositions}</p>
                                <Button asChild>
                                    <Link href="/contact">
                                        {t.sendResume}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-[800px] mx-auto text-center">
                            <h2 className="text-2xl font-bold tracking-tight mb-4">
                                {language === 'en' ? "Don't see a position that fits?" : "Hittar du ingen position som passar?"}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {language === 'en'
                                    ? "We're always on the lookout for talented individuals. If you think you'd be a great addition to our team, we'd love to hear from you."
                                    : "Vi letar alltid efter talangfulla individer. Om du tror att du skulle vara ett bra tillskott till vårt team vill vi gärna höra från dig."}
                            </p>
                            <Button asChild>
                                <Link href="/contact">
                                    {language === 'en' ? "Get in Touch" : "Kontakta oss"}
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