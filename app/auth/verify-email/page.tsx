"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

const translations = {
    en: {
        verifying: "Verifying your email...",
        success: "Email verified successfully!",
        error: "Could not verify email",
        errorDescription: "The verification link may have expired or is invalid.",
        dashboard: "Go to Dashboard",
        login: "Sign in",
        retry: "Try again",
    },
    sv: {
        verifying: "Verifierar din e-post...",
        success: "E-posten har verifierats!",
        error: "Kunde inte verifiera e-posten",
        errorDescription: "Verifieringslänken kan ha upphört att gälla eller är ogiltig.",
        dashboard: "Gå till Dashboard",
        login: "Logga in",
        retry: "Försök igen",
    }
};

export default function VerifyEmailPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            return;
        }

        // Verifiera e-post med NextAuth endpoint
        fetch(`/api/auth/verify-email?token=${token}`)
            .then(async (res) => {
                if (res.ok) {
                    setStatus("success");
                    toast({
                        title: t.success,
                        description: "",
                    });
                    // Omdirigera till dashboard efter 2 sekunder
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 2000);
                } else {
                    const data = await res.json();
                    throw new Error(data.message || "Verification failed");
                }
            })
            .catch((error) => {
                console.error("Verification error:", error);
                setStatus("error");
                toast({
                    title: t.error,
                    description: t.errorDescription,
                    variant: "destructive",
                });
            });
    }, [searchParams, router, toast, t]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            {status === "verifying" && (
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            )}
                            {status === "success" && (
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            )}
                            {status === "error" && (
                                <XCircle className="h-12 w-12 text-destructive" />
                            )}
                        </div>
                        <CardTitle className="text-2xl">
                            {status === "verifying" && t.verifying}
                            {status === "success" && t.success}
                            {status === "error" && t.error}
                        </CardTitle>
                        {status === "error" && (
                            <CardDescription>{t.errorDescription}</CardDescription>
                        )}
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-2">
                        {status === "success" && (
                            <Link href="/dashboard" className="w-full">
                                <Button className="w-full">{t.dashboard}</Button>
                            </Link>
                        )}
                        {status === "error" && (
                            <>
                                <Link href="/auth/login" className="w-full">
                                    <Button className="w-full">{t.login}</Button>
                                </Link>
                                <Link href="/auth/verify-request" className="w-full">
                                    <Button variant="outline" className="w-full">{t.retry}</Button>
                                </Link>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 