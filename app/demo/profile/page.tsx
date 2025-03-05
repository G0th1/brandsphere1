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
    Pencil,
    Camera,
    Mail,
    Phone,
    MapPin,
    Globe,
    Calendar
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

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

// User profile data
interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    bio: string;
    company: string;
    jobTitle: string;
    timezone: string;
    language: string;
    memberSince: string;
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

export default function DemoProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<DemoUser | null>(null);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const { toast } = useToast();

    // User profile data
    const [profile, setProfile] = useState<UserProfile>({
        fullName: "Demo User",
        email: "demo@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "www.example.com",
        bio: "Social media strategist with 5+ years of experience helping brands build their online presence and engage with their audience.",
        company: "Brand Strategies Inc.",
        jobTitle: "Social Media Manager",
        timezone: "America/Los_Angeles",
        language: "English",
        memberSince: "2023-01-15"
    });

    // Form data for editing
    const [formData, setFormData] = useState<UserProfile>(profile);

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
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle save profile
    const handleSaveProfile = () => {
        setProfile(formData);
        setEditMode(false);

        toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated",
        });
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setFormData(profile);
        setEditMode(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <DemoSidebar activeItem="profile" />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top navigation */}
                <DemoHeader />

                {/* Main content area */}
                <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">User Profile</h1>
                        {!editMode && (
                            <Button onClick={() => setEditMode(true)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">Profile Information</TabsTrigger>
                            <TabsTrigger value="subscription">Subscription</TabsTrigger>
                        </TabsList>

                        {/* Profile Information Tab */}
                        <TabsContent value="profile" className="space-y-4">
                            {!editMode ? (
                                <Card>
                                    <CardHeader className="relative pb-8">
                                        <div className="absolute -top-12 w-full flex justify-center">
                                            <Avatar className="h-24 w-24 border-4 border-background">
                                                <AvatarImage
                                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo123"
                                                    alt={profile.fullName}
                                                />
                                                <AvatarFallback>{profile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                                            <p className="text-muted-foreground">{profile.jobTitle} at {profile.company}</p>
                                        </div>

                                        <div className="grid gap-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start gap-2">
                                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Email</div>
                                                        <div className="text-sm text-muted-foreground">{profile.email}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Phone</div>
                                                        <div className="text-sm text-muted-foreground">{profile.phone}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Location</div>
                                                        <div className="text-sm text-muted-foreground">{profile.location}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Website</div>
                                                        <div className="text-sm text-muted-foreground">{profile.website}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Member Since</div>
                                                        <div className="text-sm text-muted-foreground">{formatDate(profile.memberSince)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <div className="font-medium">Language</div>
                                                        <div className="text-sm text-muted-foreground">{profile.language}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <div className="font-medium mb-2">Bio</div>
                                                <div className="text-sm text-muted-foreground">{profile.bio}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Edit Profile Information</CardTitle>
                                        <CardDescription>Update your personal information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-center mb-4">
                                            <div className="relative">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage
                                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo123"
                                                        alt={formData.fullName}
                                                    />
                                                    <AvatarFallback>{formData.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <Button
                                                    size="icon"
                                                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                                                >
                                                    <Camera className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name</Label>
                                                <Input
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    id="website"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="company">Company</Label>
                                                <Input
                                                    id="company"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jobTitle">Job Title</Label>
                                                <Input
                                                    id="jobTitle"
                                                    name="jobTitle"
                                                    value={formData.jobTitle}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="language">Language</Label>
                                                <Select
                                                    value={formData.language}
                                                    onValueChange={(value) => handleSelectChange('language', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="English">English</SelectItem>
                                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                                        <SelectItem value="French">French</SelectItem>
                                                        <SelectItem value="German">German</SelectItem>
                                                        <SelectItem value="Chinese">Chinese</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows={4}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" onClick={handleCancelEdit}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveProfile}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Subscription Tab */}
                        <TabsContent value="subscription" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscription Details</CardTitle>
                                    <CardDescription>Manage your subscription and billing</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="h-5 w-5 text-yellow-500" />
                                            <h3 className="font-bold text-lg">Premium Plan</h3>
                                        </div>
                                        <p className="text-muted-foreground mb-4">Your subscription is active and will renew on April 15, 2024</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="font-medium">Billing Cycle</div>
                                                <div className="text-muted-foreground">Monthly</div>
                                            </div>
                                            <div>
                                                <div className="font-medium">Next Payment</div>
                                                <div className="text-muted-foreground">$29.99 on April 15, 2024</div>
                                            </div>
                                            <div>
                                                <div className="font-medium">Payment Method</div>
                                                <div className="text-muted-foreground">•••• •••• •••• 4242</div>
                                            </div>
                                            <div>
                                                <div className="font-medium">Billing Email</div>
                                                <div className="text-muted-foreground">{profile.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium">Plan Features</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Multiple social media accounts</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Advanced analytics and reporting</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>AI-powered content suggestions</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Unlimited content scheduling</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Priority customer support</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-wrap gap-2">
                                    <Button variant="outline">
                                        Update Payment Method
                                    </Button>
                                    <Button variant="outline">
                                        View Billing History
                                    </Button>
                                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                                        Cancel Subscription
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