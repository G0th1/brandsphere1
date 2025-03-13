"use client";

import { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, Database, RefreshCw, Zap } from 'lucide-react';
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

    useEffect(() => {
        // Check if user is intentionally bypassing database check with URL param
        const urlParams = new URLSearchParams(window.location.search);
        const bypassDb = urlParams.get('bypass_db') === 'true';

        if (bypassDb) {
            setBypassChecked(true);
            setIsLoading(false);
            setHasError(false);
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
                const response = await fetch('/api/db-health-check');
                const data = await response.json();
                setHasError(!data.success);
            } catch (error) {
                console.error('Database health check failed:', error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkDbConnection();
    }, []);

    const handleRetry = () => {
        setIsLoading(true);
        window.location.reload();
    };

    const handleBypassAndGoToDemo = () => {
        window.location.href = '/demo/login?bypass_db=true';
    };

    // If user explicitly bypassed the check or is on demo path, show content
    if (bypassChecked) {
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
                            We're having trouble connecting to our database. This might be a temporary issue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Try refreshing the page or use our demo mode which doesn't require a database connection.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={handleBypassAndGoToDemo} className="w-full gap-2 bg-yellow-600 hover:bg-yellow-700">
                            <Zap className="h-4 w-4" />
                            Enter Demo Mode
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