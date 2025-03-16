"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DemoLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // Handle automatic login with countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            handleDemoLogin();
        }

        return () => clearTimeout(timer);
    }, [countdown]);

    const handleDemoLogin = async () => {
        setIsLoading(true);

        try {
            // Store demo user data in localStorage
            localStorage.setItem('user_email', 'demo@brandsphereai.com');
            localStorage.setItem('user_name', 'Demo User');
            localStorage.setItem('auth_timestamp', Date.now().toString());
            localStorage.setItem('demo_mode', 'true');
            sessionStorage.setItem('dashboard_loaded', 'true');

            // Show success message
            toast({
                title: "Demo Mode Activated",
                description: "You are now using BrandSphere in demo mode.",
            });

            // Redirect to dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 500);
        } catch (error) {
            console.error("Demo login error:", error);

            toast({
                title: "Error",
                description: "Failed to initialize demo mode. Please try again.",
                variant: "destructive",
            });

            setIsLoading(false);
            setCountdown(-1); // Stop countdown
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Demo Mode</CardTitle>
                        <CardDescription>
                            Access BrandSphere without database authentication
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-4">
                            <p className="font-medium">About Demo Mode</p>
                            <p className="text-sm mt-1">
                                Demo mode allows you to explore BrandSphere without requiring database access.
                                All data will be simulated and changes won't be saved.
                            </p>
                        </div>

                        <Button
                            className="w-full mt-2"
                            onClick={handleDemoLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Activating Demo Mode...
                                </>
                            ) : (
                                countdown > 0 ?
                                    `Activating Demo Mode in ${countdown}...` :
                                    "Activate Demo Mode"
                            )}
                        </Button>

                        <div className="mt-4">
                            <Link href="/auth/login" className="text-sm flex items-center text-blue-600 hover:text-blue-800">
                                <ArrowLeft className="h-3 w-3 mr-1" />
                                Return to normal login
                            </Link>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-xs text-center text-muted-foreground w-full">
                            <p>Demo mode provides limited functionality.</p>
                            <p>For full access, please use standard authentication.</p>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 