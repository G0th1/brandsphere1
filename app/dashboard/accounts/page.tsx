"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Twitter, Facebook, Linkedin, CheckCircle, AlertCircle, Link as LinkIcon, Plus, ArrowUpRight, Loader2, RefreshCw, Settings, Trash2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AuthGuard from '@/app/components/auth-guard';

// Interface for social media account
interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    profileUrl: string;
    avatarUrl: string;
    status: 'connected' | 'expired' | 'error';
    lastSync: Date;
    metrics: {
        followers: number;
        engagement: number;
        posts: number;
    };
}

// Mock data
const MOCK_ACCOUNTS: SocialAccount[] = [
    {
        id: '1',
        platform: 'Instagram',
        username: 'yourbrand',
        profileUrl: 'https://instagram.com/yourbrand',
        avatarUrl: '/images/mock/instagram-avatar.jpg',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        metrics: {
            followers: 4320,
            engagement: 3.2,
            posts: 127
        }
    },
    {
        id: '2',
        platform: 'Twitter',
        username: 'yourbrand',
        profileUrl: 'https://twitter.com/yourbrand',
        avatarUrl: '/images/mock/twitter-avatar.jpg',
        status: 'expired',
        lastSync: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
        metrics: {
            followers: 2150,
            engagement: 1.8,
            posts: 352
        }
    },
    {
        id: '3',
        platform: 'LinkedIn',
        username: 'Your Brand Inc.',
        profileUrl: 'https://linkedin.com/company/yourbrand',
        avatarUrl: '/images/mock/linkedin-avatar.jpg',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000 * 6), // 6 hours ago
        metrics: {
            followers: 980,
            engagement: 2.4,
            posts: 42
        }
    }
];

// Available platforms for connecting
const AVAILABLE_PLATFORMS = [
    {
        id: 'instagram',
        name: 'Instagram',
        icon: <Instagram className="h-5 w-5" />,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        textColor: 'text-pink-600',
        description: 'Connect your Instagram Business account to publish and analyze content.'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: <Facebook className="h-5 w-5" />,
        color: 'bg-blue-600',
        textColor: 'text-blue-600',
        description: 'Connect your Facebook Page to schedule posts and view analytics.'
    },
    {
        id: 'twitter',
        name: 'Twitter',
        icon: <Twitter className="h-5 w-5" />,
        color: 'bg-sky-500',
        textColor: 'text-sky-500',
        description: 'Connect your Twitter account to schedule tweets and track engagement.'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: <Linkedin className="h-5 w-5" />,
        color: 'bg-blue-700',
        textColor: 'text-blue-700',
        description: 'Connect your LinkedIn Company Page to publish and analyze content.'
    }
];

// Helper to format relative time
const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};

// Helper to get platform icon
const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return <Instagram className="h-4 w-4" />;
        case 'facebook':
            return <Facebook className="h-4 w-4" />;
        case 'twitter':
            return <Twitter className="h-4 w-4" />;
        case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
        default:
            return <LinkIcon className="h-4 w-4" />;
    }
};

