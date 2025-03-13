"use client";

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react';

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => { },
});

export const useAuth = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Check for offline mode
  const isOfflineMode = typeof window !== 'undefined' && localStorage.getItem('offlineMode') === 'true';

  // Create a mock user for offline mode
  const offlineUser = isOfflineMode ? {
    id: 'offline-user',
    name: 'Offline User',
    email: 'offline@example.com',
    image: null
  } : null;

  const signOut = async () => {
    // Clear offline mode if enabled
    if (isOfflineMode) {
      localStorage.removeItem('offlineMode');
    }
    await nextAuthSignOut({ redirect: true, callbackUrl: '/' });
  };

  return {
    user: isOfflineMode ? offlineUser : (session?.user || null),
    isLoading: isOfflineMode ? false : isLoading,
    signOut
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}; 