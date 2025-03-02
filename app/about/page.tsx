"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage, useTranslation } from "@/contexts/language-context"

// Översättningar
const translations = {
    en: {
        title: "About BrandSphereAI",
        subtitle: "My mission is to empower businesses to achieve remarkable success on social media through AI-powered solutions.",
        ourStory: "My Story",
        storyText: [
            "BrandSphereAI was founded in 2023 by me, Edvin Göthager, after I recognized the challenges businesses face in maintaining consistent, engaging, and effective social media presence.",
            "I built this platform to solve the real problems I experienced firsthand - the time-consuming nature of content creation, the difficulty in maintaining brand consistency across platforms, and the complexity of analyzing performance data from multiple sources.",
            "Today, I'm proud to provide a solution that helps businesses save time, increase engagement, and grow their brand presence online with intelligent AI solutions."
        ],
        ourValues: "My Values",
        values: [
            {
                title: "Innovation",
                description: "I am committed to staying at the forefront of AI technology and continually enhancing the platform with cutting-edge features."
            },
            {
                title: "Customer Success",
                description: "Your success is my success. I'm dedicated to providing tools that deliver measurable results for your business."
            },
            {
                title: "Integrity",
                description: "I believe in transparent business practices, respecting user privacy, and providing honest, reliable service."
            },
            {
                title: "Accessibility",
                description: "I design my tools to be intuitive and accessible to businesses of all sizes, regardless of technical expertise."
            }
        ],
        team: "Meet the Founder",
        joinTeam: "Join BrandSphereAI",
        openings: "View Collaboration Opportunities",
        contact: "Contact Me",
        founder: {
            name: "Edvin Göthager",
            role: "Founder & Developer",
            bio: "I'm a passionate developer and entrepreneur with a mission to make social media management more efficient through the power of AI. With a background in technology and a keen interest in how businesses operate online, I created BrandSphereAI to solve the everyday challenges businesses face with their social media presence."
        }
    },
    sv: {
        title: "Om BrandSphereAI",
        subtitle: "Min mission är att ge företag möjlighet att uppnå enastående framgång på sociala medier genom AI-drivna lösningar.",
        ourStory: "Min historia",
        storyText: [
            "BrandSphereAI grundades 2023 av mig, Edvin Göthager, efter att jag insåg de utmaningar företag står inför när det gäller att upprätthålla en konsekvent, engagerande och effektiv närvaro på sociala medier.",
            "Jag byggde den här plattformen för att lösa de verkliga problem jag själv upplevt - hur tidskrävande innehållsskapande är, svårigheten att upprätthålla varumärkeskonsistens över olika plattformar och komplexiteten i att analysera prestandadata från flera källor.",
            "Idag är jag stolt över att erbjuda en lösning som hjälper företag att spara tid, öka engagemang och växa sin varumärkesnärvaro online med intelligenta AI-lösningar."
        ],
        ourValues: "Mina värderingar",
        values: [
            {
                title: "Innovation",
                description: "Jag är engagerad i att ligga i framkant av AI-teknologi och att kontinuerligt förbättra plattformen med moderna funktioner."
            },
            {
                title: "Kundframgång",
                description: "Din framgång är min framgång. Jag är dedikerad till att tillhandahålla verktyg som levererar mätbara resultat för ditt företag."
            },
            {
                title: "Integritet",
                description: "Jag tror på transparenta affärsmetoder, respekt för användarnas integritet och att erbjuda ärlig, pålitlig service."
            },
            {
                title: "Tillgänglighet",
                description: "Jag designar mina verktyg för att vara intuitiva och tillgängliga för företag av alla storlekar, oavsett teknisk kompetens."
            }
        ],
        team: "Möt grundaren",
        joinTeam: "Samarbeta med BrandSphereAI",
        openings: "Se samarbetsmöjligheter",
        contact: "Kontakta mig",
        founder: {
            name: "Edvin Göthager",
            role: "Grundare & Utvecklare",
            bio: "Jag är en passionerad utvecklare och entreprenör med målet att göra hantering av sociala medier mer effektivt genom AI. Med en bakgrund inom teknologi och ett stort intresse för hur företag fungerar online, skapade jag BrandSphereAI för att lösa de vardagliga utmaningar företag står inför med sin närvaro på sociala medier."
        }
    }
};

export default function AboutPage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero section */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{t.title}</h1>
                            <p className="text-xl text-muted-foreground max-w-[800px]">{t.subtitle}</p>
                        </div>
                    </div>
                </section>

                {/* Story section */}
                <section className="py-12 md:py-16 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold tracking-tighter">{t.ourStory}</h2>
                                <div className="space-y-4">
                                    {t.storyText.map((paragraph, i) => (
                                        <p key={i} className="text-muted-foreground">{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="relative aspect-video bg-card rounded-lg overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-foreground/20"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-4xl font-bold">BrandSphereAI</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values section */}
                <section className="py-12 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter">{t.ourValues}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {t.values.map((value, i) => (
                                <div key={i} className="bg-card rounded-lg border p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Founder section */}
                <section className="py-12 md:py-16 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter">{t.team}</h2>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                                <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                                        <Image
                                            src="/founder.jpg"
                                            alt={t.founder.name}
                                            width={128}
                                            height={128}
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <h3 className="text-2xl font-bold">{t.founder.name}</h3>
                                        <p className="text-primary font-medium">{t.founder.role}</p>
                                        <p className="text-muted-foreground">{t.founder.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="py-12 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="rounded-xl bg-primary p-8 md:p-10 text-center">
                            <div className="flex flex-col items-center space-y-4 text-primary-foreground">
                                <h2 className="text-3xl font-bold">{t.joinTeam}</h2>
                                <p className="text-primary-foreground/80 max-w-[600px]">
                                    {language === 'en' ?
                                        "Looking to collaborate and help grow BrandSphereAI? Check out the available opportunities to work with me." :
                                        "Vill du samarbeta och hjälpa till att utveckla BrandSphereAI? Kolla in tillgängliga möjligheter att arbeta med mig."
                                    }
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                    <Link href="/careers">
                                        <Button variant="secondary" size="lg">
                                            {t.openings}
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" size="lg">
                                            {t.contact}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 