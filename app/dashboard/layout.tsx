// Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import AuthGuard from "@/app/components/auth-guard";
import SidebarNav from "@/app/components/sidebar-nav";
import DashboardScript from "@/app/components/dashboard-script";
import CacheBuster from "@/app/components/cache-buster";
import ThemeEnforcer from "@/app/components/theme-enforcer";
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

// Consistent dashboard styles with better layout
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
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .card:hover {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transform: translateY(-2px);
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
                        
                        // Aggressive cleanup of any debug elements
                        function cleanupDebugElements() {
                            // Remove any fixed position elements that might be debug overlays
                            const computedStyles = Array.from(document.querySelectorAll('*')).map(el => {
                                return {
                                    element: el,
                                    style: window.getComputedStyle(el)
                                };
                            });
                            
                            computedStyles.forEach(({element, style}) => {
                                // Check if it's likely a debug element
                                if (
                                    style.position === 'fixed' && 
                                    (
                                        (style.top === '0px' || style.bottom === '0px') &&
                                        (style.zIndex > 50 || style.zIndex === 'auto')
                                    ) &&
                                    !element.classList.contains('toaster') && // Don't remove toast notifications
                                    element.id !== 'radix-:r0:' // Don't remove popover elements
                                ) {
                                    console.log('Removing potential debug element', element);
                                    element.style.display = 'none';
                                    element.style.visibility = 'hidden';
                                    // Try to remove if possible
                                    if (element.parentNode) {
                                        try {
                                            element.parentNode.removeChild(element);
                                        } catch (e) {
                                            // Ignore errors
                                        }
                                    }
                                }
                            });
                        }
                        
                        // Run cleanup after slight delay to ensure everything is loaded
                        setTimeout(cleanupDebugElements, 100);
                        // Run again later in case any debug elements are added dynamically
                        setTimeout(cleanupDebugElements, 1000);
                    } catch (e) {
                        console.warn('Dashboard cleanup error:', e);
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
                    <SidebarNav />
                    <main id="dashboard-content" className="dashboard-content">
                        <Suspense fallback={<div className="p-4 border rounded-md">Loading dashboard content...</div>}>
                            {children}
                        </Suspense>
                    </main>
                    <CleanupScript />
                    <DashboardScript />
                    <CacheBuster />
                    <ThemeEnforcer />
                </div>
            </AuthGuard>
        </>
    );
} 