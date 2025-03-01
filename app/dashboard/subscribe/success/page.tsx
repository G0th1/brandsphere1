"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionService from '@/services/subscription-service';

// Komponent för innehåll som använder useSearchParams
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  // Get the session_id from URL
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    async function verifySubscription() {
      try {
        // First check if we have user logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('You need to be logged in to verify your subscription');
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        // Check if session ID exists
        if (!sessionId) {
          setError('No session ID provided');
          setLoading(false);
          return;
        }
        
        // Here we would normally verify the checkout session with Stripe
        // For this example, we'll just check if the session ID exists
        if (sessionId) {
          // In a real app, we'd make an API call to verify the session and activate subscription
          // For this demo, we'll just wait 1 second to simulate the API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update subscription status in user profile
          try {
            await SubscriptionService.getUserSubscription();
            
            toast({
              title: "Subscription activated",
              description: "Your Pro plan is now active",
            });
            
            setVerificationSuccess(true);
            setLoading(false);
          } catch (error) {
            console.error('Error updating subscription status:', error);
            setError('An error occurred while updating your subscription');
            setLoading(false);
          }
        } else {
          setError('Invalid session');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error verifying subscription:', error);
        setError('An error occurred while verifying your subscription');
        setLoading(false);
      }
    }
    
    verifySubscription();
  }, [sessionId, supabase, toast]);
  
  // Handle case where there's no session ID
  if (!sessionId && !loading) {
    return (
      <main className="flex-1 container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Missing Information</CardTitle>
            <CardDescription>
              Session information is missing. Please try subscribing again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => router.push('/dashboard/subscribe')}
              className="w-full"
            >
              Back to Subscription Page
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }
  
  // Show loading state
  if (loading) {
    return (
      <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Verifying your subscription...</p>
        </div>
      </main>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <main className="flex-1 container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Verification Error</CardTitle>
            <CardDescription>
              There was a problem verifying your subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push('/dashboard/subscribe')}
              className="w-full"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }
  
  // Show success state
  return (
    <main className="flex-1 container mx-auto p-6">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center pb-10">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          <CardDescription className="text-base mt-2">
            Thank you for subscribing to the Pro plan. Your account has been upgraded.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-medium mb-2">Next Steps</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access premium features and generate unlimited content</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Connect all your social media accounts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Schedule posts and manage your content calendar</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            className="w-full sm:w-auto"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => router.push('/dashboard/create')}
          >
            Create First Post
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Having trouble with your subscription? <Link href="/contact" className="text-primary underline">Contact our support team</Link></p>
      </div>
    </main>
  );
}

// Loading fallback
function SuccessLoading() {
  return (
    <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-lg">Laddar prenumerationsinformation...</p>
      </div>
    </main>
  );
}

// Huvudkomponenten med suspense wrapper
export default function SubscriptionSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
} 