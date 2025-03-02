"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'sv';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    // Försök att hämta sparade språkinställningar från localStorage, standardvärde är engelska
    const [language, setLanguageState] = useState<Language>('en');

    // Ladda sparade språkinställningar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('language') as Language;
            if (savedLang && (savedLang === 'en' || savedLang === 'sv')) {
                setLanguageState(savedLang);
            }
        }
    }, []);

    // Spara språkinställningar när de ändras
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    // Växla mellan engelska och svenska
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'sv' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Hook för att använda språkkontexten
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Funktion för att hämta översättningar baserat på språk - client-side rendering
export function useTranslation<T>(translations: Record<Language, T>): T {
    const { language } = useLanguage();
    return translations[language];
}

// Hjälpfunktion för server-komponenter eller utanför React-komponenter
export function getTranslation<T>(translations: Record<Language, T>, defaultLanguage: Language = 'en'): T {
    // För användning utanför React eller på serversidan
    return translations[defaultLanguage];
} 