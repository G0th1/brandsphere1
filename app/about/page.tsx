"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

// Översättningar
const translations = {
    en: {
        title: "About BrandSphereAI",
        subtitle: "Our mission is to empower businesses to achieve remarkable success on social media through AI-powered solutions.",
        ourStory: "Our Story",
        storyText: [
            "BrandSphereAI was founded in 2022 by a team of digital marketing experts and AI specialists who recognized the challenges businesses face in maintaining consistent, engaging, and effective social media presence.",
            "We built our platform to solve the real problems we experienced firsthand - the time-consuming nature of content creation, the difficulty in maintaining brand consistency across platforms, and the complexity of analyzing performance data from multiple sources.",
            "Today, we're proud to serve thousands of businesses worldwide, helping them save time, increase engagement, and grow their brand presence online with our intelligent AI solutions."
        ],
        ourValues: "Our Values",
        values: [
            {
                title: "Innovation",
                description: "We are committed to staying at the forefront of AI technology and continually enhancing our platform with cutting-edge features."
            },
            {
                title: "Customer Success",
                description: "Your success is our success. We're dedicated to providing tools that deliver measurable results for your business."
            },
            {
                title: "Integrity",
                description: "We believe in transparent business practices, respecting user privacy, and providing honest, reliable service."
            },
            {
                title: "Accessibility",
                description: "We design our tools to be intuitive and accessible to businesses of all sizes, regardless of technical expertise."
            }
        ],
        team: "Our Team",
        joinTeam: "Join Our Team",
        openings: "View Open Positions",
        contact: "Contact Us",
        teamMembers: [
            {
                name: "Emma Johnson",
                role: "Founder & CEO",
                bio: "Emma has over 15 years of experience in digital marketing and previously led growth at several successful startups."
            },
            {
                name: "Michael Chen",
                role: "CTO",
                bio: "Michael is an AI specialist with a Ph.D. in Machine Learning and previously worked at leading tech companies."
            },
            {
                name: "Sophie Rodriguez",
                role: "Head of Product",
                bio: "Sophie brings 10 years of product management experience and is passionate about creating intuitive user experiences."
            },
            {
                name: "David Kim",
                role: "Head of Customer Success",
                bio: "David ensures our customers get the most from our platform and leads our dedicated support team."
            }
        ]
    },
    sv: {
        title: "Om BrandSphereAI",
        subtitle: "Vår mission är att ge företag möjlighet att uppnå enastående framgång på sociala medier genom AI-drivna lösningar.",
        ourStory: "Vår historia",
        storyText: [
            "BrandSphereAI grundades 2022 av ett team av digitala marknadsföringsexperter och AI-specialister som insåg de utmaningar företag står inför för att upprätthålla en konsekvent, engagerande och effektiv närvaro på sociala medier.",
            "Vi byggde vår plattform för att lösa de verkliga problem vi själva upplevt - den tidskrävande aspekten av innehållsskapande, svårigheten att upprätthålla varumärkeskonsistens över olika plattformar och komplexiteten i att analysera prestandadata från flera källor.",
            "Idag är vi stolta över att betjäna tusentals företag världen över, och hjälpa dem att spara tid, öka engagemang och växa deras varumärkesnärvaro online med våra intelligenta AI-lösningar."
        ],
        ourValues: "Våra värderingar",
        values: [
            {
                title: "Innovation",
                description: "Vi är engagerade i att ligga i framkant inom AI-teknologi och kontinuerligt förbättra vår plattform med banbrytande funktioner."
            },
            {
                title: "Kundframgång",
                description: "Din framgång är vår framgång. Vi är dedikerade till att tillhandahålla verktyg som levererar mätbara resultat för ditt företag."
            },
            {
                title: "Integritet",
                description: "Vi tror på transparenta affärsmetoder, respekterar användarnas integritet och tillhandahåller ärlig, pålitlig service."
            },
            {
                title: "Tillgänglighet",
                description: "Vi designar våra verktyg för att vara intuitiva och tillgängliga för företag av alla storlekar, oavsett teknisk kompetens."
            }
        ],
        team: "Vårt team",
        joinTeam: "Gå med i vårt team",
        openings: "Se lediga tjänster",
        contact: "Kontakta oss",
        teamMembers: [
            {
                name: "Emma Johnson",
                role: "Grundare & VD",
                bio: "Emma har över 15 års erfarenhet inom digital marknadsföring och har tidigare lett tillväxtstrategier på flera framgångsrika startups."
            },
            {
                name: "Michael Chen",
                role: "CTO",
                bio: "Michael är en AI-specialist med en doktorsexamen i maskininlärning och har tidigare arbetat på ledande teknikföretag."
            },
            {
                name: "Sophie Rodriguez",
                role: "Produktchef",
                bio: "Sophie har 10 års erfarenhet av produkthantering och brinner för att skapa intuitiva användarupplevelser."
            },
            {
                name: "David Kim",
                role: "Chef för kundframgång",
                bio: "David säkerställer att våra kunder får ut det mesta av vår plattform och leder vårt dedikerade supportteam."
            }
        ]
    }
};

export default function AboutPage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center max-w-[800px] mx-auto mb-10 animate-fade-in">
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
                        <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center animate-fade-in" style={{ animationDelay: "100ms" }}>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight mb-4">{t.ourStory}</h2>
                                <div className="space-y-4">
                                    {t.storyText.map((paragraph, index) => (
                                        <p key={index} className="text-muted-foreground">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="order-first md:order-last relative">
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted/50 relative">
                                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">B</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
                            {t.ourValues}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "250ms" }}>
                            {t.values.map((value, index) => (
                                <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center animate-fade-in" style={{ animationDelay: "300ms" }}>
                            {t.team}
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "350ms" }}>
                            {t.teamMembers.map((member, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    </div>
                                    <h3 className="font-bold">{member.name}</h3>
                                    <p className="text-sm text-primary mb-2">{member.role}</p>
                                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-[800px] mx-auto text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
                            <h2 className="text-2xl font-bold tracking-tight mb-4">
                                {t.joinTeam}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {language === 'en'
                                    ? "We're always looking for talented individuals to join our team. Check out our current openings."
                                    : "Vi söker alltid efter talangfulla individer att ansluta till vårt team. Kolla in våra nuvarande lediga tjänster."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild>
                                    <Link href="/careers">
                                        {t.openings}
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/contact">
                                        {t.contact}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 