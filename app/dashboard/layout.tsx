// Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import AuthGuard from "@/app/components/auth-guard";
import DashboardClientNav from "@/app/components/dashboard-client-nav";
import { Suspense } from "react";

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

// Improved style block with better proportions
const dashboardStyles = `
    .dashboard-html, .dashboard-body {
        overflow-x: hidden;
    }
    
    .dashboard-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
    }
    
    .dashboard-content {
        flex-grow: 1;
        padding: 1.5rem;
        width: 100%;
    }
    
    @media (min-width: 768px) {
        .dashboard-content {
            padding: 2rem;
        }
    }
    
    @media (min-width: 1200px) {
        .dashboard-content {
            padding: 2.5rem;
        }
    }
`;

// Hidden script to maintain session continuity without visible elements
function SessionMaintenanceScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    try {
                        // Mark dashboard as loaded for auth continuity
                        sessionStorage.setItem('dashboard_loaded', 'true');
                    } catch (e) {
                        console.warn('Session maintenance error:', e);
                    }
                `,
            }}
        />
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
            <AuthGuard requireAuth={true}>
                <div className="dashboard-container">
                    <DashboardClientNav />
                    <main id="dashboard-content" className="dashboard-content">
                        <Suspense fallback={<div className="p-4 border rounded-md">Loading dashboard content...</div>}>
                            {children}
                        </Suspense>
                    </main>
                    <SessionMaintenanceScript />
                </div>
            </AuthGuard>
        </>
    );
} 