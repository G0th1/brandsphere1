"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Lägg till en enkel Spinner-komponent eftersom vi inte har en befintlig
const Spinner = ({ className = "" }: { className?: string }) => (
  <div className={`animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full ${className}`} />
);

// Definiera typerna
type BillingCycle = 'monthly' | 'annually';

interface PriceIds {
  monthly: string;
  annually: string;
}

interface Plan {
  name: string;
  description: string;
  price: number;
  priceIds: PriceIds;
  popular?: boolean;
  features: string[];
  notIncluded: string[];
}

interface FeatureDetail {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

interface FeatureCategory {
  name: string;
  features: FeatureDetail[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Translation {
  title: string;
  subtitle: string;
  billingCycle: {
    monthly: string;
    annually: string;
    discount: string;
  };
  getStarted: string;
  contact: string;
  saveText: string;
  annualDiscount: string;
  mostPopular: string;
  enterprise: {
    title: string;
    description: string;
    features: string[];
  };
  faqs: {
    title: string;
    items: FaqItem[];
  };
  plans: Plan[];
  features: {
    title: string;
    categories: FeatureCategory[];
  };
}

interface Translations {
  en: Translation;
  sv: Translation;
}

const translations: Translations = {
  en: {
    title: "Pricing",
    subtitle: "Simple, transparent pricing for everyone",
    billingCycle: {
      monthly: "Monthly",
      annually: "Annually",
      discount: "Save 20%",
    },
    getStarted: "Get Started",
    contact: "Contact Sales",
    saveText: "Save",
    annualDiscount: "20%",
    mostPopular: "Most Popular",
    enterprise: {
      title: "Enterprise",
      description:
        "For larger organizations with specific needs and custom requirements.",
      features: [
        "All Business plan features",
        "Custom integrations",
        "Dedicated account manager",
        "Custom contracts and SLA",
        "Tailored support and training",
        "Advanced security features",
      ],
    },
    faqs: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Can I change my plan later?",
          answer:
            "Yes, you can upgrade or downgrade your plan at any time. Changes to a higher-tier plan take effect immediately. If you downgrade, the changes will apply at the start of your next billing cycle.",
        },
        {
          question: "How does the annual billing discount work?",
          answer:
            "When you choose annual billing, you'll receive a 20% discount compared to monthly billing. You'll be charged for 12 months upfront, which saves you the equivalent of about 2.5 months of service compared to monthly billing.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer invoice payment options.",
        },
        {
          question: "Can I cancel my subscription?",
          answer:
            "Yes, you can cancel your subscription at any time from your account settings. If you cancel, you'll still have access to your plan features until the end of your current billing period.",
        },
        {
          question: "Is there a free trial?",
          answer:
            "Yes, our Pro plan includes a 14-day free trial. No credit card is required to start your trial. You'll only be charged if you decide to continue after the trial period ends.",
        },
      ],
    },
    plans: [
      {
        name: "Free",
        description: "Perfect for individuals or small teams just getting started.",
        price: 0,
        priceIds: {
          monthly: "",  // Free plan doesn't need Stripe ID
          annually: "", // Free plan doesn't need Stripe ID
        },
        features: [
          "3 social media accounts",
          "Up to 30 scheduled posts",
          "Basic analytics",
          "Limited AI content suggestions",
          "Community support",
        ],
        notIncluded: [
          "Advanced analytics",
          "AI content generation",
          "Hashtag analytics",
          "Priority support",
          "Custom branding",
        ],
      },
      {
        name: "Pro",
        description: "Ideal for growing brands and content creators.",
        price: 299,
        priceIds: {
          monthly: "price_placeholder_monthly",  // Ersätt med faktiskt månads-ID
          annually: "price_1QxrmABlLmUFFk8vNiTRH1c5", // Användarens angivna ID
        },
        popular: true,
        features: [
          "10 social media accounts",
          "Unlimited scheduled posts",
          "Advanced analytics",
          "Full AI content generation",
          "Hashtag analytics",
          "Priority email support",
          "Competitor analysis",
          "Content calendar",
        ],
        notIncluded: [
          "Custom branding",
          "Dedicated account manager",
        ],
      },
      {
        name: "Business",
        description: "For businesses requiring advanced features and support.",
        price: 799,
        priceIds: {
          monthly: "price_placeholder_business_monthly",  // Ersätt med faktiskt månads-ID
          annually: "price_placeholder_business_annually", // Ersätt med faktiskt års-ID
        },
        features: [
          "25 social media accounts",
          "Unlimited scheduled posts",
          "Advanced analytics with custom reports",
          "Premium AI content generation",
          "Hashtag analytics and recommendations",
          "Priority phone and email support",
          "Advanced competitor analysis",
          "Content calendar and workflows",
          "Custom branding",
          "Team collaboration tools",
        ],
        notIncluded: [],
      },
    ],
    features: {
      title: "Compare Features",
      categories: [
        {
          name: "Content Creation",
          features: [
            {
              name: "Scheduled Posts",
              free: "30 per month",
              pro: "Unlimited",
              business: "Unlimited",
            },
            {
              name: "AI Content Generation",
              free: "Basic (5/month)",
              pro: "Full (100/month)",
              business: "Premium (Unlimited)",
            },
            {
              name: "Custom Templates",
              free: "3 templates",
              pro: "20 templates",
              business: "Unlimited",
            },
            {
              name: "Content Calendar",
              free: false,
              pro: true,
              business: true,
            },
          ],
        },
        {
          name: "Analytics",
          features: [
            {
              name: "Performance Metrics",
              free: "Basic",
              pro: "Advanced",
              business: "Advanced + Custom",
            },
            {
              name: "Competitor Analysis",
              free: false,
              pro: true,
              business: true,
            },
            {
              name: "Hashtag Analytics",
              free: false,
              pro: true,
              business: true,
            },
            {
              name: "Custom Reports",
              free: false,
              pro: "Limited",
              business: true,
            },
          ],
        },
        {
          name: "Support & Team",
          features: [
            {
              name: "Support",
              free: "Community",
              pro: "Priority Email",
              business: "Priority Phone & Email",
            },
            {
              name: "Team Members",
              free: "1 user",
              pro: "5 users",
              business: "15 users",
            },
            {
              name: "Team Permissions",
              free: false,
              pro: "Basic",
              business: "Advanced",
            },
            {
              name: "Training Resources",
              free: "Basic",
              pro: "Advanced",
              business: "Advanced + Custom",
            },
          ],
        },
      ],
    },
  },
  sv: {
    title: "Prissättning",
    subtitle: "Enkel, transparent prissättning för alla",
    billingCycle: {
      monthly: "Månadsvis",
      annually: "Årsvis",
      discount: "Spara 20%",
    },
    getStarted: "Kom igång",
    contact: "Kontakta försäljning",
    saveText: "Spara",
    annualDiscount: "20%",
    mostPopular: "Mest populär",
    enterprise: {
      title: "Enterprise",
      description:
        "För större organisationer med specifika behov och anpassade krav.",
      features: [
        "Alla funktioner från Business-planen",
        "Anpassade integrationer",
        "Dedikerad kontoansvarig",
        "Anpassade kontrakt och SLA",
        "Skräddarsydd support och utbildning",
        "Avancerade säkerhetsfunktioner",
      ],
    },
    faqs: {
      title: "Vanliga frågor",
      items: [
        {
          question: "Kan jag ändra min plan senare?",
          answer:
            "Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringar till en plan på högre nivå träder i kraft omedelbart. Om du nedgraderar kommer ändringarna att gälla från början av nästa faktureringsperiod.",
        },
        {
          question: "Hur fungerar rabatten för årlig fakturering?",
          answer:
            "När du väljer årlig fakturering får du 20% rabatt jämfört med månatlig fakturering. Du debiteras för 12 månader i förskott, vilket sparar motsvarande cirka 2,5 månaders tjänst jämfört med månatlig fakturering.",
        },
        {
          question: "Vilka betalningsmetoder accepterar ni?",
          answer:
            "Vi accepterar alla större kreditkort (Visa, Mastercard, American Express) och PayPal. För Enterprise-planer erbjuder vi även fakturabetalningsalternativ.",
        },
        {
          question: "Kan jag avbryta min prenumeration?",
          answer:
            "Ja, du kan avbryta din prenumeration när som helst från dina kontoinställningar. Om du avbryter kommer du fortfarande ha tillgång till dina planfunktioner fram till slutet av din nuvarande faktureringsperiod.",
        },
        {
          question: "Finns det en gratis provperiod?",
          answer:
            "Ja, vår Pro-plan inkluderar en 14-dagars gratis provperiod. Inget kreditkort krävs för att starta din provperiod. Du debiteras endast om du bestämmer dig för att fortsätta efter att provperioden avslutas.",
        },
      ],
    },
    plans: [
      {
        name: "Gratis",
        description: "Perfekt för individer eller små team som precis börjat.",
        price: 0,
        priceIds: {
          monthly: "",  // Gratis-plan behöver inget Stripe ID
          annually: "", // Gratis-plan behöver inget Stripe ID
        },
        features: [
          "3 sociala mediekonton",
          "Upp till 30 schemalagda inlägg",
          "Grundläggande analys",
          "Begränsade AI-innehållsförslag",
          "Community-support",
        ],
        notIncluded: [
          "Avancerad analys",
          "AI-innehållsgenerering",
          "Hashtag-analys",
          "Prioriterad support",
          "Anpassad branding",
        ],
      },
      {
        name: "Pro",
        description: "Perfekt för växande varumärken och innehållsskapare.",
        price: 299,
        priceIds: {
          monthly: "price_placeholder_monthly",  // Ersätt med faktiskt månads-ID
          annually: "price_1QxrmABlLmUFFk8vNiTRH1c5", // Användarens angivna ID
        },
        popular: true,
        features: [
          "10 sociala mediekonton",
          "Obegränsade schemalagda inlägg",
          "Avancerad analys",
          "Fullständig AI-innehållsgenerering",
          "Hashtag-analys",
          "Prioriterad e-postsupport",
          "Konkurrentanalys",
          "Innehållskalender",
        ],
        notIncluded: [
          "Anpassad branding",
          "Dedikerad kontoansvarig",
        ],
      },
      {
        name: "Business",
        description: "För företag som kräver avancerade funktioner och support.",
        price: 799,
        priceIds: {
          monthly: "price_placeholder_business_monthly",  // Ersätt med faktiskt månads-ID
          annually: "price_placeholder_business_annually", // Ersätt med faktiskt års-ID
        },
        features: [
          "25 sociala mediekonton",
          "Obegränsade schemalagda inlägg",
          "Avancerad analys med anpassade rapporter",
          "Premium AI-innehållsgenerering",
          "Hashtag-analys och rekommendationer",
          "Prioriterad telefon- och e-postsupport",
          "Avancerad konkurrentanalys",
          "Innehållskalender och arbetsflöden",
          "Anpassad branding",
          "Verktyg för teamsamarbete",
        ],
        notIncluded: [],
      },
    ],
    features: {
      title: "Jämför funktioner",
      categories: [
        {
          name: "Innehållsskapande",
          features: [
            {
              name: "Schemalagda inlägg",
              free: "30 per månad",
              pro: "Obegränsat",
              business: "Obegränsat",
            },
            {
              name: "AI-innehållsgenerering",
              free: "Basic (5/månad)",
              pro: "Full (100/månad)",
              business: "Premium (Obegränsat)",
            },
            {
              name: "Anpassade mallar",
              free: "3 mallar",
              pro: "20 mallar",
              business: "Obegränsat",
            },
            {
              name: "Innehållskalender",
              free: false,
              pro: true,
              business: true,
            },
          ],
        },
        {
          name: "Analys",
          features: [
            {
              name: "Prestationsmått",
              free: "Grundläggande",
              pro: "Avancerad",
              business: "Avancerad + Anpassad",
            },
            {
              name: "Konkurrentanalys",
              free: false,
              pro: true,
              business: true,
            },
            {
              name: "Hashtag-analys",
              free: false,
              pro: true,
              business: true,
            },
            {
              name: "Anpassade rapporter",
              free: false,
              pro: "Begränsat",
              business: true,
            },
          ],
        },
        {
          name: "Support & Team",
          features: [
            {
              name: "Support",
              free: "Community",
              pro: "Prioriterad e-post",
              business: "Prioriterad telefon & e-post",
            },
            {
              name: "Teammedlemmar",
              free: "1 användare",
              pro: "5 användare",
              business: "15 användare",
            },
            {
              name: "Teambehörigheter",
              free: false,
              pro: "Grundläggande",
              business: "Avancerad",
            },
            {
              name: "Utbildningsresurser",
              free: "Grundläggande",
              pro: "Avancerad",
              business: "Avancerad + Anpassad",
            },
          ],
        },
      ],
    },
  },
};

