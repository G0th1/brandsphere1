'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from './components/AuthClient';

export function Providers({ children }: { children: React.ReactNode }) {
    // Generate a session key to ensure the provider reinitializes
    const sessionKey = typeof window !== 'undefined' ? window.location.pathname : 'server';

    return (
        <SessionProvider key={sessionKey}>
            <AuthProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </AuthProvider>
        </SessionProvider>
    );
} 