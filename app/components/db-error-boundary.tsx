"use client";

import { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, Database, RefreshCw, Chrome as ChromeIcon, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

interface DbErrorBoundaryProps {
    children: ReactNode;
}

export default function DbErrorBoundary({ children }: DbErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bypassChecked, setBypassChecked] = useState(true);
    const [isChrome, setIsChrome] = useState(true);
    const [isUniversalMode, setIsUniversalMode] = useState(false);

    useEffect(() => {
        // Check if the browser is Chrome
        if (typeof window !== 'undefined') {
            const isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            setIsChrome(isChromeBrowser);
        }

        // Check for database connection
        const checkDbConnection = async () => {
            try {
                const res = await fetch('/api/db-health-check', {
                    method: 'GET',
                    cache: 'no-store'
                });

                if (!res.ok) {
                    setHasError(true);
                } else {
                    setHasError(false);
                }
            } catch (error) {
                console.error('Database connection check failed:', error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        // Only check connection if we need to
        if (isLoading) {
            checkDbConnection();
        }
    }, [isLoading]);

    const handleRetry = () => {
        setIsLoading(true);
        window.location.reload();
    };

    // If we're in bypass mode or everything is ok, show children
    if (bypassChecked && !hasError) {
        return <>{children}</>;
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
                            This might be a temporary issue. Please try again in a few moments.
                        </p>
                        {!isChrome && (
                            <p className="text-sm font-medium text-orange-600 mt-2 mb-4">
                                We recommend using Google Chrome for the best experience with all features.
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={handleRetry} variant="default" className="w-full gap-2">
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