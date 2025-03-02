"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Översättningar
const translations = {
    en: {
        title: "Help Center",
        subtitle: "Find answers to your questions about BrandSphereAI",
        searchPlaceholder: "Search for help",
        categoriesTitle: "Browse by category",
        popularArticles: "Popular articles",
        getSupport: "Get Support",
        contactSupport: "Contact Support",
        visitFAQ: "Visit FAQ",
        readDocs: "Read Documentation",
        categories: [
            {
                title: "Getting Started",
                icon: "🚀",
                description: "Learn the basics of BrandSphereAI",
                articles: [
                    { title: "Creating your account", link: "#" },
                    { title: "Setting up your first social profile", link: "#" },
                    { title: "Understanding the dashboard", link: "#" },
                    { title: "Connecting social media accounts", link: "#" }
                ]
            },
            {
                title: "Content Creation",
                icon: "✏️",
                description: "Everything about creating and managing content",
                articles: [
                    { title: "Using the AI content generator", link: "#" },
                    { title: "Scheduling posts", link: "#" },
                    { title: "Creating content templates", link: "#" },
                    { title: "Managing media library", link: "#" }
                ]
            },
            {
                title: "Integrations",
                icon: "🔄",
                description: "Connect BrandSphereAI with other platforms",
                articles: [
                    { title: "Facebook integration guide", link: "#" },
                    { title: "YouTube integration guide", link: "#" },
                    { title: "Using the API", link: "#" },
                    { title: "Third-party app connections", link: "#" }
                ]
            },
            {
                title: "Account & Billing",
                icon: "💳",
                description: "Manage your account and subscription",
                articles: [
                    { title: "Updating your profile", link: "#" },
                    { title: "Managing team members", link: "#" },
                    { title: "Subscription plans", link: "#" },
                    { title: "Payment methods", link: "#" }
                ]
            },
            {
                title: "Analytics",
                icon: "📊",
                description: "Understanding your performance metrics",
                articles: [
                    { title: "Analytics dashboard overview", link: "#" },
                    { title: "Creating custom reports", link: "#" },
                    { title: "Understanding engagement metrics", link: "#" },
                    { title: "Exporting analytics data", link: "#" }
                ]
            },
            {
                title: "Troubleshooting",
                icon: "🔧",
                description: "Solve common issues and problems",
                articles: [
                    { title: "Post scheduling issues", link: "#" },
                    { title: "Account connection problems", link: "#" },
                    { title: "Error messages explained", link: "#" },
                    { title: "Common integration issues", link: "#" }
                ]
            }
        ],
        popularArticlesList: [
            {
                title: "How to create AI-generated content for multiple platforms at once",
                category: "Content Creation",
                views: "2.5k views",
                link: "#"
            },
            {
                title: "Connecting your Facebook business page to BrandSphereAI",
                category: "Integrations",
                views: "1.8k views",
                link: "#"
            },
            {
                title: "Understanding analytics: Measuring your social media performance",
                category: "Analytics",
                views: "1.5k views",
                link: "#"
            },
            {
                title: "Best practices for scheduling posts with optimal timing",
                category: "Content Creation",
                views: "1.2k views",
                link: "#"
            }
        ],
        supportOptions: [
            {
                title: "Email Support",
                description: "Get help via email within 24 hours",
                buttonText: "Email Us",
                link: "mailto:support@brandsphereai.com"
            },
            {
                title: "Live Chat",
                description: "Chat with our support team in real-time",
                buttonText: "Start Chat",
                link: "#"
            },
            {
                title: "Knowledge Base",
                description: "Browse our extensive documentation",
                buttonText: "Explore",
                link: "/docs"
            }
        ]
    },
    sv: {
        title: "Hjälpcenter",
        subtitle: "Hitta svar på dina frågor om BrandSphereAI",
        searchPlaceholder: "Sök efter hjälp",
        categoriesTitle: "Bläddra efter kategori",
        popularArticles: "Populära artiklar",
        getSupport: "Få support",
        contactSupport: "Kontakta support",
        visitFAQ: "Besök FAQ",
        readDocs: "Läs dokumentation",
        categories: [
            {
                title: "Kom igång",
                icon: "🚀",
                description: "Lär dig grunderna i BrandSphereAI",
                articles: [
                    { title: "Skapa ditt konto", link: "#" },
                    { title: "Konfigurera din första sociala profil", link: "#" },
                    { title: "Förstå instrumentpanelen", link: "#" },
                    { title: "Ansluta sociala mediekonton", link: "#" }
                ]
            },
            {
                title: "Innehållsskapande",
                icon: "✏️",
                description: "Allt om att skapa och hantera innehåll",
                articles: [
                    { title: "Använda AI-innehållsgeneratorn", link: "#" },
                    { title: "Schemalägga inlägg", link: "#" },
                    { title: "Skapa innehållsmallar", link: "#" },
                    { title: "Hantera mediebibliotek", link: "#" }
                ]
            },
            {
                title: "Integrationer",
                icon: "🔄",
                description: "Anslut BrandSphereAI med andra plattformar",
                articles: [
                    { title: "Guide för Facebook-integration", link: "#" },
                    { title: "Guide för YouTube-integration", link: "#" },
                    { title: "Använda API:et", link: "#" },
                    { title: "Anslutningar för tredjepartsappar", link: "#" }
                ]
            },
            {
                title: "Konto & Fakturering",
                icon: "💳",
                description: "Hantera ditt konto och prenumeration",
                articles: [
                    { title: "Uppdatera din profil", link: "#" },
                    { title: "Hantera teammedlemmar", link: "#" },
                    { title: "Prenumerationsplaner", link: "#" },
                    { title: "Betalningsmetoder", link: "#" }
                ]
            },
            {
                title: "Analys",
                icon: "📊",
                description: "Förstå dina prestationsmått",
                articles: [
                    { title: "Översikt över analysinstrumentpanelen", link: "#" },
                    { title: "Skapa anpassade rapporter", link: "#" },
                    { title: "Förstå engagemangsmått", link: "#" },
                    { title: "Exportera analysdata", link: "#" }
                ]
            },
            {
                title: "Felsökning",
                icon: "🔧",
                description: "Lös vanliga problem och fel",
                articles: [
                    { title: "Problem med inläggsschemaläggning", link: "#" },
                    { title: "Problem med kontoanslutning", link: "#" },
                    { title: "Felmeddelanden förklarade", link: "#" },
                    { title: "Vanliga integrationsproblem", link: "#" }
                ]
            }
        ],
        popularArticlesList: [
            {
                title: "Hur man skapar AI-genererat innehåll för flera plattformar samtidigt",
                category: "Innehållsskapande",
                views: "2,5k visningar",
                link: "#"
            },
            {
                title: "Ansluta din Facebook-företagssida till BrandSphereAI",
                category: "Integrationer",
                views: "1,8k visningar",
                link: "#"
            },
            {
                title: "Förstå analys: Mäta din prestanda på sociala medier",
                category: "Analys",
                views: "1,5k visningar",
                link: "#"
            },
            {
                title: "Bästa praxis för att schemalägga inlägg med optimal timing",
                category: "Innehållsskapande",
                views: "1,2k visningar",
                link: "#"
            }
        ],
        supportOptions: [
            {
                title: "E-postsupport",
                description: "Få hjälp via e-post inom 24 timmar",
                buttonText: "Maila oss",
                link: "mailto:support@brandsphereai.com"
            },
            {
                title: "Live-chatt",
                description: "Chatta med vårt supportteam i realtid",
                buttonText: "Starta chatt",
                link: "#"
            },
            {
                title: "Kunskapsbas",
                description: "Bläddra i vår omfattande dokumentation",
                buttonText: "Utforska",
                link: "/docs"
            }
        ]
    }
};

