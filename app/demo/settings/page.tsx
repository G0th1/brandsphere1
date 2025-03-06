"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Instagram,
    Twitter,
    Facebook,
    LogOut,
    ArrowRight,
    CheckCircle,
    Lock,
    Zap,
    Youtube,
    Bell,
    Settings,
    User,
    LayoutDashboard,
    PieChart,
    FileEdit,
    CalendarClock,
    Save,
    PlusCircle,
    Trash2,
    Linkedin,
    RefreshCw,
    Shield
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

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

// Demo user interface
interface DemoUser {
    id: string;
    email: string;
    name: string;
    subscription_tier: string;
    avatar_url: string;
    demo_mode: boolean;
}

// Social Media Account interface
interface SocialMediaAccount {
    id: string;
    platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'pinterest';
    username: string;
    connected: boolean;
    status: 'active' | 'pending' | 'error';
    lastSync?: string;
}

// Notification settings interface
interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    contentReminders: boolean;
    performanceAlerts: boolean;
}

// Privacy settings interface
interface PrivacySettings {
    dataSharing: boolean;
    usageAnalytics: boolean;
    marketingEmails: boolean;
}

// Sidebar Component
const DemoSidebar = ({ activeItem }: { activeItem: string }) => {
    const router = useRouter();

    // Exit demo function
    const exitDemo = () => {
        localStorage.removeItem('demoUser');
        router.push('/');
    };

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
                    <Link href="/demo/dashboard">
                        <Button variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/demo/content">
                        <Button variant={activeItem === 'content' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                            <FileEdit className="h-4 w-4" />
                            Content
                        </Button>
                    </Link>
                    <Link href="/demo/calendar">
                        <Button variant={activeItem === 'calendar' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                            <CalendarClock className="h-4 w-4" />
                            Calendar
                        </Button>
                    </Link>
                    <Link href="/demo/insights">
                        <Button variant={activeItem === 'insights' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                            <PieChart className="h-4 w-4" />
                            Insights
                        </Button>
                    </Link>
                    <Link href="/demo/profile">
                        <Button variant={activeItem === 'profile' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                            <User className="h-4 w-4" />
                            User Profile
                        </Button>
                    </Link>
                    <Link href="/demo/settings">
                        <Button variant={activeItem === 'settings' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                    <Avatar>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo123" alt="Demo User" />
                        <AvatarFallback>DU</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">Demo User</div>
                        <div className="text-xs text-muted-foreground">demo@example.com</div>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={exitDemo}>
                    Exit Demo
                </Button>
            </div>
        </div>
    );
};

// Header Component
const DemoHeader = () => {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-semibold md:hidden">
                    BrandSphereAI
                </div>
                <div className="flex items-center gap-2 md:ml-auto">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo123" alt="Demo User" />
                        <AvatarFallback>DU</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
};

// Platform Icon component
const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'instagram':
            return <Instagram className="h-5 w-5 text-pink-500" />;
        case 'facebook':
            return <Facebook className="h-5 w-5 text-blue-600" />;
        case 'twitter':
            return <Twitter className="h-5 w-5 text-sky-500" />;
        case 'youtube':
            return <Youtube className="h-5 w-5 text-red-600" />;
        case 'linkedin':
            return <Linkedin className="h-5 w-5 text-blue-700" />;
        case 'pinterest':
            return <div className="flex h-5 w-5 rounded-full bg-red-500 text-white items-center justify-center font-bold text-xs">P</div>;
        default:
            return null;
    }
};

export default function DemoSettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<DemoUser | null>(null);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('social');
    const { toast } = useToast();

    // Social media accounts
    const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([
        { id: '1', platform: 'instagram', username: 'brandspherebusiness', connected: true, status: 'active', lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: '2', platform: 'facebook', username: 'BrandSphereOfficial', connected: true, status: 'active', lastSync: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
        { id: '3', platform: 'twitter', username: 'BrandSphereAI', connected: true, status: 'active', lastSync: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
        { id: '4', platform: 'youtube', username: '', connected: false, status: 'pending' },
        { id: '5', platform: 'linkedin', username: '', connected: false, status: 'pending' },
        { id: '6', platform: 'pinterest', username: '', connected: false, status: 'pending' }
    ]);

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        contentReminders: true,
        performanceAlerts: true
    });

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        dataSharing: true,
        usageAnalytics: true,
        marketingEmails: false
    });

    // New account form
    const [newAccount, setNewAccount] = useState({
        platform: 'instagram',
        username: ''
    });

    useEffect(() => {
        // Set mounted to true when component has mounted
        setMounted(true);

        // Check if user is in demo mode
        const demoUserStr = localStorage.getItem('demoUser');
        if (!demoUserStr) {
            // If no demo user, redirect to demo login
            router.push('/demo/login');
            return;
        }

        try {
            const demoUser = JSON.parse(demoUserStr) as DemoUser;
            setUser(demoUser);
        } catch (error) {
            console.error('Error parsing demo user:', error);
            router.push('/demo/login');
        }
    }, [router]);

    // If component not mounted yet, show nothing
    if (!mounted) return null;

    // If user not logged in, show nothing (we're redirecting anyway)
    if (!user) return null;

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Handle connect account
    const handleConnectAccount = (account: SocialMediaAccount) => {
        const updatedAccounts = socialAccounts.map(acc => {
            if (acc.id === account.id) {
                return {
                    ...acc,
                    connected: true,
                    status: 'active' as const,
                    lastSync: new Date().toISOString(),
                    username: acc.username || `brandsphere${Math.floor(Math.random() * 1000)}`
                };
            }
            return acc;
        });

        setSocialAccounts(updatedAccounts);

        toast({
            title: "Account Connected",
            description: `Successfully connected to ${account.platform}`,
        });
    };

    // Handle disconnect account
    const handleDisconnectAccount = (account: SocialMediaAccount) => {
        const updatedAccounts = socialAccounts.map(acc => {
            if (acc.id === account.id) {
                return {
                    ...acc,
                    connected: false,
                    status: 'pending' as const
                };
            }
            return acc;
        });

        setSocialAccounts(updatedAccounts);

        toast({
            title: "Account Disconnected",
            description: `Successfully disconnected from ${account.platform}`,
        });
    };

    // Handle add account
    const handleAddAccount = () => {
        if (!newAccount.username) {
            toast({
                title: "Username Required",
                description: "Please enter a username for the account",
                variant: "destructive"
            });
            return;
        }

        const newId = (socialAccounts.length + 1).toString();
        setSocialAccounts([
            ...socialAccounts,
            {
                id: newId,
                platform: newAccount.platform as any,
                username: newAccount.username,
                connected: true,
                status: 'active',
                lastSync: new Date().toISOString()
            }
        ]);

        setNewAccount({ platform: 'instagram', username: '' });

        toast({
            title: "Account Added",
            description: `Successfully added ${newAccount.platform} account`,
        });
    };

    // Handle notification toggle
    const handleNotificationToggle = (setting: keyof NotificationSettings) => {
        setNotificationSettings({
            ...notificationSettings,
            [setting]: !notificationSettings[setting]
        });

        toast({
            title: "Settings Updated",
            description: "Your notification preferences have been saved",
        });
    };

    // Handle privacy toggle
    const handlePrivacyToggle = (setting: keyof PrivacySettings) => {
        setPrivacySettings({
            ...privacySettings,
            [setting]: !privacySettings[setting]
        });

        toast({
            title: "Privacy Settings Updated",
            description: "Your privacy preferences have been saved",
        });
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <DemoSidebar activeItem="settings" />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top navigation */}
                <DemoHeader />

                {/* Main content area */}
                <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">Settings</h1>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="social">Social Media Accounts</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
                        </TabsList>

                        {/* Social Media Accounts Tab */}
                        <TabsContent value="social" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Connected Accounts</CardTitle>
                                    <CardDescription>
                                        Manage your connected social media accounts
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {socialAccounts.map((account) => (
                                        <div key={account.id} className="flex items-center justify-between p-3 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <PlatformIcon platform={account.platform} />
                                                <div>
                                                    <div className="font-medium capitalize">{account.platform}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {account.connected ?
                                                            (account.username || "Connected") :
                                                            "Not connected"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {account.connected && account.lastSync && (
                                                    <div className="text-xs text-muted-foreground mr-2">
                                                        Last sync: {formatDate(account.lastSync)}
                                                    </div>
                                                )}
                                                {account.connected ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDisconnectAccount(account)}
                                                    >
                                                        Disconnect
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handleConnectAccount(account)}
                                                    >
                                                        Connect
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Add New Account</CardTitle>
                                    <CardDescription>
                                        Connect a new social media account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-1">
                                                <Label htmlFor="platform">Platform</Label>
                                                <Select
                                                    value={newAccount.platform}
                                                    onValueChange={(value) => setNewAccount({ ...newAccount, platform: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select platform" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="instagram">Instagram</SelectItem>
                                                        <SelectItem value="facebook">Facebook</SelectItem>
                                                        <SelectItem value="twitter">Twitter</SelectItem>
                                                        <SelectItem value="youtube">YouTube</SelectItem>
                                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                        <SelectItem value="pinterest">Pinterest</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2">
                                                <Label htmlFor="username">Username</Label>
                                                <Input
                                                    id="username"
                                                    placeholder="Enter username"
                                                    value={newAccount.username}
                                                    onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-1 flex items-end">
                                                <Button
                                                    className="w-full"
                                                    onClick={handleAddAccount}
                                                >
                                                    <PlusCircle className="h-4 w-4 mr-2" />
                                                    Add Account
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>
                                        Choose what notifications you receive
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Email Notifications</div>
                                            <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.emailNotifications}
                                            onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Push Notifications</div>
                                            <div className="text-sm text-muted-foreground">Receive push notifications</div>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.pushNotifications}
                                            onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Weekly Digest</div>
                                            <div className="text-sm text-muted-foreground">Receive a weekly summary of your activity</div>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.weeklyDigest}
                                            onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Content Reminders</div>
                                            <div className="text-sm text-muted-foreground">Get reminders about scheduled content</div>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.contentReminders}
                                            onCheckedChange={() => handleNotificationToggle('contentReminders')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Performance Alerts</div>
                                            <div className="text-sm text-muted-foreground">Receive alerts about content performance</div>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.performanceAlerts}
                                            onCheckedChange={() => handleNotificationToggle('performanceAlerts')}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="ml-auto">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Privacy Tab */}
                        <TabsContent value="privacy" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Privacy & Security</CardTitle>
                                    <CardDescription>
                                        Manage your privacy and security settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Data Sharing</div>
                                            <div className="text-sm text-muted-foreground">Allow us to use your data to improve our services</div>
                                        </div>
                                        <Switch
                                            checked={privacySettings.dataSharing}
                                            onCheckedChange={() => handlePrivacyToggle('dataSharing')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Usage Analytics</div>
                                            <div className="text-sm text-muted-foreground">Allow us to collect anonymous usage data</div>
                                        </div>
                                        <Switch
                                            checked={privacySettings.usageAnalytics}
                                            onCheckedChange={() => handlePrivacyToggle('usageAnalytics')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Marketing Emails</div>
                                            <div className="text-sm text-muted-foreground">Receive marketing and promotional emails</div>
                                        </div>
                                        <Switch
                                            checked={privacySettings.marketingEmails}
                                            onCheckedChange={() => handlePrivacyToggle('marketingEmails')}
                                        />
                                    </div>

                                    <div className="pt-4 mt-4 border-t">
                                        <h3 className="font-medium mb-4">Security Options</h3>

                                        <div className="space-y-4">
                                            <Button variant="outline" className="w-full justify-start">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Change Password
                                            </Button>

                                            <Button variant="outline" className="w-full justify-start">
                                                <Shield className="h-4 w-4 mr-2" />
                                                Enable Two-Factor Authentication
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="ml-auto">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
} 