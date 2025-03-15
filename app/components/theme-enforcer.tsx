"use client";

import { useEffect } from "react";

/**
 * ThemeEnforcer component
 * Ensures consistent navy-blue theme across the dashboard
 * by overriding potential conflicting styles
 */
export default function ThemeEnforcer() {
    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;

        // Create a style element to enforce the navy-blue theme
        const style = document.createElement('style');
        style.innerHTML = `
            /* Navy blue theme colors */
            :root {
                --theme-primary: #1e3a8a !important;
                --theme-primary-foreground: #ffffff !important;
            }
            
            /* Override any theme variables */
            .bg-primary, button[data-primary], [data-theme] .bg-primary {
                background-color: #1e3a8a !important;
                color: white !important;
            }
            
            /* Ensure primary text color */
            .text-primary, a.text-primary, [data-theme] .text-primary {
                color: #1e3a8a !important;
            }
            
            /* Fix any inconsistent headers */
            header.bg-background, 
            [data-theme] header.bg-background,
            nav.bg-background,
            [data-theme] nav.bg-background {
                background-color: #1e3a8a !important;
                color: white !important;
                border-color: #0f172a !important;
            }
            
            /* Ensure button consistency */
            button.bg-primary, 
            button[data-state="active"],
            .btn-primary {
                background-color: #1e3a8a !important;
                color: white !important;
            }
            
            /* Properly space content */
            .dashboard-content {
                padding: clamp(1rem, 5vw, 3rem) !important;
            }
            
            /* Improve card styling */
            .card {
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }
            
            .card:hover {
                box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
                transform: translateY(-2px) !important;
            }
        `;

        // Append the style element to head
        document.head.appendChild(style);

        // Remove any light theme classes from body or html
        document.documentElement.classList.remove('light');
        document.body.classList.remove('light');

        // Set the theme to dark (assuming the navy-blue works better with dark theme)
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');

        // Clean up on unmount
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return null;
} 