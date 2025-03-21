"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AuthDebugPage() {
    const { data: session, status } = useSession();
    const [apiCheck, setApiCheck] = useState<{
        loading: boolean;
        result: any | null;
        error: string | null;
    }>({
        loading: false,
        result: null,
        error: null
    });

    // Run auth check against API
    const checkAuthApi = async () => {
        setApiCheck({
            loading: true,
            result: null,
            error: null
        });

        try {
            const response = await fetch('/api/auth/check');
            const data = await response.json();

            setApiCheck({
                loading: false,
                result: data,
                error: null
            });
        } catch (error) {
            setApiCheck({
                loading: false,
                result: null,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Authentication Debug</h1>

                <div className="bg-zinc-900 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">NextAuth Session Status</h2>

                    {status === 'loading' ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span>Loading session...</span>
                        </div>
                    ) : status === 'authenticated' ? (
                        <div className="space-y-2">
                            <div className="bg-green-900/30 border border-green-800 p-3 rounded-md">
                                <p className="text-green-400 font-medium">✅ Authenticated</p>
                            </div>
                            <h3 className="text-lg font-medium mt-4">Session Data:</h3>
                            <pre className="bg-zinc-800 p-4 rounded-md overflow-auto text-sm">
                                {JSON.stringify(session, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div className="bg-red-900/30 border border-red-800 p-3 rounded-md">
                            <p className="text-red-400 font-medium">❌ Not authenticated</p>
                        </div>
                    )}
                </div>

                <div className="bg-zinc-900 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">API Authentication Check</h2>

                    <Button
                        onClick={checkAuthApi}
                        disabled={apiCheck.loading}
                        className="mb-4"
                    >
                        {apiCheck.loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Checking...
                            </>
                        ) : 'Check API Authentication'}
                    </Button>

                    {apiCheck.result && (
                        <div className="space-y-2">
                            <div className={`border p-3 rounded-md ${apiCheck.result.authenticated
                                ? 'bg-green-900/30 border-green-800'
                                : 'bg-red-900/30 border-red-800'}`}
                            >
                                <p className={`font-medium ${apiCheck.result.authenticated
                                    ? 'text-green-400'
                                    : 'text-red-400'}`}
                                >
                                    {apiCheck.result.authenticated
                                        ? '✅ API reports authenticated'
                                        : '❌ API reports not authenticated'}
                                </p>
                            </div>
                            <h3 className="text-lg font-medium mt-4">API Response:</h3>
                            <pre className="bg-zinc-800 p-4 rounded-md overflow-auto text-sm">
                                {JSON.stringify(apiCheck.result, null, 2)}
                            </pre>
                        </div>
                    )}

                    {apiCheck.error && (
                        <div className="bg-red-900/30 border border-red-800 p-3 rounded-md">
                            <p className="text-red-400 font-medium">❌ Error checking API authentication:</p>
                            <p className="text-red-300 text-sm mt-1">{apiCheck.error}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/auth/login'}
                    >
                        Go to Login
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Homepage
                    </Button>
                </div>
            </div>
        </div>
    );
} 