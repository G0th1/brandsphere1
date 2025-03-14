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

// Translations
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

// Simplified style block for better performance
const fixedStyle = `
    .dashboard-html, .dashboard-body {
        overflow-x: hidden;
    }
    
    .dashboard-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    
    .dashboard-content {
        flex-grow: 1;
        padding: 1rem;
    }
    
    @media (min-width: 768px) {
        .dashboard-content {
            padding: 2rem;
        }
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
                        <div className="dashboard-container container mx-auto">
                            <DashboardClientNav />
                            <main id="dashboard-content" className="dashboard-content">
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