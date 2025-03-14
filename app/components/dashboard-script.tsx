"use client"

import { useEffect } from "react";

export default function DashboardScript() {
    useEffect(() => {
        // Function to add debugging tools and fix potential issues
        const initializeDashboard = () => {
            // Set dashboard loaded flag when component mounts
            try {
                sessionStorage.setItem('dashboard_loaded', 'true');
                sessionStorage.removeItem('auth_in_progress');
                console.log("Dashboard loaded flag set");

                // Force any invisible elements that might be blocking to be removed
                const cleanup = () => {
                    // Find and remove any potential invisible overlays
                    const overlays = document.querySelectorAll('div[style*="position: fixed"]');
                    overlays.forEach(overlay => {
                        const computed = window.getComputedStyle(overlay);
                        const isInvisible = computed.opacity === '0' || computed.visibility === 'hidden';
                        const isFullScreen = computed.width === '100%' || computed.height === '100%';
                        const isBlocking = computed.zIndex && parseInt(computed.zIndex) > 100;

                        if ((isInvisible && isFullScreen) || isBlocking) {
                            console.log("Removing potentially blocking overlay", overlay);
                            overlay.remove();
                        }
                    });

                    // Ensure all buttons are clickable
                    const buttons = document.querySelectorAll('button, a, [role="button"]');
                    buttons.forEach(button => {
                        button.setAttribute('style', `
                            position: relative !important; 
                            z-index: 50 !important;
                            pointer-events: auto !important;
                        `);
                    });

                    // Fix any invisible content areas
                    const contentAreas = document.querySelectorAll('main, .dashboard-content, [class*="dashboard"]');
                    contentAreas.forEach(area => {
                        area.setAttribute('style', `
                            position: relative !important; 
                            z-index: 10 !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            pointer-events: auto !important;
                            display: block !important;
                        `);
                    });

                    // Force body and html to be visible
                    document.body.style.visibility = 'visible';
                    document.body.style.opacity = '1';
                    document.documentElement.style.visibility = 'visible';
                    document.documentElement.style.opacity = '1';

                    // Clear any loading states
                    document.body.classList.remove('loading');
                    document.documentElement.classList.remove('loading');

                    // Fix potential z-index stacking issues
                    const resetZIndex = () => {
                        document.querySelectorAll('div').forEach(div => {
                            const style = window.getComputedStyle(div);
                            // If z-index is very high and making things invisible
                            if (style.position === 'fixed' && style.zIndex && parseInt(style.zIndex) > 1000) {
                                div.style.zIndex = '100';
                            }
                        });
                    };

                    resetZIndex();
                };

                // Run cleanup immediately and after a short delay to catch post-render issues
                cleanup();
                setTimeout(cleanup, 300);
                setTimeout(cleanup, 1000);
                setTimeout(cleanup, 2000);

                // Listen for any click attempt that might be getting blocked
                document.addEventListener('click', (e) => {
                    if (e.target && (e.target as HTMLElement).tagName) {
                        const element = e.target as HTMLElement;
                        // Make the element and all its parents clickable
                        let current = element;
                        while (current && current !== document.body) {
                            current.style.pointerEvents = 'auto';
                            current = current.parentElement as HTMLElement;
                        }
                    }
                }, true);

            } catch (e) {
                console.warn("Could not set dashboard loaded flag", e);
            }
        };

        // Initialize immediately and re-check after a delay
        initializeDashboard();
        const interval = setInterval(initializeDashboard, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return null;
} 