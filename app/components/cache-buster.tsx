"use client";

import { useEffect } from "react";

/**
 * CacheBuster component
 * Forces a refresh of assets and styles to ensure the latest version
 * is displayed to the user.
 */
export default function CacheBuster() {
    useEffect(() => {
        // Only run in the browser
        if (typeof window === 'undefined') return;

        // Create a unique identifier for this page load
        const cacheBuster = Date.now().toString();
        sessionStorage.setItem('cache_bust', cacheBuster);

        // Function to force reload CSS
        const reloadStylesheets = () => {
            try {
                // Force reload of all stylesheets by appending cache-busting query param
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.includes('cache_bust')) {
                        const newHref = href.includes('?')
                            ? `${href}&cache_bust=${cacheBuster}`
                            : `${href}?cache_bust=${cacheBuster}`;
                        link.setAttribute('href', newHref);
                    }
                });

                console.log("Stylesheets reloaded with cache-busting");
            } catch (e) {
                console.warn("Error reloading stylesheets:", e);
            }
        };

        // Try to clean up any debug elements
        const removeDebugElements = () => {
            try {
                // Common selectors for debug elements
                const debugSelectors = [
                    '[id*="debug"]',
                    '[id*="indicator"]',
                    '[class*="debug"]',
                    '.fixed.top-0',
                    '.fixed.bottom-0',
                    '[style*="position: fixed"]'
                ];

                // Query and remove matching elements
                document.querySelectorAll(debugSelectors.join(', ')).forEach(el => {
                    // Skip toasts and popups
                    if (
                        el.classList.contains('toaster') ||
                        el.id?.includes('radix-') ||
                        el.closest('.toaster') ||
                        el.closest('.dialog')
                    ) {
                        return;
                    }

                    console.log("Removing debug element:", el);

                    if (el.parentNode) {
                        try {
                            // First try to hide it
                            el.style.display = 'none';
                            el.style.visibility = 'hidden';
                            el.style.opacity = '0';
                            el.style.pointerEvents = 'none';

                            // Then try to remove it
                            el.parentNode.removeChild(el);
                        } catch (e) {
                            // Ignore removal errors
                        }
                    }
                });
            } catch (e) {
                console.warn("Error removing debug elements:", e);
            }
        };

        // Execute operations
        reloadStylesheets();

        // Remove debug elements after a slight delay and periodically
        setTimeout(removeDebugElements, 100);
        setTimeout(removeDebugElements, 500);
        const interval = setInterval(removeDebugElements, 2000);

        // Clean up the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, []);

    return null;
} 