"use client";

import React from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react';

// Define strongly typed auth context interface
interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

/**
 * Custom hook for accessing authentication state
 * Provides user info, loading state, and sign out functionality
 */
export const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const signOut = async (): Promise<void> => {
    await nextAuthSignOut({ redirect: true, callbackUrl: '/' });
  };

  return {
    user: session?.user as User || null,
    isLoading,
    signOut
  };
};

/**
 * Auth provider component that wraps the application
 * with NextAuth's SessionProvider
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}; 