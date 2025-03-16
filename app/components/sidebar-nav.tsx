"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuthUser } from './auth-guard';
import {
    LayoutDashboard,
    FileText,
    BarChart2,
    Calendar,
    Users,
    Settings,
    PlusCircle,
    User,
    LogOut,
    Menu,
    X,
    CreditCard,
    UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define navigation items
const NAVIGATION_ITEMS = [
    {
        title: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: '/dashboard',
    },
    {
        title: 'Content',
        icon: <FileText className="h-5 w-5" />,
        href: '/dashboard/content',
    },
    {
        title: 'Projects',
        icon: <PlusCircle className="h-5 w-5" />,
        href: '/dashboard/projects',
    },
    {
        title: 'Analytics',
        icon: <BarChart2 className="h-5 w-5" />,
        href: '/dashboard/analytics',
    },
    {
        title: 'Calendar',
        icon: <Calendar className="h-5 w-5" />,
        href: '/dashboard/calendar',
    },
    {
        title: 'Accounts',
        icon: <Users className="h-5 w-5" />,
        href: '/dashboard/accounts',
    },
    {
        title: 'Team',
        icon: <Users className="h-5 w-5" />,
        href: '/dashboard/team',
    },
    {
        title: 'Profile',
        icon: <UserCircle className="h-5 w-5" />,
        href: '/dashboard/profile',
    },
    {
        title: 'Billing',
        icon: <CreditCard className="h-5 w-5" />,
        href: '/dashboard/billing',
    },
    {
        title: 'Settings',
        icon: <Settings className="h-5 w-5" />,
        href: '/dashboard/settings',
    },
];

export default function SidebarNav() {
    const pathname = usePathname();
    const user = useAuthUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle sign out with redirect
    const handleSignOut = () => signOut({ callbackUrl: "/auth/login" });

    // Generate user display info
    const userDisplayName = useMemo(() => {
        return user?.name || user?.email?.split("@")[0] || "User";
    }, [user]);

    // Determine mobile menu class dynamically
    const mobileMenuClass = isMobileMenuOpen ? 'block' : 'hidden';

    return (
        <>
            {/* Mobile header with menu toggle */}
            <div className="flex md:hidden items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</div>
                    <span className="text-xl font-bold">BrandSphere AI</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar for desktop and mobile (when open) */}
            <div className={`${mobileMenuClass} md:block md:w-64 md:flex-col md:fixed md:inset-y-0 z-50`}>
                <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pt-5 overflow-y-auto h-full">
                    {/* Logo section - desktop only */}
                    <div className="hidden md:flex items-center justify-center h-16 flex-shrink-0 px-4">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</div>
                            <span className="text-xl font-bold">BrandSphere AI</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {NAVIGATION_ITEMS.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const activeClass = isActive
                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900';
                            const iconClass = isActive
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-500 dark:text-gray-400';

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeClass}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className={`mr-3 ${iconClass}`}>
                                        {item.icon}
                                    </div>
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section with sign out button */}
                    <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{userDisplayName}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                        {user?.email || "user@example.com"}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="h-8 px-2"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                <span className="text-xs">Sign out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 