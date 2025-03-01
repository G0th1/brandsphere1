"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Översättningar för språkväljaren
const translations = {
    en: {
        language: "Language",
        english: "English",
        swedish: "Swedish",
    },
    sv: {
        language: "Språk",
        english: "Engelska",
        swedish: "Svenska",
    },
};

interface LanguageSwitcherProps {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

export function LanguageSwitcher({ variant = "outline", size = "icon" }: LanguageSwitcherProps) {
    const { language, setLanguage } = useLanguage();
    const t = translations[language];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className="w-9 px-0">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">{t.language}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                    <span className={language === "en" ? "font-bold" : ""}>
                        {t.english}
                        {language === "en" && " ✓"}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("sv")}>
                    <span className={language === "sv" ? "font-bold" : ""}>
                        {t.swedish}
                        {language === "sv" && " ✓"}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 