"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCard } from "@/components/billing/plan-card";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { dynamic } from "@/app/utils/dynamic-routes";

// Re-export the dynamic marker
export { dynamic };

// Stripe price IDs
const PRICE_IDS = {
    PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || "price_id_pro_monthly",
    PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY || "price_id_pro_yearly",
    BUSINESS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY || "price_id_business_monthly",
    BUSINESS_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_YEARLY || "price_id_business_yearly",
};

const translations = {
    en: {
        title: "Billing",
        description: "Manage your subscription and billing details",
        monthly: "Monthly",
        yearly: "Yearly (Save 20%)",
        features: {
            free: [
                "3 connected social accounts",
                "10 scheduled posts per month",
                "Basic analytics",
                "Email support"
            ],
            pro: [
                "10 connected social accounts",
                "Unlimited scheduled posts",
                "Advanced analytics",
                "Competitor analysis",
                "AI content generation",
                "Priority email support"
            ],
            business: [
                "20 connected social accounts",
                "Unlimited scheduled posts",
                "Advanced analytics",
                "Competitor analysis",
                "AI content generation",
                "Custom branding",
                "Team collaboration",
                "API access",
                "24/7 priority support"
            ]
        },
        loadingSubscription: "Loading subscription data...",
        subscriptionEndingOn: "Your subscription ends on",
        successTitle: "Payment successful",
        successMessage: "Thank you for your purchase. Your subscription is now active.",
        canceledTitle: "Payment canceled",
        canceledMessage: "Your payment was canceled. You will not be charged.",
        errorLoadingSubscription: "Failed to load subscription data. Please try again later."
    },
    sv: {
        title: "Fakturering",
        description: "Hantera din prenumeration och faktureringsuppgifter",
        monthly: "Månadsvis",
        yearly: "Årsvis (Spara 20%)",
        features: {
            free: [
                "3 anslutna sociala konton",
                "10 schemalagda inlägg per månad",
                "Grundläggande analys",
                "E-postsupport"
            ],
            pro: [
                "10 anslutna sociala konton",
                "Obegränsade schemalagda inlägg",
                "Avancerad analys",
                "Konkurrentanalys",
                "AI-innehållsgenerering",
                "Prioriterad e-postsupport"
            ],
            business: [
                "20 anslutna sociala konton",
                "Obegränsade schemalagda inlägg",
                "Avancerad analys",
                "Konkurrentanalys",
                "AI-innehållsgenerering",
                "Anpassad varumärkning",
                "Teamsamarbete",
                "API-åtkomst",
                "Prioriterad support dygnet runt"
            ]
        },
        loadingSubscription: "Laddar prenumerationsdata...",
        subscriptionEndingOn: "Din prenumeration avslutas den",
        successTitle: "Betalningen genomförd",
        successMessage: "Tack för ditt köp. Din prenumeration är nu aktiv.",
        canceledTitle: "Betalningen avbruten",
        canceledMessage: "Din betalning avbröts. Du kommer inte att debiteras.",
        errorLoadingSubscription: "Det gick inte att ladda prenumerationsdata. Försök igen senare."
    }
};

// Typer för prenumerationsobjektet
interface Subscription {
    id: string;
    userId: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Date | null;
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid' | 'inactive';
    plan: 'Free' | 'Pro' | 'Business';
    billingCycle: 'monthly' | 'annually';
    createdAt: string;
    updatedAt: string;
}

