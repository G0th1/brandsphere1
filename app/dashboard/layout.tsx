// Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import AuthGuard from "@/app/components/auth-guard";
import DashboardClientNav from "@/app/components/dashboard-client-nav";
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

// Improved style block with better layout and consistent navy-blue theme
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
    
    /* Ensure consistent theme colors */
    .bg-primary {
        background-color: var(--navy-blue-600) !important;
    }
    
    .text-primary {
        color: var(--navy-blue-600) !important;
    }
    
    /* Improve main container */
    .dashboard-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        max-width: 1600px; /* Increased from 1400px */
        margin: 0 auto;
        width: 100%;
        padding: 0;
    }
    
    /* Improve content spacing */
    .dashboard-content {
        flex-grow: 1;
        padding: 1.5rem;
        width: 100%;
        background-color: hsl(var(--background));
    }
    
    /* Responsive padding adjustments */
    @media (min-width: 768px) {
        .dashboard-content {
            padding: 2rem;
        }
    }
    
    @media (min-width: 1200px) {
        .dashboard-content {
            padding: 2.5rem 3rem;
        }
    }
    
    /* Card and UI element styling for consistent navy-blue theme */
    .card {
        border-radius: 0.5rem;
        border: 1px solid hsl(var(--border));
        background-color: hsl(var(--card));
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    /* Ensure button consistency */
    .btn-primary, 
    .bg-primary, 
    button[data-state="active"] {
        background-color: var(--navy-blue-600);
        color: white;
    }
    
    /* Override any potential conflicting styles */
    [data-theme="light"] .bg-primary,
    [data-theme="dark"] .bg-primary {
        background-color: var(--navy-blue-600) !important;
    }
`;

// Hidden script to maintain session continuity without visible elements
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
                    <DashboardClientNav />
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