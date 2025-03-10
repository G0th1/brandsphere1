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
        console.log("Startar demo-läge...");

        try {
            // Skapa demouser med aktuellt språk
            const demoUser = { ...DEFAULT_DEMO_USER, language };
            console.log("Skapad demo-användare:", { ...demoUser, language });

            // Spara i localStorage med felhantering
            try {
                localStorage.setItem('demoUser', JSON.stringify(demoUser));
                console.log("Demo-användare sparad i localStorage");
            } catch (storageError) {
                console.error('Kunde inte spara demo-användare i localStorage:', storageError);
                // Vi fortsätter ändå, utan localStorage-stöd
            }

            // Uppdatera state
            setUser(demoUser);
            console.log("Demo-användarstate uppdaterad");

            // Använd en timeout för att säkerställa att staten har uppdaterats
            // innan vi försöker navigera
            setTimeout(() => {
                console.log("Navigerar till dashboard...");

                // För att undvika refresh-loop:
                // 1. Sätt URL direkt istället för att använda router för att undvika React render-loopar
                // 2. Använd ett lite längre timeout för att säkerställa att localStorage har uppdaterats

                try {
                    // Direkt navigering utan router
                    window.location.replace("/demo/dashboard");
                } catch (navError) {
                    console.error("Fel vid direkt navigering:", navError);

                    // Fallback till window.href
                    try {
                        window.location.href = "/demo/dashboard";
                    } catch (hrefError) {
                        console.error("Fel vid href-navigering:", hrefError);

                        // Sista utvägen
                        try {
                            router.push("/demo/dashboard");
                        } catch (routerError) {
                            console.error("Fel vid router-navigering:", routerError);
                            alert("Kunde inte navigera automatiskt. Klicka OK för att försöka igen.");
                            window.location.href = "/demo/dashboard";
                        }
                    }
                } finally {
                    setIsLoading(false);
                }
            }, 800); // Använd en lite längre timeout
        } catch (error) {
            console.error('Error starting demo:', error);
            setIsLoading(false);

            // Fallback: Grundläggande navigering
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