"use client";

import { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

// Create a context for the authenticated user
const AuthUserContext = createContext<any | null>(null);

// Custom hook to access the authenticated user
export function useAuthUser() {
    return useContext(AuthUserContext);
}

interface AuthGuardProps {
    children: ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 * This centralizes authentication logic and uses NextAuth
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, status } = useSession();

    // Check for offline mode
    const isOfflineMode = typeof window !== 'undefined' && localStorage.getItem('offlineMode') === 'true';

    // Check for localStorage auth fallback (from our enhanced login page)
    const hasLocalAuth = typeof window !== 'undefined' &&
        !!localStorage.getItem('user_email') &&
        !!localStorage.getItem('auth_timestamp');

    // For timestamp-based validation
    const authTimestamp = typeof window !== 'undefined'
        ? parseInt(localStorage.getItem('auth_timestamp') || '0', 10)
        : 0;
    const isRecentAuth = Date.now() - authTimestamp < 24 * 60 * 60 * 1000; // 24 hours

    // Skip auth check in offline mode
    if (isOfflineMode) {
        return <>{children}</>;
    }

    useEffect(() => {
        // Function to check authentication
        const checkAuth = async () => {
            // Wait for session to be checked
            if (status === 'loading') {
                return;
            }

            try {
                console.log("Auth status:", status, "Session:", session ? "exists" : "null");

                // If authenticated, allow access
                if (session) {
                    setLoading(false);
                    return;
                }

                // Check for local auth fallback and validate it
                if (hasLocalAuth && isRecentAuth) {
                    console.log("Using localStorage auth fallback");
                    setLoading(false);
                    return;
                }

                // Try to check auth status via API as last resort
                try {
                    const response = await fetch('/api/auth/check');
                    const data = await response.json();

                    if (data.authenticated) {
                        console.log("API auth check successful");
                        setLoading(false);
                        return;
                    }
                } catch (apiError) {
                    console.warn("API auth check failed:", apiError);
                }

                // If we're in development, allow access with a warning
                if (process.env.NODE_ENV === 'development') {
                    console.warn("Development mode: bypassing authentication");
                    toast({
                        title: "Development Mode",
                        description: "Using development fallback authentication",
                    });
                    setLoading(false);
                    return;
                }

                // Not authenticated, redirect to login
                console.log("Not authenticated, redirecting to login");
                toast({
                    title: "Authentication Required",
                    description: "Please log in to access this page",
                });

                router.push('/auth/login');
            } catch (error) {
                console.error("Auth check error:", error);

                // In development, allow access
                if (process.env.NODE_ENV === 'development') {
                    setLoading(false);
                } else {
                    router.push('/auth/login');
                }
            }
        };

        checkAuth();
    }, [status, session, router, toast, hasLocalAuth, isRecentAuth]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Get the appropriate user object to provide
    const userToProvide = session?.user || (hasLocalAuth && isRecentAuth
        ? { email: localStorage.getItem('user_email'), id: 'local-auth-user' }
        : null);

    return <AuthUserContext.Provider value={userToProvide}>{children}</AuthUserContext.Provider>;
} 