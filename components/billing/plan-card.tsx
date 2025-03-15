"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckoutButton } from "./checkout-button";
import { SubscriptionButton } from "./subscription-button";
import { useLanguage } from "@/contexts/language-context";

const translations = {
    en: {
        currentPlan: "Your current plan",
        month: "/month",
        year: "/year",
        features: "Features include",
        freePlan: {
            title: "Free",
            description: "Everything you need to get started.",
        },
        proPlan: {
            title: "Pro",
            description: "For professionals and growing businesses.",
        },
        businessPlan: {
            title: "Business",
            description: "For teams and larger organizations.",
        },
    },
    sv: {
        currentPlan: "Din nuvarande plan",
        month: "/månad",
        year: "/år",
        features: "Funktioner som ingår",
        freePlan: {
            title: "Gratis",
            description: "Allt du behöver för att komma igång.",
        },
        proPlan: {
            title: "Pro",
            description: "För proffs och växande företag.",
        },
        businessPlan: {
            title: "Business",
            description: "För team och större organisationer.",
        },
    },
};

interface PlanCardProps {
    plan: "Free" | "Pro" | "Business";
    price: string;
    features: string[];
    interval?: "month" | "year";
    priceId?: string;
    popular?: boolean;
    currentPlan?: boolean;
    disabled?: boolean;
}

export function PlanCard({
    plan,
    price,
    features,
    interval = "month",
    priceId,
    popular = false,
    currentPlan = false,
    disabled = false,
}: PlanCardProps) {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];

    // Bestäm plantiteln baserat på planen
    const getTitle = () => {
        switch (plan) {
            case "Free":
                return t.freePlan.title;
            case "Pro":
                return t.proPlan.title;
            case "Business":
                return t.businessPlan.title;
            default:
                return plan;
        }
    };

    // Bestäm planbeskrivningen baserat på planen
    const getDescription = () => {
        switch (plan) {
            case "Free":
                return t.freePlan.description;
            case "Pro":
                return t.proPlan.description;
            case "Business":
                return t.businessPlan.description;
            default:
                return "";
        }
    };

    return (
        <Card
            className={cn(
                "flex flex-col relative",
                popular && "border-primary shadow-md",
                currentPlan && "border-green-500 bg-green-50 dark:bg-green-950/20"
            )}
        >
            {popular && !currentPlan && (
                <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-1/2">
                    <div className="px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                        {language === 'en' ? 'Popular' : 'Populär'}
                    </div>
                </div>
            )}
            <CardHeader>
                {currentPlan && (
                    <div className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {t.currentPlan}
                    </div>
                )}
                <CardTitle>{getTitle()}</CardTitle>
                <CardDescription>{getDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="grid flex-1 gap-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{price}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {interval === "month" ? t.month : t.year}
                    </span>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium">{t.features}</div>
                    <ul className="grid gap-2 text-sm">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                {currentPlan ? (
                    <SubscriptionButton
                        action="cancel"
                        disabled={plan === "Free" || disabled}
                    />
                ) : priceId ? (
                    <CheckoutButton
                        priceId={priceId}
                        plan={plan}
                        interval={interval}
                        disabled={disabled}
                    />
                ) : null}
            </CardFooter>
        </Card>
    );
} 