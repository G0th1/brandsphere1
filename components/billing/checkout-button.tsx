"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";

const translations = {
    en: {
        subscribe: "Subscribe",
        subscribing: "Processing...",
        errors: {
            checkoutError: "Failed to initiate checkout. Please try again.",
            connectionError: "Connection error. Please check your internet connection.",
            serverError: "Server error. Our team has been notified.",
            authError: "Authentication error. Please login again.",
            unexpectedError: "An unexpected error occurred. Please try again later."
        }
    },
    sv: {
        subscribe: "Prenumerera",
        subscribing: "Bearbetar...",
        errors: {
            checkoutError: "Kunde inte starta kassan. Försök igen.",
            connectionError: "Anslutningsfel. Kontrollera din internetanslutning.",
            serverError: "Serverfel. Vårt team har meddelats.",
            authError: "Autentiseringsfel. Logga in igen.",
            unexpectedError: "Ett oväntat fel uppstod. Försök igen senare."
        }
    }
};

interface CheckoutButtonProps {
    priceId: string;
    plan: string;
    interval?: "month" | "year";
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
    disabled?: boolean;
}

export function CheckoutButton({
    priceId,
    plan,
    interval = "month",
    variant = "default",
    disabled = false,
}: CheckoutButtonProps) {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleCheckout = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceId,
                    plan,
                    interval,
                }),
            });

            // Check if response exists before trying to parse it
            if (!response) {
                throw new Error(t.errors.connectionError);
            }

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                console.error("Error parsing response:", parseError);
                throw new Error(t.errors.serverError);
            }

            if (!response.ok) {
                // Check for specific error types
                if (response.status === 401) {
                    throw new Error(t.errors.authError);
                } else if (response.status >= 500) {
                    throw new Error(t.errors.serverError);
                }

                // Use the error message from the API if available
                const errorMessage = data?.message || t.errors.checkoutError;
                throw new Error(errorMessage);
            }

            // Redirect to checkout page
            if (data.url) {
                window.location.href = data.url;
            } else {
                // Handle the case where the URL is missing
                throw new Error("Checkout URL not provided");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);

            // Show a descriptive toast error
            toast({
                title: language === "en" ? "Error" : "Fel",
                description: error.message || t.errors.unexpectedError,
                variant: "destructive",
            });

            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCheckout}
            variant={variant}
            disabled={isLoading || disabled}
            className="w-full"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.subscribing}
                </>
            ) : (
                t.subscribe
            )}
        </Button>
    );
} 