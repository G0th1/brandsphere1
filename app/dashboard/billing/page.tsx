"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCard } from "@/components/billing/plan-card";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { dynamic } from "@/app/utils/dynamic-routes";
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { hasActiveSubscription, PLAN_FEATURES } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, CreditCardIcon, InfoIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import BillingPortalButton from '@/components/billing/billing-portal-button';
import SubscriptionStatusBadge from '@/components/billing/subscription-status-badge';

export const metadata: Metadata = {
    title: 'Billing - BrandSphere',
    description: 'Manage your subscription and billing information',
};

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

export default async function BillingPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/dashboard/billing');
    }

    // Get user subscription
    const subscription = await db.subscription.findUnique({
        where: { userId: session.user.id },
    });

    // Get user's current plan features
    const planKey = subscription?.plan?.toUpperCase() as keyof typeof PLAN_FEATURES || 'FREE';
    const planFeatures = PLAN_FEATURES[planKey];

    // Format dates
    const currentPeriodEnd = subscription?.stripeCurrentPeriodEnd
        ? new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    const createdAt = subscription?.createdAt
        ? new Date(subscription.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    return (
        <div className="container max-w-5xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your subscription, payment methods, and billing information
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Current Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Current Plan</span>
                            {subscription && (
                                <SubscriptionStatusBadge status={subscription.status} />
                            )}
                        </CardTitle>
                        <CardDescription>
                            Your current subscription plan and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold">{planFeatures.name}</h3>
                            {subscription && subscription.billingCycle && (
                                <p className="text-muted-foreground">
                                    {subscription.billingCycle === 'monthly'
                                        ? `$${planFeatures.price.monthly}/month`
                                        : `$${planFeatures.price.annually}/year`}
                                </p>
                            )}
                        </div>

                        {subscription?.status === 'active' && currentPeriodEnd && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Current period ends on {currentPeriodEnd}</span>
                            </div>
                        )}

                        {subscription?.status === 'canceled' && currentPeriodEnd && (
                            <Alert variant="warning" className="mt-4">
                                <AlertTriangleIcon className="h-4 w-4" />
                                <AlertTitle>Subscription Canceled</AlertTitle>
                                <AlertDescription>
                                    Your subscription has been canceled and will end on {currentPeriodEnd}.
                                    After this date, your account will be downgraded to the Free plan.
                                </AlertDescription>
                            </Alert>
                        )}

                        {subscription?.status === 'past_due' && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTriangleIcon className="h-4 w-4" />
                                <AlertTitle>Payment Past Due</AlertTitle>
                                <AlertDescription>
                                    Your latest payment failed. Please update your payment method to
                                    avoid service interruption.
                                </AlertDescription>
                            </Alert>
                        )}

                        {!subscription && (
                            <Alert className="mt-4">
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Free Plan</AlertTitle>
                                <AlertDescription>
                                    You are currently on the Free plan with limited features.
                                    Upgrade to unlock more capabilities.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <BillingPortalButton
                            customerId={subscription?.stripeCustomerId}
                            className="w-full"
                        />

                        <Button variant="outline" className="w-full" asChild>
                            <a href="/pricing">View Plans & Upgrade</a>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Plan Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Features</CardTitle>
                        <CardDescription>
                            Your current plan includes the following features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.socialAccounts} social media accounts</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.scheduledPosts} scheduled posts per month</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.aiCreditsPerMonth} AI credits per month</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.contentSuggestions} content suggestions per month</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.analyticsRetentionDays}-day analytics retention</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.teamMembers} team members</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                                <span>{planFeatures.customBranding ? 'Custom branding' : 'Standard branding'}</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="/pricing">Compare Plans</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Billing History */}
            {subscription && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Billing History</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                            <CardDescription>
                                View and download your recent invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <p className="text-muted-foreground">
                                    To view your complete billing history and download invoices,
                                    please visit the Stripe billing portal.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <BillingPortalButton
                                customerId={subscription?.stripeCustomerId}
                                className="w-full"
                            />
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
} 