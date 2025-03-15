"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthDebugPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [storage, setStorage] = useState<Record<string, any>>({});
    const [cookies, setCookies] = useState<string>("Loading...");

    // Function to read and format all storage
    useEffect(() => {
        try {
            // Read localStorage
            const localStorageData: Record<string, any> = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    localStorageData[key] = localStorage.getItem(key);
                }
            }

            // Read sessionStorage
            const sessionStorageData: Record<string, any> = {};
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key) {
                    sessionStorageData[key] = sessionStorage.getItem(key);
                }
            }

            // Combine all storage data
            setStorage({
                localStorage: localStorageData,
                sessionStorage: sessionStorageData,
                session: session,
                status: status,
                navigator: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                }
            });

            // Read cookies
            setCookies(document.cookie);

        } catch (error) {
            console.error("Error accessing storage:", error);
        }
    }, [session, status]);

    // Function to fix authentication issues
    const fixAuthIssues = () => {
        // Clear all authentication data
        localStorage.removeItem('user_email');
        localStorage.removeItem('auth_timestamp');
        sessionStorage.removeItem('dashboard_loaded');
        sessionStorage.removeItem('auth_in_progress');
        sessionStorage.removeItem('redirectAfterLogin');

        // Set new auth data for direct access
        localStorage.setItem('user_email', 'debug-user@example.com');
        localStorage.setItem('auth_timestamp', Date.now().toString());
        sessionStorage.setItem('dashboard_loaded', 'true');

        // Redirect to dashboard with debug flag
        window.location.href = '/dashboard?debug=true';
    };

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Session Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg mb-2">Status: <span className="font-bold">{status}</span></div>
                        {session ? (
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-60">
                                <pre>{JSON.stringify(session, null, 2)}</pre>
                            </div>
                        ) : (
                            <div className="text-red-500">No active session found</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cookies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-60">
                            {cookies.split(';').map((cookie, i) => (
                                <div key={i}>{cookie.trim()}</div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Storage Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
                        <pre>{JSON.stringify(storage, null, 2)}</pre>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button onClick={() => router.push('/auth/login')}>
                    Go to Login
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                </Button>
                <Button variant="destructive" onClick={fixAuthIssues}>
                    Fix Authentication Issues
                </Button>
            </div>
        </div>
    );
} 