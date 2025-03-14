"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Settings, CreditCard, BarChart3, Activity, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useAuthUser } from "./auth-guard";

export default function DashboardNav() {
    const pathname = usePathname();
    const user = useAuthUser();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    // Navigation items
    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Projects", href: "/dashboard/projects", icon: FileText },
        { name: "Activity", href: "/dashboard/activity", icon: Activity },
        { name: "Team", href: "/dashboard/team", icon: Users },
        { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">B</div>
                        <span className="text-lg font-bold tracking-tight">BrandSphereAI</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 text-sm transition-colors hover:text-foreground/80 ${isActive ? "text-foreground font-medium" : "text-foreground/60"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden md:inline-block">
                        {user?.name || user?.email?.split("@")[0] || "User"}
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Sign out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
} 