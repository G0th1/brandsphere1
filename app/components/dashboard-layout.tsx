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
} from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';
import { ThemeToggle } from "@/app/components/theme-toggle";

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

    // Get content for current tab (for tabbed version)
    const getTabContent = (tab: string) => {
        switch (tab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle>Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-bold">12</span>
                                            <span className="text-sm text-muted-foreground">Scheduled Posts</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-bold">3</span>
                                            <span className="text-sm text-muted-foreground">Connected Accounts</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-bold">7.4k</span>
                                            <span className="text-sm text-muted-foreground">Total Followers</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <InsightsDashboard />
                        </div>

                        <div className="md:col-span-1">
                            <RecentActivities />
                        </div>
                    </div>
                );
            case 'content':
                return <PostManagement />;
            case 'analytics':
                return <InsightsDashboard />;
            case 'calendar':
                return <ContentCalendar />;
            case 'accounts':
                return <SocialAccounts />;
            case 'settings':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Settings panel is under development. Check back soon!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return children;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar (desktop) */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
                <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pt-5 overflow-y-auto">
                    <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            BrandSphere AI
                        </h1>
                    </div>

                    <div className="mt-5 flex-grow flex flex-col">
                        <nav className="flex-1 px-2 space-y-1">
                            {NAVIGATION_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
                                            }
                                        `}
                                    >
                                        <div className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {item.icon}
                                        </div>
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {isDemoActive && (
                        <div className="px-4 py-4 mt-auto">
                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400">Demo Mode Active</h3>
                                        <div className="mt-1 text-xs text-blue-600 dark:text-blue-300">
                                            You're using BrandSphere in demo mode.
                                        </div>
                                        <div className="mt-2">
                                            <Button variant="outline" size="sm" className="text-xs w-full">
                                                Upgrade to Pro
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${isMobileMenuOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-950">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 mt-5">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            BrandSphere AI
                        </h1>
                    </div>

                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {NAVIGATION_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            group flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
                                            }
                                        `}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className={`mr-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {item.icon}
                                        </div>
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {isDemoActive && (
                        <div className="px-4 py-4">
                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400">Demo Mode Active</h3>
                                        <div className="mt-1 text-xs text-blue-600 dark:text-blue-300">
                                            You're using BrandSphere in demo mode.
                                        </div>
                                        <div className="mt-2">
                                            <Button variant="outline" size="sm" className="text-xs w-full">
                                                Upgrade to Pro
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content area */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* Top navigation */}
                <div className="sticky top-0 z-30 flex-shrink-0 h-16 bg-white dark:bg-gray-950 shadow dark:shadow-gray-800">
                    <div className="flex items-center justify-between px-4 md:px-6 h-full">
                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Menu className="h-6 w-6" />
                            </button>

                            <h1 className="text-lg font-bold ml-3 md:hidden text-gray-900 dark:text-gray-100">
                                {currentPage?.title || 'Dashboard'}
                            </h1>
                        </div>

                        {/* Search */}
                        <div className="flex-1 max-w-md ml-4 md:ml-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
                                    placeholder="Search"
                                    type="search"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Quick Create Button */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" className="relative z-20 flex items-center gap-1">
                                        <PlusCircle className="h-4 w-4" />
                                        <span className="hidden sm:inline">Create</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="z-30">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => handleQuickCreate('post')}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        New Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => handleQuickCreate('account')}
                                    >
                                        <Users className="h-4 w-4 mr-2" />
                                        Connect Account
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Notifications */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsNotificationsOpen(true)}
                                className="relative z-20"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>

                            {/* Theme Toggler */}
                            <div className="relative z-20">
                                <ThemeToggle />
                            </div>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative z-20 h-8 w-8 rounded-full">
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <span className="text-sm font-medium">U</span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="z-30">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
                    {/* Page heading */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {currentPage?.title || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Tabbed navigation - shown only on main dashboard route */}
                    {pathname === '/dashboard' ? (
                        <Tabs defaultValue="dashboard" className="space-y-6">
                            <div className="relative z-10 border-b border-gray-200 dark:border-gray-800">
                                <TabsList className="flex -mb-px space-x-8">
                                    <TabsTrigger
                                        value="dashboard"
                                        className="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="content"
                                        className="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                                    >
                                        Content
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="analytics"
                                        className="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                                    >
                                        Analytics
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="calendar"
                                        className="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                                    >
                                        Calendar
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="accounts"
                                        className="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                                    >
                                        Accounts
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="dashboard" className="relative z-10">
                                {getTabContent('dashboard')}
                            </TabsContent>

                            <TabsContent value="content" className="relative z-10">
                                {getTabContent('content')}
                            </TabsContent>

                            <TabsContent value="analytics" className="relative z-10">
                                {getTabContent('analytics')}
                            </TabsContent>

                            <TabsContent value="calendar" className="relative z-10">
                                {getTabContent('calendar')}
                            </TabsContent>

                            <TabsContent value="accounts" className="relative z-10">
                                {getTabContent('accounts')}
                            </TabsContent>
                        </Tabs>
                    ) : (
                        // Regular page content
                        <div className="relative z-10">{children}</div>
                    )}
                </main>
            </div>

            {/* Notifications Dialog */}
            <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DialogContent className="z-50 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Notifications</DialogTitle>
                        <DialogDescription>
                            Stay updated with your recent activity
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto">
                        <RecentActivities />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNotificationsOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            setIsNotificationsOpen(false);
                            setTimeout(() => {
                                window.location.href = '/dashboard/notifications';
                            }, 100);
                        }}>
                            View All
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quick Create Dialog */}
            <Dialog open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen}>
                <DialogContent className="z-50 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New</DialogTitle>
                        <DialogDescription>
                            What would you like to create?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 justify-start h-auto p-4 text-left cursor-pointer"
                            onClick={() => handleQuickCreate('post')}
                        >
                            <FileText className="h-5 w-5" />
                            <div>
                                <h3 className="font-medium">New Post</h3>
                                <p className="text-sm text-muted-foreground">Create and schedule a new social media post</p>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="flex items-center gap-2 justify-start h-auto p-4 text-left cursor-pointer"
                            onClick={() => handleQuickCreate('account')}
                        >
                            <Users className="h-5 w-5" />
                            <div>
                                <h3 className="font-medium">Connect Account</h3>
                                <p className="text-sm text-muted-foreground">Connect a new social media account</p>
                            </div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DashboardLayout; 