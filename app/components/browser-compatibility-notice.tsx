"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function BrowserCompatibilityNotice() {
    const { toast } = useToast();
    const [isEdge, setIsEdge] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if running in browser
        if (typeof window === 'undefined') return;

        // Detect Edge browser
        const userAgent = navigator.userAgent;
        const isEdgeBrowser = userAgent.indexOf("Edg") !== -1;
        setIsEdge(isEdgeBrowser);

        // Check if notice was previously dismissed
        try {
            const noticeDismissed = localStorage.getItem('edge_notice_dismissed') === 'true';
            setDismissed(noticeDismissed);

            // Show toast for Edge users
            if (isEdgeBrowser && !noticeDismissed) {
                toast({
                    title: "Using Microsoft Edge?",
                    description: "For best experience, please adjust your privacy settings or try Chrome/Firefox",
                    duration: 10000,
                    action: (
                        <button
                            className="bg-primary px-3 py-2 rounded-md text-sm text-white"
                            onClick={() => {
                                localStorage.setItem('edge_notice_dismissed', 'true');
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

    // If not Edge or notice dismissed, don't show anything
    if (!isEdge || dismissed) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-lg z-50 text-sm">
            <button
                onClick={() => {
                    try {
                        localStorage.setItem('edge_notice_dismissed', 'true');
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

            <h3 className="font-medium text-orange-800 mb-2">Microsoft Edge Detected</h3>
            <p className="text-orange-700 mb-3">
                Some features may not work properly in Edge due to privacy settings. For the best experience:
            </p>

            <ol className="text-orange-700 list-decimal pl-5 space-y-1">
                <li>Open Edge Settings → Privacy, search and services</li>
                <li>Under "Tracking prevention" change from Balanced to Basic</li>
                <li>Or try using Chrome or Firefox instead</li>
            </ol>
        </div>
    );
} 