"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!email || !password) {
            toast({
                title: "Error",
                description: "Please enter both email and password.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            console.log("Attempting login with email:", email);

            // Store that we're attempting login before the actual call
            // This helps prevent race conditions in the authentication flow
            sessionStorage.setItem('auth_in_progress', 'true');

            // Clear any previous dashboard loaded flag
            sessionStorage.removeItem('dashboard_loaded');

            // Get the redirect URL from sessionStorage if available
            const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
            const effectiveCallbackUrl = storedRedirect || callbackUrl;

            console.log("Will redirect to:", effectiveCallbackUrl);

            // Check if universal mode is enabled
            const isUniversalMode = localStorage.getItem('universalMode') === 'true';
            const isOfflineMode = localStorage.getItem('offlineMode') === 'true';

            if (isUniversalMode || isOfflineMode) {
                // In universal mode, skip the actual auth check and simulate a successful login
                console.log("Using universal mode for login");

                // Simulate successful login by storing auth data
                localStorage.setItem('user_email', email);
                localStorage.setItem('auth_timestamp', Date.now().toString());
                sessionStorage.setItem('user_email', email);
                sessionStorage.setItem('auth_timestamp', Date.now().toString());

                // Set a mock session for universal mode
                document.cookie = "next-auth.session-token=universal-mode; path=/; max-age=2592000";

                // Success toast
                toast({
                    title: "Success",
                    description: "Login successful! Redirecting...",
                });

                // Redirect after short delay
                setTimeout(() => {
                    // Process the URL to ensure it's a full URL
                    let redirectUrl = effectiveCallbackUrl;

                    // If it's a relative URL (starts with /), make it absolute
                    if (redirectUrl.startsWith('/')) {
                        redirectUrl = window.location.origin + redirectUrl;
                    }

                    console.log("Redirecting to:", redirectUrl);
                    window.location.href = redirectUrl;
                }, 800);

                return;
            }

            // Normal authentication flow for non-universal mode
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: effectiveCallbackUrl,
            });

            console.log("Login result:", result);

            if (result?.error) {
                console.error("Login error:", result.error);

                // Show more specific error messages
                let errorMessage = "Invalid login credentials.";

                if (result.error === "CredentialsSignin") {
                    errorMessage = "The email or password you entered is incorrect.";
                } else if (result.error.includes("fetch")) {
                    errorMessage = "Network error. Please check your connection and try again.";
                } else {
                    errorMessage = `Error: ${result.error}`;
                }

                toast({
                    title: "Authentication Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                sessionStorage.removeItem('auth_in_progress');
                setIsLoading(false);
                return;
            }

            // Success - show toast
            toast({
                title: "Success",
                description: "Login successful! Redirecting...",
            });

            // Set a mock session in localStorage for fallback
            try {
                localStorage.setItem('user_email', email);
                localStorage.setItem('auth_timestamp', Date.now().toString());

                // Also set in sessionStorage for more reliable cross-tab access
                sessionStorage.setItem('user_email', email);
                sessionStorage.setItem('auth_timestamp', Date.now().toString());

                // Clear the redirect URL from storage
                sessionStorage.removeItem('redirectAfterLogin');
            } catch (e) {
                console.warn("Could not set storage auth data", e);
            }

            // Add a small delay for the session to be fully established
            setTimeout(() => {
                // Force session duration to be long by setting cookies manually
                document.cookie = "next-auth.session-token=true; path=/; max-age=2592000"; // 30 days

                // Process the URL to ensure it's a full URL
                let redirectUrl = effectiveCallbackUrl;

                // If it's a relative URL (starts with /), make it absolute
                if (redirectUrl.startsWith('/')) {
                    redirectUrl = window.location.origin + redirectUrl;
                }

                if (result?.url) {
                    console.log("Login successful, redirecting to:", result.url);
                    // Use window.location for a full page reload to ensure session is applied
                    window.location.href = result.url;
                } else {
                    console.log("No redirect URL, using default:", redirectUrl);
                    // Fallback to default redirect
                    window.location.href = redirectUrl;
                }
            }, 800);
        } catch (error) {
            console.error("Login error:", error);

            const errorMessage = error instanceof Error
                ? `Error: ${error.message}`
                : "Something went wrong. Please try again.";

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            sessionStorage.removeItem('auth_in_progress');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                        <CardDescription>Enter your email and password to sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full"
                                    autoComplete="current-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait...
                                    </>
                                ) : "Sign in"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center">
                            <Link href="/auth/forgot-password" className="text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="text-sm text-center">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline">
                                Create an account
                            </Link>
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <div className="text-center mb-2">
                                <span className="bg-background px-2 text-xs text-muted-foreground">DATABASE CONNECTION ISSUES?</span>
                            </div>
                            <div className="text-sm text-center mb-2">
                                Skip the database setup and try our fully-featured demo
                            </div>
                            <Button
                                variant="outline"
                                className="w-full flex gap-2 items-center justify-center"
                                onClick={() => router.push('/demo/login')}
                            >
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Use Demo Mode Instead
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 