export default function BillingPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const [interval, setInterval] = useState<"month" | "year">("month");
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Hantera statusmeddelanden från URL-frågesträngar
    useEffect(() => {
        if (searchParams?.get('success') === 'true') {
            toast({
                title: t.successTitle,
                description: t.successMessage,
                variant: "success",
            });
        } else if (searchParams?.get('canceled') === 'true') {
            toast({
                title: t.canceledTitle,
                description: t.canceledMessage,
                variant: "destructive",
            });
        }
    }, [searchParams, toast, t]);

    // Hämta prenumerationsdata
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/subscription');

                if (!response.ok) {
                    throw new Error('Failed to fetch subscription data');
                }

                const data = await response.json();
                setSubscription(data);
            } catch (error) {
                console.error('Error fetching subscription:', error);
                toast({
                    title: "Error",
                    description: t.errorLoadingSubscription,
                    variant: "destructive",
                });

                setSubscription({
                    id: "fallback",
                    userId: "",
                    stripeCustomerId: null,
                    stripeSubscriptionId: null,
                    stripePriceId: null,
                    stripeCurrentPeriodEnd: null,
                    status: "active",
                    plan: "Free",
                    billingCycle: "monthly",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined' &&
            (localStorage.getItem('universalMode') === 'true' ||
                localStorage.getItem('offlineMode') === 'true')) {
            setSubscription({
                id: "universal-mode",
                userId: "",
                stripeCustomerId: null,
                stripeSubscriptionId: null,
                stripePriceId: null,
                stripeCurrentPeriodEnd: null,
                status: "active",
                plan: "Free",
                billingCycle: "monthly",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            setLoading(false);
        } else {
            fetchSubscription();
        }
    }, [toast, t]);

    // Sätt intervall baserat på användarens nuvarande prenumeration
    useEffect(() => {
        if (subscription) {
            setInterval(subscription.billingCycle === "annually" ? "year" : "month");
        }
    }, [subscription]);

    if (loading) {
        return (
            <div className="container max-w-6xl py-8">
                <p className="text-center text-muted-foreground">{t.loadingSubscription}</p>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
                <p className="text-muted-foreground">{t.description}</p>

                {subscription?.status === "canceled" && subscription.stripeCurrentPeriodEnd && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-amber-800 dark:text-amber-400">
                            {t.subscriptionEndingOn} {formatDate(subscription.stripeCurrentPeriodEnd)}
                        </p>
                    </div>
                )}
            </div>

            <Tabs
                defaultValue={interval}
                className="w-full"
                onValueChange={(value) => setInterval(value as "month" | "year")}
            >
                <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8">
                    <TabsTrigger value="month">{t.monthly}</TabsTrigger>
                    <TabsTrigger value="year">{t.yearly}</TabsTrigger>
                </TabsList>

                <TabsContent value="month" className="mt-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <PlanCard
                            plan="Free"
                            price="$0"
                            features={t.features.free}
                            interval="month"
                            currentPlan={subscription?.plan === "Free"}
                        />

                        <PlanCard
                            plan="Pro"
                            price="$19"
                            features={t.features.pro}
                            interval="month"
                            priceId={PRICE_IDS.PRO_MONTHLY}
                            popular
                            currentPlan={subscription?.plan === "Pro" && subscription?.billingCycle === "monthly"}
                        />

                        <PlanCard
                            plan="Business"
                            price="$49"
                            features={t.features.business}
                            interval="month"
                            priceId={PRICE_IDS.BUSINESS_MONTHLY}
                            currentPlan={subscription?.plan === "Business" && subscription?.billingCycle === "monthly"}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="year" className="mt-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <PlanCard
                            plan="Free"
                            price="$0"
                            features={t.features.free}
                            interval="year"
                            currentPlan={subscription?.plan === "Free"}
                        />

                        <PlanCard
                            plan="Pro"
                            price="$180"
                            features={t.features.pro}
                            interval="year"
                            priceId={PRICE_IDS.PRO_YEARLY}
                            popular
                            currentPlan={subscription?.plan === "Pro" && subscription?.billingCycle === "annually"}
                        />

                        <PlanCard
                            plan="Business"
                            price="$470"
                            features={t.features.business}
                            interval="year"
                            priceId={PRICE_IDS.BUSINESS_YEARLY}
                            currentPlan={subscription?.plan === "Business" && subscription?.billingCycle === "annually"}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 