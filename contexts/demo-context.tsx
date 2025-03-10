"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage, Language } from './language-context';
import { safeNavigate } from '@/lib/utils/navigation';

// Typ för demo-användare
export interface DemoUser {
    id: string;
    email: string;
    name: string;
    subscription_tier: string;
    avatar_url: string;
    demo_mode: boolean;
    language: Language;
}

// Typ för demo-kontext
interface DemoContextType {
    user: DemoUser | null;
    isLoading: boolean;
    isInitialized: boolean;
    startDemo: () => void;
    exitDemo: () => void;
    updateUser: (updates: Partial<DemoUser>) => void;
}

// Skapa kontexten
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Demo provider props
interface DemoProviderProps {
    children: ReactNode;
}

// Standardvärden för demo-användare
const DEFAULT_DEMO_USER: DemoUser = {
    id: 'demo-user-123',
    email: 'demo@example.com',
    name: 'Demo User',
    subscription_tier: 'premium',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo123',
    demo_mode: true,
    language: 'en'
};

// Provider-komponent
export function DemoProvider({ children }: DemoProviderProps) {
    const [user, setUser] = useState<DemoUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();
    const { language } = useLanguage();

    // Initialisera demo-läget när komponenten monteras
    useEffect(() => {
        const initializeDemo = () => {
            try {
                const storedUser = localStorage.getItem('demoUser');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser) as DemoUser;
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error initializing demo:', error);
                localStorage.removeItem('demoUser');
            } finally {
                setIsInitialized(true);
            }
        };

        if (typeof window !== 'undefined') {
            initializeDemo();
        }
    }, []);

    // Uppdatera användarens språkpreferens när språket ändras
    useEffect(() => {
        if (user) {
            const updatedUser = { ...user, language };
            setUser(updatedUser);
            localStorage.setItem('demoUser', JSON.stringify(updatedUser));
        }
    }, [language, user]);

    // Starta demo-läge
    const startDemo = () => {
        setIsLoading(true);

        try {
            // Skapa demouser med aktuellt språk
            const demoUser = { ...DEFAULT_DEMO_USER, language };

            // Spara i localStorage
            localStorage.setItem('demoUser', JSON.stringify(demoUser));

            // Uppdatera state
            setUser(demoUser);

            // Omdirigera till dashboard efter kort väntetid
            setTimeout(() => {
                try {
                    // Försök med router först
                    router.push('/demo/dashboard');
                } catch (routerError) {
                    console.error('Router navigation failed:', routerError);
                    // Fallback till window.location om router misslyckas
                    window.location.href = '/demo/dashboard';
                } finally {
                    setIsLoading(false);
                }
            }, 500); // Minska tiden för bättre användarupplevelse
        } catch (error) {
            console.error('Error starting demo:', error);
            setIsLoading(false);
            // Fallback till direkt navigering om något går fel
            window.location.href = '/demo/dashboard';
        }
    };

    // Avsluta demo-läge
    const exitDemo = () => {
        localStorage.removeItem('demoUser');
        setUser(null);
        // Använd den säkra navigeringsfunktionen
        safeNavigate('/', router);
    };

    // Uppdatera användarinformation
    const updateUser = (updates: Partial<DemoUser>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('demoUser', JSON.stringify(updatedUser));
        }
    };

    return (
        <DemoContext.Provider value={{
            user,
            isLoading,
            isInitialized,
            startDemo,
            exitDemo,
            updateUser
        }}>
            {children}
        </DemoContext.Provider>
    );
}

// Hook för att använda demo-kontexten
export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
} 