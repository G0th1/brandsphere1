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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
    Bell,
    Check,
    Clock,
    Calendar,
    FileText,
    User,
    MessageSquare,
    Settings,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    AlertTriangle,
    Trash2,
    RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSubscription } from '@/contexts/subscription-context';

// Types
interface Activity {
    id: string;
    type: 'post_created' | 'post_published' | 'post_failed' | 'account_connected' | 'account_expired' | 'analytics_updated' | 'comment_received' | 'system_message';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    platform?: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn';
    postId?: string;
    postTitle?: string;
    accountId?: string;
    urgent?: boolean;
}

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
}

// Mock data for activities
const MOCK_ACTIVITIES: Activity[] = [
    {
        id: '1',
        type: 'post_published',
        title: 'Post Published',
        message: 'Your post "New Product Launch" was successfully published to Instagram.',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        read: true,
        platform: 'Instagram',
        postId: '123',
        postTitle: 'New Product Launch'
    },
    {
        id: '2',
        type: 'account_connected',
        title: 'Account Connected',
        message: 'Your LinkedIn account has been successfully connected.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true,
        platform: 'LinkedIn',
        accountId: '456'
    },
    {
        id: '3',
        type: 'comment_received',
        title: 'New Comment',
        message: 'You received a new comment on your post "Weekly Tips".',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        read: false,
        platform: 'Twitter',
        postId: '789',
        postTitle: 'Weekly Tips'
    },
    {
        id: '4',
        type: 'analytics_updated',
        title: 'Analytics Updated',
        message: 'Your analytics dashboard has been updated with the latest data.',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        read: true
    },
    {
        id: '5',
        type: 'post_failed',
        title: 'Post Failed',
        message: 'Your scheduled post "Customer Success Story" could not be published to Facebook.',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        read: false,
        platform: 'Facebook',
        postId: '101',
        postTitle: 'Customer Success Story',
        urgent: true
    },
    {
        id: '6',
        type: 'account_expired',
        title: 'Account Authorization Expired',
        message: 'Your Twitter account authorization has expired. Please reconnect your account.',
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        read: false,
        platform: 'Twitter',
        accountId: '202',
        urgent: true
    },
    {
        id: '7',
        type: 'system_message',
        title: 'System Update',
        message: 'BrandSphere has been updated with new features. Check out what\'s new!',
        timestamp: new Date(Date.now() - 345600000), // 4 days ago
        read: true
    }
];

// Mock data for notifications
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'warning',
        title: 'Account Authorization Expired',
        message: 'Your Twitter account authorization has expired. Please reconnect your account.',
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        read: false,
        actionUrl: '/accounts',
        actionLabel: 'Reconnect'
    },
    {
        id: '2',
        type: 'error',
        title: 'Post Failed',
        message: 'Your scheduled post "Customer Success Story" could not be published to Facebook.',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        read: false,
        actionUrl: '/posts/101',
        actionLabel: 'View Details'
    },
    {
        id: '3',
        type: 'info',
        title: 'System Update',
        message: 'BrandSphere has been updated with new features. Check out what\'s new!',
        timestamp: new Date(Date.now() - 345600000), // 4 days ago
        read: true,
        actionUrl: '/whats-new',
        actionLabel: 'Learn More'
    },
    {
        id: '4',
        type: 'success',
        title: 'Account Connected',
        message: 'Your LinkedIn account has been successfully connected.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true
    }
];

// Helper functions for UI
const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
        case 'post_created':
        case 'post_published':
            return <FileText className="h-4 w-4" />;
        case 'post_failed':
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'account_connected':
            return <User className="h-4 w-4" />;
        case 'account_expired':
            return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case 'analytics_updated':
            return <RefreshCw className="h-4 w-4" />;
        case 'comment_received':
            return <MessageSquare className="h-4 w-4" />;
        case 'system_message':
            return <Settings className="h-4 w-4" />;
        default:
            return <Bell className="h-4 w-4" />;
    }
};

const getPlatformIcon = (platform?: string) => {
    switch (platform) {
        case 'Instagram':
            return <Instagram className="h-4 w-4" />;
        case 'Twitter':
            return <Twitter className="h-4 w-4" />;
        case 'Facebook':
            return <Facebook className="h-4 w-4" />;
        case 'LinkedIn':
            return <Linkedin className="h-4 w-4" />;
        default:
            return null;
    }
};

const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
        case 'success':
            return <Check className="h-4 w-4 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case 'error':
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'info':
        default:
            return <Bell className="h-4 w-4 text-blue-500" />;
    }
};

const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
};

