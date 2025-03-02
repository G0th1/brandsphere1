"use client";

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

const translations = {
  en: {
    title: "Payment Successful!",
    subtitle: "Thank you for subscribing to BrandSphereAI",
    welcomeMessage: "Welcome to the BrandSphereAI family!",
    detailsHeader: "Your subscription details",
    detailsInfo: "You will receive a confirmation email shortly with your subscription details.",
    whatNow: "What happens now?",
    nextSteps: [
      "Your account has been upgraded with your new subscription.",
      "You now have access to all the features in your plan.",
      "Our team is ready to help you make the most of your subscription."
    ],
    dashboardButton: "Go to Dashboard",
    supportMessage: "Need help? Our support team is ready to assist you.",
    contactSupport: "Contact Support"
  },
  sv: {
    title: "Betalningen lyckades!",
    subtitle: "Tack för att du prenumererar på BrandSphereAI",
    welcomeMessage: "Välkommen till BrandSphereAI-familjen!",
    detailsHeader: "Din prenumerationsinformation",
    detailsInfo: "Du kommer snart att få ett bekräftelsemail med dina prenumerationsuppgifter.",
    whatNow: "Vad händer nu?",
    nextSteps: [
      "Ditt konto har uppgraderats med din nya prenumeration.",
      "Du har nu tillgång till alla funktioner i din plan.",
      "Vårt team är redo att hjälpa dig att få ut det mesta av din prenumeration."
    ],
    dashboardButton: "Gå till Dashboard",
    supportMessage: "Behöver du hjälp? Vårt supportteam är redo att hjälpa dig.",
    contactSupport: "Kontakta Support"
  }
};

export default function SubscriptionSuccessPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    // Här skulle vi kunna hämta information om prenumerationen från Stripe
    // För demo-syften använder vi URL-parametrar
    const url = new URL(window.location.href);
    const plan = url.searchParams.get('plan') || 'Pro';
    setPlan(plan);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {t.subtitle}
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-8">
            <p className="font-medium text-green-800 dark:text-green-300">
              {t.welcomeMessage}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{t.detailsHeader}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="font-medium">Plan:</p>
              <p>{plan}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Status:</p>
              <p className="text-green-600 dark:text-green-400">Active</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.detailsInfo}</p>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{t.whatNow}</h2>
          <ul className="space-y-4">
            {t.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">{t.dashboardButton}</Link>
          </Button>
          <div className="mt-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t.supportMessage}
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">{t.contactSupport}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 