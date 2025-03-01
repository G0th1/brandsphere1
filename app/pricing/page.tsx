'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For hobby creators and beginners',
    features: [
      'Manage up to 3 social media accounts',
      'Basic statistics and insights',
      'Manual content creation',
      'Up to 10 posts per month',
      'Email support',
    ],
    cta: 'Get started for free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For content creators who want to grow',
    features: [
      'Manage up to 10 social media accounts',
      'Advanced statistics and insights',
      'AI-generated content suggestions',
      'Unlimited posts',
      'Post scheduling',
      'Priority support',
    ],
    cta: 'Start 7-day free trial',
    href: '/dashboard/subscribe',
    highlighted: true,
    special: 'MVP launch price - 50% off!',
    originalPrice: '$39',
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    description: 'For teams and larger organizations',
    features: [
      'Unlimited social media accounts',
      'Complete statistics and analysis',
      'AI-optimized content strategy',
      'Integration with marketing tools',
      'Team collaboration',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Contact us',
    href: '/contact',
    highlighted: false,
  },
]

export default function PricingPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Enkla och transparenta prisplaner
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Välj den plan som passar dina behov och väx tillsammans med oss. 
                  Alla planer inkluderar våra kärnfunktioner.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">14 dagars testperiod</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Ingen bindningstid</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Avsluta när som helst</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
              {pricingPlans.map((plan, index) => (
                <div 
                  key={plan.name} 
                  className={`flex flex-col rounded-lg border ${plan.highlighted ? "border-primary shadow-lg" : "border-border"} bg-card overflow-hidden`}
                >
                  {plan.highlighted && (
                    <div className="bg-primary py-1 text-xs font-medium text-center text-primary-foreground">
                      Populäraste valet
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground min-h-[40px]">
                      {plan.description}
                    </p>
                    <div className="mt-4 mb-8">
                      <p className="flex items-baseline">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      </p>
                    </div>

                    {/* Show original price if available */}
                    {plan.originalPrice && (
                      <p className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'} line-through mt-1`}>
                        Regular: {plan.originalPrice}{plan.period}
                      </p>
                    )}

                    <Link href={plan.highlighted ? "/signup" : plan.name === "Free" ? "/signup" : "/contact"}>
                      <Button 
                        className="w-full" 
                        variant={plan.highlighted ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-muted/50 px-6 py-4 flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-1" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
              <h2 className="text-xl font-bold mb-4">Behöver du en anpassad lösning?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Kontakta oss för en skräddarsydd lösning som möter dina specifika affärskrav. 
                Vi erbjuder anpassade pris för större team och företag.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Kontakta försäljning
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold mb-4">Vanliga frågor</h2>
              <div className="space-y-4 text-left mt-8">
                {[
                  {
                    question: "Kan jag byta plan när jag vill?",
                    answer: "Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringar träder i kraft vid nästa faktureringsperiod."
                  },
                  {
                    question: "Vad händer när min testperiod är slut?",
                    answer: "Efter din 14-dagars testperiod kommer du automatiskt att flyttas till den betalda planen du valde. Du kan avbryta innan perioden löper ut för att undvika debitering."
                  },
                  {
                    question: "Är mina sociala mediakonton säkra?",
                    answer: "Absolut. Vi använder branschledande säkerhetsstandarder för att skydda dina uppgifter och anslutningar. Vi har aldrig direkt tillgång till dina lösenord."
                  },
                  {
                    question: "Hur faktureras jag?",
                    answer: "Vi erbjuder månadsvis eller årlig fakturering. Årliga planer ger en rabatt på 20% jämfört med månadsbetalning."
                  }
                ].map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{faq.question}</h3>
                    <p className="text-muted-foreground mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 