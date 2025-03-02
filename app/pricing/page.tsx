"use client"

import { useState } from "react"
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
      },
      {
        question: "Is there a free trial?",
        answer: "We offer a 14-day free trial of our Pro plan. No credit card required to start your trial."
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
      },
      {
        question: "Finns det en gratis provperiod?",
        answer: "Vi erbjuder en 14-dagars gratis provperiod av vår Pro-plan. Inget kreditkort krävs för att starta din provperiod."
      }
    ]
  }
};

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
    comingSoon: false
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
    comingSoon: false
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
  const { language } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const t = translations[language as keyof typeof translations];

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
          {t.title}
        </h1>
        <p className="text-muted-foreground text-xl max-w-[700px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs defaultValue="monthly" onValueChange={(value) => setBillingCycle(value as BillingCycle)} className="w-full max-w-md">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="monthly">{t.monthlyLabel}</TabsTrigger>
            <TabsTrigger value="yearly" className="relative">
              {t.yearlyLabel}
              <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {t.yearlyDiscount}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn("flex flex-col justify-between", plan.popular ? "border-primary shadow-md" : "")}>
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                <Badge className="px-3 py-1 text-sm font-medium" variant="default">
                  {language === 'en' ? 'Popular' : 'Populär'}
                </Badge>
              </div>
            )}
            {plan.comingSoon && (
              <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                <Badge className="px-3 py-1 text-sm font-medium" variant="outline">
                  {language === 'en' ? 'Coming soon' : 'Kommer snart'}
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{language === 'en' ? plan.description : plan.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline text-4xl font-bold">
                  {plan.price[language as keyof typeof plan.price].currency}{billingCycle === 'monthly'
                    ? plan.price[language as keyof typeof plan.price].monthly
                    : plan.price[language as keyof typeof plan.price].yearly}
                  <span className="text-sm font-medium text-muted-foreground">
                    /{billingCycle === 'monthly' ? t.monthlyLabel.toLowerCase() : t.yearlyLabel.toLowerCase()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.excludes.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                    <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {typeof t[plan.cta as keyof typeof t] === 'string'
                  ? t[plan.cta as keyof typeof t] as string
                  : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 md:mt-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            {t.faqTitle}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {t.faq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="mt-20 md:mt-28 bg-muted/50 p-8 rounded-lg max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{t.enterpriseTitle}</h2>
          <p className="text-muted-foreground">{t.enterpriseSubtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {t.enterpriseFeatures.map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg">{t.enterpriseCta}</Button>
        </div>
      </div>
    </div>
  );
} 