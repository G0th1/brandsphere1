"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

// Definiera vilka funktioner som är tillgängliga per plan
export const PLAN_FEATURES = {
    free: [
        'basic_analytics',
        'single_account',
        'limited_posts',
        'basic_templates'
    ],
    pro: [
        'basic_analytics',
        'single_account',
        'limited_posts',
        'basic_templates',
        'advanced_analytics',
        'multiple_accounts',
        'unlimited_posts',
        'advanced_templates',
        'scheduled_posts',
        'ai_suggestions'
    ],
    business: [
        'basic_analytics',
        'single_account',
        'limited_posts',
        'basic_templates',
        'advanced_analytics',
        'multiple_accounts',
        'unlimited_posts',
        'advanced_templates',
        'scheduled_posts',
        'ai_suggestions',
        'team_collaboration',
        'white_label',
        'priority_support',
        'api_access',
        'custom_branding'
    ]
};

// Definiera funktioner som kräver sociala mediekonton
export const SOCIAL_REQUIRED_FEATURES = [
    'advanced_analytics',
    'scheduled_posts',
    'ai_suggestions',
    'multiple_accounts',
    'unlimited_posts'
];

const translations = {
    en: {
        upgradeRequired: "Upgrade required",
        featureNotAvailable: "This feature is not available in your current plan.",
        upgradeToPro: "Upgrade to Pro",
        upgradeToBusiness: "Upgrade to Business",
        viewPlans: "View Plans",
        socialRequired: "Social media account required",
        socialRequiredDesc: "This feature requires you to connect at least one social media account.",
        connectAccounts: "Connect Accounts"
    },
    sv: {
        upgradeRequired: "Uppgradering krävs",
        featureNotAvailable: "Denna funktion är inte tillgänglig i din nuvarande plan.",
        upgradeToPro: "Uppgradera till Pro",
        upgradeToBusiness: "Uppgradera till Business",
        viewPlans: "Visa planer",
        socialRequired: "Socialt mediekonto krävs",
        socialRequiredDesc: "Denna funktion kräver att du kopplar minst ett socialt mediekonto.",
        connectAccounts: "Koppla konton"
    }
};

interface FeatureGateProps {
    feature: string;
    userPlan?: 'free' | 'pro' | 'business';
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface SocialGateProps {
    feature: string;
    hasSocialAccounts: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * SocialGate-komponenten kontrollerar om en användare har kopplat sociala mediekonton
 * för att få åtkomst till vissa funktioner.
 * 
 * Exempel:
 * <SocialGate feature="advanced_analytics" hasSocialAccounts={user.hasSocialAccounts}>
 *   <AdvancedAnalyticsComponent />
 * </SocialGate>
 */
export function SocialGate({
    feature,
    hasSocialAccounts,
    children,
    fallback
}: SocialGateProps) {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();

    // Kontrollera om funktionen kräver sociala mediekonton
    const requiresSocialAccount = SOCIAL_REQUIRED_FEATURES.includes(feature);

    // Om funktionen inte kräver sociala mediekonton eller om användaren har kopplat konton, visa originalinnehållet
    if (!requiresSocialAccount || hasSocialAccounts) {
        return <>{children}</>;
    }

    // Om anpassat fallback-innehåll tillhandahålls, visa det
    if (fallback) {
        return <>{fallback}</>;
    }

    // Standardfallback är en uppmaning att koppla sociala mediekonton
    return (
        <div className="border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 rounded-lg p-4 text-center my-4">
            <LinkIcon className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-1">{t.socialRequired}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t.socialRequiredDesc}
            </p>
            <Button
                onClick={() => router.push('/dashboard/connect')}
                variant="default"
                size="sm"
            >
                {t.connectAccounts}
            </Button>
        </div>
    );
}

/**
 * FeatureGate-komponenten kontrollerar om en användare har åtkomst 
 * till en viss funktion baserat på deras prenumerationsnivå.
 * 
 * Exempel:
 * <FeatureGate feature="advanced_analytics" userPlan={user.plan}>
 *   <AdvancedAnalyticsComponent />
 * </FeatureGate>
 */
export function FeatureGate({
    feature,
    userPlan = 'free',
    children,
    fallback
}: FeatureGateProps) {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();

    // Kontrollera om användaren har tillgång till funktionen
    const hasAccess = PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES]?.includes(feature);

    // Om användaren har åtkomst, visa originalinnehållet
    if (hasAccess) {
        return <>{children}</>;
    }

    // Om anpassat fallback-innehåll tillhandahålls, visa det
    if (fallback) {
        return <>{fallback}</>;
    }

    // Avgör vilken plan som behövs för denna funktion
    const requiredPlan =
        PLAN_FEATURES.pro.includes(feature) ? 'pro' :
            PLAN_FEATURES.business.includes(feature) ? 'business' : 'enterprise';

    // Standardfallback är en uppgraderingsuppmaning
    return (
        <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 rounded-lg p-4 text-center my-4">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-1">{t.upgradeRequired}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t.featureNotAvailable}
            </p>
            <Button
                onClick={() => router.push('/pricing')}
                variant="default"
                size="sm"
            >
                {requiredPlan === 'pro' ? t.upgradeToPro :
                    requiredPlan === 'business' ? t.upgradeToBusiness :
                        t.viewPlans}
            </Button>
        </div>
    );
}

// Hook för att kontrollera om en användare har åtkomst till en specifik funktion
export function useHasFeatureAccess(feature: string, userPlan: 'free' | 'pro' | 'business' = 'free'): boolean {
    return PLAN_FEATURES[userPlan]?.includes(feature) || false;
} 