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
            // Add console logs for debugging
            console.log("Login attempt started with:", email);
            document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;background:black;color:white;z-index:9999;padding:10px;">Login attempt with: ${email}</div>`;

            // Clear any previous dashboard loaded flag
            sessionStorage.removeItem('dashboard_loaded');
            sessionStorage.removeItem('auth_in_progress');

            // Use the simplest possible login approach
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            // Add debug info to page
            document.body.innerHTML += `<div style="position:fixed;top:30px;left:0;right:0;background:black;color:white;z-index:9999;padding:10px;">Login result: ${JSON.stringify(result || 'No result')}</div>`;
            console.log("Login result:", result);

            if (result?.error) {
                console.error("Login error:", result.error);
                document.body.innerHTML += `<div style="position:fixed;top:60px;left:0;right:0;background:red;color:white;z-index:9999;padding:10px;">Error: ${result.error}</div>`;

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
                setIsLoading(false);
                return;
            }

            // Success - show toast
            toast({
                title: "Success",
                description: "Login successful! Redirecting...",
            });

            document.body.innerHTML += `<div style="position:fixed;top:90px;left:0;right:0;background:green;color:white;z-index:9999;padding:10px;">Success! Redirecting...</div>`;

            // Save login info in storage
            localStorage.setItem('user_email', email);
            localStorage.setItem('auth_timestamp', Date.now().toString());
            sessionStorage.setItem('dashboard_loaded', 'true');

            // Force a hard redirect to the dashboard
            setTimeout(() => {
                document.body.innerHTML += `<div style="position:fixed;top:120px;left:0;right:0;background:blue;color:white;z-index:9999;padding:10px;">Redirecting now to /dashboard</div>`;
                window.location.href = '/dashboard';
            }, 1500);
        } catch (error) {
            console.error("Login error:", error);
            document.body.innerHTML += `<div style="position:fixed;top:150px;left:0;right:0;background:red;color:white;z-index:9999;padding:10px;">Exception: ${error instanceof Error ? error.message : String(error)}</div>`;

            const errorMessage = error instanceof Error
                ? `Error: ${error.message}`
                : "Something went wrong. Please try again.";

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
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

                        {/* New: Direct access button */}
                        <div className="mt-4 pt-4 border-t">
                            <div className="text-center mb-2">
                                <span className="text-xs text-muted-foreground">DIRECT ACCESS OPTION</span>
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => {
                                    // Store minimal auth info
                                    localStorage.setItem('user_email', email || 'demo@example.com');
                                    localStorage.setItem('auth_timestamp', Date.now().toString());
                                    sessionStorage.setItem('dashboard_loaded', 'true');

                                    // Force direct navigation
                                    toast({
                                        title: "Direct Access",
                                        description: "Bypassing normal auth flow...",
                                    });

                                    // Add delay for toast to show
                                    setTimeout(() => {
                                        window.location.href = '/dashboard?direct=true';
                                    }, 500);
                                }}
                            >
                                Direct Dashboard Access
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Use this option if you're having trouble with the normal login.
                            </p>
                        </div>
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