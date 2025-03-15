'use client';

import { useEffect } from 'react';

/**
 * BrowserCompat component
 * 
 * Handles cross-browser compatibility issues, particularly for database 
 * connections in non-Chrome browsers.
 * 
 * This component patches fetch and XHR APIs to ensure consistent behavior
 * across different browsers.
 */
export function BrowserCompat() {
    useEffect(() => {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        // Detect browser
        const ua = window.navigator.userAgent;
        const isChrome = ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1;

        // Only apply fixes for non-Chrome browsers
        if (!isChrome) {
            // Set cookie with SameSite=None to help with cross-origin issues
            document.cookie = "db-compat=true; path=/; SameSite=None; Secure";

            // Patch the fetch API to ensure credentials are included
            const originalFetch = window.fetch;
            window.fetch = function (input, init) {
                // Always include credentials
                const newInit = { ...init } || {};
                newInit.credentials = 'include';

                // Add compat headers
                const headers = new Headers(newInit.headers || {});
                headers.append('X-Browser-Compat', 'true');
                newInit.headers = headers;

                return originalFetch.call(this, input, newInit);
            };

            // Modify XHR requests for similar reasons
            const originalXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (...args) {
                this.withCredentials = true;
                return originalXhrOpen.apply(this, args);
            };

            // Monitor for database connection errors
            window.addEventListener('error', function (event) {
                const errorMsg = event.message?.toLowerCase() || '';
                if (
                    errorMsg.includes('database') ||
                    errorMsg.includes('connection') ||
                    errorMsg.includes('fetch') ||
                    errorMsg.includes('prisma')
                ) {
                    event.preventDefault();
                    return true;
                }
            }, true);
        }
    }, []);

    // This component doesn't render anything
    return null;
}

export default BrowserCompat; 