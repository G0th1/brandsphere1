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

  const signOut = async () => {
    await nextAuthSignOut({ redirect: true, callbackUrl: '/' });
  };

  return {
    user: session?.user || null,
    isLoading,
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