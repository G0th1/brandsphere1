"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check, Star, ArrowRight, Globe } from 'lucide-react'
import { useTranslation, useLanguage } from '@/contexts/language-context'
import { homeTranslations } from '@/lib/translations'
import { useState } from "react"
import { useSafeRouter } from "@/lib/utils/navigation"

export default function HomePageClient() {
    const { language } = useLanguage();
    const t = useTranslation(homeTranslations);
    const safeRouter = useSafeRouter();

    // Function to create the underlined version of the title
    const renderTitleWithUnderline = () => {
        const title = t.hero.title;
        const wordToUnderline = language === 'en' ? "Smarter" : "smartare";

        if (!title.includes(wordToUnderline)) {
            return title;
        }

        const parts = title.split(wordToUnderline);

        return (
            <>
                {parts[0]}
                <span className="relative">
                    {wordToUnderline}
                    <span className="absolute left-0 right-0 bottom-1 h-3 w-full"
                        style={{
                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' width='100' height='20' preserveAspectRatio='none'%3E%3Cpath d='M0,15 Q25,5 50,15 T100,15' stroke='%23ff5500' stroke-width='3' fill='none' stroke-linecap='round' stroke-dasharray='4,8' /%3E%3C/svg%3E\")",
                            backgroundRepeat: "repeat-x",
                            backgroundSize: "100% 100%",
                            animation: "chalk-line 3s ease-in-out infinite alternate",
                            opacity: 0.8,
                            zIndex: -1
                        }}>
                    </span>
                </span>
                {parts[1]}
            </>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                {/* Hero sektion */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 pointer-events-none" />

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                            <div className="space-y-4 animate-fade-in">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                                    {renderTitleWithUnderline()}
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    {t.hero.subtitle}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                                <Link href="/auth/login" passHref>
                                    <Button size="lg" className="group" asChild>
                                        <a>
                                            {t.hero.getStarted}
                                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </Button>
                                </Link>

                                <Link href="/pricing" passHref>
                                    <Button variant="outline" size="lg" asChild>
                                        <a>{t.hero.viewPricing}</a>
                                    </Button>
                                </Link>
                            </div>

                            <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
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

                        {/* Product screenshot with shadow effect */}
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
                                    <div className="rounded border border-zinc-700 w-full h-auto aspect-video bg-zinc-800 flex items-center justify-center">
                                        <span className="text-zinc-400 text-sm">Dashboard preview placeholder</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -right-12 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-60" />
                            <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl opacity-60" />
                        </div>
                    </div>
                </section>

                {/* Features section */}
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
                                        {/* Icons would be determined based on the feature */}
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

                {/* CTA section */}
                <section className="bg-primary/5 py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                                {t.cta.title}
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                {t.cta.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                                <Link href="/auth/login">
                                    <Button size="lg">
                                        {t.cta.buttonText}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx global>{`
        @keyframes chalk-line {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(1px);
          }
          100% {
            transform: translateY(-1px);
          }
        }
      `}</style>
        </div>
    )
} 