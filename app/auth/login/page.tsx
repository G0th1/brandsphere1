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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const translations = {
    en: {
        title: "Sign in to your account",
        description: "Enter your email below to sign in to your account",
        emailLabel: "Email address",
        passwordLabel: "Password",
        magicLinkTab: "Magic Link",
        passwordTab: "Password",
        signIn: "Sign in",
        sendLink: "Send magic link",
        createAccount: "Create an account",
        forgotPassword: "Forgot password?",
        errors: {
            default: "Something went wrong. Please try again.",
            credentialsSignin: "Invalid login credentials.",
            emailSignin: "Could not send verification email. Please try again."
        },
        loading: "Please wait...",
        success: "Check your email for the login link!"
    },
    sv: {
        title: "Logga in på ditt konto",
        description: "Ange din e-post nedan för att logga in på ditt konto",
        emailLabel: "E-postadress",
        passwordLabel: "Lösenord",
        magicLinkTab: "Magisk länk",
        passwordTab: "Lösenord",
        signIn: "Logga in",
        sendLink: "Skicka magisk länk",
        createAccount: "Skapa ett konto",
        forgotPassword: "Glömt lösenord?",
        errors: {
            default: "Något gick fel. Försök igen.",
            credentialsSignin: "Ogiltiga inloggningsuppgifter.",
            emailSignin: "Kunde inte skicka verifieringsmejl. Försök igen."
        },
        loading: "Vänta...",
        success: "Kolla din e-post efter inloggningslänken!"
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
    const [authType, setAuthType] = useState("magic-link"); // "magic-link" or "password"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (authType === "magic-link") {
                // Skicka magisk länk
                const result = await signIn("email", {
                    email,
                    redirect: false,
                    callbackUrl,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                // Redirect till verify-request sidan
                router.push("/auth/verify-request");
            } else {
                // Lösenordsbaserad inloggning
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                    callbackUrl,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                if (result?.url) {
                    router.push(result.url);
                }
            }
        } catch (error) {
            console.error("Sign in error:", error);
            toast({
                title: "Inloggningsfel",
                description: t.errors.default,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Visa eventuella felmeddelanden från URL
    React.useEffect(() => {
        if (error) {
            const errorMessage = error === "CredentialsSignin"
                ? t.errors.credentialsSignin
                : error === "EmailSignin"
                    ? t.errors.emailSignin
                    : t.errors.default;

            toast({
                title: "Error",
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
                        <Tabs defaultValue="magic-link" onValueChange={(value) => setAuthType(value)}>
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="magic-link">{t.magicLinkTab}</TabsTrigger>
                                <TabsTrigger value="password">{t.passwordTab}</TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t.emailLabel}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="namn@exempel.se"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <TabsContent value="password" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">{t.passwordLabel}</Label>
                                            <Button variant="link" className="p-0 h-auto font-normal text-xs" asChild>
                                                <a href="/auth/forgot-password">{t.forgotPassword}</a>
                                            </Button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required={authType === "password"}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </TabsContent>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !email || (authType === "password" && !password)}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.loading}
                                        </>
                                    ) : authType === "magic-link" ? t.sendLink : t.signIn}
                                </Button>
                            </form>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button variant="link" asChild>
                            <a href="/auth/register">{t.createAccount}</a>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 