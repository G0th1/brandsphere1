"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { STRIPE_PRICES, StripeService } from '@/services/stripe-service';
import SubscriptionService, { UserSubscription } from '@/services/subscription-service';
import { AuthGuard, useAuthUser } from '@/app/components/auth-guard';
import { createSafeSupabaseClient } from '@/app/utils/supabase-client';
import { dynamic } from "@/app/utils/dynamic-routes";

// Re-export the dynamic marker
export { dynamic };

export default function SubscribePage() {
  return (
    <AuthGuard>
      <SubscribePageContent />
    </AuthGuard>
  );
}

function SubscribePageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSafeSupabaseClient();
  const user = useAuthUser();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        // Check if the user already has a subscription
        const userSubscription = await SubscriptionService.getUserSubscription();
        setSubscription(userSubscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, [user]);

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
      const response = await StripeService.createPortalSession({
        customerId: user.id,
        returnUrl: `${origin}/dashboard/subscribe`,
      });

      if (response && response.url) {
        router.push(response.url);
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: "Error",
        description: "Unable to access subscription management. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user already has an active subscription
  if (subscription && subscription.status === 'active') {
    return (
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">You currently have an active subscription.</p>
        </div>

        <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardHeader>
            <CardTitle>Active Subscription</CardTitle>
            <CardDescription>
              You are currently subscribed to the {subscription.plan} plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {subscription.status}</p>
              <p><strong>Plan:</strong> {subscription.plan}</p>
              {subscription.currentPeriodEnd && (
                <p><strong>Current period ends:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
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

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need help with your subscription? Contact our support team at support@brandsphereai.com
          </p>
        </div>
      </div>
    );
  }

  // Display subscription plans for users without an active subscription
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the plan that best fits your needs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <CardHeader>
            <CardTitle>Basic Plan</CardTitle>
            <CardDescription>Perfect for individuals and small teams</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Up to 5 social media accounts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Schedule up to 30 posts per month</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(STRIPE_PRICES.BASIC)}
              disabled={loading && selectedPlan === STRIPE_PRICES.BASIC}
            >
              {loading && selectedPlan === STRIPE_PRICES.BASIC ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe to Basic'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden border-primary">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-700" />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Popular
          </div>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>Advanced features for growing businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$24.99</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited social media accounts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Advanced analytics and reporting</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited scheduled posts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>AI content suggestions</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(STRIPE_PRICES.PRO)}
              disabled={loading && selectedPlan === STRIPE_PRICES.PRO}
            >
              {loading && selectedPlan === STRIPE_PRICES.PRO ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe to Pro'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          All plans include a 14-day free trial. No credit card required until the trial ends.
        </p>
      </div>
    </div>
  );
} 