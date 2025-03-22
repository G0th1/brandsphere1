"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAuth } from "@/app/components/AuthClient";
import ButtonEmergencyLogin from "@/app/components/ButtonEmergencyLogin";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { createRoot } from 'react-dom/client';

const timeoutPromise = (ms: number) => {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), ms)
    );
};

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [debugResult, setDebugResult] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [loginError, setLoginError] = useState("");
    const { loginSuccess } = useAuth();
    const [authDebug, setAuthDebug] = useState<any>(null);

    // Check for cookie presence
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check for auth cookie presence
            const hasSession = document.cookie.includes('next-auth.session-token');

            setAuthDebug({
                hasSession,
                cookies: document.cookie,
                callbackUrl
            });

            // If user already has session, redirect to dashboard
            if (hasSession) {
                console.log("Session token found, redirecting to dashboard...");
                window.location.href = callbackUrl;
            }
        }
    }, [callbackUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError("");

        try {
            console.log("Attempting to log in with email:", email);

            // First check if database is reachable
            let dbHealthCheck;
            try {
                // Set a timeout of 5 seconds for DB health check
                dbHealthCheck = await Promise.race([
                    fetch('/api/health'),
                    timeoutPromise(5000)
                ]);
            } catch (error) {
                console.error("Database health check timed out:", error);
                throw new Error("Database connectivity issue. Please try again or use emergency access.");
            }

            if (!dbHealthCheck?.ok) {
                console.error("DB health check failed:", await dbHealthCheck?.text());
                throw new Error("Database connectivity issue. Please try again or use emergency access.");
            }

            console.log("Database health check passed, attempting sign in");

            // Set a timeout of a 8 seconds for sign-in
            const signInResult = await Promise.race([
                signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                }),
                timeoutPromise(8000)
            ]);

            console.log("Sign in result:", signInResult);

            if (!signInResult?.ok) {
                // First login attempt failed
                console.log("First login attempt failed, trying token-based login");

                // Try token-based login as fallback
                const tokenLoginResponse = await fetch("/api/auth/debug-login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                const tokenLoginData = await tokenLoginResponse.json();
                console.log("Token login response:", tokenLoginData);

                if (!tokenLoginResponse.ok) {
                    throw new Error(tokenLoginData.error || "Invalid login credentials");
                }

                // Set direct auth cookie manually
                Cookies.set('direct-auth-token', tokenLoginData.token, {
                    expires: 1, // 1 day
                    path: '/'
                });

                // Set a backup cookie in HttpOnly mode via call to API
                await fetch("/api/auth/set-cookie", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: tokenLoginData.token,
                    }),
                });

                toast.success("Login successful with token-based auth");
                loginSuccess(tokenLoginData.user);

                // Force a hard navigation to ensure cookies are applied
                console.log("Login successful! Redirecting to:", callbackUrl);

                // Set a small delay to ensure cookies are set before navigation
                setTimeout(() => {
                    // Use window.location for a full page navigation
                    window.location.href = callbackUrl;
                }, 500);

                return;
            }

            // First login attempt succeeded
            toast.success("Login successful!");

            // Call our auth context's login success method
            loginSuccess({
                email,
                id: "", // Will be filled by session
                name: "",
            });

            // Force a hard navigation
            console.log("Login successful! Redirecting to:", callbackUrl);

            // Set a small delay to ensure cookies are set before navigation
            setTimeout(() => {
                // Use window.location for a full page navigation
                window.location.href = callbackUrl;
            }, 500);

        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "An unexpected error occurred");
            setLoginError(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDebug = () => {
        setIsDebugMode(!isDebugMode);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
            <div className="mx-auto w-full max-w-md p-6">
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logo.svg"
                            alt="BrandSphere Logo"
                            width={48}
                            height={48}
                            className="h-12 w-auto"
                        />
                    </div>
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="text-zinc-400 mt-2">
                        Sign in to continue to BrandSphere
                    </p>
                </div>

                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-zinc-700/50">
                    {loginError && (
                        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-200 text-sm">
                            {loginError}
                        </div>
                    )}

                    {authDebug && isDebugMode && (
                        <div className="mb-4 p-3 bg-gray-700 rounded text-xs mb-4 overflow-auto max-h-28">
                            <pre>{JSON.stringify(authDebug, null, 2)}</pre>
                        </div>
                    )}

                    {debugResult && (
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded-md text-blue-100 text-sm">
                            <h3 className="font-bold mb-2">Login Diagnosis</h3>
                            <ul className="space-y-1">
                                <li>User found: {debugResult.userLookup.success ? '✅' : '❌'}</li>
                                <li>Password verification: {debugResult.passwordVerification.success ? '✅' : '❌'}</li>
                                <li>Password reset: {debugResult.passwordReset.success ? '✅' : '❌'}</li>
                            </ul>
                            {debugResult.recommendations.length > 0 && (
                                <div className="mt-2">
                                    <h4 className="font-semibold">Recommendations:</h4>
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        {debugResult.recommendations.map((rec, i) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-700/50 text-zinc-200 border-zinc-600 focus:ring-primary"
                                placeholder="Enter your email"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="text-zinc-200">
                                    Password
                                </Label>
                                <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-700/50 text-zinc-200 border-zinc-600 focus:ring-primary"
                                placeholder="Enter your password"
                                disabled={isLoading}
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
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>

                        {isDebugMode && (
                            <Button
                                type="button"
                                onClick={toggleDebug}
                                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Diagnosing...
                                    </>
                                ) : (
                                    'Diagnose Login Issue'
                                )}
                            </Button>
                        )}
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={toggleDebug}
                            className="text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            {isDebugMode ? 'Hide Debug Mode' : 'Enable Debug Mode'}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-zinc-400 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-700/30 text-center">
                        <p className="text-zinc-500 text-xs mb-3">
                            Trouble signing in?
                        </p>
                        <div className="mt-2">
                            <ButtonEmergencyLogin email={email} callbackUrl={callbackUrl} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 