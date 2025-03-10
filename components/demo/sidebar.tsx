"use client"

import Link from "next/link";
import {
    LayoutDashboard,
    FileEdit,
    PieChart,
    User,
    CalendarClock,
    Settings,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useDemo } from "@/contexts/demo-context";

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
        dashboard: "Dashboard",
        content: "Content",
        calendar: "Calendar",
        insights: "Insights",
        profile: "User Profile",
        settings: "Settings",
        exitDemo: "Exit Demo"
    },
    sv: {
        dashboard: "Kontrollpanel",
        content: "Innehåll",
        calendar: "Kalender",
        insights: "Insikter",
        profile: "Användarprofil",
        settings: "Inställningar",
        exitDemo: "Avsluta demo"
    }
};

interface DemoSidebarProps {
    activeItem: string;
}

export function DemoSidebar({ activeItem }: DemoSidebarProps) {
    const { language } = useLanguage();
    const { user, exitDemo } = useDemo();
    const t = translations[language === 'sv' ? 'sv' : 'en'];

    if (!user) return null;

    return (
        <div className="hidden md:flex flex-col w-64 border-r bg-card">
            <div className="p-4 flex justify-center">
                <div className="text-xl font-bold">BrandSphereAI</div>
            </div>

            <div className="mt-2 px-3">
                <div className="flex items-center justify-between rounded-md bg-accent/50 px-2 py-1.5">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Premium</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Demo</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                    <Button
                        variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => window.location.href = "/demo/dashboard"}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        {t.dashboard}
                    </Button>
                    <Button
                        variant={activeItem === 'content' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => window.location.href = "/demo/content"}
                    >
                        <FileEdit className="h-4 w-4" />
                        {t.content}
                    </Button>
                    <Button
                        variant={activeItem === 'calendar' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => window.location.href = "/demo/calendar"}
                    >
                        <CalendarClock className="h-4 w-4" />
                        {t.calendar}
                    </Button>
                    <Button
                        variant={activeItem === 'insights' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => window.location.href = "/demo/insights"}
                    >
                        <PieChart className="h-4 w-4" />
                        {t.insights}
                    </Button>
                    <Button
                        variant={activeItem === 'profile' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => window.location.href = "/demo/profile"}
                    >
                        <User className="h-4 w-4" />
                        {t.profile}
                    </Button>
                    <Button
                        variant={activeItem === 'settings' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => window.location.href = "/demo/settings"}
                    >
                        <Settings className="h-4 w-4" />
                        {t.settings}
                    </Button>
                </nav>
            </div>

            <div className="mt-auto p-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                    <Avatar>
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={exitDemo}>
                    {t.exitDemo}
                </Button>
            </div>
        </div>
    );
} 