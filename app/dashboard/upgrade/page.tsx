"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User } from "@supabase/supabase-js"
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

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.replace("/login")
        return
      }
      
      setUser(session.user)
      setLoading(false)
    }
    
    getUser()
  }, [router, supabase])

  const handleUpgrade = async () => {
    setProcessingPayment(true)
    
    // Här skulle vi normalt sett integrera med ett betalningssystem som Stripe
    // Men för demonstration simulerar vi en betalningsprocess
    
    try {
      // Simulera API-anrop för att ställa in prenumerationen
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Uppdatera användarprofilen med den nya prenumerationsstatusen
      // I en riktig implementation skulle detta troligen hanteras av en webhook från betalningsleverantören
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: 'pro' })
        .eq('id', user?.id)
      
      if (error) throw error
      
      // Omdirigera till dashboard med ett framgångsmeddelande
      router.push('/dashboard?upgraded=true')
    } catch (error) {
      console.error('Uppgraderingsfel:', error)
      setProcessingPayment(false)
      // Här skulle vi visa ett felmeddelande
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Laddar...</div>
      </div>
    )
  }

  const proFeatures = [
    "Hantera upp till 10 sociala mediekonton",
    "Avancerad statistik och insikter",
    "AI-genererade innehållsförslag",
    "Obegränsade inlägg",
    "Schemaläggning av inlägg",
    "Prioriterad support"
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
            Tillbaka till dashboard
          </Link>
        </div>
      </header>
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Uppgradera till Pro
              </h1>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                Få tillgång till avancerade funktioner och obegränsade möjligheter för att maximera din närvaro på sociala medier.
              </p>
            </div>
            
            <Card className="border-accent/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center border-b pb-8">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Pro-plan</CardTitle>
                <div className="mt-1 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">199 kr</span>
                  <span className="ml-1 text-muted-foreground">/månad</span>
                </div>
                <CardDescription className="mt-3 flex items-center justify-center text-accent">
                  <span className="font-medium">50% rabatt!</span>
                  <span className="ml-2 text-muted-foreground line-through">Normalt: 398 kr/månad</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="font-medium">Du får tillgång till:</div>
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
                  <div className="font-medium">Inkluderat i alla planer:</div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">14 dagars pengarna-tillbaka-garanti</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Ingen bindningstid - avsluta när som helst</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Säker betalning via kortbetalning eller faktura</span>
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
                  {processingPayment ? "Bearbetar betalning..." : "Uppgradera till Pro nu"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Genom att klicka på "Uppgradera" godkänner du våra <Link href="/terms" className="underline hover:text-foreground">användarvillkor</Link> och <Link href="/privacy" className="underline hover:text-foreground">integritetspolicy</Link>.
                </p>
              </CardFooter>
            </Card>
            
            <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
              <p>
                Har du frågor om våra planer? <Link href="/contact" className="text-primary hover:underline">Kontakta vårt team</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 