export default function PricingPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof Translations];
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Beräkna pris baserat på faktureringsperiod
  const calculatePrice = (basePrice: number) => {
    if (billingCycle === "annually") {
      // Applicera 20% rabatt för årlig fakturering
      return (basePrice * 12 * 0.8).toFixed(0);
    }
    return basePrice;
  };

  // Hantera checkout mot Stripe
  const handleCheckout = async (planName: string, priceId: string) => {
    if (!priceId) return; // Ingen åtgärd för planer utan priceId (t.ex. gratis)

    setIsLoading(true);
    setLoadingPlan(planName);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          billingCycle,
          successUrl: `/dashboard/subscribe/success?plan=${encodeURIComponent(planName)}`,
          cancelUrl: '/pricing?canceled=true'
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error('Checkout error:', error);
        alert('Ett fel inträffade vid checkout. Vänligen försök igen.');
      } else if (url) {
        // Omdirigera till Stripe checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ett fel inträffade vid checkout. Vänligen försök igen.');
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.subtitle}
            </p>

            {/* Faktureringsväljare */}
            <div className="mt-8 inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Tabs
                defaultValue="monthly"
                value={billingCycle}
                onValueChange={(value: string) => setBillingCycle(value as BillingCycle)}
                className="w-full max-w-xs"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="monthly">{t.billingCycle.monthly}</TabsTrigger>
                  <TabsTrigger value="annually" className="relative">
                    {t.billingCycle.annually}
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {t.billingCycle.discount}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Prisplaner */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {t.plans.map((plan: Plan) => (
              <Card
                key={plan.name}
                className={`relative p-6 ${plan.popular
                  ? "border-primary shadow-lg dark:border-primary"
                  : ""
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium text-sm">
                    {t.mostPopular}
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">
                      {plan.price > 0
                        ? billingCycle === "monthly"
                          ? plan.price
                          : calculatePrice(plan.price)
                        : "0"}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 dark:text-gray-400 ml-2 pb-1">
                        SEK{billingCycle === "monthly" ? "/mån" : "/år"}
                      </span>
                    )}
                  </div>
                  {billingCycle === "annually" && plan.price > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {t.saveText} {t.annualDiscount}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full mb-6"
                  disabled={isLoading && loadingPlan === plan.name}
                  onClick={() => handleCheckout(
                    plan.name,
                    plan.priceIds[billingCycle]
                  )}
                >
                  {isLoading && loadingPlan === plan.name ? (
                    <Spinner className="mr-2" />
                  ) : null}
                  {plan.price > 0 ? t.getStarted : t.getStarted}
                </Button>

                <div className="space-y-4">
                  <h3 className="font-semibold">Inkluderat:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <>
                      <h3 className="font-semibold">Inte inkluderat:</h3>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start text-gray-500">
                            <X className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Enterprise-sektion */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">{t.enterprise.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t.enterprise.description}
                </p>
                <Button variant="outline" size="lg">
                  {t.contact}
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Inkluderar:</h3>
                <ul className="space-y-3">
                  {t.enterprise.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Funktionsjämförelse */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">{t.features.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Features</th>
                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                    <th className="text-center py-4 px-4 font-semibold">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {t.features.categories.map((category: FeatureCategory, categoryIndex: number) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td
                          colSpan={4}
                          className="py-3 px-4 font-semibold text-primary"
                        >
                          {category.name}
                        </td>
                      </tr>
                      {category.features.map((feature: FeatureDetail, featureIndex: number) => (
                        <tr
                          key={`${categoryIndex}-${featureIndex}`}
                          className="border-b"
                        >
                          <td className="py-3 px-4">{feature.name}</td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.free === "boolean" ? (
                              feature.free ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              feature.free
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.pro === "boolean" ? (
                              feature.pro ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              feature.pro
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.business === "boolean" ? (
                              feature.business ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              feature.business
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vanliga frågor */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">{t.faqs.title}</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {t.faqs.items.map((faq: FaqItem, index: number) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 