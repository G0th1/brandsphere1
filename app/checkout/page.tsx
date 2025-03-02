"use client"

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { ChevronLeft, Check, CreditCard, Lock, Loader2 } from 'lucide-react'
import { useTranslation, useLanguage } from '@/contexts/language-context'
import { checkoutTranslations } from '@/lib/translations'

// Deklarera plans-objektet med korrekt typning
interface Plan {
  name: string;
  description: string;
  price: number;
  priceId: string;
  features: string[];
  period: string;
}

// Svenska och engelska versioner av planerna
const plansData = {
  en: {
    basic: {
      name: 'Basic',
      description: 'For personal use',
      price: 99,
      priceId: 'price_basic',
      features: ['3 social accounts', 'Scheduling', 'Basic analytics'],
      period: '/month'
    },
    pro: {
      name: 'Pro',
      description: 'For professionals and small businesses',
      price: 249,
      priceId: 'price_pro',
      features: ['10 social accounts', 'Advanced scheduling', 'Comprehensive analytics', 'Priority support'],
      period: '/month'
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations',
      price: 0,
      priceId: 'contact_sales',
      features: ['Unlimited accounts', 'Dedicated support', 'Custom features', 'API access'],
      period: ''
    }
  },
  sv: {
    basic: {
      name: 'Basic',
      description: 'För personligt bruk',
      price: 99,
      priceId: 'price_basic',
      features: ['3 sociala konton', 'Schemaläggning', 'Analys av grundläggande statistik'],
      period: 'kr/månad'
    },
    pro: {
      name: 'Pro',
      description: 'För professionella och småföretag',
      price: 249,
      priceId: 'price_pro',
      features: ['10 sociala konton', 'Avancerad schemaläggning', 'Omfattande analys', 'Prioriterad support'],
      period: 'kr/månad'
    },
    enterprise: {
      name: 'Enterprise',
      description: 'För stora företag',
      price: 0,
      priceId: 'contact_sales',
      features: ['Obegränsade konton', 'Dedikerad support', 'Anpassade funktioner', 'API-tillgång'],
      period: ''
    }
  }
};

// Komponent som använder searchParams
function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslation(checkoutTranslations)
  const { language } = useLanguage()

  // Get plan from URL parameters, default to 'pro'
  const planId = searchParams.get('plan') || 'pro'
  const plans = plansData[language]
  const plan = plans[planId as keyof typeof plans] || plans.pro

  // If enterprise plan is selected, redirect to contact page
  useEffect(() => {
    if (plan.priceId === 'contact_sales') {
      router.push('/contact')
    }
  }, [plan.priceId, router])

  // Form state variables
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  // Validera kreditkort
  const validateCard = () => {
    // Enkel validering för demo-syfte
    if (!cardName || cardName.length < 3) return false;
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) return false;
    if (!cardExpiry || !cardExpiry.includes('/')) return false;
    if (!cardCvc || cardCvc.length !== 3) return false;
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (!validateCard()) {
      toast({
        title: t.errors.incompleteForm,
        description: t.errors.incompleteForm,
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Simulera betalningsprocessen med Promise
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // För demo: slumpmässigt avgör om betalningen lyckas (80% chans) eller misslyckas (20% chans)
          const isSuccessful = Math.random() < 0.8;

          if (isSuccessful) {
            resolve();
          } else {
            reject(new Error("Payment processing failed"));
          }
        }, 2000);
      });

      // Vid framgång
      toast({
        title: t.success.title,
        description: t.success.description
      })

      // Omdirigera till dashboard efter lyckad betalning
      router.push('/dashboard')
    } catch (err) {
      // Vid fel
      console.error("Checkout error:", err);
      setError(t.errors.processingError)
      toast({
        title: t.errors.processingError,
        description: t.errors.processingError,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Format card number with spaces (4 digits groups)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  // Format expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/pricing')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t.backToPlans}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.paymentDetails}</CardTitle>
                <CardDescription>{t.cardInformation}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.nameOnCard}</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">{t.cardNumber}</Label>
                    <Input
                      id="number"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">{t.expiryDate}</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">{t.securityCode}</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-destructive text-sm">{error}</div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.processingPayment}
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        {t.completeCheckout}
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    <Lock className="inline h-3 w-3 mr-1" />
                    {t.securityText}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t.selected}</span>
                  <span className="font-semibold">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span>{plan.price} {plan.period}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>{t.total}</span>
                  <span>{plan.price} {plan.period}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full border-t my-4"></div>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>{t.guaranteeText}</p>
                  <p>{t.accessText}</p>
                </div>
              </CardFooter>
            </Card>

            <div className="mt-4 text-sm text-muted-foreground text-center space-y-2">
              <p>{t.questionsText} <a href="/contact" className="text-primary underline">{t.contactUs}</a></p>
              <p>{t.termsAgreement} <a href="/terms" className="text-primary underline">{t.termsLink}</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback för suspense
function CheckoutLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

// Huvud-komponenten som wrapar suspense
export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  )
} 