"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
    LayoutDashboard,
    FileText,
    BarChart2,
    Calendar,
    Users,
    Bell,
    Settings,
    PlusCircle,
    Search,
    User,
    HelpCircle,
    LogOut,
    Moon,
    Sun,
    Menu,
    X,
    Sparkles,
} from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';
import { ThemeToggle } from "@/app/components/theme-toggle";
import Image from 'next/image';
import { DashboardConnectionWrapper } from './dashboard-connection-wrapper';

// Import components
import { PostManagement } from '@/app/components/content/post-management';
import { SocialAccounts } from '@/app/components/account/social-accounts';
import { InsightsDashboard } from '@/app/components/analytics/insights-dashboard';
import { ContentCalendar } from '@/app/components/content/content-calendar';
import { RecentActivities } from '@/app/components/activity/recent-activities';

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
        title: 'AI Content',
        icon: <Sparkles className="h-5 w-5" />,
        href: '/dashboard/ai-content',
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
        title: 'Settings',
        icon: <Settings className="h-5 w-5" />,
        href: '/dashboard/settings',
    },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const pathname = usePathname();
    const { isDemoActive } = useSubscription();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

    // Get current page title
    const currentPage = NAVIGATION_ITEMS.find(item =>
        pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    // Handle quick create
    const handleQuickCreate = (option: string) => {
        setIsQuickCreateOpen(false);
        setTimeout(() => {
            switch (option) {
                case 'post':
                    window.location.href = '/dashboard/content?create=true';
                    break;
                case 'account':
                    window.location.href = '/dashboard/accounts?connect=true';
                    break;
                default:
                    break;
            }
        }, 100);
    };

    // Get content for current tab
    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'dashboard':
                return <div>Dashboard Content</div>;
            case 'content':
                return <PostManagement />;
            case 'analytics':
                return <InsightsDashboard />;
            case 'calendar':
                return <ContentCalendar />;
            case 'accounts':
                return <SocialAccounts />;
            default:
                return children;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center">
                        <button
                            className="md:hidden mr-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <Image
                                src="/images/image_2025-03-02_212020748 (1).png"
                                alt="BrandSphereAI Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-bold">BrandSphere AI</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Account</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/auth/logout">Logout</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 z-50 md:relative md:z-0 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800`}>
                    <div className="flex flex-col h-full p-4">
                        <nav className="space-y-2 mt-8">
                            {NAVIGATION_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center p-2 rounded-md ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4">
                    <DashboardConnectionWrapper>
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold">{currentPage?.title || 'Dashboard'}</h1>
                        </div>

                        {pathname === '/dashboard' ? (
                            <Tabs defaultValue="dashboard">
                                <TabsList>
                                    <TabsTrigger value="dashboard">Overview</TabsTrigger>
                                    <TabsTrigger value="content">Content</TabsTrigger>
                                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                </TabsList>
                                <TabsContent value="dashboard">
                                    {getTabContent('dashboard')}
                                </TabsContent>
                                <TabsContent value="content">
                                    {getTabContent('content')}
                                </TabsContent>
                                <TabsContent value="analytics">
                                    {getTabContent('analytics')}
                                </TabsContent>
                            </Tabs>
                        ) : (
                            children
                        )}
                    </DashboardConnectionWrapper>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout; 