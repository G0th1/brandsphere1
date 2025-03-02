"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, Check } from "lucide-react";
import Link from "next/link";

const translations = {
    en: {
        title: "Reset Password",
        description: "Create a new password for your account",
        passwordLabel: "New Password",
        confirmPasswordLabel: "Confirm New Password",
        submitButton: "Reset Password",
        backToLogin: "Back to login",
        errors: {
            default: "Something went wrong. Please try again.",
            passwordMismatch: "Passwords do not match.",
            passwordTooShort: "Password must be at least 8 characters long.",
            invalidToken: "Invalid or expired reset token. Please request a new reset link.",
        },
        loading: "Resetting password...",
        success: "Password has been reset successfully!",
        loginNow: "Login now"
    },
    sv: {
        title: "Återställ lösenord",
        description: "Skapa ett nytt lösenord för ditt konto",
        passwordLabel: "Nytt lösenord",
        confirmPasswordLabel: "Bekräfta nytt lösenord",
        submitButton: "Återställ lösenord",
        backToLogin: "Tillbaka till inloggning",
        errors: {
            default: "Något gick fel. Försök igen.",
            passwordMismatch: "Lösenorden matchar inte.",
            passwordTooShort: "Lösenordet måste vara minst 8 tecken långt.",
            invalidToken: "Ogiltig eller utgången återställningstoken. Begär en ny återställningslänk.",
        },
        loading: "Återställer lösenord...",
        success: "Lösenordet har återställts!",
        loginNow: "Logga in nu"
    }
};

export default function ResetPasswordPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { toast } = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Om inget token finns, visa ett felmeddelande
    React.useEffect(() => {
        if (!token) {
            toast({
                title: "Fel",
                description: t.errors.invalidToken,
                variant: "destructive",
            });
        }
    }, [token, toast, t.errors.invalidToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast({
                title: "Fel",
                description: t.errors.invalidToken,
                variant: "destructive",
            });
            return;
        }

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
            // Här kan du anropa en API-slutpunkt för att återställa lösenordet
            // För nu simulerar vi bara ett API-anrop med en timeout
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSuccess(true);

            toast({
                title: "Klart",
                description: t.success,
            });
        } catch (error) {
            console.error("Reset password error:", error);
            toast({
                title: "Fel",
                description: t.errors.default,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">{t.success}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-center pt-6">
                            <Button asChild>
                                <Link href="/auth/login">{t.loginNow}</Link>
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
                                <Label htmlFor="password">{t.passwordLabel}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading || !token}
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
                                    disabled={isLoading || !token}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !password || !confirmPassword || !token}
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