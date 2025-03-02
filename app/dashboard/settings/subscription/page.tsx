"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { CalendarClock, CreditCard, Package, Shield, AlertCircle, Check, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface Subscription {
    id?: string;
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
    currentPeriodEnd: Date;
    plan: string;
    billingCycle: 'monthly' | 'annually';
}

const mockSubscription: Subscription = {
    id: "sub_mock123456",
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar framåt
    plan: 'Pro',
    billingCycle: 'monthly'
};

const translations = {
    en: {
        title: "Subscription Management",
        subtitle: "Manage your BrandSphereAI subscription",
        currentPlan: {
            title: "Current Plan",
            status: "Status",
            renewalDate: "Next renewal",
            billingCycle: "Billing cycle",
            statuses: {
                active: "Active",
                canceled: "Canceled",
                past_due: "Past due",
                trialing: "Trial",
                unpaid: "Unpaid"
            },
            cycles: {
                monthly: "Monthly",
                annually: "Annually"
            }
        },
        actions: {
            title: "Subscription Actions",
            upgrade: "Upgrade Plan",
            cancel: "Cancel Subscription",
            resume: "Resume Subscription",
            update: "Update Payment Method",
            cancelConfirm: "Are you sure you want to cancel your subscription? You will have access to your features until the end of your current billing period.",
            cancelSuccess: "Your subscription has been canceled. You have access to your current features until the end of the billing period.",
            resumeSuccess: "Your subscription has been resumed successfully.",
            loading: "Processing..."
        },
        usage: {
            title: "Resource Usage",
            social: "Social accounts",
            posts: "Monthly posts",
            storage: "Storage",
            of: "of"
        },
        faq: {
            title: "Frequently Asked Questions",
            questions: [
                {
                    question: "How do I upgrade my plan?",
                    answer: "You can upgrade your plan at any time by clicking the 'Upgrade Plan' button. Your new plan will be effective immediately, and you'll only be charged the prorated difference for the current billing period."
                },
                {
                    question: "What happens if I cancel?",
                    answer: "If you cancel your subscription, you'll still have access to your plan's features until the end of your current billing period. After that, your account will be downgraded to the Free plan."
                },
                {
                    question: "Can I get a refund?",
                    answer: "We offer prorated refunds if you downgrade your plan. For full refund requests, please contact our support team within 14 days of payment."
                }
            ]
        },
        needHelp: "Need more help?",
        contactSupport: "Contact Support",
        benefits: {
            title: "Benefits of your Pro plan",
            items: [
                "Up to 10 social media accounts",
                "Unlimited scheduled posts",
                "Advanced analytics",
                "AI content generation",
                "Priority email support"
            ]
        }
    },
    sv: {
        title: "Prenumerationshantering",
        subtitle: "Hantera din BrandSphereAI-prenumeration",
        currentPlan: {
            title: "Aktuell plan",
            status: "Status",
            renewalDate: "Nästa förnyelse",
            billingCycle: "Faktureringsperiod",
            statuses: {
                active: "Aktiv",
                canceled: "Avslutad",
                past_due: "Förfallen",
                trialing: "Provperiod",
                unpaid: "Obetald"
            },
            cycles: {
                monthly: "Månadsvis",
                annually: "Årsvis"
            }
        },
        actions: {
            title: "Prenumerationsåtgärder",
            upgrade: "Uppgradera plan",
            cancel: "Avsluta prenumeration",
            resume: "Återuppta prenumeration",
            update: "Uppdatera betalningsmetod",
            cancelConfirm: "Är du säker på att du vill avsluta din prenumeration? Du kommer att ha tillgång till dina funktioner fram till slutet av din nuvarande faktureringsperiod.",
            cancelSuccess: "Din prenumeration har avslutats. Du har tillgång till dina nuvarande funktioner fram till slutet av faktureringsperioden.",
            resumeSuccess: "Din prenumeration har återupptagits.",
            loading: "Bearbetar..."
        },
        usage: {
            title: "Resursanvändning",
            social: "Sociala konton",
            posts: "Månatliga inlägg",
            storage: "Lagring",
            of: "av"
        },
        faq: {
            title: "Vanliga frågor",
            questions: [
                {
                    question: "Hur uppgraderar jag min plan?",
                    answer: "Du kan uppgradera din plan när som helst genom att klicka på 'Uppgradera plan'. Din nya plan kommer att aktiveras omedelbart, och du debiteras endast den proportionella skillnaden för den aktuella faktureringsperioden."
                },
                {
                    question: "Vad händer om jag avslutar min prenumeration?",
                    answer: "Om du avslutar din prenumeration har du fortfarande tillgång till din plans funktioner fram till slutet av din nuvarande faktureringsperiod. Därefter nedgraderas ditt konto till gratisplanen."
                },
                {
                    question: "Kan jag få återbetalning?",
                    answer: "Vi erbjuder proportionell återbetalning om du nedgraderar din plan. För fullständiga återbetalningsbegäranden, kontakta vårt supportteam inom 14 dagar efter betalning."
                }
            ]
        },
        needHelp: "Behöver du mer hjälp?",
        contactSupport: "Kontakta support",
        benefits: {
            title: "Fördelar med din Pro-plan",
            items: [
                "Upp till 10 sociala mediekonton",
                "Obegränsat antal schemalagda inlägg",
                "Avancerad analys",
                "AI-innehållsgenerering",
                "Prioriterad e-postsupport"
            ]
        }
    }
};

