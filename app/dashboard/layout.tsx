"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useEffect, useState } from "react";
import { AuthGuard, useAuthUser } from "@/app/components/auth-guard";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";
import DashboardNav from "@/app/components/dashboard-nav";
import { Toaster } from "@/components/ui/toaster";

// Import the dynamic marker to prevent static generation
import { dynamic } from "@/app/utils/dynamic-routes";
// Re-export the dynamic marker
export { dynamic };

// Översättningar
const translations = {
    en: {
        home: "Home",
        dashboard: "Dashboard",
        upgrade: "Upgrade",
        signOut: "Sign out",
        loading: "Loading...",
    },
    sv: {
        home: "Hem",
        dashboard: "Instrumentpanel",
        upgrade: "Uppgradera",
        signOut: "Logga ut",
        loading: "Laddar...",
    }
};

export const metadata: Metadata = {
    title: "BrandSphere AI - Dashboard",
    description: "AI-Powered Brand Identity Management",
};

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-background font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthGuard requireAuth={true}>
                        <div className="container mx-auto flex min-h-screen w-full flex-col">
                            <DashboardNav />
                            <div className="flex-1 p-4 md:p-8">{children}</div>
                        </div>
                    </AuthGuard>
                    <Toaster />
                </ThemeProvider>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Mark dashboard as loaded when this script runs
                            try {
                                sessionStorage.setItem('dashboard_loaded', 'true');
                                
                                // Also clear any auth_in_progress flag
                                sessionStorage.removeItem('auth_in_progress');
                                
                                console.log("Dashboard loaded flag set");
                            } catch (e) {
                                console.warn("Could not set dashboard loaded flag", e);
                            }
                        `,
                    }}
                />
            </body>
        </html>
    );
}

function DashboardLayoutContent({
    children,
}: {
    children: ReactNode;
}) {
    const user = useAuthUser();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { language } = useLanguage();
    const t = translations[language];
    const email = user?.email || null;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("/login");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">B</div>
                            <span className="text-lg font-bold tracking-tight">BrandSphereAI</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden md:inline-block">
                                {email}
                            </span>
                            <Button variant="ghost" size="icon" onClick={handleSignOut} title={t.signOut}>
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">{t.signOut}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
                    <p className="text-sm text-muted-foreground">
                        &copy; 2023 BrandSphereAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                            Privacy
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
} 