export default function HelpCenterPage() {
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
                            <p className="text-muted-foreground text-lg md:text-xl mb-8">
                                {t.subtitle}
                            </p>
                            <div className="relative max-w-md mx-auto">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <Input
                                    type="search"
                                    placeholder={t.searchPlaceholder}
                                    className="pl-10 py-6 text-base"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <Button variant="outline" asChild>
                                <Link href="/faq">{t.visitFAQ}</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contact">{t.contactSupport}</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/api-documentation">{t.readDocs}</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold mb-8">
                            {t.categoriesTitle}
                        </h2>
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {t.categories.map((category, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-2xl">
                                                {category.icon}
                                            </div>
                                            <h3 className="text-xl font-bold">
                                                {category.title}
                                            </h3>
                                        </div>
                                        <p className="text-muted-foreground mb-6">
                                            {category.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {category.articles.map((article, artIndex) => (
                                                <li key={artIndex}>
                                                    <Link
                                                        href={article.link}
                                                        className="text-primary hover:underline flex items-center"
                                                    >
                                                        <span className="text-xs mr-2">•</span>
                                                        {article.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-2xl font-bold mb-8">
                            {t.popularArticles}
                        </h2>
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            {t.popularArticlesList.map((article, index) => (
                                <Link href={article.link} key={index}>
                                    <div className="bg-background p-6 rounded-lg border hover:border-primary transition-colors">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <span>{article.category}</span>
                                            <span>•</span>
                                            <span>{article.views}</span>
                                        </div>
                                        <h3 className="font-semibold">
                                            {article.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">
                                {t.getSupport}
                            </h2>
                            <p className="text-muted-foreground">
                                {language === 'en'
                                    ? "Need additional help? Our support team is ready to assist you."
                                    : "Behöver du ytterligare hjälp? Vårt supportteam är redo att hjälpa dig."}
                            </p>
                        </div>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                            {t.supportOptions.map((option, index) => (
                                <Card key={index} className="p-6">
                                    <h3 className="font-bold text-lg mb-2">
                                        {option.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {option.description}
                                    </p>
                                    <Button asChild>
                                        <Link href={option.link}>
                                            {option.buttonText}
                                        </Link>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-[800px] mx-auto text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                {language === 'en' ? "Can't find what you're looking for?" : "Kan du inte hitta vad du letar efter?"}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {language === 'en'
                                    ? "Our comprehensive documentation covers everything from getting started to advanced features."
                                    : "Vår omfattande dokumentation täcker allt från att komma igång till avancerade funktioner."}
                            </p>
                            <Button asChild>
                                <Link href="/api-documentation">
                                    {language === 'en' ? "Browse Documentation" : "Bläddra i dokumentationen"}
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