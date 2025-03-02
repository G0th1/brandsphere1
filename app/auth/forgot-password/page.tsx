"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

const translations = {
    en: {
        title: "Forgot Password",
        description: "Enter your email address and we'll send you a link to reset your password.",
        emailLabel: "Email address",
        submitButton: "Send Reset Link",
        backToLogin: "Back to login",
        errors: {
            default: "Something went wrong. Please try again.",
            invalidEmail: "Please enter a valid email address.",
        },
        loading: "Sending reset link...",
        success: "Password reset link sent! Check your email for instructions."
    },
    sv: {
        title: "Glömt lösenord",
        description: "Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.",
        emailLabel: "E-postadress",
        submitButton: "Skicka återställningslänk",
        backToLogin: "Tillbaka till inloggning",
        errors: {
            default: "Något gick fel. Försök igen.",
            invalidEmail: "Ange en giltig e-postadress.",
        },
        loading: "Skickar återställningslänk...",
        success: "Återställningslänk skickad! Kontrollera din e-post för instruktioner."
    }
};

export default function ForgotPasswordPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast({
                title: "Fel",
                description: t.errors.invalidEmail,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Här kan du anropa en API-slutpunkt om du har en sådan
            // För nu simulerar vi bara ett API-anrop med en timeout
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitted(true);

            toast({
                title: "Skickat",
                description: t.success,
            });
        } catch (error) {
            console.error("Forgot password error:", error);
            toast({
                title: "Fel",
                description: t.errors.default,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">{t.success}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                {t.description}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/auth/login">{t.backToLogin}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        );
    }

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

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t.loading}
                                    </>
                                ) : t.submitButton}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button variant="link" asChild>
                            <Link href="/auth/login">{t.backToLogin}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 