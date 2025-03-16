'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileForm } from '@/app/components/profile/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialConnections } from '@/app/components/profile/social-connections';
import { SecuritySettings } from '@/app/components/profile/security-settings';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { DashboardHeader } from '@/app/components/dashboard/dashboard-header';
import { DashboardShell } from '@/app/components/dashboard/dashboard-shell';

async function getUserProfile(userId: string) {
    try {
        // This function is not used in the client component anymore
        // but keeping it here as it might be useful for server components
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [connectedAccounts, setConnectedAccounts] = useState([]);

    // Fetch connected social accounts when the component mounts
    useState(() => {
        const fetchConnectedAccounts = async () => {
            if (!session?.user?.id) return;

            try {
                setIsLoading(true);
                const response = await fetch(`/api/user/social-connections?userId=${session.user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch connected accounts');
                }

                const data = await response.json();
                setConnectedAccounts(data.connections || []);
            } catch (error) {
                console.error('Error fetching connected accounts:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch connected social accounts',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchConnectedAccounts();
        }
    }, [session?.user?.id, toast]);

    // If session is loading, show loading state
    if (status === 'loading') {
        return (
            <DashboardShell>
                <DashboardHeader
                    heading="Profile"
                    text="Manage your profile and account settings"
                />
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </DashboardShell>
        );
    }

    // If not authenticated, show error
    if (status !== 'authenticated' || !session?.user) {
        return (
            <DashboardShell>
                <DashboardHeader
                    heading="Profile"
                    text="Manage your profile and account settings"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Unauthorized</CardTitle>
                        <CardDescription>
                            You need to be signed in to access your profile settings.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Profile"
                text="Manage your profile and account settings"
            />

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger value="social">Social Connections</TabsTrigger>
                    <TabsTrigger value="security">Security Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your profile information and personal details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm user={session.user} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Connections</CardTitle>
                            <CardDescription>
                                Connect your social media accounts to share content directly from the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SocialConnections
                                connectedAccounts={connectedAccounts}
                                onAccountConnected={(account) => {
                                    setConnectedAccounts([...connectedAccounts, account]);
                                    toast({
                                        title: 'Account Connected',
                                        description: `Your ${account.platform} account has been connected successfully.`,
                                    });
                                }}
                                onAccountDisconnected={(platform) => {
                                    setConnectedAccounts(connectedAccounts.filter(acc => acc.platform !== platform));
                                    toast({
                                        title: 'Account Disconnected',
                                        description: `Your ${platform} account has been disconnected.`,
                                    });
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your password and security preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SecuritySettings userId={session.user.id} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
} 