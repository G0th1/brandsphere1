"use client"

import { useState, useEffect } from "react"
import { useRouter, redirect } from "next/navigation"
import { Check, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

// Lägg till en enkel Spinner-komponent eftersom vi inte har en befintlig
function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
    />
  );
}

// Priskomponenter - använder samma konstanter som i resten av applikationen
const PRICE_IDS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || "price_1QxXyyBlLmUFFk8vQVg2xtZl",
  PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY || "price_1QxrmABlLmUFFk8vNiTRH1c5",
  BUSINESS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY || "price_id_business_monthly",
  BUSINESS_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_YEARLY || "price_id_business_yearly",
};

type BillingCycle = "monthly" | "yearly"

interface PricingInfo {
  monthly: number;
  yearly: number;
  currency: string;
}

interface Plan {
  name: string;
  description: string;
  price: {
    en: PricingInfo;
    sv: PricingInfo;
  };
  features: string[];
  excludes: string[];
  popular: boolean;
  comingSoon: boolean;
  cta: string;
  priceId?: {
    monthly: string;
    yearly: string;
  };
}

interface FeatureDetail {
  name: string;
  plans: {
    free: boolean;
    pro: boolean;
    business: boolean;
  };
}

interface FeatureCategory {
  category: string;
  features: FeatureDetail[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Translation {
  title: string;
  subtitle: string;
  faqTitle: string;
  enterpriseTitle: string;
  enterpriseSubtitle: string;
  enterpriseFeatures: string[];
  enterpriseCta: string;
  monthlyLabel: string;
  yearlyLabel: string;
  yearlyDiscount: string;
  featureIncluded: string;
  featureNotIncluded: string;
  getStartedButton: string;
  contactSalesButton: string;
  categoriesTitle: {
    contentCreation: string;
    analytics: string;
    support: string;
  };
  faq: FaqItem[];
}

interface Translations {
  en: Translation;
  sv: Translation;
}

const translations: Translations = {
  en: {
    title: "Pricing",
    subtitle: "Simple, transparent pricing for everyone.",
    faqTitle: "Frequently asked questions",
    enterpriseTitle: "Need something more?",
    enterpriseSubtitle: "Customized plans for large organizations with specific needs.",
    enterpriseFeatures: [
      "Unlimited users",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security features",
      "Custom reporting and analytics",
      "Priority support and SLA",
      "Onboarding and training"
    ],
    enterpriseCta: "Contact sales",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    yearlyDiscount: "Save 20%",
    featureIncluded: "Included",
    featureNotIncluded: "Not included",
    getStartedButton: "Get started",
    contactSalesButton: "Contact sales",
    categoriesTitle: {
      contentCreation: "Content Creation",
      analytics: "Analytics",
      support: "Support"
    },
    faq: [
      {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing cycle."
      },
      {
        question: "Is there a discount for annual billing?",
        answer: "Yes, you save 20% when you choose annual billing for any of our paid plans."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. For annual plans, we can also provide invoicing options."
      },
      {
        question: "Can I cancel my subscription?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
      }
    ]
  },
  sv: {
    title: "Prissättning",
    subtitle: "Enkel, transparent prissättning för alla.",
    faqTitle: "Vanliga frågor",
    enterpriseTitle: "Behöver ni något mer?",
    enterpriseSubtitle: "Anpassade planer för stora organisationer med specifika behov.",
    enterpriseFeatures: [
      "Obegränsade användare",
      "Dedikerad kontoansvarig",
      "Anpassade integrationer",
      "Avancerade säkerhetsfunktioner",
      "Anpassad rapportering och analys",
      "Prioriterad support och SLA",
      "Onboarding och utbildning"
    ],
    enterpriseCta: "Kontakta försäljning",
    monthlyLabel: "Månadsvis",
    yearlyLabel: "Årsvis",
    yearlyDiscount: "Spara 20%",
    featureIncluded: "Ingår",
    featureNotIncluded: "Ingår ej",
    getStartedButton: "Kom igång",
    contactSalesButton: "Kontakta försäljning",
    categoriesTitle: {
      contentCreation: "Innehållsskapande",
      analytics: "Analys",
      support: "Support"
    },
    faq: [
      {
        question: "Kan jag ändra min plan senare?",
        answer: "Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringarna kommer att tillämpas på din nästa faktureringsperiod."
      },
      {
        question: "Finns det rabatt för årlig fakturering?",
        answer: "Ja, du sparar 20% när du väljer årlig fakturering för någon av våra betalda planer."
      },
      {
        question: "Vilka betalningsmetoder accepterar ni?",
        answer: "Vi accepterar alla större kreditkort, inklusive Visa, Mastercard och American Express. För årsplaner kan vi även erbjuda faktureringsalternativ."
      },
      {
        question: "Kan jag avbryta min prenumeration?",
        answer: "Ja, du kan avbryta din prenumeration när som helst från dina kontoinställningar. Din tillgång fortsätter till slutet av din nuvarande faktureringsperiod."
      }
    ]
  }
};

// Uppdatera plans med Stripe priceIds
const plans: Plan[] = [
  {
    name: "Free",
    description: "For individuals or small teams just getting started.",
    price: {
      en: {
        monthly: 0,
        yearly: 0,
        currency: "$"
      },
      sv: {
        monthly: 0,
        yearly: 0,
        currency: "$"
      }
    },
    features: ["3 connected social accounts", "10 scheduled posts per month", "Basic analytics", "Email support"],
    excludes: ["Advanced analytics", "AI content generation", "Multiple users", "API access"],
    cta: "getStartedButton",
    popular: false,
    comingSoon: false
  },
  {
    name: "Pro",
    description: "For growing brands and content creators.",
    price: {
      en: {
        monthly: 19,
        yearly: 180,
        currency: "$"
      },
      sv: {
        monthly: 19,
        yearly: 180,
        currency: "$"
      }
    },
    features: ["10 connected social accounts", "Unlimited scheduled posts", "Advanced analytics", "Competitor analysis", "AI content generation", "Priority email support"],
    excludes: ["Custom branding", "Dedicated account manager"],
    cta: "getStartedButton",
    popular: true,
    comingSoon: false,
    priceId: {
      monthly: PRICE_IDS.PRO_MONTHLY,
      yearly: PRICE_IDS.PRO_YEARLY
    }
  },
  {
    name: "Business",
    description: "For businesses needing advanced features.",
    price: {
      en: {
        monthly: 49,
        yearly: 470,
        currency: "$"
      },
      sv: {
        monthly: 49,
        yearly: 470,
        currency: "$"
      }
    },
    features: ["20 connected social accounts", "Unlimited scheduled posts", "Advanced analytics", "Competitor analysis", "AI content generation", "Custom branding", "Team collaboration", "API access", "24/7 priority support"],
    excludes: [],
    cta: "getStartedButton",
    popular: false,
    comingSoon: false,
    priceId: {
      monthly: PRICE_IDS.BUSINESS_MONTHLY,
      yearly: PRICE_IDS.BUSINESS_YEARLY
    }
  }
];

const featureCategories: FeatureCategory[] = [
  {
    category: "contentCreation",
    features: [
      {
        name: "Scheduled posts",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "AI content generation",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Multi-platform posting",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "Content calendar",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Content library",
        plans: { free: false, pro: true, business: true }
      }
    ]
  },
  {
    category: "analytics",
    features: [
      {
        name: "Performance metrics",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "Audience insights",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Competitor analysis",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Custom reports",
        plans: { free: false, pro: false, business: true }
      },
      {
        name: "ROI tracking",
        plans: { free: false, pro: false, business: true }
      }
    ]
  },
  {
    category: "support",
    features: [
      {
        name: "Email support",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "Priority support",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Phone support",
        plans: { free: false, pro: false, business: true }
      },
      {
        name: "Dedicated manager",
        plans: { free: false, pro: false, business: true }
      },
      {
        name: "Team permissions",
        plans: { free: false, pro: false, business: true }
      }
    ]
  }
];

export default function PricingPage() {
  redirect("/");
} 