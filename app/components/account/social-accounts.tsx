"use client";

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Plus,
    RefreshCcw,
    Unlink,
    CheckCircle,
    AlertCircle,
    Link as LinkIcon
} from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';

// Types
interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    profileUrl: string;
    avatarUrl: string;
    status: 'connected' | 'expired' | 'pending';
    lastSync: Date;
    metrics?: {
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

// Get icon for platform
const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'Instagram':
            return <Instagram className="h-5 w-5" />;
        case 'Twitter':
            return <Twitter className="h-5 w-5" />;
        case 'Facebook':
            return <Facebook className="h-5 w-5" />;
        case 'LinkedIn':
            return <Linkedin className="h-5 w-5" />;
        default:
            return <LinkIcon className="h-5 w-5" />;
    }
};

export function SocialAccounts() {
    const { toast } = useToast();
    const { isDemoActive } = useSubscription();
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState('');

    // Fetch accounts (using mock data for demo)
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // In a real app, this would be an API call
                setIsLoading(true);
                // Simulate API delay
                setTimeout(() => {
                    setAccounts(MOCK_ACCOUNTS);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching social accounts:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load social accounts',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, [toast]);

    // Handle account reconnection
    const handleReconnect = (account: SocialAccount) => {
        if (isDemoActive) {
            // In demo mode, just show a success message
            toast({
                title: 'Account Reconnected',
                description: `Your ${account.platform} account has been reconnected successfully.`,
            });

            // Update account status in UI
            const updatedAccounts = accounts.map(a =>
                a.id === account.id ? { ...a, status: 'connected', lastSync: new Date() } : a
            );
            setAccounts(updatedAccounts);
            return;
        }

        // In a real app, this would redirect to OAuth flow
        window.open(`/api/auth/${account.platform.toLowerCase()}`, '_blank');
    };

    // Open disconnect dialog
    const handleDisconnectRequest = (account: SocialAccount) => {
        setSelectedAccount(account);
        setIsDisconnectDialogOpen(true);
    };

    // Handle account disconnection
    const handleDisconnect = () => {
        if (!selectedAccount) return;

        if (isDemoActive) {
            // In demo mode, just show a success message
            toast({
                title: 'Account Disconnected',
                description: `Your ${selectedAccount.platform} account has been disconnected.`,
            });

            // Remove account from UI
            const updatedAccounts = accounts.filter(a => a.id !== selectedAccount.id);
            setAccounts(updatedAccounts);
            setIsDisconnectDialogOpen(false);
            return;
        }

        // In a real app, this would be an API call
        try {
            // Remove account
            const updatedAccounts = accounts.filter(a => a.id !== selectedAccount.id);
            setAccounts(updatedAccounts);
            toast({
                title: 'Account Disconnected',
                description: `Your ${selectedAccount.platform} account has been disconnected.`,
            });
            setIsDisconnectDialogOpen(false);
        } catch (error) {
            console.error('Error disconnecting account:', error);
            toast({
                title: 'Error',
                description: 'Failed to disconnect account',
                variant: 'destructive',
            });
        }
    };

    // Open connect modal
    const handleConnectRequest = () => {
        setIsConnectModalOpen(true);
    };

    // Handle platform selection for connection
    const handlePlatformSelect = (platformId: string) => {
        setSelectedPlatform(platformId);

        if (isDemoActive) {
            // In demo mode, just show a success message
            const platform = AVAILABLE_PLATFORMS.find(p => p.id === platformId);

            toast({
                title: 'Account Connected',
                description: `Your ${platform?.name} account has been connected successfully.`,
            });

            // Add a mock account
            const newAccount: SocialAccount = {
                id: Date.now().toString(),
                platform: platform?.name || '',
                username: 'newaccount',
                profileUrl: `https://${platformId}.com/newaccount`,
                avatarUrl: `/images/mock/${platformId}-avatar.jpg`,
                status: 'connected',
                lastSync: new Date(),
                metrics: {
                    followers: 0,
                    engagement: 0,
                    posts: 0
                }
            };

            setAccounts([...accounts, newAccount]);
            setIsConnectModalOpen(false);
            return;
        }

        // In a real app, this would redirect to OAuth flow
        window.open(`/api/auth/${platformId}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Social Media Accounts</h2>
                    <p className="text-muted-foreground">
                        Connect and manage your social media accounts
                    </p>
                </div>
                <Button onClick={handleConnectRequest} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Connect Account
                </Button>
            </div>

            {isLoading ? (
                // Loading state
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-32"></div>
                                        <div className="h-3 bg-muted rounded w-24"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : accounts.length === 0 ? (
                // Empty state
                <Card className="border-dashed">
                    <CardContent className="py-10 text-center">
                        <div className="mx-auto rounded-full w-12 h-12 flex items-center justify-center bg-muted">
                            <LinkIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No accounts connected</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                            Connect your social media accounts to schedule posts, track performance, and analyze engagement.
                        </p>
                        <Button onClick={handleConnectRequest} className="mt-4 flex items-center gap-1">
                            <Plus className="h-4 w-4" /> Connect Account
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                // Connected accounts list
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {accounts.map((account) => (
                        <Card key={account.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
                    ${account.platform === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                            account.platform === 'Twitter' ? 'bg-sky-500' :
                                                account.platform === 'Facebook' ? 'bg-blue-600' :
                                                    account.platform === 'LinkedIn' ? 'bg-blue-700' : 'bg-gray-500'}`}>
                                        {getPlatformIcon(account.platform)}
                                    </span>
                                    <CardTitle className="text-lg">{account.platform}</CardTitle>
                                    {account.status === 'connected' ? (
                                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-amber-500 ml-auto" />
                                    )}
                                </div>
                                <CardDescription>
                                    {account.status === 'connected'
                                        ? `Last synced ${formatRelativeTime(account.lastSync)}`
                                        : "Authorization expired"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={account.avatarUrl} alt={account.username} />
                                        <AvatarFallback>{account.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{account.username}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {account.metrics?.followers.toLocaleString()} followers
                                        </p>
                                    </div>
                                </div>

                                {account.metrics && (
                                    <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                                        <div>
                                            <p className="font-medium">{account.metrics.followers.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Followers</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">{account.metrics.posts}</p>
                                            <p className="text-xs text-muted-foreground">Posts</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">{account.metrics.engagement}%</p>
                                            <p className="text-xs text-muted-foreground">Engagement</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between gap-2">
                                {account.status === 'expired' ? (
                                    <Button
                                        variant="default"
                                        className="w-full flex items-center gap-1"
                                        onClick={() => handleReconnect(account)}
                                    >
                                        <RefreshCcw className="h-4 w-4" /> Reconnect
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.open(account.profileUrl, '_blank')}
                                    >
                                        View Profile
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => handleDisconnectRequest(account)}
                                >
                                    <Unlink className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Connect Account Modal */}
            <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Connect Social Media Account</DialogTitle>
                        <DialogDescription>
                            Choose a platform to connect to your BrandSphere account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {AVAILABLE_PLATFORMS.map((platform) => (
                            <Card
                                key={platform.id}
                                className={`cursor-pointer border hover:border-${platform.id === 'instagram' ? 'pink-500' : platform.id === 'twitter' ? 'sky-500' : platform.id === 'facebook' ? 'blue-600' : 'blue-700'} transition-colors`}
                                onClick={() => handlePlatformSelect(platform.id)}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                                        {platform.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`font-medium ${platform.textColor}`}>{platform.name}</h3>
                                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConnectModalOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Disconnect Account Confirmation */}
            <AlertDialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedAccount && (
                                <>
                                    Are you sure you want to disconnect your {selectedAccount.platform} account ({selectedAccount.username})?
                                    <br />
                                    You'll need to reconnect it to schedule posts and view analytics.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDisconnect} className="bg-red-500 hover:bg-red-600">
                            Disconnect
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default SocialAccounts; 