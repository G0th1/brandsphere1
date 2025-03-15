"use client";

import { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, Database, RefreshCw, Zap, Globe, Chrome as ChromeIcon, Laptop, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import Link from 'next/link';

interface DbErrorBoundaryProps {
    children: ReactNode;
}

export default function DbErrorBoundary({ children }: DbErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bypassChecked, setBypassChecked] = useState(false);
    const [isChrome, setIsChrome] = useState(true);
    const [isUniversalMode, setIsUniversalMode] = useState(false);

    useEffect(() => {
        // Enable universal mode for all devices
        const enableUniversalMode = () => {
            setBypassChecked(true);
            setIsLoading(false);
            setHasError(false);
            setIsUniversalMode(true);

            // Store the preferences
            try {
                localStorage.setItem('offlineMode', 'true');
                localStorage.setItem('universalMode', 'true');

                // Set cookies that help with cross-device compatibility
                document.cookie = "universal-mode=active; path=/; SameSite=None; Secure; Max-Age=86400";
                document.cookie = "device-access=enabled; path=/; SameSite=None; Secure; Max-Age=86400";
            } catch (e) {
                console.warn('Could not write to localStorage or cookies:', e);
            }
        };

        // Always enable universal mode immediately to prevent loading screen
        enableUniversalMode();

        // Cleanup URL params if needed
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const hasParams = urlParams.has('offline_mode') || urlParams.has('bypass_db') || urlParams.has('universal_mode');
            if (hasParams) {
                cleanupUrlParams();
            }
        }

    }, []);

    // Function to clean up URL parameters
    const cleanupUrlParams = () => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('offline_mode');
            url.searchParams.delete('bypass_db');
            url.searchParams.delete('universal_mode');
            window.history.replaceState({}, document.title, url.toString());
        }
    };

    const handleRetry = () => {
        setIsLoading(true);
        localStorage.removeItem('offlineMode');
        localStorage.removeItem('universalMode');
        window.location.reload();
    };

    const handleEnterUniversalMode = () => {
        localStorage.setItem('offlineMode', 'true');
        localStorage.setItem('universalMode', 'true');
        window.location.reload();
    };

    const handleBypassAndGoToDemo = () => {
        localStorage.setItem('offlineMode', 'true');
        localStorage.setItem('universalMode', 'true');
        window.location.href = '/demo/login';
    };

    // If universal mode is enabled, show content with indicator
    if (bypassChecked) {
        let indicatorText = isUniversalMode ? "Universal Mode" : "Offline Mode";
        let indicatorBg = isUniversalMode ? "bg-green-600" : "bg-yellow-600";
        let indicatorIcon = isUniversalMode ? <Laptop className="h-3.5 w-3.5 mr-1.5" /> : <Globe className="h-3.5 w-3.5 mr-1.5" />;

        if (!isChrome && !isUniversalMode) {
            indicatorText = "Browser Compatibility Mode";
            indicatorBg = "bg-blue-600";
            indicatorIcon = <ChromeIcon className="h-3.5 w-3.5 mr-1.5" />;
        }

        return (
            <>
                {/* Mode Indicator */}
                <div className={`fixed bottom-4 right-4 z-50 ${indicatorBg} text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg`}>
                    {indicatorIcon}
                    {indicatorText}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-5 px-1.5 text-xs text-white hover:bg-opacity-70"
                        onClick={handleRetry}
                    >
                        Reconnect
                    </Button>
                </div>
                {children}
            </>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Connecting to Database</CardTitle>
                        <CardDescription className="text-center">Please wait while we establish connection...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center p-6">
                        <Database className="h-12 w-12 animate-pulse text-primary" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md border-destructive/50">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle className="text-center text-destructive">Database Connection Error</CardTitle>
                        <CardDescription className="text-center">
                            We're having trouble connecting to our database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            You can continue using the website in universal mode. This allows access from any device but some features requiring database connection may be limited.
                        </p>
                        {!isChrome && (
                            <p className="text-sm font-medium text-orange-600 mt-2 mb-4">
                                We recommend using Google Chrome for the best experience with all features.
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={handleEnterUniversalMode} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                            <Laptop className="h-4 w-4" />
                            Use Website in Universal Mode
                        </Button>
                        <Button onClick={handleBypassAndGoToDemo} className="w-full gap-2 bg-yellow-600 hover:bg-yellow-700">
                            <Zap className="h-4 w-4" />
                            Go to Demo Mode
                        </Button>
                        <Button onClick={handleRetry} variant="outline" className="w-full gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Retry Database Connection
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
} 