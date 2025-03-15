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

    // Add visible debugging messages
    const showDebug = (message: string) => {
        if (typeof document !== 'undefined') {
            console.log("[AuthGuard]", message);
            const debugBox = document.createElement('div');
            debugBox.style.cssText = 'position:fixed;bottom:0;right:0;background:rgba(0,0,0,0.8);color:white;padding:10px;z-index:9999;max-width:80%;font-size:12px;';
            debugBox.textContent = `[AuthGuard] ${message}`;
            document.body.appendChild(debugBox);
            setTimeout(() => document.body.removeChild(debugBox), 5000);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            showDebug(`Checking authentication, status: ${status}, path: ${pathname}`);

            // Always allow access in development mode
            if (process.env.NODE_ENV === "development") {
                showDebug("Development mode - allowing access");
                if (isMounted) {
                    setIsAuthenticated(true);
                    setUser({ email: "dev@example.com", role: "user" });
                    setIsLoading(false);
                }
                return;
            }

            // Check for session
            if (status === "loading") {
                showDebug("Session is loading...");
                return; // Wait for session
            }

            if (session?.user) {
                showDebug(`User authenticated: ${session.user.email}`);
                if (isMounted) {
                    setIsAuthenticated(true);
                    setUser({
                        id: session.user.id as string,
                        email: session.user.email as string,
                        name: session.user.name || "",
                        role: "user",
                    });
                    setIsLoading(false);

                    // Store session info
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user_email', session.user.email as string);
                        localStorage.setItem('auth_timestamp', Date.now().toString());
                    }
                }
            } else {
                showDebug("No session found, user is not authenticated");

                // Check for stored credentials as fallback
                const storedEmail = localStorage.getItem('user_email');
                const authTimestamp = localStorage.getItem('auth_timestamp');
                const recentAuth = authTimestamp && (Date.now() - parseInt(authTimestamp)) < 3600000; // 1 hour

                if (storedEmail && recentAuth) {
                    showDebug(`Using recent stored auth for: ${storedEmail}`);
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
                        showDebug(`Redirecting to login page from: ${pathname}`);
                        // Store the current path for redirect after login
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('redirectAfterLogin', pathname);
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

    // Add visible feedback
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const status = document.createElement('div');
            status.style.cssText = 'position:fixed;top:0;right:0;background:rgba(0,0,0,0.8);color:white;padding:5px 10px;z-index:9999;font-size:12px;';
            status.textContent = isAuthenticated
                ? `✅ Authenticated as: ${user?.email}`
                : (isLoading ? "⏳ Loading auth..." : "❌ Not authenticated");
            document.body.appendChild(status);

            return () => {
                document.body.removeChild(status);
            };
        }
    }, [isAuthenticated, isLoading, user]);

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