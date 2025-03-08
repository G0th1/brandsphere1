"use client"

import { Bell, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

// Avatar components
const Avatar = ({ children, className, ...props }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`} {...props}>
        {children}
    </div>
);

const AvatarImage = ({ src, alt, className, ...props }: { src: string, alt: string, className?: string }) => (
    <img src={src} alt={alt} className={`aspect-square h-full w-full ${className || ''}`} {...props} />
);

const AvatarFallback = ({ children, className, ...props }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className || ''}`} {...props}>
        {children}
    </div>
);

const translations = {
    en: {
        notifications: "Notifications",
        settings: "Settings",
        help: "Help"
    },
    sv: {
        notifications: "Aviseringar",
        settings: "Inställningar",
        help: "Hjälp"
    }
};

export function DemoHeader() {
    const { language } = useLanguage();
    const t = translations[language === 'sv' ? 'sv' : 'en'];

    return (
        <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
                <div className="md:hidden flex items-center gap-2">
                    <div className="text-xl font-bold">BrandSphereAI</div>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        title={t.help}
                        aria-label={t.help}
                    >
                        <Info className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        title={t.notifications}
                        aria-label={t.notifications}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        title={t.settings}
                        aria-label={t.settings}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>

                    <div className="md:hidden">
                        <Avatar>
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo123" alt="Demo User" />
                            <AvatarFallback>DU</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
} 