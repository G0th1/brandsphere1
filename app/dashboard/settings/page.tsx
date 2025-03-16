import { Metadata } from 'next';
import { DashboardLayout } from '@/app/components/dashboard-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const metadata: Metadata = {
    title: 'Settings | BrandSphereAI',
    description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="bg-background border">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your account profile information and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Write a short bio about yourself"
                                        defaultValue="Social media manager and content creator."
                                    />
                                </div>
                                <Button>Save Changes</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Language and Region</CardTitle>
                                <CardDescription>
                                    Set your language and regional preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language</Label>
                                        <select
                                            id="language"
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="en">English</option>
                                            <option value="sv">Swedish</option>
                                            <option value="no">Norwegian</option>
                                            <option value="da">Danish</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <select
                                            id="timezone"
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="utc">UTC</option>
                                            <option value="cet">Central European Time</option>
                                            <option value="est">Eastern Standard Time</option>
                                            <option value="pst">Pacific Standard Time</option>
                                        </select>
                                    </div>
                                </div>
                                <Button>Save Preferences</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme</CardTitle>
                                <CardDescription>
                                    Customize the appearance of the application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Theme Mode</Label>
                                    <div className="flex items-center gap-2">
                                        <ThemeToggle />
                                        <span className="text-sm text-muted-foreground">
                                            Select light, dark, or system theme
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Accessibility</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="reduce-motion">Reduce motion</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Reduce the amount of animations in the interface
                                            </p>
                                        </div>
                                        <Switch id="reduce-motion" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="high-contrast">High contrast</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Increase contrast between elements
                                            </p>
                                        </div>
                                        <Switch id="high-contrast" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Dashboard Layout</CardTitle>
                                <CardDescription>
                                    Customize how your dashboard is displayed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="compact-view">Compact view</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display more content with less spacing
                                        </p>
                                    </div>
                                    <Switch id="compact-view" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="show-analytics">Show analytics on dashboard</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display analytics widgets on your main dashboard
                                        </p>
                                    </div>
                                    <Switch id="show-analytics" defaultChecked />
                                </div>
                                <Button>Save Layout Preferences</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Configure how and when you receive notifications.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Post Engagement</h3>
                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="post-published">Post Published</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications when your scheduled posts are published.
                                                </p>
                                            </div>
                                            <Switch id="post-published" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="engagement-reminder">Engagement Reminders</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get reminders to engage with comments shortly after posts are published.
                                                </p>
                                            </div>
                                            <Switch id="engagement-reminder" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="engagement-time">Engagement Time</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    How long after publishing should we remind you to engage?
                                                </p>
                                            </div>
                                            <Select defaultValue="30">
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Select time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="15">15 minutes</SelectItem>
                                                    <SelectItem value="30">30 minutes</SelectItem>
                                                    <SelectItem value="60">1 hour</SelectItem>
                                                    <SelectItem value="120">2 hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Analytics & Insights</h3>
                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="weekly-summary">Weekly Summary</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive a weekly summary of your social media performance.
                                                </p>
                                            </div>
                                            <Switch id="weekly-summary" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="trending-content">Trending Content</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notifications about trending topics for your audience.
                                                </p>
                                            </div>
                                            <Switch id="trending-content" defaultChecked />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Delivery Preferences</h3>
                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications via email.
                                                </p>
                                            </div>
                                            <Switch id="email-notifications" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications in your browser.
                                                </p>
                                            </div>
                                            <Switch id="browser-notifications" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications on your mobile device.
                                                </p>
                                            </div>
                                            <Switch id="mobile-notifications" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                                <Button>Update Password</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Two-Factor Authentication</CardTitle>
                                <CardDescription>
                                    Add an extra layer of security to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="two-factor">Enable two-factor authentication</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Require a verification code when logging in
                                        </p>
                                    </div>
                                    <Switch id="two-factor" />
                                </div>
                                <Button variant="outline">Set Up Two-Factor Authentication</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sessions</CardTitle>
                                <CardDescription>
                                    Manage your active sessions and devices.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border rounded-md p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Current Session</p>
                                                <p className="text-sm text-muted-foreground">Windows 10 • Chrome • Stockholm, Sweden</p>
                                            </div>
                                            <div className="text-sm text-green-500">Active Now</div>
                                        </div>
                                    </div>
                                    <div className="border rounded-md p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Mobile App</p>
                                                <p className="text-sm text-muted-foreground">iOS 16 • BrandSphere App • Last active 2 days ago</p>
                                            </div>
                                            <Button variant="outline" size="sm">Revoke</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
} 