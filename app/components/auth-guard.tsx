"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

// Type for authenticated user
export interface AuthenticatedUser {
    id?: string;
    email: string;
    name?: string;
    role?: string;
}

// Create the context
const AuthUserContext = createContext<AuthenticatedUser | null>(null);

// Custom hook to access the authenticated user
export function useAuthUser() {
    const context = useContext(AuthUserContext);
    if (context === undefined) {
        throw new Error("useAuthUser must be used within an AuthGuard");
    }
    return context;
}

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requireAuth?: boolean;
}

export default function AuthGuard({
    children,
    fallback = <div className="flex w-full h-screen justify-center items-center"><Skeleton className="w-full max-w-md h-60 rounded-md" /></div>,
    requireAuth = true,
}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [authAttempts, setAuthAttempts] = useState(0);
    const [initialCheckComplete, setInitialCheckComplete] = useState(false);

    // Function to check if we're in offline development mode
    const isOfflineMode = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_OFFLINE_MODE === "true";

    useEffect(() => {
        // Flag to prevent state updates if component unmounts
        let isMounted = true;

        const checkAuthentication = async () => {
            console.log(`AuthGuard: Checking authentication at ${pathname}, status: ${status}, attempts: ${authAttempts}`);

            // If not mounted, exit
            if (!isMounted) return;

            // First attempt
            if (authAttempts === 0) {
                setAuthAttempts(1);
            }

            // Check for active session in progress
            const authInProgress = sessionStorage.getItem('auth_in_progress') === 'true';
            const recentAuth = localStorage.getItem('auth_timestamp');
            const timeSinceAuth = recentAuth ? Date.now() - parseInt(recentAuth) : Infinity;
            const isRecentAuth = timeSinceAuth < 60000; // Within last minute

            // Get dashboard loading state
            const isDashboardLoaded = sessionStorage.getItem('dashboard_loaded') === 'true';

            // Special handling for login attempts in progress
            if (authInProgress && !isDashboardLoaded) {
                console.log("Auth in progress. Waiting before deciding...");
                setIsLoading(true);
                // Delay to allow login to complete
                setTimeout(() => {
                    if (isMounted) {
                        // Increment attempts to try again
                        setAuthAttempts(prev => prev + 1);
                    }
                }, 1000);
                return;
            }

            // If session is loading, display loading state
            if (status === "loading" && authAttempts < 3) {
                console.log("Session is still loading...");
                setIsLoading(true);
                setTimeout(() => {
                    if (isMounted) {
                        setAuthAttempts(prev => prev + 1);
                    }
                }, 500);
                return;
            }

            // Check authenticated using both NextAuth session and localStorage fallback
            if (session?.user) {
                console.log("NextAuth session found:", session.user);
                setIsAuthenticated(true);
                setUser({
                    id: session.user.id as string,
                    email: session.user.email as string,
                    name: session.user.name || "",
                    role: session.user.role as string || "user",
                });
                setIsLoading(false);

                // Store auth info as fallback
                try {
                    localStorage.setItem('user_email', session.user.email as string);
                    localStorage.setItem('auth_timestamp', Date.now().toString());
                } catch (e) {
                    console.warn("Could not store fallback auth data", e);
                }

                // Mark dashboard as loaded if we're on dashboard
                if (pathname.includes('/dashboard')) {
                    sessionStorage.setItem('dashboard_loaded', 'true');
                }
            } else {
                console.log("No NextAuth session, checking fallbacks...");

                // Check special conditions for allowing access despite no session
                // 1. Development mode with offline mode enabled
                // 2. Recent login with stored email (within last minute)
                // 3. Dashboard already loaded once in this session

                const userEmail = localStorage.getItem('user_email');

                if (isOfflineMode && userEmail) {
                    console.log("Offline development mode, allowing access");
                    setIsAuthenticated(true);
                    setUser({
                        email: userEmail,
                        role: "user",
                    });
                    setIsLoading(false);
                } else if (isRecentAuth && userEmail && authAttempts <= 3) {
                    console.log("Recent auth detected, temporarily allowing access");
                    setIsAuthenticated(true);
                    setUser({
                        email: userEmail,
                        role: "user",
                    });
                    setIsLoading(false);

                    // If we're on dashboard, mark it as loaded
                    if (pathname.includes('/dashboard')) {
                        sessionStorage.setItem('dashboard_loaded', 'true');
                    }

                    // After allowing access, recheck in the background to confirm
                    setTimeout(() => {
                        if (isMounted) {
                            setAuthAttempts(prev => prev + 1);
                        }
                    }, 2000);
                } else if (isDashboardLoaded && userEmail) {
                    console.log("Dashboard already loaded, allowing continued access");
                    setIsAuthenticated(true);
                    setUser({
                        email: userEmail,
                        role: "user",
                    });
                    setIsLoading(false);
                } else {
                    // No valid session found after multiple attempts
                    console.log("No valid auth found, requireAuth:", requireAuth);
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsLoading(false);

                    // Only redirect if this is the first complete check and auth is required
                    if (requireAuth && !initialCheckComplete) {
                        // Store current location for redirect after login
                        try {
                            sessionStorage.setItem('redirectAfterLogin', pathname);
                            console.log("Stored redirect:", pathname);
                        } catch (e) {
                            console.warn("Could not store redirect location", e);
                        }

                        // Clear auth in progress flag
                        sessionStorage.removeItem('auth_in_progress');

                        console.log("Redirecting to login page...");
                        router.push("/auth/login?message=Authentication required to access this page");
                    }
                }
            }

            // Mark initial check as complete
            if (!initialCheckComplete) {
                setInitialCheckComplete(true);
            }
        };

        checkAuthentication();

        return () => {
            isMounted = false;
        };
    }, [router, pathname, status, requireAuth, authAttempts, initialCheckComplete]);

    // Don't render anything until we've checked auth status
    if (isLoading) {
        return fallback;
    }

    // If auth is required but user is not authenticated, show login page
    // (though this should already be handled by the redirect in the useEffect)
    if (requireAuth && !isAuthenticated) {
        console.log("Access denied - not authenticated");
        return fallback;
    }

    // User is authenticated or auth is not required, render children
    return (
        <AuthUserContext.Provider value={user}>
            {children}
        </AuthUserContext.Provider>
    );
} 