"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";

// Översättningar
const translations = {
    en: {
        title: "Demo Premium Login",
        description: "Try the premium version of BrandSphereAI with a demo account",
        googleLogin: "Continue with Google (Demo)",
        backToHome: "Back to home",
        loading: "Signing in...",
        welcome: "Welcome to BrandSphereAI Premium"
    },
    sv: {
        title: "Demo Premium-inloggning",
        description: "Testa premiumversionen av BrandSphereAI med ett demokonto",
        googleLogin: "Fortsätt med Google (Demo)",
        backToHome: "Tillbaka till startsidan",
        loading: "Loggar in...",
        welcome: "Välkommen till BrandSphereAI Premium"
    }
};

export default function DemoLoginPage() {
    const { language } = useLanguage();
    const t = translations[language];
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Simulera inloggning med Google
    const handleGoogleSignIn = () => {
        setIsLoading(true);

        // Lagra demo-användarinformation i localStorage
        localStorage.setItem('demoUser', JSON.stringify({
            id: 'demo-user-123',
            email: 'demo@example.com',
            name: 'Demo User',
            subscription_tier: 'premium',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo123',
            demo_mode: true
        }));

        // Simulera inladdningstid för att göra det mer realistiskt
        setTimeout(() => {
            // Omdirigera till demo-dashboard
            router.push("/demo/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">{t.title}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Button
                            className="w-full flex items-center justify-center gap-2 h-10"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>{t.loading}</span>
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>{t.googleLogin}</span>
                                </>
                            )}
                        </Button>
                    </CardContent>

                    <CardFooter>
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full">
                                {t.backToHome}
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </main>

            <Footer />
        </div>
    );
} 