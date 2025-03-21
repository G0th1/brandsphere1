"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, Database, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Translations for different errors
const errorMessages = {
    en: {
        title: "Authentication Error",
        code_exchange_failed: "Failed to verify your email. The verification link may have expired.",
        no_session: "No active session found. Please try logging in again.",
        no_code: "No verification code found. Please try again with a valid link.",
        unexpected: "An unexpected error occurred. Please try again later.",
        default: "There was a problem with authentication. Please try again.",
        server_error: "The authentication server returned an invalid response. We're working on fixing this issue.",
        database_error: "We couldn't connect to our database. Please try again in a few moments.",
        connection_error: "There was a problem connecting to our services. Please check your internet connection and try again.",
        json_error: "Failed to process the server response. Our team has been notified of this issue.",
        tryAgain: "Try Again",
        backToHome: "Back to Home",
        checkDbStatus: "Check Database Status",
        switchToSwedish: "Switch to Swedish"
    },
    sv: {
        title: "Autentiseringsfel",
        code_exchange_failed: "Det gick inte att verifiera din e-post. Verifieringslänken kan ha upphört att gälla.",
        no_session: "Ingen aktiv session hittades. Försök att logga in igen.",
        no_code: "Ingen verifieringskod hittades. Försök igen med en giltig länk.",
        unexpected: "Ett oväntat fel inträffade. Försök igen senare.",
        default: "Det uppstod ett problem med autentiseringen. Försök igen.",
        server_error: "Autentiseringsservern returnerade ett ogiltigt svar. Vi arbetar på att åtgärda detta problem.",
        database_error: "Vi kunde inte ansluta till vår databas. Försök igen om en stund.",
        connection_error: "Det uppstod ett problem med anslutningen till våra tjänster. Kontrollera din internetanslutning och försök igen.",
        json_error: "Det gick inte att bearbeta serversvaret. Vårt team har underrättats om detta problem.",
        tryAgain: "Försök igen",
        backToHome: "Tillbaka till startsidan",
        checkDbStatus: "Kontrollera databasstatus",
        switchToSwedish: "Byt till engelska"
    }
};

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get('error') || 'default';
    const errorDescription = searchParams.get('error_description') || '';
    const [language, setLanguage] = useState<"en" | "sv">("en");
    const [dbStatus, setDbStatus] = useState<"unknown" | "ok" | "error">("unknown");
    const [isCheckingDb, setIsCheckingDb] = useState(false);

    // Determine the error type from the error description
    let errorCode = errorParam;
    if (errorDescription?.toLowerCase().includes('json') ||
        errorDescription?.toLowerCase().includes('parse') ||
        errorDescription?.toLowerCase().includes('unexpected token')) {
        errorCode = 'json_error';
    } else if (errorDescription?.toLowerCase().includes('invalid response')) {
        errorCode = 'server_error';
    } else if (errorDescription?.toLowerCase().includes('database') ||
        errorDescription?.toLowerCase().includes('connection')) {
        errorCode = 'database_error';
    }

    // Check database connection on load to determine if that's the source of the issue
    useEffect(() => {
        const checkDbStatus = async () => {
            try {
                const res = await fetch('/api/db-health-check', {
                    method: 'GET',
                    cache: 'no-store'
                });

                if (res.ok) {
                    try {
                        const data = await res.json();
                        setDbStatus(data.status === "ok" ? "ok" : "error");
                    } catch (jsonError) {
                        console.error('Failed to parse JSON response:', jsonError);
                        setDbStatus("error");
                        // Update error code if we have JSON parsing issues
                        errorCode = 'json_error';
                    }
                } else {
                    setDbStatus("error");
                    // If we have a database error, update the error code
                    if (errorCode === 'server_error') {
                        errorCode = 'database_error';
                    }
                }
            } catch (error) {
                console.error('Database connection check failed:', error);
                setDbStatus("error");
            }
            setIsCheckingDb(false);
        };

        // Only run this once on page load
        checkDbStatus();
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "sv" : "en");
    };

    const handleCheckDbStatus = async () => {
        setIsCheckingDb(true);
        try {
            const res = await fetch('/api/db-health-check', {
                method: 'GET',
                cache: 'no-store'
            });

            if (res.ok) {
                try {
                    const data = await res.json();
                    setDbStatus(data.status === "ok" ? "ok" : "error");
                } catch (jsonError) {
                    console.error('Failed to parse JSON response:', jsonError);
                    setDbStatus("error");
                }
            } else {
                setDbStatus("error");
            }
        } catch (error) {
            console.error('Database connection check failed:', error);
            setDbStatus("error");
        }
        setIsCheckingDb(false);
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
                        {errorCode === 'json_error' ? (
                            <AlertTriangle className="h-12 w-12 text-amber-500" />
                        ) : (
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">{messages.title}</CardTitle>
                    <CardDescription className="text-base">
                        {errorMessage}
                    </CardDescription>
                </CardHeader>
                {(errorCode === 'server_error' || errorCode === 'database_error' || errorCode === 'json_error') && (
                    <CardContent>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="text-sm font-medium">Database Status:</div>
                            {isCheckingDb ? (
                                <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Checking...
                                </div>
                            ) : dbStatus === "ok" ? (
                                <div className="text-green-600 flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-green-600 mr-2"></div>
                                    Connected
                                </div>
                            ) : dbStatus === "error" ? (
                                <div className="text-red-600 flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-red-600 mr-2"></div>
                                    Disconnected
                                </div>
                            ) : (
                                <div className="text-yellow-600 flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-yellow-600 mr-2"></div>
                                    Unknown
                                </div>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleCheckDbStatus}
                            disabled={isCheckingDb}
                        >
                            {isCheckingDb ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <Database className="h-4 w-4 mr-2" />
                                    {messages.checkDbStatus}
                                </>
                            )}
                        </Button>
                    </CardContent>
                )}
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/auth/login" className="w-full">
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