"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: string;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: '',
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: error.toString(),
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Update state with error details
        this.setState({
            error,
            errorInfo: errorInfo.componentStack || error.toString(),
        });

        // You could also log to an error reporting service here
    }

    handleReload = (): void => {
        // Reload the page to reset the state
        window.location.reload();
    };

    handleGoHome = (): void => {
        // Navigate back to home
        window.location.href = '/';
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Render error fallback UI
            return (
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <Card className="w-full max-w-md border-destructive/50">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="h-12 w-12 text-destructive" />
                            </div>
                            <CardTitle className="text-center text-destructive">Application Error</CardTitle>
                            <CardDescription className="text-center">
                                We encountered an unexpected error
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="bg-muted p-3 rounded-md text-left overflow-auto max-h-40 text-xs font-mono">
                                {this.state.errorInfo}
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                Please try refreshing the page or return to the home page.
                            </p>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button onClick={this.handleReload} className="w-full gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Refresh Page
                            </Button>
                            <Button onClick={this.handleGoHome} variant="outline" className="w-full gap-2">
                                <Home className="h-4 w-4" />
                                Go to Home
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }

        // If no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary; 