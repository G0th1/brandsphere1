/**
 * Browser Compatibility Helper
 * 
 * This file contains utilities to help with browser compatibility issues,
 * especially regarding database connections across different browsers.
 */

// A function to check if the current browser is supported
export function checkBrowserSupport() {
    if (typeof window === 'undefined') return true; // Server-side

    const ua = window.navigator.userAgent;
    const isChrome = ua.indexOf('Chrome') > -1;
    const isEdge = ua.indexOf('Edg') > -1;
    const isFirefox = ua.indexOf('Firefox') > -1;
    const isSafari = ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1;

    // Report browser info to console
    console.log('Browser detection:', { isChrome, isEdge, isFirefox, isSafari, userAgent: ua });

    return true;
}

// Function to fix cookie settings for non-Chrome browsers
export function fixCookieSettings() {
    if (typeof window === 'undefined') return; // Server-side

    const ua = window.navigator.userAgent;
    const isChrome = ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1;

    if (!isChrome) {
        // For non-Chrome browsers, add a compatibility cookie
        document.cookie = "db-compat=true; path=/; SameSite=None; Secure";

        // Listen for fetch events and modify them for compatibility
        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            const newInit = init || {};
            const newHeaders = new Headers(newInit.headers || {});

            // Add a header to indicate this request needs special handling
            newHeaders.append('X-Browser-Compat', 'true');

            newInit.headers = newHeaders;
            newInit.credentials = 'include'; // Always include credentials for cross-origin requests

            return originalFetch.call(this, input, newInit);
        };

        console.log('Applied database connection fixes for non-Chrome browsers');
    }
}

// IIFE to automatically apply fixes when imported
(function () {
    if (typeof window !== 'undefined') {
        // Run on next tick to ensure DOM is ready
        setTimeout(() => {
            checkBrowserSupport();
            fixCookieSettings();
        }, 0);
    }
})(); 