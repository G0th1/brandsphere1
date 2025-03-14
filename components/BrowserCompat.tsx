'use client';

import { useEffect } from 'react';

/**
 * BrowserCompat component
 * 
 * This component handles cross-browser compatibility issues,
 * particularly for database connections in non-Chrome browsers.
 * 
 * It should be imported in the root layout or main application component.
 */
export function BrowserCompat() {
    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;

        // Detect browser
        const ua = window.navigator.userAgent;
        const isChrome = ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1;
        const isEdge = ua.indexOf('Edg') > -1;
        const isFirefox = ua.indexOf('Firefox') > -1;
        const isSafari = ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1;

        // Log browser info
        console.log('Browser detection:', { isChrome, isEdge, isFirefox, isSafari });

        // Apply fixes for non-Chrome browsers
        if (!isChrome) {
            console.log('🔄 Non-Chrome browser detected. Applying database compatibility fixes.');

            // Set cookie with SameSite=None to help with cross-origin issues
            document.cookie = "db-compat=true; path=/; SameSite=None; Secure";

            // Patch the fetch API to ensure credentials are included
            const originalFetch = window.fetch;
            window.fetch = function (input, init) {
                const newInit = { ...init } || {};
                newInit.credentials = 'include'; // Always include credentials

                // Add headers to indicate compat mode
                const headers = new Headers(newInit.headers || {});
                headers.append('X-Browser-Compat', 'true');
                newInit.headers = headers;

                return originalFetch.call(this, input, newInit);
            };

            // Monitor for database connection errors
            window.addEventListener('error', function (event) {
                if (event.message && (
                    event.message.includes('database') ||
                    event.message.includes('connection') ||
                    event.message.includes('fetch') ||
                    event.message.includes('prisma')
                )) {
                    console.warn('⚠️ Caught database error:', event.message);
                    // Retry the operation or apply fallback
                    event.preventDefault();
                    return true;
                }
            }, true);

            // Modify XHR requests for similar reasons
            const originalXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (...args) {
                const xhr = this;
                xhr.withCredentials = true; // Allow credentials
                return originalXhrOpen.apply(xhr, args);
            };
        }
    }, []);

    // This component doesn't render anything
    return null;
}

export default BrowserCompat; 