"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function BrowserCompatibilityNotice() {
    const { toast } = useToast();
    const [isEdge, setIsEdge] = useState(false);
    const [isSafari, setIsSafari] = useState(false);
    const [isFirefox, setIsFirefox] = useState(false);
    const [isChrome, setIsChrome] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if running in browser
        if (typeof window === 'undefined') return;

        // Detect browsers
        const userAgent = navigator.userAgent;
        const isEdgeBrowser = userAgent.indexOf("Edg") !== -1;
        const isFirefoxBrowser = userAgent.indexOf("Firefox") !== -1;
        const isSafariBrowser = userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1;
        const isChromeBrowser = userAgent.indexOf("Chrome") !== -1 && !isEdgeBrowser;

        setIsEdge(isEdgeBrowser);
        setIsFirefox(isFirefoxBrowser);
        setIsSafari(isSafariBrowser);
        setIsChrome(isChromeBrowser);

        // Apply database compatibility fixes for non-Chrome browsers
        if (!isChromeBrowser) {
            // Set SameSite=None cookies for cross-browser compatibility
            document.cookie = "db-compat=true; path=/; SameSite=None; Secure";

            // Patch fetch to include credentials and compatibility headers
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

            console.log('Applied database compatibility fixes for non-Chrome browser');
        }

        // Check if notice was previously dismissed
        try {
            const noticeDismissed = localStorage.getItem('browser_notice_dismissed') === 'true';
            setDismissed(noticeDismissed);

            // Show toast for non-Chrome users
            if (!isChromeBrowser && !noticeDismissed) {
                toast({
                    title: "Browser Compatibility Notice",
                    description: "For best experience, we recommend using Google Chrome",
                    duration: 8000,
                    action: (
                        <button
                            className="bg-primary px-3 py-2 rounded-md text-sm text-white"
                            onClick={() => {
                                localStorage.setItem('browser_notice_dismissed', 'true');
                                setDismissed(true);
                            }}
                        >
                            Dismiss
                        </button>
                    ),
                });
            }
        } catch (e) {
            console.warn("Could not access localStorage:", e);
        }
    }, [toast]);

    // If Chrome or notice dismissed, don't show anything
    if (isChrome || dismissed) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-lg z-50 text-sm">
            <button
                onClick={() => {
                    try {
                        localStorage.setItem('browser_notice_dismissed', 'true');
                    } catch (e) {
                        console.warn("Could not access localStorage:", e);
                    }
                    setDismissed(true);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>

            <h3 className="font-medium text-orange-800 mb-2">Browser Compatibility Notice</h3>
            <p className="text-orange-700 mb-3">
                {isEdge && "Microsoft Edge users may experience some limitations."}
                {isFirefox && "Firefox users may experience some database connection issues."}
                {isSafari && "Safari users may experience some database connection issues."}
                {!isEdge && !isFirefox && !isSafari && "Your browser may have limited compatibility."}
            </p>

            <p className="text-orange-700 mb-3">
                For the best experience, we recommend using Chrome.
            </p>

            {isEdge && (
                <ol className="text-orange-700 list-decimal pl-5 space-y-1">
                    <li>Open Edge Settings → Privacy, search and services</li>
                    <li>Under "Tracking prevention" change from Balanced to Basic</li>
                    <li>Or try using Chrome instead</li>
                </ol>
            )}
        </div>
    );
} 