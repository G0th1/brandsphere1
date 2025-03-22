"use client";

// This is a Server Component
import "@/app/globals.css";
import DashboardLayout from "@/app/components/dashboard-layout";
import SiteHeader from "@/app/components/site-header";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthClient';
import DashboardSidebar from '../components/DashboardSidebar';
import { useSession } from 'next-auth/react';

// Export dynamic marker to prevent static generation
export const dynamic = 'force-dynamic';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const [redirectAttempted, setRedirectAttempted] = useState(false);
    const [mountTime] = useState(() => Date.now());
    const [gracePeriod, setGracePeriod] = useState(true);
    const [cookieCheck, setCookieCheck] = useState<{
        hasNextAuthSession: boolean,
        hasNextAuthCallback: boolean,
        hasDirectAuth: boolean,
        allCookies: string
    }>({
        hasNextAuthSession: false,
        hasNextAuthCallback: false,
        hasDirectAuth: false,
        allCookies: ''
    });

    // Don't redirect during initial grace period to allow session to initialize
    useEffect(() => {
        // Give a 5-second grace period after initial page load
        const timer = setTimeout(() => {
            setGracePeriod(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Check for auth cookies
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookies = document.cookie;

            setCookieCheck({
                hasNextAuthSession: cookies.includes('next-auth.session-token'),
                hasNextAuthCallback: cookies.includes('next-auth.callback-url'),
                hasDirectAuth: cookies.includes('direct-auth-token'),
                allCookies: cookies
            });

            // Check every second for cookies
            const interval = setInterval(() => {
                const currentCookies = document.cookie;
                setCookieCheck({
                    hasNextAuthSession: currentCookies.includes('next-auth.session-token'),
                    hasNextAuthCallback: currentCookies.includes('next-auth.callback-url'),
                    hasDirectAuth: currentCookies.includes('direct-auth-token'),
                    allCookies: currentCookies
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    // Add more detailed debugging logs
    useEffect(() => {
        console.log("Dashboard Layout - Auth State:", {
            isAuthenticated,
            isLoading,
            user,
            sessionData: session,
            sessionStatus,
            gracePeriod,
            redirectAttempted,
            timeSinceMount: Date.now() - mountTime,
            cookieCheck
        });

        // Only redirect if:
        // 1. Not in grace period
        // 2. Not loading
        // 3. Not authenticated
        // 4. No auth cookies present at all
        // 5. Haven't already attempted redirect
        const hasAnyCookies = cookieCheck.hasNextAuthSession || cookieCheck.hasDirectAuth;

        if (!gracePeriod && !isLoading && !isAuthenticated && !hasAnyCookies && !redirectAttempted) {
            console.log("Grace period ended, no auth detected, redirecting to login page");
            setRedirectAttempted(true);
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router, user, session, sessionStatus, redirectAttempted, gracePeriod, mountTime, cookieCheck]);

    // Determine authentication status from all possible sources
    const hasDirectSession =
        !!session?.user ||
        cookieCheck.hasNextAuthSession ||
        cookieCheck.hasDirectAuth;

    // Show loading state during grace period or while auth is loading
    if (gracePeriod || isLoading) {
        console.log(gracePeriod ? "In grace period..." : "Auth is loading...");
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="ml-2 text-sm text-gray-400">
                    {gracePeriod ? "Initializing your session..." : "Loading your dashboard..."}
                </p>
                {cookieCheck.hasNextAuthSession && (
                    <p className="absolute bottom-4 text-xs text-green-500">
                        Authentication token detected ✓
                    </p>
                )}
            </div>
        );
    }

    // If we have a direct session but useAuth reports not authenticated,
    // render the dashboard anyway with a warning
    if (hasDirectSession && !isAuthenticated) {
        console.log("Session token found but auth context reports not authenticated");
        return (
            <div className="flex h-screen bg-zinc-900 text-white">
                <DashboardSidebar />
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-yellow-900/30 border border-yellow-800 rounded p-3 mb-4">
                        <p className="text-yellow-200 text-sm">
                            Warning: Session synchronization issue detected. You may need to refresh.
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        );
    }

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        console.log("Not authenticated in render check");
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
                <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
                    <p className="mb-4">You need to be logged in to access the dashboard.</p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Render dashboard layout for authenticated users
    console.log("Rendering dashboard for authenticated user:", user?.email);
    return (
        <div className="flex h-screen bg-zinc-900 text-white">
            <DashboardSidebar />
            <div className="flex-1 overflow-auto p-6">
                {children}
            </div>
        </div>
    );
} 