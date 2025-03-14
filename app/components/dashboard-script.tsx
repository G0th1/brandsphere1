"use client"

import { useEffect } from "react";

export default function DashboardScript() {
    useEffect(() => {
        // Set dashboard loaded flag when component mounts
        try {
            sessionStorage.setItem('dashboard_loaded', 'true');
            sessionStorage.removeItem('auth_in_progress');
            console.log("Dashboard loaded flag set");
        } catch (e) {
            console.warn("Could not set dashboard loaded flag", e);
        }
    }, []);

    return null;
} 