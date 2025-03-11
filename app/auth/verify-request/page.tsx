"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { Mail } from "lucide-react";

const translations = {
    en: {
        title: "Check your email",
        description: "A verification link has been sent to your email address",
        emailCheck: "Check your email and click on the verification link to continue",
        backToHome: "Back to Home",
        didntReceive: "Didn't receive an email?",
        checkSpam: "Check your spam folder or",
        tryAgain: "try signing in again"
    },
    sv: {
        title: "Kontrollera din e-post",
        description: "En verifieringslänk har skickats till din e-postadress",
        emailCheck: "Kontrollera din e-post och klicka på verifieringslänken för att fortsätta",
        backToHome: "Tillbaka till startsidan",
        didntReceive: "Fick du inget e-postmeddelande?",
        checkSpam: "Kontrollera din skräppostmapp eller",
        tryAgain: "försök logga in igen"
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
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Mail className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">{t.emailCheck}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4">
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full">{t.backToHome}</Button>
                        </Link>
                        <div className="text-sm text-center text-muted-foreground">
                            <p>{t.didntReceive}</p>
                            <p>{t.checkSpam} <Link href="/auth/login" className="text-primary hover:underline">{t.tryAgain}</Link></p>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 