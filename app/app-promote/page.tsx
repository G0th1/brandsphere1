"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle, ChevronRight, Mail, Smartphone, Check, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Översättningar
const translations = {
    en: {
        title: "Promote BrandSphereAI",
        subtitle: "Earn money by promoting BrandSphereAI to your audience",
        contactTitle: "Get Started",
        contactText: "Interested in becoming a BrandSphereAI promoter? Contact me at:",
        email: "brandsphereai@gmail.com",
        copied: "Copied!",
        copyEmail: "Copy email",
        contactButton: "Send Email",
        howItWorksTitle: "How It Works",
        howItWorksSteps: [
            {
                title: "1. Apply",
                description: "Send me an email telling me a bit about yourself, your audience, and why you're interested in promoting BrandSphereAI."
            },
            {
                title: "2. Get Approved",
                description: "I'll review your application and if it's a good fit, I'll provide you with promotional materials and your unique referral link."
            },
            {
                title: "3. Promote",
                description: "Share BrandSphereAI with your audience through blog posts, social media, videos, or any other channel you prefer."
            },
            {
                title: "4. Earn",
                description: "Earn money for each new customer that signs up through your referral link. Commission rates will be discussed during approval."
            }
        ],
        whyPromoteTitle: "Why Promote BrandSphereAI?",
        whyPromotePoints: [
            {
                title: "Valuable Tool",
                description: "You'll be promoting a genuinely useful tool that helps businesses improve their social media presence."
            },
            {
                title: "Competitive Commission",
                description: "Earn attractive commissions for each successful referral."
            },
            {
                title: "Support & Resources",
                description: "Get promotional materials and support to help you succeed."
            },
            {
                title: "Flexible Promotion",
                description: "Promote in ways that work best for your audience and content style."
            }
        ],
        ideasTitle: "Promotion Ideas",
        ideasText: "Here are some ways you could promote BrandSphereAI:",
        ideas: [
            "Create a review or tutorial of BrandSphereAI on your blog or YouTube channel",
            "Share your experience using the platform on social media",
            "Include BrandSphereAI in roundups of useful social media tools",
            "Host a webinar demonstrating how to use AI for social media management",
            "Share case studies of how BrandSphereAI has helped you or others"
        ],
        faqTitle: "Frequently Asked Questions",
        faqs: [
            {
                question: "Who can become a promoter?",
                answer: "Anyone with an audience interested in social media marketing, content creation, or business productivity tools can apply. This includes bloggers, content creators, social media influencers, and industry professionals."
            },
            {
                question: "How much can I earn?",
                answer: "Commission rates vary depending on your audience and promotion methods. We'll discuss specific rates during the approval process."
            },
            {
                question: "Is there a minimum audience size requirement?",
                answer: "No, quality is more important than quantity. I'm looking for promoters who have an engaged audience that would genuinely benefit from BrandSphereAI."
            },
            {
                question: "How are referrals tracked?",
                answer: "You'll receive a unique referral link that tracks all sign-ups that come through your promotions."
            },
            {
                question: "How and when do I get paid?",
                answer: "Payment details and schedules will be discussed during the approval process. Typically, payments are processed monthly for all qualified referrals."
            }
        ]
    },
    sv: {
        title: "Marknadsför BrandSphereAI",
        subtitle: "Tjäna pengar genom att marknadsföra BrandSphereAI till din publik",
        contactTitle: "Kom igång",
        contactText: "Intresserad av att bli en BrandSphereAI-marknadsförare? Kontakta mig på:",
        email: "brandsphereai@gmail.com",
        copied: "Kopierad!",
        copyEmail: "Kopiera e-post",
        contactButton: "Skicka e-post",
        howItWorksTitle: "Hur det fungerar",
        howItWorksSteps: [
            {
                title: "1. Ansök",
                description: "Skicka ett e-postmeddelande och berätta lite om dig själv, din publik och varför du är intresserad av att marknadsföra BrandSphereAI."
            },
            {
                title: "2. Bli godkänd",
                description: "Jag granskar din ansökan och om det är en bra matchning föser jag dig med marknadsföringsmaterial och din unika referenslänk."
            },
            {
                title: "3. Marknadsför",
                description: "Dela BrandSphereAI med din publik genom blogginlägg, sociala medier, videor eller andra kanaler du föredrar."
            },
            {
                title: "4. Tjäna",
                description: "Tjäna pengar för varje ny kund som registrerar sig via din referenslänk. Provisionsvillkor diskuteras under godkännandeprocessen."
            }
        ],
        whyPromoteTitle: "Varför marknadsföra BrandSphereAI?",
        whyPromotePoints: [
            {
                title: "Värdefullt verktyg",
                description: "Du kommer att marknadsföra ett genuint användbart verktyg som hjälper företag att förbättra sin närvaro på sociala medier."
            },
            {
                title: "Konkurrenskraftig provision",
                description: "Tjäna attraktiva provisioner för varje framgångsrik hänvisning."
            },
            {
                title: "Support & Resurser",
                description: "Få marknadsföringsmaterial och support för att hjälpa dig lyckas."
            },
            {
                title: "Flexibel marknadsföring",
                description: "Marknadsför på sätt som fungerar bäst för din publik och innehållsstil."
            }
        ],
        ideasTitle: "Marknadsföringsidéer",
        ideasText: "Här är några sätt du kan marknadsföra BrandSphereAI på:",
        ideas: [
            "Skapa en recension eller handledning om BrandSphereAI på din blogg eller YouTube-kanal",
            "Dela din erfarenhet av att använda plattformen på sociala medier",
            "Inkludera BrandSphereAI i sammanställningar av användbara verktyg för sociala medier",
            "Håll ett webbseminarium som visar hur man använder AI för hantering av sociala medier",
            "Dela fallstudier om hur BrandSphereAI har hjälpt dig eller andra"
        ],
        faqTitle: "Vanliga frågor",
        faqs: [
            {
                question: "Vem kan bli marknadsförare?",
                answer: "Alla med en publik som är intresserad av marknadsföring i sociala medier, innehållsskapande eller produktivitetsverktyg för företag kan ansöka. Detta inkluderar bloggare, innehållsskapare, influencers på sociala medier och branschproffs."
            },
            {
                question: "Hur mycket kan jag tjäna?",
                answer: "Provisionsvillkoren varierar beroende på din publik och marknadsföringsmetoder. Vi diskuterar specifika villkor under godkännandeprocessen."
            },
            {
                question: "Finns det krav på minsta publikstorlek?",
                answer: "Nej, kvalitet är viktigare än kvantitet. Jag letar efter marknadsförare som har en engagerad publik som genuint skulle ha nytta av BrandSphereAI."
            },
            {
                question: "Hur spåras hänvisningar?",
                answer: "Du får en unik referenslänk som spårar alla registreringar som kommer via dina marknadsföringsaktiviteter."
            },
            {
                question: "Hur och när får jag betalt?",
                answer: "Betalningsdetaljer och schema diskuteras under godkännandeprocessen. Vanligtvis behandlas betalningar månadsvis för alla kvalificerade hänvisningar."
            }
        ]
    }
};

