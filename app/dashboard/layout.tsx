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

// Add this style block to fix possible overlay issues
const fixedStyle = `
    html, body {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
    }
    
    .dashboard-container {
        isolation: isolate;
        position: relative;
        z-index: 50;
        visibility: visible !important;
        opacity: 1 !important;
        display: flex !important;
    }
    
    .dashboard-content {
        position: relative;
        z-index: 60;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
    }
    
    button, a, [role="button"] {
        position: relative;
        z-index: 100;
        pointer-events: auto !important;
        cursor: pointer !important;
    }
    
    main, section, article, [id*="dashboard"], [class*="dashboard"] {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
    }
`;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className="dashboard-html">
            <head>
                <style dangerouslySetInnerHTML={{ __html: fixedStyle }} />
            </head>
            <body className="min-h-screen bg-background font-sans antialiased dashboard-body">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthGuard requireAuth={true}>
                        <div className="dashboard-container relative container mx-auto flex min-h-screen w-full flex-col">
                            <DashboardClientNav />
                            <main id="dashboard-content" className="dashboard-content relative z-60 flex-1 p-4 md:p-8">
                                {children}
                            </main>
                        </div>
                    </AuthGuard>
                    <Toaster />
                </ThemeProvider>
                <DashboardScript />
            </body>
        </html>
    );
} 