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

    // Add more detailed debugging logs
    useEffect(() => {
        console.log("Dashboard Layout - Detailed Auth Debug:", {
            isAuthenticated,
            isLoading,
            user,
            sessionData: session,
            sessionStatus,
            redirectAttempted
        });

        if (!isLoading && !isAuthenticated && !redirectAttempted) {
            console.log("Not authenticated, redirecting to login page");
            setRedirectAttempted(true);
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router, user, session, sessionStatus, redirectAttempted]);

    // Check if we have direct session data even if useAuth reports not authenticated
    const hasDirectSession = !!session?.user;

    // Show nothing while loading
    if (isLoading) {
        console.log("Dashboard is loading...");
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="ml-2 text-sm text-gray-400">Loading your dashboard...</p>
            </div>
        );
    }

    // If we have a direct session but useAuth reports not authenticated,
    // render the dashboard anyway but show a warning
    if (hasDirectSession && !isAuthenticated) {
        console.log("Direct session found but useAuth reports not authenticated");
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

    // If not authenticated and not loading, render nothing
    // (the useEffect will redirect)
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