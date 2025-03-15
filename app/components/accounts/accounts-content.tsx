"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Twitter, Facebook, Linkedin, AlertCircle, Link as LinkIcon, Plus, ArrowUpRight, Loader2, RefreshCw, Trash2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
            followers: 12540,
            engagement: 3.2,
            posts: 342
        }
    },
    {
        id: '2',
        platform: 'Twitter',
        username: 'yourbrand',
        profileUrl: 'https://twitter.com/yourbrand',
        avatarUrl: '/images/mock/twitter-avatar.jpg',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        metrics: {
            followers: 8750,
            engagement: 2.1,
            posts: 1205
        }
    },
    {
        id: '3',
        platform: 'Facebook',
        username: 'yourbrand',
        profileUrl: 'https://facebook.com/yourbrand',
        avatarUrl: '/images/mock/facebook-avatar.jpg',
        status: 'expired',
        lastSync: new Date(Date.now() - 3600000 * 72), // 3 days ago
        metrics: {
            followers: 24680,
            engagement: 1.8,
            posts: 520
        }
    },
    {
        id: '4',
        platform: 'Linkedin',
        username: 'yourbrand',
        profileUrl: 'https://linkedin.com/company/yourbrand',
        avatarUrl: '/images/mock/linkedin-avatar.jpg',
        status: 'error',
        lastSync: new Date(Date.now() - 3600000 * 12), // 12 hours ago
        metrics: {
            followers: 5430,
            engagement: 1.2,
            posts: 187
        }
    }
];

// Format relative time
const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

// Get platform icon
const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return <Instagram className="h-5 w-5" />;
        case 'twitter':
            return <Twitter className="h-5 w-5" />;
        case 'facebook':
            return <Facebook className="h-5 w-5" />;
        case 'linkedin':
            return <Linkedin className="h-5 w-5" />;
        default:
            return <LinkIcon className="h-5 w-5" />;
    }
};

export default function AccountsContent() {
    const { toast } = useToast();
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);
    const [showConnectDialog, setShowConnectDialog] = useState(false);

    useEffect(() => {
        // Simple data loading to prevent issues
        setAccounts(MOCK_ACCOUNTS);
        setIsLoading(false);
    }, []);

    // Simplified UI to ensure it renders properly
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Connected Accounts</h1>
                <Button onClick={() => setShowConnectDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Account
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accounts.map((account) => (
                        <Card key={account.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={account.avatarUrl} alt={account.platform} />
                                            <AvatarFallback>{account.platform.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{account.platform}</CardTitle>
                                            <CardDescription>@{account.username}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={
                                        account.status === 'connected' ? 'success' :
                                            account.status === 'expired' ? 'warning' : 'destructive'
                                    }>
                                        {account.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Followers</p>
                                        <p className="text-lg font-medium">{account.metrics.followers.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Engagement</p>
                                        <p className="text-lg font-medium">{account.metrics.engagement}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Posts</p>
                                        <p className="text-lg font-medium">{account.metrics.posts}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={account.profileUrl} target="_blank" rel="noopener noreferrer">
                                        View Profile
                                        <ArrowUpRight className="h-3 w-3 ml-1" />
                                    </a>
                                </Button>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        <RefreshCw className="h-3 w-3 mr-1" />
                                        Sync
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Connect Dialog */}
            <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Connect a Social Media Account</DialogTitle>
                        <DialogDescription>
                            Choose a platform to connect your social media account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {['Instagram', 'Twitter', 'Facebook', 'Linkedin'].map((platform) => (
                            <Button
                                key={platform}
                                variant="outline"
                                className="flex items-center justify-center gap-2 h-14"
                                onClick={() => {
                                    setSelectedPlatform(platform);
                                    setShowConnectDialog(false);
                                    toast({
                                        title: "Connection Started",
                                        description: `Redirecting to ${platform} authorization...`,
                                    });
                                }}
                            >
                                {getPlatformIcon(platform)}
                                {platform}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 