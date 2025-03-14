"use client";

import { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, Database, RefreshCw, Zap, Globe, Chrome as ChromeIcon } from 'lucide-react';
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

    useEffect(() => {
        // Detect browser
        if (typeof window !== 'undefined') {
            const ua = window.navigator.userAgent;
            const isChromeBrowser = ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1;
            setIsChrome(isChromeBrowser);

            // For non-Chrome browsers, automatically bypass checks
            if (!isChromeBrowser) {
                console.log('Non-Chrome browser detected. Bypassing database checks.');
                setBypassChecked(true);
                setIsLoading(false);
                setHasError(false);

                // Store offline mode preference for non-Chrome browsers
                localStorage.setItem('offlineMode', 'true');
                return;
            }
        }

        // Check if user previously enabled offline mode
        const offlineModeEnabled = localStorage.getItem('offlineMode') === 'true';

        // Check URL parameters for offline mode
        const urlParams = new URLSearchParams(window.location.search);
        const offlineParam = urlParams.get('offline_mode') === 'true';
        const bypassDb = urlParams.get('bypass_db') === 'true';

        // If offline mode is enabled through any method, bypass the database check
        if (offlineModeEnabled || offlineParam || bypassDb) {
            setBypassChecked(true);
            setIsLoading(false);
            setHasError(false);

            // Store the offline mode preference
            if (!offlineModeEnabled && (offlineParam || bypassDb)) {
                localStorage.setItem('offlineMode', 'true');
            }

            // If using a URL parameter, clean it up for cleaner URLs
            if (offlineParam || bypassDb) {
                cleanupUrlParams();
            }

            return;
        }

        // Check if user is on demo path
        const isDemoPath = window.location.pathname.startsWith('/demo');
        if (isDemoPath) {
            setBypassChecked(true);
            setIsLoading(false);
            setHasError(false);
            return;
        }

        // Otherwise check database connection
        const checkDbConnection = async () => {
            try {
                // Add a compatibility flag for non-Chrome browsers
                const params = !isChrome ? '?bypass_db=true' : '';
                const response = await fetch(`/api/db-health-check${params}`, {
                    credentials: 'include',
                    headers: {
                        'X-Browser-Compat': 'true'
                    }
                });

                if (!response.ok && !isChrome) {
                    // For non-Chrome browsers, always bypass even if the API fails
                    console.log('API returned error but bypassing for non-Chrome browser');
                    setHasError(false);
                    setBypassChecked(true);
                    localStorage.setItem('offlineMode', 'true');
                } else {
                    const data = await response.json();
                    setHasError(!data.success);

                    // If this is a non-Chrome browser and we got success, still enable offline mode
                    if (!isChrome && data.success) {
                        setBypassChecked(true);
                        localStorage.setItem('offlineMode', 'true');
                    }
                }
            } catch (error) {
                console.error('Database health check failed:', error);

                // For non-Chrome browsers, bypass even on error
                if (!isChrome) {
                    setHasError(false);
                    setBypassChecked(true);
                    localStorage.setItem('offlineMode', 'true');
                } else {
                    setHasError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkDbConnection();
    }, [isChrome]);

    // Function to clean up URL parameters
    const cleanupUrlParams = () => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('offline_mode');
            url.searchParams.delete('bypass_db');
            window.history.replaceState({}, document.title, url.toString());
        }
    };

    const handleRetry = () => {
        setIsLoading(true);
        localStorage.removeItem('offlineMode');
        window.location.reload();
    };

    const handleEnterOfflineMode = () => {
        localStorage.setItem('offlineMode', 'true');
        window.location.reload();
    };

    const handleBypassAndGoToDemo = () => {
        localStorage.setItem('offlineMode', 'true');
        window.location.href = '/demo/login';
    };

    // If checks are bypassed, show content with an offline indicator
    if (bypassChecked) {
        let indicatorText = "Offline Mode";
        let indicatorBg = "bg-yellow-600";

        if (!isChrome) {
            indicatorText = "Browser Compatibility Mode";
            indicatorBg = "bg-blue-600";
        }

        return (
            <>
                {/* Offline/Compatibility Mode Indicator */}
                <div className={`fixed bottom-4 right-4 z-50 ${indicatorBg} text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg`}>
                    {!isChrome ? (
                        <ChromeIcon className="h-3.5 w-3.5 mr-1.5" />
                    ) : (
                        <Globe className="h-3.5 w-3.5 mr-1.5" />
                    )}
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
                            You can continue using the website in offline mode. Some features that require a database connection may be limited.
                        </p>
                        {!isChrome && (
                            <p className="text-sm font-medium text-orange-600 mt-2 mb-4">
                                We recommend using Google Chrome for the best experience with all features.
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={handleEnterOfflineMode} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                            <Globe className="h-4 w-4" />
                            Use Entire Website in Offline Mode
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