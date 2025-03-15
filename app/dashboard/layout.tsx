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

// Simplified dashboard indicator component
function DashboardStatusBar() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-primary text-white text-xs p-1 z-50 text-center"
            id="dashboard-indicator"
            suppressHydrationWarning
        >
            Dashboard Loaded • <span id="dashboard-time">{new Date().toLocaleTimeString()}</span>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        try {
                            // Mark dashboard as loaded for auth continuity
                            sessionStorage.setItem('dashboard_loaded', 'true');
                            
                            // Update time every second
                            setInterval(() => {
                                document.getElementById('dashboard-time').textContent = new Date().toLocaleTimeString();
                            }, 1000);
                            
                            // Add user info if available
                            const email = localStorage.getItem('user_email');
                            if (email) {
                                document.getElementById('dashboard-indicator').textContent += ' • User: ' + email;
                            }
                        } catch (e) {
                            console.warn('Dashboard indicator error:', e);
                        }
                    `,
                }}
            />
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: fixedStyle }} />
            <AuthGuard requireAuth={true}>
                <div className="dashboard-container container mx-auto">
                    <DashboardClientNav />
                    <main id="dashboard-content" className="dashboard-content p-4 md:p-6 pb-8">
                        <Suspense fallback={<div className="p-4 border rounded-md">Loading dashboard content...</div>}>
                            {children}
                        </Suspense>
                    </main>
                    <DashboardStatusBar />
                </div>
            </AuthGuard>
        </>
    );
} 