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
        if (status === 'loading') {
            setIsLoading(true);
            return;
        }

        if (session && session.user) {
            setUser({
                id: session.user.id as string || '',
                email: session.user.email || '',
                role: (session.user as any).role || 'user',
            });
            setIsLoading(false);
        } else {
            setUser(null);
            setIsLoading(false);
        }
    }, [session, status]);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 