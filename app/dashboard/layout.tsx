// Server Component
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import AuthGuard from "@/app/components/auth-guard";
import DashboardClientNav from "@/app/components/dashboard-client-nav";
import DashboardScript from "@/app/components/dashboard-script";

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
    children: React.ReactNode;
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
                            <DashboardClientNav />
                            <div className="flex-1 p-4 md:p-8">{children}</div>
                        </div>
                    </AuthGuard>
                    <Toaster />
                </ThemeProvider>
                <DashboardScript />
            </body>
        </html>
    );
} 