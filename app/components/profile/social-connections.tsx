"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// Social media platform configuration
const PLATFORMS = [
    {
        id: 'twitter',
        name: 'Twitter',
        icon: '/images/twitter-icon.svg',
        color: 'bg-blue-500',
        connectUrl: '/api/connect/twitter',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: '/images/facebook-icon.svg',
        color: 'bg-blue-600',
        connectUrl: '/api/connect/facebook',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: '/images/instagram-icon.svg',
        color: 'bg-pink-500',
        connectUrl: '/api/connect/instagram',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '/images/linkedin-icon.svg',
        color: 'bg-blue-700',
        connectUrl: '/api/connect/linkedin',
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: '/images/tiktok-icon.svg',
        color: 'bg-black',
        connectUrl: '/api/connect/tiktok',
    },
];

interface SocialConnectionsProps {
    connectedAccounts: string[];
}

export function SocialConnections({ connectedAccounts }: SocialConnectionsProps) {
    const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState<string | null>(null);
    const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
    const [platformToDisconnect, setPlatformToDisconnect] = useState<string | null>(null);

    // Handle platform connection
    const handleConnect = (platformId: string) => {
        setIsConnecting(platformId);

        // In a real implementation, we would redirect to the platform's OAuth page
        // For demo purposes, we're just showing a success toast
        setTimeout(() => {
            setIsConnecting(null);
            window.location.href = PLATFORMS.find(p => p.id === platformId)?.connectUrl || '/dashboard/profile';
        }, 1000);
    };

    // Handle platform disconnection
    const handleDisconnect = async (platformId: string) => {
        setIsDisconnecting(platformId);

        try {
            // Call API to disconnect platform
            const response = await fetch(`/api/disconnect/${platformId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Failed to disconnect ${platformId}`);
            }

            toast({
                title: 'Account disconnected',
                description: `Your ${platformId} account has been disconnected successfully.`,
            });

            // Refresh the page to update the UI
            window.location.reload();
        } catch (error) {
            console.error(`Error disconnecting ${platformId}:`, error);
            toast({
                title: 'Disconnection failed',
                description: `Failed to disconnect your ${platformId} account. Please try again later.`,
                variant: 'destructive',
            });
        } finally {
            setIsDisconnecting(null);
            setShowDisconnectDialog(false);
            setPlatformToDisconnect(null);
        }
    };

    // Helper function to confirm disconnection
    const confirmDisconnect = (platformId: string) => {
        setPlatformToDisconnect(platformId);
        setShowDisconnectDialog(true);
    };

    return (
        <div className="space-y-6">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connect your social media accounts</AlertTitle>
                <AlertDescription>
                    Connect your social media accounts to BrandSphereAI to manage and analyze your content across platforms.
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                {PLATFORMS.map((platform) => {
                    const isConnected = connectedAccounts.includes(platform.id);

                    return (
                        <div
                            key={platform.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platform.color}`}>
                                    {/* Fallback to text initials if icon URL is invalid */}
                                    <span className="text-white font-semibold text-lg">
                                        {platform.name.charAt(0)}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-medium">{platform.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isConnected
                                            ? 'Connected'
                                            : `Connect your ${platform.name} account`}
                                    </p>
                                </div>
                            </div>

                            {isConnected ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => confirmDisconnect(platform.id)}
                                    disabled={isDisconnecting === platform.id}
                                >
                                    {isDisconnecting === platform.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Disconnecting...
                                        </>
                                    ) : (
                                        'Disconnect'
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => handleConnect(platform.id)}
                                    disabled={isConnecting === platform.id}
                                >
                                    {isConnecting === platform.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        'Connect'
                                    )}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Disconnect confirmation dialog */}
            <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Disconnect Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to disconnect your {platformToDisconnect ? PLATFORMS.find(p => p.id === platformToDisconnect)?.name : ''} account?
                            This will remove all access to your account data.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowDisconnectDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => platformToDisconnect && handleDisconnect(platformToDisconnect)}
                            disabled={isDisconnecting === platformToDisconnect}
                        >
                            {isDisconnecting === platformToDisconnect ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Disconnecting...
                                </>
                            ) : (
                                'Disconnect'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 