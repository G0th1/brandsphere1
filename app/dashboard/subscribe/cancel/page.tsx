"use client";

import React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { XCircle } from "lucide-react"
import Link from "next/link"

const translations = {
    en: {
        title: "Payment Cancelled",
        subtitle: "Your subscription process was not completed",
        message: "You've canceled the subscription process. No charges have been made to your account.",
        reasons: {
            title: "Common reasons for cancellation:",
            items: [
                "Need more time to decide",
                "Looking for different features",
                "Price considerations",
                "Technical issues during checkout"
            ]
        },
        needHelp: "Need help deciding?",
        helpText: "Our team is here to assist you with any questions about our plans or features.",
        contactUs: "Contact Us",
        backToPricing: "Back to Pricing",
        exploreFeatures: "Explore Features"
    },
    sv: {
        title: "Betalning avbruten",
        subtitle: "Din prenumerationsprocess slutfördes inte",
        message: "Du har avbrutit prenumerationsprocessen. Inga avgifter har dragits från ditt konto.",
        reasons: {
            title: "Vanliga anledningar till avbrott:",
            items: [
                "Behöver mer tid att bestämma sig",
                "Letar efter andra funktioner",
                "Prisöverväganden",
                "Tekniska problem vid utcheckning"
            ]
        },
        needHelp: "Behöver du hjälp att bestämma dig?",
        helpText: "Vårt team finns här för att hjälpa dig med frågor om våra planer eller funktioner.",
        contactUs: "Kontakta oss",
        backToPricing: "Tillbaka till prissidan",
        exploreFeatures: "Utforska funktioner"
    }
};

export default function SubscriptionCancelPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <XCircle className="h-16 w-16 text-gray-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        {t.subtitle}
                    </p>
                    <Card className="p-6 mb-8 text-left">
                        <p className="mb-4">{t.message}</p>
                        <div className="mb-4">
                            <h2 className="font-semibold mb-2">{t.reasons.title}</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                {t.reasons.items.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    <Card className="p-6 mb-8 bg-gray-50 dark:bg-gray-800">
                        <h2 className="font-bold text-xl mb-2">{t.needHelp}</h2>
                        <p className="mb-4">{t.helpText}</p>
                        <Button variant="secondary" asChild>
                            <Link href="/contact">{t.contactUs}</Link>
                        </Button>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href="/pricing">{t.backToPricing}</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/features">{t.exploreFeatures}</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
} 