export default function AppPromotePage() {
    const { language } = useLanguage();
    const t = translations[language];
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(t.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero section */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter max-w-[800px]">
                                {t.title}
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
                                {t.subtitle}
                            </p>
                            <Button size="lg" asChild>
                                <a href="#contact-form">
                                    {t.contactButton} <ChevronRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* How it works section */}
                <section className="py-12 md:py-16">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-8 text-center">
                            {t.howItWorksTitle}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {t.howItWorksSteps.map((step, i) => (
                                <Card key={i} className="p-6">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Check className="h-5 w-5 text-primary" />
                                            <h3 className="text-lg font-semibold">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex-grow">{step.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why promote section */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-8 text-center">
                            {t.whyPromoteTitle}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {t.whyPromotePoints.map((point, i) => (
                                <Card key={i} className="p-6">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Check className="h-5 w-5 text-primary" />
                                            <h3 className="text-lg font-semibold">{point.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex-grow">{point.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotion ideas section */}
                <section className="py-12 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold tracking-tight mb-4 text-center">
                                {t.ideasTitle}
                            </h2>
                            <p className="text-center text-muted-foreground mb-8">
                                {t.ideasText}
                            </p>
                            <ul className="space-y-3">
                                {t.ideas.map((idea, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                            <Check className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <span>{idea}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FAQ section */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-8 text-center">
                                {t.faqTitle}
                            </h2>

                            <Accordion type="single" collapsible className="w-full">
                                {t.faqs.map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`}>
                                        <AccordionTrigger className="text-left font-medium">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                            <div className="mt-8 text-center">
                                <p className="text-muted-foreground mb-4">
                                    {language === 'en'
                                        ? 'Have more questions about promoting your app?'
                                        : 'Har du fler frågor om att marknadsföra din app?'}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <a
                                        href="mailto:BrandsphereaI@gmail.com"
                                        className="text-primary hover:underline"
                                    >
                                        BrandsphereaI@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact section */}
                <section className="py-12 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-md mx-auto text-center">
                            <h2 className="text-2xl font-bold tracking-tight mb-4">
                                {t.contactTitle}
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                {t.contactText}
                            </p>
                            <div className="bg-muted p-4 rounded-lg flex items-center justify-between mb-6">
                                <span className="font-medium">{t.email}</span>
                                <Button variant="ghost" size="sm" onClick={handleCopyEmail}>
                                    {copied ? (
                                        <Check className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    {copied ? t.copied : t.copyEmail}
                                </Button>
                            </div>
                            <Button className="w-full" asChild>
                                <a href={`mailto:${t.email}?subject=${language === 'en' ? 'BrandSphereAI Promotion Application' : 'Ansökan om BrandSphereAI-marknadsföring'}`}>
                                    <Mail className="mr-2 h-4 w-4" /> {t.contactButton}
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 