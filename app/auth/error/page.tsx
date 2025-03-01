"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Översättningar för olika fel
const errorMessages = {
    en: {
        title: "Authentication Error",
        code_exchange_failed: "Failed to verify your email. The verification link may have expired.",
        no_session: "No active session found. Please try logging in again.",
        no_code: "No verification code found. Please try again with a valid link.",
        unexpected: "An unexpected error occurred. Please try again later.",
        default: "There was a problem with authentication. Please try again.",
        tryAgain: "Try Again",
        backToHome: "Back to Home",
        switchToSwedish: "Switch to Swedish"
    },
    sv: {
        title: "Autentiseringsfel",
        code_exchange_failed: "Det gick inte att verifiera din e-post. Verifieringslänken kan ha upphört att gälla.",
        no_session: "Ingen aktiv session hittades. Försök att logga in igen.",
        no_code: "Ingen verifieringskod hittades. Försök igen med en giltig länk.",
        unexpected: "Ett oväntat fel inträffade. Försök igen senare.",
        default: "Det uppstod ett problem med autentiseringen. Försök igen.",
        tryAgain: "Försök igen",
        backToHome: "Tillbaka till startsidan",
        switchToSwedish: "Byt till engelska"
    }
};

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const errorCode = searchParams.get('error') || 'default';
    const [language, setLanguage] = useState<"en" | "sv">("en");

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "sv" : "en");
    };

    const messages = errorMessages[language];
    const errorMessage = messages[errorCode as keyof typeof messages] || messages.default;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-8">
            <div className="absolute top-4 right-4">
                <Button variant="outline" size="sm" onClick={toggleLanguage}>
                    {messages.switchToSwedish}
                </Button>
            </div>

            <Link
                href="/"
                className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight"
            >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    B
                </div>
                BrandSphereAI
            </Link>

            <Card className="w-full max-w-md overflow-hidden">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">{messages.title}</CardTitle>
                    <CardDescription className="text-base">
                        {errorMessage}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/login" className="w-full">
                        <Button className="w-full">{messages.tryAgain}</Button>
                    </Link>
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full">{messages.backToHome}</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
} 