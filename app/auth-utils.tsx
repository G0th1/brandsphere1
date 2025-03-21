'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthCheckProps {
    children: ReactNode;
    fallback?: ReactNode; // Optional fallback for loading state
}

/**
 * Component that checks if the user is authenticated.
 * If not, it redirects to the login page.
 * Use this in client components that require authentication.
 */
export function AuthCheck({ children, fallback }: AuthCheckProps) {
    const { status } = useSession();

    // If the user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    // Show fallback while loading
    if (status === 'loading') {
        return fallback ? <>{fallback}</> : <AuthLoading />;
    }

    // User is authenticated, render children
    return <>{children}</>;
}

/**
 * Simple loading component for auth checks
 */
export function AuthLoading() {
    return (
        <div className="flex h-[60vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Authenticating...</p>
            </div>
        </div>
    );
}

/**
 * Hook to get the current user in client components
 * Returns null during loading state
 */
export function useCurrentUser() {
    const { data: session } = useSession();
    return session?.user || null;
}

/**
 * Component to restrict access to admin users only
 */
export function AdminOnly({ children }: { children: ReactNode }) {
    const { data: session } = useSession();

    // If the user is not authenticated, redirect to login
    if (!session) {
        redirect('/login');
    }

    // If the user is not an admin, redirect to dashboard
    if (session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    // User is an admin, render children
    return <>{children}</>;
} 