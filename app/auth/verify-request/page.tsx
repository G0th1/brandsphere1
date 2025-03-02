"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

const translations = {
    en: {
        title: "Check your email",
        description: "A sign in link has been sent to your email address.",
        instructions: "Click the link in the email to sign in or continue with your account setup.",
        spamNotice: "If you can't see the email in your inbox, check your spam folder.",
        noEmail: "Didn't receive an email?",
        resend: "Send a new link",
        backToLogin: "Back to login"
    },
    sv: {
        title: "Kontrollera din e-post",
        description: "En inloggningslänk har skickats till din e-postadress.",
        instructions: "Klicka på länken i e-postmeddelandet för att logga in eller fortsätta med din kontokonfiguration.",
        spamNotice: "Om du inte ser mejlet i din inkorg, kontrollera din skräppostmapp.",
        noEmail: "Fick du inget mejl?",
        resend: "Skicka en ny länk",
        backToLogin: "Tillbaka till inloggning"
    }
};

export default function VerifyRequestPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t.instructions}</p>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex gap-2 text-sm">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                            <p className="text-yellow-800 dark:text-yellow-300">{t.spamNotice}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">{t.noEmail}</p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button variant="default" className="w-full">
                                <Link href="/auth/login" className="w-full">
                                    {t.resend}
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Link href="/auth/login" className="w-full">
                                    {t.backToLogin}
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 