function AccountsPageContent() {
    const { toast } = useToast();
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);
    const [showConnectDialog, setShowConnectDialog] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setAccounts(MOCK_ACCOUNTS);
            setIsLoading(false);
        }, 1000);
    };

    const handleConnectRequest = () => {
        setShowConnectDialog(true);
    };

    const handleReconnect = (account: SocialAccount) => {
        toast({
            title: "Reconnection Initiated",
            description: `We're reconnecting to your ${account.platform} account.`,
        });

        // Simulate reconnection delay
        setTimeout(() => {
            const updatedAccounts = accounts.map(a =>
                a.id === account.id ? { ...a, status: 'connected', lastSync: new Date() } : a
            );
            setAccounts(updatedAccounts);
            toast({
                title: "Account Reconnected",
                description: `Your ${account.platform} account has been successfully reconnected.`,
            });
        }, 2000);
    };

    const handleDisconnectRequest = (account: SocialAccount) => {
        setAccountToDisconnect(account);
        setShowDisconnectConfirm(true);
    };

    const handleDisconnect = () => {
        if (!accountToDisconnect) return;

        toast({
            title: "Account Disconnected",
            description: `Your ${accountToDisconnect.platform} account has been disconnected.`,
        });

        // Remove the account from the list
        const updatedAccounts = accounts.filter(a => a.id !== accountToDisconnect.id);
        setAccounts(updatedAccounts);

        // Close the dialog and reset state
        setShowDisconnectConfirm(false);
        setAccountToDisconnect(null);
    };

    const handlePlatformSelect = (platformId: string) => {
        setSelectedPlatform(platformId);
        setIsConnecting(true);

        // Simulate connection process
        setTimeout(() => {
            const platform = AVAILABLE_PLATFORMS.find(p => p.id === platformId);
            if (!platform) return;

            // Check if account already exists
            const existingAccount = accounts.find(a => a.platform.toLowerCase() === platformId);
            if (existingAccount) {
                toast({
                    title: "Account Already Connected",
                    description: `Your ${platform.name} account is already connected.`,
                    variant: "destructive",
                });
                setIsConnecting(false);
                return;
            }

            // Create new mock account
            const newAccount: SocialAccount = {
                id: `new-${Date.now()}`,
                platform: platform.name,
                username: `yourbrand_${platformId}`,
                profileUrl: `https://${platformId}.com/yourbrand`,
                avatarUrl: `/images/mock/${platformId}-avatar.jpg`,
                status: 'connected',
                lastSync: new Date(),
                metrics: {
                    followers: Math.floor(Math.random() * 5000),
                    engagement: +(Math.random() * 5).toFixed(1),
                    posts: Math.floor(Math.random() * 200)
                }
            };

            setAccounts([...accounts, newAccount]);
            setIsConnecting(false);
            setShowConnectDialog(false);

            toast({
                title: "Account Connected",
                description: `Your ${platform.name} account has been connected successfully.`,
            });
        }, 2000);
    };

    const handleSync = (account: SocialAccount) => {
        toast({
            title: "Sync Started",
            description: `Syncing data from your ${account.platform} account.`,
        });

        // Simulate sync delay
        setTimeout(() => {
            const updatedAccounts = accounts.map(a =>
                a.id === account.id
                    ? {
                        ...a,
                        lastSync: new Date(),
                        metrics: {
                            ...a.metrics,
                            followers: a.metrics.followers + Math.floor(Math.random() * 10),
                            engagement: +(a.metrics.engagement + Math.random() * 0.3).toFixed(1)
                        }
                    }
                    : a
            );
            setAccounts(updatedAccounts);
            toast({
                title: "Sync Complete",
                description: `Successfully synced data from your ${account.platform} account.`,
            });
        }, 2000);
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Connected Accounts</h1>
                        <p className="text-muted-foreground">
                            Manage your connected social media accounts and integrations
                        </p>
                    </div>
                    <Button onClick={handleConnectRequest} className="flex gap-2">
                        <Plus className="h-4 w-4" />
                        Connect Account
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="all">All Accounts</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="issues">Issues</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="space-y-6">
                            {accounts.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <div className="bg-muted p-3 rounded-full">
                                            <LinkIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-medium">No Connected Accounts</h3>
                                        <p className="text-center text-muted-foreground max-w-md">
                                            Connect your social media accounts to schedule posts, view analytics, and manage all your content from one place.
                                        </p>
                                        <Button onClick={handleConnectRequest} className="mt-2">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Connect Your First Account
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {accounts.map((account) => (
                                        <Card key={account.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar>
                                                            <AvatarImage src={account.avatarUrl} />
                                                            <AvatarFallback>{getPlatformIcon(account.platform)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle className="text-lg">{account.platform}</CardTitle>
                                                            <CardDescription>@{account.username}</CardDescription>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant={account.status === 'connected' ? 'default' : 'destructive'}
                                                        className="capitalize"
                                                    >
                                                        {account.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <div className="grid grid-cols-3 gap-2 py-2">
                                                    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                                                        <span className="text-lg font-semibold">{account.metrics.followers.toLocaleString()}</span>
                                                        <span className="text-xs text-muted-foreground">Followers</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                                                        <span className="text-lg font-semibold">{account.metrics.engagement}%</span>
                                                        <span className="text-xs text-muted-foreground">Engagement</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                                                        <span className="text-lg font-semibold">{account.metrics.posts}</span>
                                                        <span className="text-xs text-muted-foreground">Posts</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
                                                    <RefreshCw className="h-3 w-3" />
                                                    <span>Last synced {formatRelativeTime(account.lastSync)}</span>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex items-center justify-between pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSync(account)}
                                                >
                                                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                                    Sync
                                                </Button>
                                                <div className="flex gap-2">
                                                    {account.status === 'expired' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReconnect(account)}
                                                        >
                                                            Reconnect
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDisconnectRequest(account)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                        Disconnect
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="active" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {accounts.filter(a => a.status === 'connected').map((account) => (
                                    <Card key={account.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={account.avatarUrl} />
                                                        <AvatarFallback>{getPlatformIcon(account.platform)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">{account.platform}</CardTitle>
                                                        <CardDescription>@{account.username}</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge variant="default" className="capitalize">
                                                    {account.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <div className="grid grid-cols-3 gap-2 py-2">
                                                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                                                    <span className="text-lg font-semibold">{account.metrics.followers.toLocaleString()}</span>
                                                    <span className="text-xs text-muted-foreground">Followers</span>
                                                </div>
                                                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                                                    <span className="text-lg font-semibold">{account.metrics.engagement}%</span>
                                                    <span className="text-xs text-muted-foreground">Engagement</span>
                                                </div>
                                                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                                                    <span className="text-lg font-semibold">{account.metrics.posts}</span>
                                                    <span className="text-xs text-muted-foreground">Posts</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
                                                <RefreshCw className="h-3 w-3" />
                                                <span>Last synced {formatRelativeTime(account.lastSync)}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSync(account)}
                                            >
                                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                                Sync
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDisconnectRequest(account)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                Disconnect
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="issues" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {accounts.filter(a => a.status !== 'connected').map((account) => (
                                    <Card key={account.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={account.avatarUrl} />
                                                        <AvatarFallback>{getPlatformIcon(account.platform)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">{account.platform}</CardTitle>
                                                        <CardDescription>@{account.username}</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge variant="destructive" className="capitalize">
                                                    {account.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <Alert className="mt-2" variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Authorization Required</AlertTitle>
                                                <AlertDescription>
                                                    Your account connection has expired. Please reconnect to continue using this account.
                                                </AlertDescription>
                                            </Alert>
                                        </CardContent>
                                        <CardFooter className="flex justify-end pt-2">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleReconnect(account)}
                                            >
                                                Reconnect Account
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* Connect Account Dialog */}
                <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Connect Account</DialogTitle>
                            <DialogDescription>
                                Select a platform to connect to your BrandSphere account
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {AVAILABLE_PLATFORMS.map((platform) => (
                                <div
                                    key={platform.id}
                                    className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                                    onClick={() => !isConnecting && handlePlatformSelect(platform.id)}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                                        {platform.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`font-medium ${platform.textColor}`}>
                                            {platform.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                                    </div>
                                    {isConnecting && selectedPlatform === platform.id ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    ) : (
                                        <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowConnectDialog(false)}
                                disabled={isConnecting}
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Disconnect Confirmation Dialog */}
                <Dialog open={showDisconnectConfirm} onOpenChange={setShowDisconnectConfirm}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Disconnect Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to disconnect your {accountToDisconnect?.platform} account?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                            <p>This will remove the account from BrandSphere AI. You'll need to reconnect it if you want to use it again.</p>
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Important</AlertTitle>
                                <AlertDescription>
                                    This won't revoke BrandSphere AI's permissions on {accountToDisconnect?.platform}.
                                    Visit your {accountToDisconnect?.platform} settings to fully revoke access.
                                </AlertDescription>
                            </Alert>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowDisconnectConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDisconnect}
                            >
                                Disconnect
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default function AccountsPage() {
    return (
        <AuthGuard>
            <AccountsPageContent />
        </AuthGuard>
    );
} 