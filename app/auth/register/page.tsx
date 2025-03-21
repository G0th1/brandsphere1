"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate password confirmation
        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            // Call registration API
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            toast({
                title: "Success",
                description: "Account created successfully! You can now log in.",
            });

            // Redirect to login
            router.push("/auth/login");
        } catch (error) {
            console.error("Registration error:", error);

            const errorMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred. Please try again.";

            toast({
                title: "Registration Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-zinc-900">
                <Card className="max-w-md w-full border-zinc-800 bg-zinc-950">
                    <CardHeader className="text-zinc-200">
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription className="text-zinc-400">Enter your information to create a new account</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="border-zinc-700 bg-zinc-800 text-zinc-200 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="border-zinc-700 bg-zinc-800 text-zinc-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="border-zinc-700 bg-zinc-800 text-zinc-200"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-zinc-800 pt-4">
                        <div className="text-sm text-center text-zinc-400">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:text-primary/90 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 