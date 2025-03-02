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
        }
    },
    sv: {
        subscribe: "Prenumerera",
        subscribing: "Bearbetar...",
        errors: {
            checkoutError: "Kunde inte starta kassan. Försök igen.",
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t.errors.checkoutError);
            }

            // Redirect till checkout-sidan
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Fel",
                description: t.errors.checkoutError,
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