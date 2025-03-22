'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from './components/AuthClient';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </AuthProvider>
        </SessionProvider>
    );
} 