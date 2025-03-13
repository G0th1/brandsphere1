"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 * This centralizes authentication logic and handles missing Supabase configuration
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClientComponentClient();
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Authentication error:", error);
                    throw error;
                }

                if (!session) {
                    // Not authenticated, redirect to login
                    router.replace("/login");
                    return;
                }

                setUser(session.user);
            } catch (error) {
                // Handle potential Supabase configuration errors
                console.error("Auth check error:", error);

                toast({
                    title: "Authentication System Error",
                    description: "There was a problem checking your login status. Using demo mode.",
                    variant: "destructive",
                });

                // In development, we can create a mock user
                if (process.env.NODE_ENV === "development") {
                    setUser({
                        id: "dev-user-id",
                        email: "dev@example.com",
                        // Add other required User properties
                    } as User);
                } else {
                    router.replace("/login");
                    return;
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, toast]);

    if (loading) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-xl">Loading...</div>
            </div>
        );
    }

    // We made it here, user is authenticated (or in dev mode)
    return <>{children}</>;
}

/**
 * Hook to get the current authenticated user
 */
export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            try {
                const supabase = createClientComponentClient();
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth user error:", error);
                    throw error;
                }

                if (session) {
                    setUser(session.user);
                } else if (process.env.NODE_ENV === "development") {
                    // In development, provide a mock user
                    setUser({
                        id: "dev-user-id",
                        email: "dev@example.com",
                        // Add other required User properties
                    } as User);
                }
            } catch (error) {
                console.error("Failed to get user:", error);
                // For development, create a mock user
                if (process.env.NODE_ENV === "development") {
                    setUser({
                        id: "dev-user-id",
                        email: "dev@example.com",
                        // Add other required User properties
                    } as User);
                }
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [router]);

    return { user, loading };
} 