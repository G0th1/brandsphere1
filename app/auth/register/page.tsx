"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        console.log("Starting registration process...");

        // Basic form validation
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            toast({
                title: "Error",
                description: "Password must be at least 8 characters long",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Force offline mode for immediate workaround
        localStorage.setItem('offlineMode', 'true');
        console.log("Enabled offline mode as a workaround");

        try {
            // Check if we're in offline mode
            const isOfflineMode = true; // Force to true as workaround
            console.log("Using offline mode:", isOfflineMode);

            // Construct the API URL with bypass_db parameter if in offline mode
            const apiUrl = "/api/auth/register?bypass_db=true";
            console.log("Using API URL:", apiUrl);

            // Simple POST request to registration API
            console.log("Sending registration request...");
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                let errorMessage = data.error || "Registration failed";
                console.error("Registration API error:", errorMessage);
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            // Success! Show message and redirect
            console.log("Registration successful, preparing to redirect");
            toast({
                title: "Success",
                description: "Account created! Redirecting to login...",
            });

            // Store user info in localStorage for offline mode
            if (isOfflineMode) {
                try {
                    const mockUser = {
                        id: 'offline-' + Date.now(),
                        name,
                        email,
                        createdAt: new Date().toISOString()
                    };
                    localStorage.setItem('offlineUser', JSON.stringify(mockUser));
                    console.log("Stored mock user data for offline mode");
                } catch (err) {
                    console.warn("Could not store offline user data", err);
                }
            }

            // Redirect after brief delay
            setTimeout(() => {
                console.log("Redirecting to login page");
                router.push("/auth/login");
            }, 1500);
        } catch (error) {
            console.error("Registration error - full details:", error);

            toast({
                title: "Registration Error",
                description: error instanceof Error ? error.message : "Registration failed. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>Enter your details below to create your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
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
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : "Create account"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <div className="text-center mb-2">
                                <span className="bg-background px-2 text-xs text-muted-foreground">HAVING DATABASE ISSUES?</span>
                            </div>
                            <div className="text-sm text-center mb-2">
                                Skip the hassle of registration and database setup
                            </div>
                            <Link href="/demo/login" className="w-full">
                                <Button variant="outline" className="w-full flex gap-2 items-center justify-center">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    Try Demo Mode Instead
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 