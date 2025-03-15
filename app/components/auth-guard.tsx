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

    useEffect(() => {
        // Simple authentication check with fallback for development
        const checkAuth = async () => {
            console.log(`AuthGuard: Checking authentication, status: ${status}`);

            if (status === "loading") {
                return; // Wait for session to load
            }

            if (session?.user) {
                console.log("Session found, user is authenticated");
                setIsAuthenticated(true);
                setUser({
                    id: session.user.id as string,
                    email: session.user.email as string,
                    name: session.user.name || "",
                    role: "user",
                });
                setIsLoading(false);

                // Set fallback for development
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user_email', session.user.email as string);
                    localStorage.setItem('auth_timestamp', Date.now().toString());
                    sessionStorage.setItem('dashboard_loaded', 'true');
                }
            } else {
                // Check if we're in development mode
                if (process.env.NODE_ENV === "development") {
                    console.log("Development mode, allowing access");
                    setIsAuthenticated(true);
                    setUser({
                        email: "dev@example.com",
                        role: "user",
                    });
                    setIsLoading(false);
                    return;
                }

                console.log("No session found, user is not authenticated");
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);

                // Redirect to login if authentication is required
                if (requireAuth) {
                    // Store the current path for redirect after login
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('redirectAfterLogin', pathname);
                    }
                    router.push("/auth/login");
                }
            }
        };

        checkAuth();
    }, [router, pathname, session, status, requireAuth]);

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