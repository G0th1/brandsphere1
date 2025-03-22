"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function EmergencyLoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        instructions?: string;
    } | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [userFound, setUserFound] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    const checkUserExists = async () => {
        if (!email) {
            setErrorMessage('Please enter your email');
            return false;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/auth/user-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUserFound(true);
                setUserDetails(data.user);
                return true;
            } else {
                setErrorMessage(data.message || 'User not found');
                toast({
                    title: "User Not Found",
                    description: "No account found with this email address.",
                    variant: "destructive",
                });
                return false;
            }
        } catch (error) {
            console.error('Error checking user:', error);
            setErrorMessage('Error checking user existence');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmergencyLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // First check if user exists
        const exists = await checkUserExists();
        if (!exists) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/auth/force-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResult({
                    success: true,
                    message: data.message,
                    instructions: data.instructions
                });

                toast({
                    title: "Emergency Access Granted",
                    description: "You have been logged in with emergency access credentials.",
                    variant: "default",
                });

                // Redirect after 5 seconds to allow reading the instructions
                setTimeout(() => {
                    router.push('/dashboard');
                    router.refresh();
                }, 5000);
            } else {
                setResult({
                    success: false,
                    message: data.message || 'Emergency login failed'
                });

                setErrorMessage(data.message || 'Emergency login failed');
                toast({
                    title: "Error",
                    description: data.message || "Emergency login failed",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Emergency login error:', error);
            setErrorMessage('Error during emergency login');
            setResult({
                success: false,
                message: 'Error during emergency login'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-red-900 to-zinc-950 text-white">
            <div className="mx-auto w-full max-w-md p-6">
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-800 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold">Emergency Access</h1>
                    <p className="text-red-300 mt-2">
                        This is for emergency login only
                    </p>
                </div>

                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-red-700/50">
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-200 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    {userFound && !result?.success && (
                        <div className="mb-4 p-3 bg-amber-900/30 border border-amber-800 rounded-md text-amber-200 text-sm">
                            <h3 className="font-bold mb-2">User Found</h3>
                            <p>We found your account. Click the button below to reset your password and get emergency access.</p>
                            <p className="mt-2 text-xs">Account info: {userDetails?.email} (Role: {userDetails?.role})</p>
                        </div>
                    )}

                    {result?.success && (
                        <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-200 text-sm">
                            <h3 className="font-bold mb-2">Emergency Access Granted</h3>
                            <p>{result.message}</p>
                            {result.instructions && (
                                <div className="mt-2 p-2 bg-amber-900/30 border border-amber-800 rounded-md">
                                    <p className="font-medium">Important:</p>
                                    <p>{result.instructions}</p>
                                </div>
                            )}
                            <p className="mt-2">Redirecting to dashboard in 5 seconds...</p>
                        </div>
                    )}

                    <form onSubmit={handleEmergencyLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-200">
                                Your Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-700/50 text-zinc-200 border-zinc-600 focus:ring-red-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-700 hover:bg-red-800"
                            disabled={isLoading || result?.success}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {userFound ? 'Processing Emergency Access...' : 'Checking Account...'}
                                </>
                            ) : (
                                userFound ? 'Get Emergency Access' : 'Check Account & Continue'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-zinc-400 text-sm">
                            <Link href="/auth/login" className="text-red-300 hover:text-red-200 font-medium">
                                Return to normal login
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-zinc-500">
                    <p>This page sets a fixed password and creates an emergency session.</p>
                    <p>Use only when normal login methods fail.</p>
                </div>
            </div>
        </div>
    );
} 