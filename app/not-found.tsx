"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Page not found",
    description: "The page you're looking for doesn't seem to exist. It might have been moved, deleted, or you may have entered the wrong address.",
    homeButton: "Back to homepage",
    contactButton: "Contact us",
    popularTitle: "Popular pages:",
    features: "Our features",
    pricing: "Pricing plans",
    blog: "Our blog",
    faq: "Frequently asked questions"
  },
  sv: {
    title: "Sidan hittades inte",
    description: "Sidan du letar efter verkar inte existera. Den kan ha flyttats, tagits bort eller så kanske du skrivit in fel adress.",
    homeButton: "Tillbaka till startsidan",
    contactButton: "Kontakta oss",
    popularTitle: "Populära sidor:",
    features: "Våra funktioner",
    pricing: "Prisplaner",
    blog: "Vår blogg",
    faq: "Vanliga frågor"
  }
};

export default function NotFound() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <div className="inline-block p-6 bg-muted/30 rounded-full mb-4">
                <div className="relative">
                  <div className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    404
                  </div>
                  <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t.title}
              </h1>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
                {t.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>{t.homeButton}</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t.contactButton}</span>
                </Link>
              </Button>
            </div>

            <div className="w-full max-w-md animate-fade-up" style={{ animationDelay: '300ms' }}>
              <div className="bg-muted/30 p-6 rounded-lg">
                <h2 className="text-xl font-medium mb-4">{t.popularTitle}</h2>
                <ul className="space-y-3">
                  <li>
                    <Link href="/features" className="flex items-center gap-2 text-primary hover:underline">
                      <ArrowLeft className="h-4 w-4" />
                      <span>{t.features}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="flex items-center gap-2 text-primary hover:underline">
                      <ArrowLeft className="h-4 w-4" />
                      <span>{t.pricing}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="flex items-center gap-2 text-primary hover:underline">
                      <ArrowLeft className="h-4 w-4" />
                      <span>{t.blog}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="flex items-center gap-2 text-primary hover:underline">
                      <ArrowLeft className="h-4 w-4" />
                      <span>{t.faq}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 