"use client";

// This is a Server Component
import "@/app/globals.css";
import DashboardLayout from "@/app/components/dashboard-layout";
import SiteHeader from "@/app/components/site-header";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthClient';
import DashboardSidebar from '../components/DashboardSidebar';

// Export dynamic marker to prevent static generation
export const dynamic = 'force-dynamic';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show nothing while loading
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If not authenticated and not loading, render nothing
    // (the useEffect will redirect)
    if (!isAuthenticated) {
        return null;
    }

    // Render dashboard layout for authenticated users
    return (
        <div className="flex h-screen bg-zinc-900 text-white">
            <DashboardSidebar />
            <div className="flex-1 overflow-auto p-6">
                {children}
            </div>
        </div>
    );
} 