export function RecentActivities() {
    const { toast } = useToast();
    const { isDemoActive } = useSubscription();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('activities');

    // Fetch activities and notifications (using mock data for demo)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Simulate API delay
                setTimeout(() => {
                    setActivities(MOCK_ACTIVITIES);
                    setNotifications(MOCK_NOTIFICATIONS);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching activities:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load activities and notifications',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    // Mark all as read
    const handleMarkAllAsRead = () => {
        if (activeTab === 'activities') {
            const updatedActivities = activities.map(activity => ({
                ...activity,
                read: true
            }));
            setActivities(updatedActivities);
            toast({
                title: 'All Activities Marked as Read',
                description: 'All activities have been marked as read.',
            });
        } else {
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                read: true
            }));
            setNotifications(updatedNotifications);
            toast({
                title: 'All Notifications Marked as Read',
                description: 'All notifications have been marked as read.',
            });
        }
    };

    // Mark single item as read
    const handleMarkAsRead = (id: string) => {
        if (activeTab === 'activities') {
            const updatedActivities = activities.map(activity =>
                activity.id === id ? { ...activity, read: true } : activity
            );
            setActivities(updatedActivities);
        } else {
            const updatedNotifications = notifications.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            );
            setNotifications(updatedNotifications);
        }
    };

    // Clear all activities or notifications
    const handleClearAll = () => {
        if (activeTab === 'activities') {
            setActivities([]);
            toast({
                title: 'Activities Cleared',
                description: 'All activities have been cleared.',
            });
        } else {
            setNotifications([]);
            toast({
                title: 'Notifications Cleared',
                description: 'All notifications have been cleared.',
            });
        }
    };

    // Clear single item
    const handleClear = (id: string) => {
        if (activeTab === 'activities') {
            const updatedActivities = activities.filter(activity => activity.id !== id);
            setActivities(updatedActivities);
        } else {
            const updatedNotifications = notifications.filter(notification => notification.id !== id);
            setNotifications(updatedNotifications);
        }
    };

    // Count unread items
    const unreadActivities = activities.filter(a => !a.read).length;
    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Track your recent activities and notifications
                </CardDescription>
            </CardHeader>

            <Tabs defaultValue="activities" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="activities" className="relative">
                            Activities
                            {unreadActivities > 0 && (
                                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {unreadActivities}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="relative">
                            Notifications
                            {unreadNotifications > 0 && (
                                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {unreadNotifications}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <CardContent className="p-0">
                    <TabsContent value="activities" className="m-0">
                        {isLoading ? (
                            // Loading state
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-4 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-muted"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-3 bg-muted rounded w-full"></div>
                                            <div className="h-3 bg-muted rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activities.length === 0 ? (
                            // Empty state
                            <div className="py-12 text-center">
                                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No recent activities</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                                    When you use BrandSphere, your activities will appear here.
                                </p>
                            </div>
                        ) : (
                            // Activities list
                            <div>
                                <div className="p-2 space-y-1">
                                    {activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className={`
                                                flex items-start gap-4 p-3 rounded-lg transition-colors
                                                ${!activity.read ? 'bg-muted/50' : 'hover:bg-muted/30'}
                                                ${activity.urgent ? 'border-l-2 border-red-500' : ''}
                                            `}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted`}>
                                                {getActivityIcon(activity)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h4 className="font-medium truncate">{activity.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{activity.message}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {!activity.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleMarkAsRead(activity.id)}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleClear(activity.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center mt-1 text-xs text-muted-foreground">
                                                    <span>{formatTime(activity.timestamp)}</span>
                                                    {activity.platform && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                {getPlatformIcon(activity.platform)}
                                                                {activity.platform}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="notifications" className="m-0">
                        {isLoading ? (
                            // Loading state
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-4 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-muted"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-3 bg-muted rounded w-full"></div>
                                            <div className="h-3 bg-muted rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            // Empty state
                            <div className="py-12 text-center">
                                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No notifications</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                                    You don't have any notifications right now. We'll notify you when something important happens.
                                </p>
                            </div>
                        ) : (
                            // Notifications list
                            <div>
                                <div className="p-2 space-y-1">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`
                                                flex items-start gap-4 p-3 rounded-lg transition-colors
                                                ${!notification.read ? 'bg-muted/50' : 'hover:bg-muted/30'}
                                                ${notification.type === 'error' ? 'border-l-2 border-red-500' :
                                                    notification.type === 'warning' ? 'border-l-2 border-amber-500' : ''}
                                            `}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted`}>
                                                {getNotificationIcon(notification)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h4 className="font-medium truncate">{notification.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleClear(notification.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(notification.timestamp)}
                                                    </span>
                                                    {notification.actionUrl && notification.actionLabel && (
                                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs font-medium">
                                                            {notification.actionLabel}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </CardContent>
            </Tabs>

            <CardFooter className="flex justify-between border-t p-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={
                        (activeTab === 'activities' && unreadActivities === 0) ||
                        (activeTab === 'notifications' && unreadNotifications === 0)
                    }
                >
                    Mark all as read
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={
                        (activeTab === 'activities' && activities.length === 0) ||
                        (activeTab === 'notifications' && notifications.length === 0)
                    }
                >
                    Clear all
                </Button>
            </CardFooter>
        </Card>
    );
}

export default RecentActivities; 