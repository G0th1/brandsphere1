"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CreditCard,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import AuthGuard from '@/app/components/auth-guard'

export default function UpgradePage() {
  return (
    <AuthGuard>
      <UpgradePageContent />
    </AuthGuard>
  )
}

function UpgradePageContent() {
  const [processingPayment, setProcessingPayment] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade your account.",
        variant: "destructive"
      })
      return
    }

    setProcessingPayment(true)

    try {
      // Create a Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1OxYzKLkswYnONGCpLrKFdnM', // Replace with your actual Stripe price ID
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
          cancelUrl: `${window.location.origin}/dashboard/upgrade?canceled=true`,
          customerEmail: user.email
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Upgrade error:', error)
      setProcessingPayment(false)
      toast({
        title: "Payment error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    )
  }

  const proFeatures = [
    "Manage up to 10 social media accounts",
    "Advanced analytics and insights",
    "AI-generated content suggestions",
    "Unlimited posts",
    "Post scheduling",
    "Priority support"
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link
            href="/dashboard"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Upgrade to Pro
              </h1>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                Get access to advanced features and unlimited possibilities to maximize your social media presence.
              </p>
            </div>

            <Card className="border-accent/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center border-b pb-8">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <div className="mt-1 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-3 flex items-center justify-center text-accent">
                  <span className="font-medium">50% off!</span>
                  <span className="ml-2 text-muted-foreground line-through">Normally: $39.99/month</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="font-medium">You'll get access to:</div>
                  <ul className="space-y-3">
                    {proFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="font-medium">Included in all plans:</div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">14-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">No commitment - cancel anytime</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Secure payment via credit card or invoice</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t p-6 flex flex-col gap-4">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base"
                  onClick={handleUpgrade}
                  disabled={processingPayment}
                >
                  {processingPayment ? "Processing payment..." : "Upgrade to Pro now"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By clicking "Upgrade" you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
                </p>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
              <p>
                Have questions about our plans? <Link href="/contact" className="text-primary hover:underline">Contact our team</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 