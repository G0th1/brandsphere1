"use client"

import { useEffect } from "react";

/**
 * Dashboard initialization script
 * Handles session marking and cleanup of debug elements
 */
export default function DashboardScript() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            // Mark dashboard as loaded
            sessionStorage.setItem('dashboard_loaded', 'true');
            sessionStorage.removeItem('auth_in_progress');

            // Remove any debug elements
            const debugElements = document.querySelectorAll(
                '[id*="debug"], [id*="indicator"], [class*="debug"]'
            );

            debugElements.forEach(el => {
                el.parentNode?.removeChild(el);
            });
        } catch (error) {
            // Silently fail if there are issues with DOM or sessionStorage
        }
    }, []);

    return null;
} 