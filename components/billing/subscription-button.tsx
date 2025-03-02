"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";

const translations = {
    en: {
        cancel: "Cancel Subscription",
        reactivate: "Reactivate Subscription",
        changePlan: "Change Plan",
        processing: "Processing...",
        cancelSuccess: "Subscription will be canceled at the end of the billing period.",
        reactivateSuccess: "Subscription reactivated successfully.",
        changePlanSuccess: "Plan changed successfully.",
        errors: {
            default: "An error occurred. Please try again.",
        }
    },
    sv: {
        cancel: "Avsluta prenumeration",
        reactivate: "Återaktivera prenumeration",
        changePlan: "Byt plan",
        processing: "Bearbetar...",
        cancelSuccess: "Prenumerationen avslutas vid slutet av faktureringsperioden.",
        reactivateSuccess: "Prenumerationen återaktiverades.",
        changePlanSuccess: "Planen ändrades.",
        errors: {
            default: "Ett fel inträffade. Försök igen.",
        }
    }
};

interface SubscriptionButtonProps {
    action: "cancel" | "reactivate" | "change_plan";
    newPriceId?: string;
    newPlan?: string;
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
    disabled?: boolean;
}

export function SubscriptionButton({
    action,
    newPriceId,
    newPlan,
    variant = action === "cancel" ? "destructive" : "default",
    disabled = false,
}: SubscriptionButtonProps) {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    // Bestäm knapptexten baserat på åtgärden
    const getButtonText = () => {
        if (isLoading) return t.processing;

        switch (action) {
            case "cancel":
                return t.cancel;
            case "reactivate":
                return t.reactivate;
            case "change_plan":
                return t.changePlan;
            default:
                return "";
        }
    };

    const handleAction = async () => {
        setIsLoading(true);

        try {
            const body: any = { action };

            // Lägg till ytterligare data för planändringar
            if (action === "change_plan") {
                if (!newPriceId || !newPlan) {
                    throw new Error("Missing required data for plan change");
                }
                body.newPriceId = newPriceId;
                body.newPlan = newPlan;
            }

            const response = await fetch("/api/subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t.errors.default);
            }

            // Visa framgångsmeddelande baserat på åtgärden
            let successMessage = "";
            switch (action) {
                case "cancel":
                    successMessage = t.cancelSuccess;
                    break;
                case "reactivate":
                    successMessage = t.reactivateSuccess;
                    break;
                case "change_plan":
                    successMessage = t.changePlanSuccess;
                    break;
            }

            toast({
                title: "Klart",
                description: successMessage,
            });

            // Uppdatera UI
            router.refresh();
        } catch (error) {
            console.error("Subscription action error:", error);
            toast({
                title: "Fel",
                description: t.errors.default,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAction}
            variant={variant}
            disabled={isLoading || disabled}
            className={action === "cancel" ? "bg-red-600 hover:bg-red-700" : ""}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
        </Button>
    );
} 