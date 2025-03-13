"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
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

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
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
                setIsLoading(false);
                return;
            }

            if (result?.url) {
                console.log("Login successful, redirecting to:", result.url);
                router.push(result.url);
            } else {
                console.error("No URL returned after login");
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                });
                setIsLoading(false);
            }
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
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4">
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

                            <Button
                                type="submit"
                                className="w-full"
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
                    <CardFooter className="flex flex-col space-y-2">
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
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 