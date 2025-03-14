"use client"

import { useEffect } from "react";

export default function DashboardScript() {
    useEffect(() => {
        // Set a flag to avoid duplicate initialization
        if (window.__dashboardInitialized) return;
        window.__dashboardInitialized = true;

        // Set dashboard loaded flag
        try {
            sessionStorage.setItem('dashboard_loaded', 'true');
            sessionStorage.removeItem('auth_in_progress');

            // One-time style injection for better performance
            const styleEl = document.createElement('style');
            styleEl.innerHTML = `
                .dashboard-html, .dashboard-body {
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                .dashboard-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                }
                .dashboard-content {
                    position: relative;
                    z-index: 20;
                    visibility: visible;
                }
                [role="button"], a, button {
                    cursor: pointer;
                }
            `;
            document.head.appendChild(styleEl);

            // One-time cleanup of problematic elements
            const cleanup = () => {
                // Only remove problematic overlays, not every fixed element
                const overlays = document.querySelectorAll('div[style*="position: fixed"][style*="opacity: 0"], div[style*="visibility: hidden"][style*="position: fixed"]');
                overlays.forEach(overlay => {
                    const computed = window.getComputedStyle(overlay);
                    if (computed.width === '100%' && computed.height === '100%') {
                        console.log("Removing blocking overlay");
                        overlay.remove();
                    }
                });

                // Make sure content is visible - use classList rather than inline styles
                document.documentElement.classList.add('dashboard-html');
                document.body.classList.add('dashboard-body');

                // Ensure dashboard content is visible
                const dashboardContent = document.getElementById('dashboard-content');
                if (dashboardContent) {
                    dashboardContent.style.visibility = 'visible';
                    dashboardContent.style.opacity = '1';
                }

                // Ensure body scroll is enabled
                document.body.style.overflow = '';
            };

            // Run cleanup once and then again after a short delay
            cleanup();

            // Only set a single timeout for delayed cleanup, not multiple
            setTimeout(cleanup, 1000);

            // Add a single click handler for any blocked clicks
            const clickHandler = (e) => {
                // Only fix click issues for specific elements that need it
                if (e.target && e.target.tagName &&
                    (e.target.tagName === 'BUTTON' ||
                        e.target.tagName === 'A' ||
                        e.target.getAttribute('role') === 'button')) {
                    e.target.style.pointerEvents = 'auto';
                }
            };

            document.addEventListener('click', clickHandler, { passive: true });

            // Clean up event listeners when component unmounts
            return () => {
                document.removeEventListener('click', clickHandler);
                window.__dashboardInitialized = false;
            };
        } catch (e) {
            console.warn("Dashboard initialization error:", e);
        }
    }, []);

    return null;
} 