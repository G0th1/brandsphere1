"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            // Check database connection first with enhanced error handling
            let dbIsAvailable = false;
            try {
                const dbCheckResponse = await fetch('/api/db-health-check', {
                    method: 'GET',
                    cache: 'no-store',
                    headers: { 'Cache-Control': 'no-cache' },
                    // Add timeout to prevent hanging on network issues
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                });
                
                dbIsAvailable = dbCheckResponse.ok;
                
                if (!dbIsAvailable) {
                    const errorText = await dbCheckResponse.text();
                    console.error('Database connection error:', errorText);
                    
                    setErrorMessage('Database connection error. Please try again in a few moments.');
                    toast({
                        title: "Database Error",
                        description: "We're having trouble connecting to our database. Please try again later.",
                        variant: "destructive",
                    });
                    
                    setIsLoading(false);
                    return;
                }
            } catch (dbError) {
                console.error('Database health check failed:', dbError);
                // Continue with login attempt even if db check fails
                // The actual authentication might still work
            }

            // Try NextAuth signIn with enhanced error handling and timeout
            const signInController = new AbortController();
            const signInTimeout = setTimeout(() => signInController.abort(), 10000); // 10 seconds timeout
            
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });
                
                clearTimeout(signInTimeout);
                
                if (!result?.error) {
                    toast({
                        title: "Success",
                        description: "Login successful!",
                        variant: "default",
                    });
                    router.push(callbackUrl);
                    router.refresh();
                    return;
                }
                
                // If NextAuth fails but error is specifically about credentials,
                // don't try fallback method
                if (result.error.includes('credentials') || 
                    result.error.includes('password') || 
                    result.error.includes('email')) {
                    throw new Error(result.error);
                }
                
                // Log the specific error for debugging
                console.warn('NextAuth login failed, trying fallback:', result.error);
            } catch (signInError) {
                clearTimeout(signInTimeout);
                
                // If it's an abort error, the request timed out
                if (signInError.name === 'AbortError') {
                    console.error('Sign-in request timed out');
                } else {
                    console.error('Sign-in error:', signInError);
                }
                
                // Continue to fallback method
            }

            // Fallback: Try direct token login
            try {
                const tokenController = new AbortController();
                const tokenTimeout = setTimeout(() => tokenController.abort(), 8000); // 8 seconds timeout
                
                const tokenResponse = await fetch('/api/auth/token-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    signal: tokenController.signal
                });
                
                clearTimeout(tokenTimeout);
                
                if (tokenResponse.ok) {
                    const tokenData = await tokenResponse.json();
                    
                    if (tokenData.status === 'success') {
                        toast({
                            title: "Success",
                            description: "Login successful!",
                            variant: "default",
                        });
                        router.push(callbackUrl);
                        router.refresh();
                        return;
                    }
                }
                
                // If both methods fail with specific credential errors, show invalid credentials message
                setErrorMessage('Login failed. Please check your credentials and try again.');
                toast({
                    title: "Error",
                    description: "Login failed. Please check your credentials.",
                    variant: "destructive",
                });
            } catch (tokenError) {
                // Handle token login errors
                console.error('Token login error:', tokenError);
                
                // If it's an abort error, the request timed out
                if (tokenError.name === 'AbortError') {
                    setErrorMessage('Login request timed out. Please try again later.');
                    toast({
                        title: "Timeout",
                        description: "Login request took too long. Please try again.",
                        variant: "destructive",
                    });
                } else {
                    throw tokenError; // Let the outer catch handle it
                }
            }
        } catch (error) {
            console.error('Login error:', error);

            // Check if error is related to database connection
            const isDatabaseError = error instanceof Error &&
                (error.message.includes('database') ||
                    error.message.includes('connection') ||
                    error.message.includes('ECONNREFUSED') ||
                    error.message.includes('timeout'));

            if (isDatabaseError) {
                setErrorMessage('Database connection error. Please try again in a few moments.');
                toast({
                    title: "Database Error",
                    description: "We're having trouble connecting to our database. Please try again later.",
                    variant: "destructive",
                });
            } else {
                setErrorMessage('An error occurred during login. Please try again later.');
                toast({
                    title: "Error",
                    description: "Login service is temporarily unavailable. Please try again later.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
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
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-200 text-sm">
                            {errorMessage}
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
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-zinc-400">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 