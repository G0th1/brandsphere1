"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyLoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [magicLink, setMagicLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMagicLink(null);

        try {
            const response = await fetch('/api/auth/emergency-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setMagicLink(data.magicLink);
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Emergency login error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (magicLink) {
            navigator.clipboard.writeText(magicLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
            <Card className="w-full max-w-md bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Emergency Login</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Generate a one-time login link to access your account if you're having trouble logging in.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert className="mb-4 bg-red-900/30 border-red-800">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <AlertTitle className="text-red-400">Error</AlertTitle>
                            <AlertDescription className="text-red-200">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {magicLink ? (
                        <div className="space-y-4">
                            <Alert className="bg-green-900/30 border-green-800">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Login Link Generated</AlertTitle>
                                <AlertDescription className="text-green-200">
                                    Your one-time login link has been generated. Click the link below or copy it to your clipboard.
                                </AlertDescription>
                            </Alert>

                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="magic-link" className="text-zinc-200">Your Login Link</Label>
                                <div className="flex">
                                    <Input
                                        id="magic-link"
                                        value={magicLink}
                                        readOnly
                                        className="bg-zinc-700/50 text-zinc-200 border-zinc-600 flex-1"
                                    />
                                    <Button
                                        onClick={copyToClipboard}
                                        className="ml-2"
                                        variant="outline"
                                        size="icon"
                                    >
                                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link
                                    href={magicLink}
                                    className="flex items-center justify-center w-full bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Click to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={generateMagicLink} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-200">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-700/50 text-zinc-200 border-zinc-600"
                                    required
                                />
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    {!magicLink && (
                        <Button
                            type="button"
                            onClick={generateMagicLink}
                            disabled={isLoading || !email}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Login Link'
                            )}
                        </Button>
                    )}
                    <Link
                        href="/auth/login"
                        className="w-full text-center text-sm text-zinc-400 hover:text-zinc-300 mt-2"
                    >
                        Back to normal login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
} 