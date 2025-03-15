"use client"

import { useEffect } from "react";

export default function DashboardScript() {
    useEffect(() => {
        // Only mark the session as loaded, no UI modifications
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('dashboard_loaded', 'true');
            sessionStorage.removeItem('auth_in_progress');

            // Check if we need to remove any debug elements that might have been added
            document.querySelectorAll('[id*="debug"], [id*="indicator"], [class*="debug"]').forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }
    }, []);

    return null;
} 