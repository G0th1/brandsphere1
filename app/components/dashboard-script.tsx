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

            // Ensure dashboard content is visible
            const dashboardContent = document.getElementById('dashboard-content');
            if (dashboardContent) {
                dashboardContent.style.visibility = 'visible';
                dashboardContent.style.opacity = '1';
            }

            // Clean up when component unmounts
            return () => {
                document.head.removeChild(styleEl);
                window.__dashboardInitialized = false;
            };
        } catch (e) {
            console.warn("Dashboard initialization error:", e);
        }
    }, []);

    return null;
} 