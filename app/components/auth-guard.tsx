"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

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

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication after hydration
        if (status === "loading") {
            return;
        }

        if (!session) {
            // Redirect to login page if not authenticated
            router.push("/auth/login?callbackUrl=/dashboard");
        } else {
            setIsLoading(false);
        }
    }, [session, status, router]);

    // Show loading state
    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If authenticated, render children
    return <>{session ? children : null}</>;
}

// Default export to avoid import errors
export default AuthGuard; 