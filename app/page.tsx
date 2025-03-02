"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check, Star } from 'lucide-react'
import { useTranslation } from '@/contexts/language-context'
import { homeTranslations } from '@/lib/translations'

export default function HomePage() {
  const t = useTranslation(homeTranslations);

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
                  {t.hero.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t.hero.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Button size="lg" className="group">
                  {t.hero.getStarted}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">
                    {t.hero.viewPricing}
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-primary" />
                  <span>{t.hero.freeTrial}</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-primary" />
                  <span>{t.hero.noCardRequired}</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-primary" />
                  <span>{t.hero.cancelAnytime}</span>
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
                  <Image
                    src="/images/Brandsphere AI – Gjord med Clipchamp.gif"
                    alt={t.hero.dashboardAlt || "BrandSphereAI Dashboard Demo"}
                    width={1200}
                    height={675}
                    className="rounded border border-zinc-700 w-full h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Dekorativa element */}
              <div className="absolute -bottom-6 -right-12 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-60" />
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl opacity-60" />
            </div>
          </div>
        </section>

        {/* Funktioner sektion */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.features.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.features.items.map((feature, index) => (
                <div key={index} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4 text-primary">
                    {/* Icons zou ld be determined based on the feature */}
                    {index === 0 && <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Star className="h-6 w-6" /></div>}
                    {index === 1 && <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Star className="h-6 w-6" /></div>}
                    {index === 2 && <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Star className="h-6 w-6" /></div>}
                    {index === 3 && <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Star className="h-6 w-6" /></div>}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA sektion */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.cta.title}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t.cta.subtitle}
              </p>
              <div className="pt-4">
                <Button size="lg" className="group">
                  {t.cta.buttonText}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 