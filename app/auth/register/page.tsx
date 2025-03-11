"use client";

import React, { useState } from "react";
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
            passwordTooShort: "Password must be at least 8 characters long.",
            networkError: "Network error. Please check your connection and try again."
        },
        loading: "Creating account...",
        success: "Account created! Redirecting to login..."
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
            passwordTooShort: "Lösenordet måste vara minst 8 tecken långt.",
            networkError: "Nätverksfel. Kontrollera din anslutning och försök igen."
        },
        loading: "Skapar konto...",
        success: "Konto skapat! Omdirigerar till inloggning..."
    }
};

export default function RegisterPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();
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
                if (response.status === 409) {
                    throw new Error(t.errors.emailExists);
                } else if (response.status === 500 && data.error) {
                    // Mer detaljerade felmeddelanden i utvecklingsmiljö
                    console.error("Server error details:", data.error);
                    throw new Error(data.message || t.errors.default);
                } else {
                    throw new Error(data.message || t.errors.default);
                }
            }

            toast({
                title: "Framgång",
                description: t.success,
            });

            // Kort fördröjning för att visa framgångsmeddelandet innan omdirigering
            setTimeout(() => {
                router.push("/auth/login");
            }, 1500);
        } catch (error: any) {
            console.error("Registration error:", error);

            // Hantera olika typer av fel
            let errorMessage = t.errors.default;

            if (error.message) {
                if (error.message.includes("network") || error.message.includes("fetch")) {
                    errorMessage = t.errors.networkError;
                } else if (error.message.includes("databas") || error.message.includes("database")) {
                    errorMessage = "Databasfel. Vänligen kontakta supporten.";
                } else {
                    errorMessage = error.message;
                }
            }

            toast({
                title: "Registreringsfel",
                description: errorMessage,
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
} 