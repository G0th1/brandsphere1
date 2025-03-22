'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from './components/AuthClient';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    // Generate a session key to ensure the provider reinitializes
    const sessionKey = typeof window !== 'undefined' ? window.location.pathname : 'server';

    return (
        <SessionProvider key={sessionKey}>
            <AuthProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
                <Toaster position="top-right" />
            </AuthProvider>
        </SessionProvider>
    );
} 