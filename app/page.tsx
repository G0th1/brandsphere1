import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero sektion */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <div className="space-y-4 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  Hantera sociala medier <span className="text-primary">smartare</span> med AI
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Spara tid och skapa bättre innehåll med vår intelligenta plattform för sociala medier.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Button size="lg" className="group">
                  Kom igång gratis
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">
                    Visa priser
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-primary" />
                  <span>Gratis testperiod</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-primary" />
                  <span>Ingen kreditkort krävs</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-primary" />
                  <span>Avsluta när som helst</span>
                </div>
              </div>
            </div>
            
            {/* Produktskärmbild med skuggeffekt */}
            <div className="mt-16 md:mt-24 relative animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="rounded-lg overflow-hidden shadow-2xl mx-auto max-w-4xl">
                <div className="bg-zinc-800 h-6 flex items-center px-4">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="bg-zinc-900 p-3">
                  <div className="border border-zinc-700 rounded bg-zinc-800 h-[400px] flex items-center justify-center">
                    <p className="text-white text-lg">Dashboard-skärmbild</p>
                  </div>
                </div>
              </div>
              
              {/* Dekorativa element */}
              <div className="absolute -bottom-6 -right-12 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-60" />
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl opacity-60" />
            </div>
          </div>
        </section>
        
        {/* Funktionsscektion */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Allt du behöver för sociala medier</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                BrandSphereAI kombinerar AI-driven innehållsskapande med kraftfulla verktyg för schemaläggning och analys.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-skapat innehåll",
                  description: "Generera engagerande inlägg, bildtexter och hashtags automatiskt med vår AI-teknik."
                },
                {
                  title: "Smart schemaläggning",
                  description: "Planera inlägg för optimal tid och konsistens genom alla dina sociala kanaler."
                },
                {
                  title: "Omfattande analys",
                  description: "Få djupgående insikter om dina prestationer och engagemang för att optimera din strategi."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-card rounded-lg border p-6 transition-all hover:shadow-md">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA sektion */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-primary rounded-lg px-6 py-12 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Redo att ta din sociala medienärvaro till nästa nivå?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Anslut dig till tusentals företag och skapare som använder BrandSphereAI för att växa sin publik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="group">
                    Skapa konto
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Utforska priser
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 