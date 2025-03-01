"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { STRIPE_PRICES, StripeService } from '@/services/stripe-service';
import SubscriptionService, { UserSubscription } from '@/services/subscription-service';

export default function SubscribePage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        
        // Check if the user already has a subscription
        try {
          const userSubscription = await SubscriptionService.getUserSubscription();
          setSubscription(userSubscription);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        } finally {
          setLoadingSubscription(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router, supabase]);
  
  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "Please sign in before subscribing.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setSelectedPlan(priceId);
    
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      const response = await StripeService.createCheckoutSession({
        priceId,
        successUrl: `${origin}/dashboard/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/dashboard/subscribe`,
        customerId: user.id,
        customerEmail: user.email,
      });
      
      // Redirect to Stripe Checkout
      if (response && response.url) {
        router.push(response.url);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Unable to create a payment session. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await StripeService.createCustomerPortalLink(
        user.id,
        `${origin}/dashboard`
      );
      
      if (response && response.url) {
        router.push(response.url);
      }
    } catch (error) {
      console.error('Error creating customer portal link:', error);
      toast({
        title: "Error",
        description: "Unable to open subscription management. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading status if we're still fetching user info
  if (loadingSubscription || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If the user already has an active subscription
  if (subscription && subscription.isActive && subscription.plan !== 'free') {
    return (
      <div className="container mx-auto max-w-4xl py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Manage Your Subscription</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You already have an active subscription. Manage or upgrade your plan here.
          </p>
        </div>
        
        <Card className="w-full mb-10">
          <CardHeader>
            <CardTitle>Your Current Plan</CardTitle>
            <CardDescription>
              {subscription.renewalDate 
                ? `Your subscription is active until ${subscription.renewalDate.toLocaleDateString()}`
                : 'Your subscription is currently active'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Plan:</span>
                <span>{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span className="text-green-600">Active</span>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md">
                  Your subscription is set to cancel at the end of the current period.
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleManageSubscription} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Manage Subscription'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-5xl py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose Subscription Plan</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upgrade to unlock all features in BrandSphereAI
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {/* Free plan */}
        <Card className="flex flex-col border-muted">
          <CardHeader>
            <CardTitle>{STRIPE_PRICES.FREE.name}</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <CardDescription>Get started with social media</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {STRIPE_PRICES.FREE.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Your Current Plan
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Monthly plan */}
        <Card className="flex flex-col border-primary">
          <CardHeader>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm w-fit">
              Popular
            </div>
            <CardTitle className="mt-4">{STRIPE_PRICES.PRO_MONTHLY.name}</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">${(STRIPE_PRICES.PRO_MONTHLY.price / 100).toFixed(0)}</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <CardDescription>For serious content creators</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {STRIPE_PRICES.PRO_MONTHLY.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(STRIPE_PRICES.PRO_MONTHLY.id)}
              disabled={loading && selectedPlan === STRIPE_PRICES.PRO_MONTHLY.id}
            >
              {loading && selectedPlan === STRIPE_PRICES.PRO_MONTHLY.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Yearly plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm w-fit">
              Save 17%
            </div>
            <CardTitle className="mt-4">{STRIPE_PRICES.PRO_YEARLY.name}</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">${(STRIPE_PRICES.PRO_YEARLY.price / 100).toFixed(0)}</span>
              <span className="text-muted-foreground"> / year</span>
              <div className="text-sm text-muted-foreground mt-1">
                Equivalent to ${((STRIPE_PRICES.PRO_YEARLY.price / 12) / 100).toFixed(0)} / month
              </div>
            </div>
            <CardDescription>Best value for money</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {STRIPE_PRICES.PRO_YEARLY.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(STRIPE_PRICES.PRO_YEARLY.id)}
              disabled={loading && selectedPlan === STRIPE_PRICES.PRO_YEARLY.id}
            >
              {loading && selectedPlan === STRIPE_PRICES.PRO_YEARLY.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-10 text-center text-sm text-muted-foreground">
        <p>
          All payments are securely processed via Stripe. You can cancel your subscription at any time.
        </p>
        <p className="mt-1">
          Need help? Contact us at{' '}
          <a href="mailto:support@brandsphereai.com" className="text-primary hover:underline">
            support@brandsphereai.com
          </a>
        </p>
      </div>
    </div>
  );
} 