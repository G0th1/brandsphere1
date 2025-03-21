'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthClient';

// Dashboard navigation items
const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'grid-2x2' },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: 'megaphone' },
    { name: 'Content', href: '/dashboard/content', icon: 'file-text' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'chart-bar' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
];

export default function DashboardSidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <div className="w-64 bg-zinc-800 border-r border-zinc-700 flex flex-col h-full text-white">
            {/* Logo & Brand */}
            <div className="flex items-center justify-center h-16 border-b border-zinc-700">
                <Link href="/dashboard" className="text-xl font-bold text-primary">
                    BrandSphere
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-zinc-300 hover:bg-zinc-700/50'
                                }`}
                        >
                            <span className="mr-3">
                                <i className={`icon icon-${item.icon} h-5 w-5`} aria-hidden="true" />
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="border-t border-zinc-700 p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-zinc-700 text-primary flex items-center justify-center">
                            {user?.email?.substring(0, 1).toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-zinc-200">{user?.email || 'User'}</p>
                        <button
                            onClick={logout}
                            className="text-sm text-red-400 hover:text-red-300"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 