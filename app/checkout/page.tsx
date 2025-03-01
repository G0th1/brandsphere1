"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { ChevronLeft, Check, CreditCard, Lock, Loader2 } from 'lucide-react'

// Deklarera plans-objektet med korrekt typning
interface Plan {
  name: string;
  description: string;
  price: number;
  priceId: string;
  features: string[];
  period: string;
}

const plans: Record<string, Plan> = {
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

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Get plan from URL parameters, default to 'pro'
  const planId = searchParams.get('plan') || 'pro'
  const plan = plans[planId] || plans.pro
  
  // If enterprise plan is selected, redirect to contact page
  if (plan.priceId === 'contact_sales') {
    router.push('/contact')
    return null
  }
  
  // Form state variables
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      toast({
        title: "Form is incomplete",
        description: "Please fill in all fields.",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      
      toast({
        title: "Subscription activated!",
        description: "Your Pro plan is now active."
      })
      
      // Redirect to dashboard after successful payment
      router.push('/dashboard')
    }, 2000)
  }
  
  // Helper function to format card number
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
  
  // Helper function to format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    
    return v
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push('/pricing')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to pricing plans
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Fill in your payment details to activate your subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay {plan.price}
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center text-xs text-muted-foreground flex items-center justify-center mt-4">
                    <Lock className="h-3 w-3 mr-1" /> Secure payment with encryption
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-3xl font-bold">{plan.price}<span className="text-base font-normal text-muted-foreground">{plan.period}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">Pay monthly, cancel anytime</p>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 px-6 py-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>14-day money-back guarantee</p>
                    <p>Full access to all Pro features</p>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-4 text-sm text-muted-foreground text-center space-y-2">
                <p>Have questions? <a href="/contact" className="text-primary underline">Contact us</a></p>
                <p>By completing this purchase you agree to our <a href="/terms" className="text-primary underline">terms of service</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 