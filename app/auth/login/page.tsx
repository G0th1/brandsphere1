"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const translations = {
    en: {
        title: "Sign in to your account",
        description: "Enter your email and password to sign in to your account",
        emailLabel: "Email address",
        passwordLabel: "Password",
        signIn: "Sign in",
        createAccount: "Create an account",
        forgotPassword: "Forgot password?",
        errors: {
            title: "Authentication Error",
            default: "Something went wrong. Please try again.",
            credentialsSignin: "Invalid login credentials.",
            googleSignin: "Could not sign in with Google. Please try again.",
            networkError: "Network error. Please check your connection and try again."
        },
        loading: "Please wait...",
        googleLogin: "Continue with Google",
        divider: "or"
    },
    sv: {
        title: "Logga in på ditt konto",
        description: "Ange din e-postadress och lösenord för att logga in på ditt konto",
        emailLabel: "E-postadress",
        passwordLabel: "Lösenord",
        signIn: "Logga in",
        createAccount: "Skapa ett konto",
        forgotPassword: "Glömt lösenord?",
        errors: {
            title: "Autentiseringsfel",
            default: "Något gick fel. Vänligen försök igen.",
            credentialsSignin: "Ogiltiga inloggningsuppgifter.",
            googleSignin: "Kunde inte logga in med Google. Vänligen försök igen.",
            networkError: "Nätverksfel. Kontrollera din anslutning och försök igen."
        },
        loading: "Vänligen vänta...",
        googleLogin: "Fortsätt med Google",
        divider: "eller"
    }
};

export default function LoginPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Grundläggande validering
        if (!email || !password) {
            toast({
                title: t.errors.title,
                description: "Du måste ange både e-post och lösenord.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            console.log(`🔄 Försöker logga in användare: ${email}`);

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            console.log(`📊 Inloggningsresultat:`, JSON.stringify(result));

            if (result?.error) {
                console.error("Login error:", result.error);

                // Visa specifika felmeddelanden baserat på olika felkoder
                let errorMessage = t.errors.default;

                if (result.error === "CredentialsSignin") {
                    errorMessage = t.errors.credentialsSignin;
                } else if (result.error.includes("fetch")) {
                    errorMessage = t.errors.networkError;
                }

                toast({
                    title: t.errors.title,
                    description: errorMessage,
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            if (result?.url) {
                console.log(`✅ Inloggning lyckades, omdirigerar till: ${result.url}`);
                router.push(result.url);
            } else {
                console.error("Ingen URL returnerades efter inloggning");
                toast({
                    title: t.errors.title,
                    description: t.errors.default,
                    variant: "destructive",
                });
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error("Sign in error:", error);

            // Hantera olika typer av fel
            let errorMessage = t.errors.default;

            if (error.message) {
                console.error(`Felmeddelande: ${error.message}`);
                if (error.message.includes("network") || error.message.includes("fetch")) {
                    errorMessage = t.errors.networkError;
                }
            }

            toast({
                title: t.errors.title,
                description: errorMessage,
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            console.log(`🔄 Försöker logga in med Google`);

            await signIn("google", {
                callbackUrl,
            });

            // Vi kommer inte hit om Google auth lyckas eftersom sidan omdirigeras
            console.log("Google auth avslutades utan omdirigering");
        } catch (error: any) {
            console.error("Google sign in error:", error);

            // Hantera olika typer av fel
            let errorMessage = t.errors.googleSignin;

            if (error.message && (error.message.includes("network") || error.message.includes("fetch"))) {
                errorMessage = t.errors.networkError;
            }

            toast({
                title: t.errors.title,
                description: errorMessage,
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    // Visa eventuella felmeddelanden från URL
    React.useEffect(() => {
        if (error) {
            const errorMessage = error === "CredentialsSignin"
                ? t.errors.credentialsSignin
                : t.errors.default;

            toast({
                title: t.errors.title,
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [error, toast, t.errors]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                onClick={handleGoogleSignIn}
                                className="w-full"
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {t.googleLogin}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        {t.divider}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.emailLabel}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">{t.passwordLabel}</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {t.forgotPassword}
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t.loading}
                                    </>
                                ) : (
                                    t.signIn
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4">
                        <div className="text-sm text-center text-muted-foreground">
                            <Link
                                href="/auth/register"
                                className="text-primary hover:underline"
                            >
                                {t.createAccount}
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 