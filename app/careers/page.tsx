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
        title: "Collaboration Opportunities",
        subtitle: "Join me in building the future of social media marketing",
        workWithUs: "Why Collaborate With BrandSphereAI",
        workWithUsSubtitle: "I'm on a mission to transform how businesses utilize social media, and I'm looking for passionate individuals to collaborate with.",
        benefits: "Benefits of Collaboration",
        openPositions: "Available Opportunities",
        apply: "Apply Now",
        noPositions: "No open positions at the moment. Check back later or send your resume!",
        sendResume: "Contact Me",
        benefitsList: [
            {
                title: "Flexible Work",
                description: "Work from anywhere with a flexible schedule that fits your lifestyle."
            },
            {
                title: "Competitive Compensation",
                description: "Fair payment for your contributions based on your role and experience."
            },
            {
                title: "Professional Growth",
                description: "Gain valuable experience working with cutting-edge AI technology and social media marketing."
            },
            {
                title: "Learning Opportunities",
                description: "Access to resources and mentorship to support your professional development."
            },
            {
                title: "Be Part of Something New",
                description: "Help shape an innovative product from its early stages and make a real impact."
            },
            {
                title: "Work-Life Balance",
                description: "I respect your time and encourage a healthy work-life balance."
            }
        ],
        positions: [
            {
                title: "Brand Ambassador",
                location: "Remote",
                type: "Part-time / Flexible",
                description: "Help spread the word about BrandSphereAI by representing the platform at events, on social media, and within your network. You'll be the face and voice of the brand to potential users.",
                requirements: [
                    "Strong presence on social media platforms",
                    "Excellent communication and networking skills",
                    "Passion for social media marketing and AI tools",
                    "Ability to create engaging content about the platform"
                ]
            },
            {
                title: "Content Creator",
                location: "Remote",
                type: "Project-based",
                description: "Create high-quality blog posts, videos, tutorials, and social media content that showcases the features and benefits of BrandSphereAI to potential users.",
                requirements: [
                    "Experience creating marketing content for digital products",
                    "Strong writing and/or video production skills",
                    "Understanding of social media marketing concepts",
                    "Ability to explain technical features in an accessible way"
                ]
            },
            {
                title: "Beta Tester",
                location: "Remote",
                type: "Part-time / Flexible",
                description: "Test new features before they're released to the public, provide feedback on user experience, and help identify and report bugs or usability issues.",
                requirements: [
                    "Experience with social media management tools",
                    "Attention to detail and analytical thinking",
                    "Ability to provide clear, constructive feedback",
                    "Interest in helping improve product usability"
                ]
            },
            {
                title: "Mentor/Advisor",
                location: "Remote",
                type: "Flexible",
                description: "Share your expertise in areas such as AI, social media marketing, business development, or startup growth to help shape the strategic direction of BrandSphereAI.",
                requirements: [
                    "Significant experience in relevant industry (social media, AI, SaaS)",
                    "Track record of success in your field",
                    "Strategic thinking and problem-solving skills",
                    "Willingness to provide honest guidance and feedback"
                ]
            },
            {
                title: "Student Intern",
                location: "Remote",
                type: "Part-time / Flexible",
                description: "Gain real-world experience working on various aspects of a tech startup while contributing to the growth of BrandSphereAI through projects aligned with your skills and interests.",
                requirements: [
                    "Currently enrolled in a relevant degree program",
                    "Basic understanding of digital marketing, development, or business",
                    "Eagerness to learn and apply new skills",
                    "Self-motivated with good time management skills"
                ]
            }
        ]
    },
    sv: {
        title: "Samarbetsmöjligheter",
        subtitle: "Hjälp mig bygga framtidens sociala marknadsföring",
        workWithUs: "Varför samarbeta med BrandSphereAI",
        workWithUsSubtitle: "Jag har som uppdrag att förändra hur företag använder sociala medier, och jag söker passionerade individer att samarbeta med.",
        benefits: "Fördelar med samarbete",
        openPositions: "Tillgängliga möjligheter",
        apply: "Ansök nu",
        noPositions: "Inga lediga möjligheter för tillfället. Kom tillbaka senare eller kontakta mig!",
        sendResume: "Kontakta mig",
        benefitsList: [
            {
                title: "Flexibelt arbete",
                description: "Arbeta varifrån du vill med ett flexibelt schema som passar din livsstil."
            },
            {
                title: "Konkurrenskraftig ersättning",
                description: "Rättvis betalning för dina bidrag baserat på din roll och erfarenhet."
            },
            {
                title: "Professionell utveckling",
                description: "Få värdefull erfarenhet av att arbeta med toppmodern AI-teknik och marknadsföring i sociala medier."
            },
            {
                title: "Inlärningsmöjligheter",
                description: "Tillgång till resurser och mentorskap för att stödja din professionella utveckling."
            },
            {
                title: "Var del av något nytt",
                description: "Hjälp till att forma en innovativ produkt från dess tidiga stadier och göra verklig skillnad."
            },
            {
                title: "Balans mellan arbete och fritid",
                description: "Jag respekterar din tid och uppmuntrar en hälsosam balans mellan arbete och fritid."
            }
        ],
        positions: [
            {
                title: "Varumärkesambassadör",
                location: "Distans",
                type: "Deltid / Flexibel",
                description: "Hjälp till att sprida ordet om BrandSphereAI genom att representera plattformen vid evenemang, på sociala medier och inom ditt nätverk. Du kommer att vara ansiktet och rösten för varumärket mot potentiella användare.",
                requirements: [
                    "Stark närvaro på sociala medieplattformar",
                    "Utmärkta kommunikations- och nätverksfärdigheter",
                    "Passion för marknadsföring i sociala medier och AI-verktyg",
                    "Förmåga att skapa engagerande innehåll om plattformen"
                ]
            },
            {
                title: "Innehållsskapare",
                location: "Distans",
                type: "Projektbaserad",
                description: "Skapa högkvalitativa blogginlägg, videor, handledningar och innehåll för sociala medier som visar funktionerna och fördelarna med BrandSphereAI för potentiella användare.",
                requirements: [
                    "Erfarenhet av att skapa marknadsföringsinnehåll för digitala produkter",
                    "Starka skriv- och/eller videoproduktionsfärdigheter",
                    "Förståelse för marknadsföringskoncept i sociala medier",
                    "Förmåga att förklara tekniska funktioner på ett tillgängligt sätt"
                ]
            },
            {
                title: "Betatestare",
                location: "Distans",
                type: "Deltid / Flexibel",
                description: "Testa nya funktioner innan de släpps till allmänheten, ge feedback om användarupplevelsen och hjälp till att identifiera och rapportera buggar eller användbarhetsproblem.",
                requirements: [
                    "Erfarenhet av hanteringsverktyg för sociala medier",
                    "Uppmärksamhet på detaljer och analytiskt tänkande",
                    "Förmåga att ge tydlig, konstruktiv feedback",
                    "Intresse av att hjälpa till att förbättra produktens användbarhet"
                ]
            },
            {
                title: "Mentor/Rådgivare",
                location: "Distans",
                type: "Flexibel",
                description: "Dela din expertis inom områden som AI, marknadsföring i sociala medier, affärsutveckling eller startup-tillväxt för att hjälpa till att forma den strategiska riktningen för BrandSphereAI.",
                requirements: [
                    "Betydande erfarenhet inom relevant bransch (sociala medier, AI, SaaS)",
                    "Framgångshistorik inom ditt område",
                    "Strategiskt tänkande och problemlösningsförmåga",
                    "Vilja att ge ärlig vägledning och feedback"
                ]
            },
            {
                title: "Studentpraktikant",
                location: "Distans",
                type: "Deltid / Flexibel",
                description: "Få verklig erfarenhet av att arbeta med olika aspekter av ett teknikstartup samtidigt som du bidrar till tillväxten av BrandSphereAI genom projekt som är anpassade efter dina färdigheter och intressen.",
                requirements: [
                    "För närvarande inskriven i ett relevant utbildningsprogram",
                    "Grundläggande förståelse för digital marknadsföring, utveckling eller affärsverksamhet",
                    "Iver att lära och tillämpa nya färdigheter",
                    "Självmotiverad med god tidshantering"
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
                                        ? "While BrandSphereAI is an individual venture, I believe in the power of collaboration to create something amazing. I'm looking for passionate individuals who share my vision and want to contribute their skills to help grow this platform into something that truly transforms how businesses approach social media."
                                        : "Även om BrandSphereAI är ett individuellt projekt, tror jag på kraften i samarbete för att skapa något fantastiskt. Jag letar efter passionerade individer som delar min vision och vill bidra med sina färdigheter för att hjälpa till att utveckla denna plattform till något som verkligen förändrar hur företag närmar sig sociala medier."}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-muted/30 rounded-lg flex flex-col items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        1
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2 text-center">
                                        {language === 'en' ? "Dedicated Founder" : "Dedikerad grundare"}
                                    </div>
                                </div>
                                <div className="aspect-square bg-muted/30 rounded-lg flex flex-col items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        5+
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2 text-center">
                                        {language === 'en' ? "Collaboration Roles" : "Samarbetsroller"}
                                    </div>
                                </div>
                                <div className="aspect-square bg-muted/30 rounded-lg flex flex-col items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        100%
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2 text-center">
                                        {language === 'en' ? "Remote Friendly" : "Distansvänligt"}
                                    </div>
                                </div>
                                <div className="aspect-square bg-muted/30 rounded-lg flex flex-col items-center justify-center p-6">
                                    <div className="text-5xl font-bold text-primary">
                                        ∞
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2 text-center">
                                        {language === 'en' ? "Growth Potential" : "Tillväxtpotential"}
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
                                            <Button className="mt-4 md:mt-0" asChild>
                                                <Link href="/contact">
                                                    {t.apply}
                                                </Link>
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
                                {language === 'en' ? "Have another way you'd like to collaborate?" : "Har du ett annat sätt du vill samarbeta på?"}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {language === 'en'
                                    ? "I'm always open to creative collaboration ideas. If you have skills that could benefit BrandSphereAI in ways not listed above, I'd love to hear from you."
                                    : "Jag är alltid öppen för kreativa samarbetsidéer. Om du har färdigheter som kan gynna BrandSphereAI på sätt som inte listas ovan, hör gärna av dig."}
                            </p>
                            <Button asChild>
                                <Link href="/contact">
                                    {language === 'en' ? "Get in Touch" : "Kontakta mig"}
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