// Användningsstatistik för demo
const usageData = {
    social: { used: 4, total: 10 },
    posts: { used: 157, total: 500 },
    storage: { used: 2.1, total: 10 }
};

export default function SubscriptionManagementPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Här skulle du hämta användarens prenumerationsdata från din API/databas
        // För demo-syften använder vi mockdata
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                // Ersätt denna mockdata med ett riktigt API-anrop
                const response = await fetch('/api/subscription');

                if (!response.ok) {
                    throw new Error('Kunde inte hämta prenumerationsdata');
                }

                const data = await response.json();
                setSubscription(data);
            } catch (error) {
                console.error("Failed to fetch subscription", error);
                toast({
                    title: language === 'sv' ? "Kunde inte hämta prenumerationsinformation" : "Failed to load subscription data",
                    description: language === 'sv' ? "Vänligen försök igen senare" : "Please try again later",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [toast, language]);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(language === 'sv' ? 'sv-SE' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const handleCancelSubscription = async () => {
        if (!subscription?.id) return;

        if (confirm(t.actions.cancelConfirm)) {
            setActionLoading(true);

            try {
                const response = await fetch('/api/subscription/cancel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ subscriptionId: subscription.id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || errorData.error || 'Kunde inte avsluta prenumerationen');
                }

                const data = await response.json();
                // Uppdatera lokal status med data från servern
                setSubscription(data);

                // Visa toast-meddelande
                toast({
                    title: language === 'sv' ? "Prenumeration avslutad" : "Subscription canceled",
                    description: t.actions.cancelSuccess,
                    variant: "default"
                });
            } catch (error) {
                console.error("Error canceling subscription:", error);
                toast({
                    title: language === 'sv' ? "Ett fel uppstod" : "An error occurred",
                    description: error instanceof Error ? error.message : "Kunde inte avsluta prenumerationen",
                    variant: "destructive"
                });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleResumeSubscription = async () => {
        if (!subscription?.id) return;

        setActionLoading(true);

        try {
            const response = await fetch('/api/subscription/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId: subscription.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Kunde inte återuppta prenumerationen');
            }

            const data = await response.json();
            // Uppdatera lokal status med data från servern
            setSubscription(data);

            // Visa toast-meddelande
            toast({
                title: language === 'sv' ? "Prenumeration återupptagen" : "Subscription resumed",
                description: t.actions.resumeSuccess,
                variant: "default"
            });
        } catch (error) {
            console.error("Error resuming subscription:", error);
            toast({
                title: language === 'sv' ? "Ett fel uppstod" : "An error occurred",
                description: error instanceof Error ? error.message : "Kunde inte återuppta prenumerationen",
                variant: "destructive"
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-8"></div>

                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-8">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="md:col-span-2">
                                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        {t.subtitle}
                    </p>

                    {subscription ? (
                        <>
                            {/* Aktuell prenumerationsinfo */}
                            <Card className="p-6 mb-8 border-2 border-primary/10">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <Package className="mr-2 h-5 w-5" />
                                    {t.currentPlan.title}: {subscription.plan}
                                </h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500" id="subscription-status-label">{t.currentPlan.status}</p>
                                        <p className="font-medium flex items-center" aria-labelledby="subscription-status-label">
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full mr-2 ${subscription.status === 'active' ? 'bg-green-500' :
                                                    subscription.status === 'canceled' ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                aria-hidden="true"
                                            ></span>
                                            {t.currentPlan.statuses[subscription.status]}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">{t.currentPlan.renewalDate}</p>
                                        <p className="font-medium flex items-center">
                                            <CalendarClock className="mr-2 h-4 w-4 text-gray-500" />
                                            {formatDate(subscription.currentPeriodEnd)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">{t.currentPlan.billingCycle}</p>
                                        <p className="font-medium flex items-center">
                                            <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                                            {t.currentPlan.cycles[subscription.billingCycle]}
                                        </p>
                                    </div>
                                </div>

                                {/* Resursanvändning */}
                                {subscription.status === 'active' && (
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                        <h3 className="font-semibold mb-4">{t.usage.title}</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-1 text-sm">
                                                    <span id="social-usage-label">{t.usage.social}</span>
                                                    <span>{usageData.social.used} {t.usage.of} {usageData.social.total}</span>
                                                </div>
                                                <Progress
                                                    value={(usageData.social.used / usageData.social.total) * 100}
                                                    className="h-2"
                                                    aria-labelledby="social-usage-label"
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={(usageData.social.used / usageData.social.total) * 100}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-1 text-sm">
                                                    <span id="posts-usage-label">{t.usage.posts}</span>
                                                    <span>{usageData.posts.used} {t.usage.of} {usageData.posts.total}</span>
                                                </div>
                                                <Progress
                                                    value={(usageData.posts.used / usageData.posts.total) * 100}
                                                    className="h-2"
                                                    aria-labelledby="posts-usage-label"
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={(usageData.posts.used / usageData.posts.total) * 100}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-1 text-sm">
                                                    <span id="storage-usage-label">{t.usage.storage}</span>
                                                    <span>{usageData.storage.used} GB {t.usage.of} {usageData.storage.total} GB</span>
                                                </div>
                                                <Progress
                                                    value={(usageData.storage.used / usageData.storage.total) * 100}
                                                    className="h-2"
                                                    aria-labelledby="storage-usage-label"
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={(usageData.storage.used / usageData.storage.total) * 100}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Prenumerationsåtgärder */}
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {/* Åtgärder */}
                                <div className="md:col-span-2">
                                    <Card className="p-6 h-full">
                                        <h2 className="text-xl font-bold mb-4">{t.actions.title}</h2>
                                        <div className="flex flex-wrap gap-4">
                                            <Button asChild className="flex gap-2">
                                                <Link href="/pricing">
                                                    <span>{t.actions.upgrade}</span>
                                                </Link>
                                            </Button>

                                            <Button variant="outline" asChild className="flex gap-2">
                                                <Link href="#">
                                                    <CreditCard className="h-4 w-4" />
                                                    <span>{t.actions.update}</span>
                                                </Link>
                                            </Button>

                                            {subscription.status === 'active' ? (
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleCancelSubscription}
                                                    disabled={actionLoading}
                                                    className="flex gap-2"
                                                    aria-label={t.actions.cancel}
                                                >
                                                    {actionLoading ? (
                                                        <>
                                                            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                                                            <span>{t.actions.loading}</span>
                                                        </>
                                                    ) : (
                                                        <span>{t.actions.cancel}</span>
                                                    )}
                                                </Button>
                                            ) : subscription.status === 'canceled' ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={handleResumeSubscription}
                                                    disabled={actionLoading}
                                                    className="flex gap-2"
                                                    aria-label={t.actions.resume}
                                                >
                                                    {actionLoading ? (
                                                        <>
                                                            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                                                            <span>{t.actions.loading}</span>
                                                        </>
                                                    ) : (
                                                        <span>{t.actions.resume}</span>
                                                    )}
                                                </Button>
                                            ) : null}
                                        </div>
                                    </Card>
                                </div>

                                {/* Fördelar med din plan */}
                                <div className="md:col-span-1">
                                    <Card className="p-6 h-full bg-primary/5">
                                        <h2 className="text-lg font-bold mb-4">{t.benefits.title}</h2>
                                        <ul className="space-y-2">
                                            {t.benefits.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Card className="p-6 mb-8 text-center">
                            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">
                                {language === 'sv' ? 'Ingen aktiv prenumeration' : 'No active subscription'}
                            </h2>
                            <p className="mb-4">
                                {language === 'sv'
                                    ? 'Du har för närvarande ingen aktiv prenumeration. Uppgradera för att få tillgång till alla funktioner.'
                                    : 'You currently have no active subscription. Upgrade to access all features.'}
                            </p>
                            <Button asChild>
                                <Link href="/pricing">
                                    {language === 'sv' ? 'Visa prisplaner' : 'View pricing plans'}
                                </Link>
                            </Button>
                        </Card>
                    )}

                    {/* FAQ-sektion */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">{t.faq.title}</h2>
                        <div className="space-y-4">
                            {t.faq.questions.map((faq, index) => (
                                <Card key={index} className="p-4">
                                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-bold mb-2">{t.needHelp}</h3>
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