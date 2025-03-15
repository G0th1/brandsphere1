// Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import AuthGuard from "@/app/components/auth-guard";
import DashboardScript from "@/app/components/dashboard-script";
import CacheBuster from "@/app/components/cache-buster";
import ThemeEnforcer from "@/app/components/theme-enforcer";
import { Suspense } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";

// Import the dynamic marker to prevent static generation
import { dynamic } from "@/app/utils/dynamic-routes";
// Re-export the dynamic marker
export { dynamic };

// Import sidebar with error boundary and fallback
const SidebarNav = dynamic(() => import("@/app/components/sidebar-nav"), {
    ssr: false,
    loading: () => <SimpleSidebarFallback />
});

// Fallback navigation component if sidebar fails to load
function SimpleSidebarFallback() {
    return (
        <div className="md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 hidden md:block">
            <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pt-5 overflow-y-auto h-full">
                <div className="hidden md:flex items-center justify-center h-16 flex-shrink-0 px-4">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</div>
                        <span className="text-xl font-bold">BrandSphere AI</span>
                    </Link>
                </div>
                <div className="mt-5 flex-grow flex flex-col">
                    <nav className="flex-1 px-2 space-y-1">
                        <Link href="/dashboard" className="group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800">
                            <div className="mr-3 text-gray-900 dark:text-gray-100">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            Dashboard
                        </Link>
                        <Link href="/dashboard/settings" className="group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900">
                            <div className="mr-3 text-gray-500 dark:text-gray-400">
                                <Settings className="h-5 w-5" />
                            </div>
                            Settings
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}

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

// Simplified dashboard styles
const dashboardStyles = `
    :root {
        --navy-blue-50: #f0f5fa;
        --navy-blue-100: #dae3f3;
        --navy-blue-600: #1e3a8a;
        --navy-blue-700: #172554;
        --navy-blue-800: #0f172a;
        --navy-blue-900: #0a0f1a;
    }

    body, html {
        overflow-x: hidden;
        background-color: hsl(var(--background));
    }
    
    /* Dashboard layout with sidebar */
    .dashboard-container {
        display: flex;
        min-height: 100vh;
        width: 100%;
    }
    
    /* Content area styling */
    .dashboard-content {
        flex-grow: 1;
        width: 100%;
        padding: 1.5rem;
        margin-left: 0;
        transition: margin-left 0.3s ease;
    }
    
    /* Sidebar space on desktop */
    @media (min-width: 768px) {
        .dashboard-content {
            margin-left: 256px; /* Width of sidebar */
            width: calc(100% - 256px);
            padding: 2rem;
        }
    }
    
    @media (min-width: 1200px) {
        .dashboard-content {
            padding: 2.5rem 3rem;
        }
    }
    
    /* Consistent card styling */
    .card {
        border-radius: 0.5rem;
        border: 1px solid hsl(var(--border));
        background-color: hsl(var(--card));
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    /* Page title styling */
    .page-title {
        font-size: 1.875rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }
    
    .page-description {
        color: hsl(var(--muted-foreground));
        margin-bottom: 1.5rem;
    }
    
    /* Consistent spacing */
    .content-section {
        margin-bottom: 2rem;
    }

    /* Mobile Menu */
    .mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid hsl(var(--border));
        background-color: hsl(var(--background));
    }

    @media (min-width: 768px) {
        .mobile-header {
            display: none;
        }
    }
`;

// Hidden script to cleanup debug elements
function CleanupScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    try {
                        // Mark dashboard as loaded for auth continuity
                        sessionStorage.setItem('dashboard_loaded', 'true');
                        
                        // Create a unique cache-busting timestamp
                        sessionStorage.setItem('cache_bust', Date.now().toString());
                        
                        // Remove any debug elements
                        setTimeout(() => {
                            document.querySelectorAll('[data-debug]')
                                .forEach(el => el.remove());
                        }, 100);
                    } catch (e) {
                        console.warn('Dashboard cleanup error:', e);
                    }
                `,
            }}
        />
    );
}

// Mobile header component
function MobileHeader() {
    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</div>
                <span className="text-xl font-bold">BrandSphere AI</span>
            </Link>
            <Link href="/api/auth/signout" className="p-2">
                <LogOut className="h-5 w-5" />
            </Link>
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
            <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
            <AuthGuard requireAuth={true}>
                <div className="dashboard-container">
                    <Suspense fallback={<SimpleSidebarFallback />}>
                        <SidebarNav />
                    </Suspense>
                    <div className="flex flex-col w-full">
                        <MobileHeader />
                        <main id="dashboard-content" className="dashboard-content">
                            <Suspense fallback={<div className="p-4 border rounded-md">Loading dashboard content...</div>}>
                                {children}
                            </Suspense>
                        </main>
                    </div>
                    <CleanupScript />
                    <DashboardScript />
                    <CacheBuster />
                    <ThemeEnforcer />
                </div>
            </AuthGuard>
        </>
    );
} 