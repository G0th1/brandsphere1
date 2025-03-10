"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const translations = {
    en: {
        title: "Create an account",
        description: "Enter your details below to create your account",
        nameLabel: "Full name",
        emailLabel: "Email address",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm password",
        createAccount: "Create account",
        alreadyHaveAccount: "Already have an account?",
        signIn: "Sign in",
        errors: {
            default: "Something went wrong. Please try again.",
            emailExists: "An account with this email already exists.",
            passwordMismatch: "Passwords do not match.",
            passwordTooShort: "Password must be at least 8 characters long."
        },
        loading: "Creating account...",
        success: "Account created! Please check your email to verify your account.",
        errorLoading: "Error loading the registration page. Please try refreshing."
    },
    sv: {
        title: "Skapa ett konto",
        description: "Ange dina uppgifter nedan för att skapa ditt konto",
        nameLabel: "Fullständigt namn",
        emailLabel: "E-postadress",
        passwordLabel: "Lösenord",
        confirmPasswordLabel: "Bekräfta lösenord",
        createAccount: "Skapa konto",
        alreadyHaveAccount: "Har du redan ett konto?",
        signIn: "Logga in",
        errors: {
            default: "Något gick fel. Försök igen.",
            emailExists: "Ett konto med denna e-postadress finns redan.",
            passwordMismatch: "Lösenorden matchar inte.",
            passwordTooShort: "Lösenordet måste vara minst 8 tecken långt."
        },
        loading: "Skapar konto...",
        success: "Konto skapat! Kontrollera din e-post för att verifiera ditt konto.",
        errorLoading: "Ett fel uppstod vid laddning av registreringssidan. Försök uppdatera."
    }
};

export default function RegisterPage() {
    const [mounted, setMounted] = useState(false);
    const [renderError, setRenderError] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const router = useRouter();

    // Förbättrad felhantering för debugging
    useEffect(() => {
        try {
            // Sätt timeout för att simulera laddning och förhindra snabb flicker
            const timer = setTimeout(() => {
                setMounted(true);
                setInitializing(false);
            }, 300);

            return () => clearTimeout(timer);
        } catch (error) {
            console.error("Initializing error:", error);
            setRenderError(true);
            setInitializing(false);
        }
    }, []);

    // Visa laddningsindikator innan klientsidan är redo
    if (initializing) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
            </div>
        );
    }

    // Felmeddelande om komponenten inte kunde renderas korrekt
    if (renderError) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4 text-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">
                            Ett fel uppstod vid laddning av registreringssidan. Försök uppdatera.
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                            <Button onClick={() => window.location.reload()}>
                                Uppdatera sidan
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/auth/login")}>
                                Gå till inloggning
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    try {
        const { language } = useLanguage();
        const t = translations[language as keyof typeof translations];
        const { toast } = useToast();

        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [isLoading, setIsLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            // Validera formuläret
            if (password !== confirmPassword) {
                toast({
                    title: "Fel",
                    description: t.errors.passwordMismatch,
                    variant: "destructive",
                });
                return;
            }

            if (password.length < 8) {
                toast({
                    title: "Fel",
                    description: t.errors.passwordTooShort,
                    variant: "destructive",
                });
                return;
            }

            setIsLoading(true);

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || t.errors.default);
                }

                toast({
                    title: "Kontot har skapats",
                    description: t.success,
                });

                // Redirect till inloggningssidan
                router.push("/auth/login");
            } catch (error: any) {
                console.error("Registration error:", error);
                toast({
                    title: "Registreringsfel",
                    description: error.message || t.errors.default,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t.title}</CardTitle>
                            <CardDescription>{t.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t.nameLabel}</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t.emailLabel}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">{t.passwordLabel}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">{t.confirmPasswordLabel}</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !name || !email || !password || !confirmPassword}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.loading}
                                        </>
                                    ) : t.createAccount}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                {t.alreadyHaveAccount}{" "}
                                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                                    {t.signIn}
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        );
    } catch (error) {
        // Vid rendering-fel, visa ett felmeddelande
        console.error("Error rendering RegisterPage:", error);
        if (!renderError) {
            setRenderError(true);
        }

        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4 text-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">
                            Ett fel uppstod vid laddning av registreringssidan. Försök uppdatera.
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                            <Button onClick={() => window.location.reload()}>
                                Uppdatera sidan
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/auth/login")}>
                                Gå till inloggning
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
} 