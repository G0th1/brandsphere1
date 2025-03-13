"use client";

import { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createSafeSupabaseClient } from "@/app/utils/supabase-client";

// Create a context for the authenticated user
const AuthUserContext = createContext<User | null>(null);

// Custom hook to access the authenticated user
export function useAuthUser() {
    return useContext(AuthUserContext);
}

interface AuthGuardProps {
    children: ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 * This centralizes authentication logic and handles missing Supabase configuration
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createSafeSupabaseClient();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if we're in a build/SSG environment
                if (typeof window === 'undefined') {
                    console.log('AuthGuard: Running in SSG mode, skipping auth check');
                    setLoading(false);
                    return;
                }

                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Error checking auth session:", error);

                    // Show a toast notification for auth system errors
                    toast({
                        title: "Authentication system error",
                        description: "There was a problem with the authentication system. Using development mode.",
                        variant: "destructive",
                    });

                    // In development, provide a mock user
                    if (process.env.NODE_ENV !== 'production') {
                        setUser({
                            id: 'dev-user-id',
                            email: 'dev@example.com',
                            app_metadata: {},
                            user_metadata: {},
                            aud: 'authenticated',
                            created_at: new Date().toISOString(),
                        } as User);
                        setLoading(false);
                        return;
                    }

                    // In production, redirect to login
                    router.push('/login');
                    return;
                }

                if (!session) {
                    router.push('/login');
                    return;
                }

                setUser(session.user);
                setLoading(false);
            } catch (error) {
                console.error("Auth check failed:", error);

                // In development, provide a mock user
                if (process.env.NODE_ENV !== 'production') {
                    setUser({
                        id: 'dev-user-id',
                        email: 'dev@example.com',
                        app_metadata: {},
                        user_metadata: {},
                        aud: 'authenticated',
                        created_at: new Date().toISOString(),
                    } as User);
                    setLoading(false);
                    return;
                }

                router.push('/login');
            }
        };

        checkAuth();
    }, [router, supabase, toast]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If we're in development and there's no user, provide a mock user
    if (!user && process.env.NODE_ENV !== 'production') {
        return (
            <AuthUserContext.Provider
                value={{
                    id: 'dev-user-id',
                    email: 'dev@example.com',
                    app_metadata: {},
                    user_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                } as User}
            >
                {children}
            </AuthUserContext.Provider>
        );
    }

    return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>;
} 