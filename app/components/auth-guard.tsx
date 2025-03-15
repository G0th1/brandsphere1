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

// Safely access storage APIs across browsers (including Edge)
function safeGetStorageItem(storage: Storage | null, key: string): string | null {
    if (!storage) return null;
    try {
        return storage.getItem(key);
    } catch (e) {
        console.warn(`Failed to access ${key} from storage:`, e);
        return null;
    }
}

// Safely set storage item across browsers
function safeSetStorageItem(storage: Storage | null, key: string, value: string): boolean {
    if (!storage) return false;
    try {
        storage.setItem(key, value);
        return true;
    } catch (e) {
        console.warn(`Failed to set ${key} in storage:`, e);
        return false;
    }
}

// Safely remove storage item across browsers
function safeRemoveStorageItem(storage: Storage | null, key: string): boolean {
    if (!storage) return false;
    try {
        storage.removeItem(key);
        return true;
    } catch (e) {
        console.warn(`Failed to remove ${key} from storage:`, e);
        return false;
    }
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

    // Use console.log for debugging, but don't show UI elements
    const logDebug = (message: string) => {
        if (process.env.NODE_ENV === "development") {
            console.log("[AuthGuard]", message);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            logDebug(`Checking authentication, status: ${status}, path: ${pathname}`);

            // Always allow access in development mode
            if (process.env.NODE_ENV === "development") {
                logDebug("Development mode - allowing access");
                if (isMounted) {
                    setIsAuthenticated(true);
                    setUser({ email: "dev@example.com", role: "user" });
                    setIsLoading(false);
                }
                return;
            }

            // Wait for session to load
            if (status === "loading") return;

            if (session?.user) {
                logDebug(`User authenticated: ${session.user.email}`);
                if (isMounted) {
                    setIsAuthenticated(true);
                    setUser({
                        id: session.user.id as string,
                        email: session.user.email as string,
                        name: session.user.name || "",
                        role: "user",
                    });
                    setIsLoading(false);

                    // Store session info but only if we have window access
                    if (typeof window !== 'undefined') {
                        try {
                            localStorage.setItem('user_email', session.user.email as string);
                            localStorage.setItem('auth_timestamp', Date.now().toString());
                        } catch (e) {
                            // Silently fail if localStorage is not available
                        }
                    }
                }
            } else {
                logDebug("No session found, user is not authenticated");

                // Check for stored credentials as fallback
                let storedEmail = null;
                let recentAuth = false;

                if (typeof window !== 'undefined') {
                    try {
                        storedEmail = localStorage.getItem('user_email');
                        const authTimestamp = localStorage.getItem('auth_timestamp');
                        recentAuth = authTimestamp && (Date.now() - parseInt(authTimestamp)) < 3600000; // 1 hour
                    } catch (e) {
                        // Silently fail if localStorage is not available
                    }
                }

                if (storedEmail && recentAuth) {
                    logDebug(`Using recent stored auth for: ${storedEmail}`);
                    if (isMounted) {
                        setIsAuthenticated(true);
                        setUser({
                            email: storedEmail,
                            role: "user",
                        });
                        setIsLoading(false);
                    }
                    return;
                }

                if (isMounted) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsLoading(false);

                    // Redirect if auth is required
                    if (requireAuth) {
                        logDebug(`Redirecting to login page from: ${pathname}`);
                        // Store the current path for redirect after login
                        if (typeof window !== 'undefined') {
                            try {
                                sessionStorage.setItem('redirectAfterLogin', pathname);
                            } catch (e) {
                                // Silently fail if sessionStorage is not available
                            }
                        }
                        router.push("/auth/login");
                    }
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [router, pathname, session, status, requireAuth]);

    // Remove visible feedback effect

    if (isLoading) {
        return fallback;
    }

    if (requireAuth && !isAuthenticated) {
        return fallback;
    }

    return (
        <AuthUserContext.Provider value={user}>
            {children}
        </AuthUserContext.Provider>
    );
} 