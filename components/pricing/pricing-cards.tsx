'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { STRIPE_PRICES } from '@/lib/stripe';

interface PricingCardsProps {
    plans: Array<{
        id: string;
        name: string;
        description: string;
        price: {
            monthly: number;
            annually: number;
        };
        features: string[];
        highlighted?: boolean;
        currentPlan?: boolean;
    }>;
    userId?: string;
    userEmail?: string;
}

export default function PricingCards({ plans, userId, userEmail }: PricingCardsProps) {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    // Listen for billing period changes from the toggle in PricingHeader
    useEffect(() => {
        const handleBillingChange = (e: any) => {
            setBillingPeriod(e.detail.billingPeriod);
        };

        document.addEventListener('billing-period-change', handleBillingChange);

        return () => {
            document.removeEventListener('billing-period-change', handleBillingChange);
        };
    }, []);

    const handlePlanSelection = async (planId: string) => {
        if (!userId) {
            // Redirect to sign in if user is not logged in
            router.push(`/auth/login?callbackUrl=/pricing`);
            return;
        }

        // Don't do anything if this is already the user's current plan
        if (plans.find(p => p.id === planId)?.currentPlan) {
            toast({
                title: "Already subscribed",
                description: "You are already subscribed to this plan. Go to your profile to manage your subscription.",
                variant: "default",
            });
            return;
        }

        // Free plan doesn't require payment
        if (planId === 'FREE') {
            // Handle downgrade to free plan
            setIsLoading(planId);
            try {
                const response = await fetch('/api/stripe/cancel-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to downgrade to free plan');
                }

                toast({
                    title: "Plan downgraded",
                    description: "Your subscription has been cancelled and you are now on the free plan.",
                    variant: "default",
                });

                router.push('/dashboard');
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "There was a problem downgrading your plan. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(null);
            }
            return;
        }

        // For paid plans, create a checkout session
        setIsLoading(planId);
        try {
            // Get the appropriate price ID
            const priceId = STRIPE_PRICES[planId as keyof typeof STRIPE_PRICES]?.[billingPeriod];

            if (!priceId) {
                throw new Error(`Price ID not found for plan ${planId} with billing period ${billingPeriod}`);
            }

            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    successUrl: `${window.location.origin}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: `${window.location.origin}/pricing`,
                    customerEmail: userEmail,
                    metadata: {
                        userId,
                        plan: planId,
                        billingPeriod,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url } = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "There was a problem creating your checkout session. Please try again.",
                variant: "destructive",
            });
            setIsLoading(null);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
                <Card
                    key={plan.id}
                    className={`flex flex-col ${plan.highlighted
                        ? 'border-primary shadow-lg shadow-primary/20 relative overflow-hidden'
                        : ''
                        }`}
                >
                    {plan.highlighted && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                            <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shadow-md">
                                <div>
                                    <div className="text-center font-bold">MOST</div>
                                    <div className="text-center font-bold">POPULAR</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <CardHeader>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                            ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.annually}
                            <span className="ml-1 text-xl font-medium text-muted-foreground">
                                /{billingPeriod === 'monthly' ? 'month' : 'year'}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-grow">
                        <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                                        <CheckIcon className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter>
                        <Button
                            size="lg"
                            className="w-full"
                            variant={plan.highlighted ? "default" : "outline"}
                            disabled={isLoading !== null || plan.currentPlan}
                            onClick={() => handlePlanSelection(plan.id)}
                        >
                            {isLoading === plan.id && (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                            )}
                            {plan.currentPlan
                                ? "Current Plan"
                                : plan.id === 'FREE'
                                    ? "Downgrade to Free"
                                    : "Get Started"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
} 