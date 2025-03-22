'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// User type definition
type User = {
    id: string;
    email: string;
    role: string;
};

// Auth context type definition
type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    login: async () => ({ success: false, message: 'Not implemented' }),
    logout: () => { },
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Update local state based on NextAuth session
    useEffect(() => {
        console.log('AuthProvider - Session state changed:', {
            status,
            hasSession: !!session,
            sessionData: session ? JSON.stringify(session).substring(0, 200) + '...' : 'No session'
        });

        if (status === 'loading') {
            console.log('AuthProvider - Session is loading');
            setIsLoading(true);
            return;
        }

        if (session && session.user) {
            console.log('AuthProvider - Session loaded successfully, user:', {
                id: session.user.id,
                email: session.user.email,
                role: (session.user as any).role
            });

            setUser({
                id: session.user.id as string || '',
                email: session.user.email || '',
                role: (session.user as any).role || 'user',
            });
            setIsLoading(false);
        } else {
            console.log('AuthProvider - No session found or invalid session');
            setUser(null);
            setIsLoading(false);
        }
    }, [session, status]);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            console.log('AuthProvider - Login attempt for:', email);
            setIsLoading(true);

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            console.log('AuthProvider - Login result:', {
                success: !result?.error,
                error: result?.error || 'No error',
                url: result?.url
            });

            if (!result?.error) {
                return { success: true, message: 'Login successful' };
            } else {
                return {
                    success: false,
                    message: result.error || 'Authentication failed'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'An unexpected error occurred during login'
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        console.log('AuthProvider - Logging out');
        signOut({ redirect: true, callbackUrl: '/auth/login' });
    };

    // Context value
    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    console.log('AuthProvider - Current auth state:', {
        isAuthenticated: !!user,
        isLoading,
        hasUser: !!user
    });

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 