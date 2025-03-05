"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    BarChart3,
    FileEdit,
    PlusCircle,
    Instagram,
    Twitter,
    Facebook,
    LogOut,
    ArrowRight,
    CheckCircle,
    Lock,
    Zap,
    X,
    Youtube,
    Layers,
    Info,
    Bell,
    Settings,
    User,
    LayoutDashboard,
    PieChart,
    Palette,
    MessageCircle,
    Inbox,
    BookOpen,
    CalendarClock,
    Pencil,
    Image,
    VideoIcon,
    Link as LinkIcon,
    MoreHorizontal,
    Search,
    Filter,
    Upload,
    Save,
    Hash
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
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";

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

// Content types
type ContentItem = {
    id: string;
    title: string;
    type: 'post' | 'video' | 'story' | 'reel';
    status: 'draft' | 'scheduled' | 'published';
    platforms: string[];
    createdAt: string;
    scheduledFor?: string;
    image?: string;
    content: string;
    tags: string[];
};

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
        <header className="border-b bg-card">
            <div className="flex h-16 items-center px-4 justify-between">
                <div className="md:hidden flex items-center gap-2">
                    <div className="text-xl font-bold">BrandSphereAI</div>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                    </Button>

                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>

                    <div className="md:hidden">
                        <Avatar>
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo123" alt="Demo User" />
                            <AvatarFallback>DU</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Sample content data
const sampleContentItems: ContentItem[] = [
    {
        id: "1",
        title: "New AI Marketing Trends",
        type: "post",
        status: "scheduled",
        platforms: ["facebook", "instagram", "twitter"],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=350&q=80",
        content: "Excited to share the top AI marketing trends for 2025! Our team has analyzed data from over 1,000 companies to identify the key strategies that will drive growth in the coming year. What trends are you most excited about? #AIMarketing #DigitalTrends #MarketingStrategy",
        tags: ["AI", "Marketing", "DigitalTrends"]
    },
    {
        id: "2",
        title: "Monday Motivation Quote",
        type: "post",
        status: "draft",
        platforms: ["instagram"],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1552508744-1696d4464960?w=500&h=500&q=80",
        content: "\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill\n\nWhat quote inspires you to start your week strong? #MondayMotivation #Success #Inspiration",
        tags: ["Motivation", "Quote", "Monday"]
    },
    {
        id: "3",
        title: "Product Line Sneak Peek",
        type: "video",
        status: "scheduled",
        platforms: ["facebook", "instagram", "youtube"],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=500&h=350&q=80",
        content: "We're so excited to give you a sneak peek of our newest product line! After months of development, we can't wait to share what we've been working on. Stay tuned for the full reveal next week! #NewProduct #ComingSoon #ExcitingNews",
        tags: ["Product", "Launch", "NewCollection"]
    },
    {
        id: "4",
        title: "E-commerce Tips and Tricks",
        type: "post",
        status: "published",
        platforms: ["facebook", "twitter"],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=350&q=80",
        content: "Just published our latest guide on e-commerce optimization! Learn how to boost your conversion rates, improve customer experience, and maximize sales. Check out the full article on our website. #Ecommerce #OnlineSales #BusinessTips",
        tags: ["Ecommerce", "Tips", "Business"]
    },
    {
        id: "5",
        title: "Behind the Scenes - Office Tour",
        type: "reel",
        status: "scheduled",
        platforms: ["instagram", "youtube"],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledFor: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=350&q=80",
        content: "Take a peek behind the scenes at our office! We're giving you a tour of where the magic happens. From our creative space to our cozy break room, see what makes our workspace special. #OfficeLife #BehindTheScenes #TeamCulture",
        tags: ["Office", "BehindTheScenes", "CompanyCulture"]
    }
];

// Content type badges
const ContentTypeBadge = ({ type }: { type: string }) => {
    switch (type) {
        case 'post':
            return <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Post</div>;
        case 'video':
            return <div className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Video</div>;
        case 'story':
            return <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">Story</div>;
        case 'reel':
            return <div className="px-2 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-medium">Reel</div>;
        default:
            return <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">{type}</div>;
    }
};

// Status badges
const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'draft':
            return <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Draft</div>;
        case 'scheduled':
            return <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Scheduled</div>;
        case 'published':
            return <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Published</div>;
        default:
            return <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">{status}</div>;
    }
};

// Format date function
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Platform icons function
const renderPlatformIcons = (platforms: string[]) => {
    return (
        <div className="flex space-x-1">
            {platforms.map(platform => {
                if (platform === 'facebook') return <Facebook key={platform} className="h-4 w-4 text-blue-600" />;
                if (platform === 'instagram') return <Instagram key={platform} className="h-4 w-4 text-pink-600" />;
                if (platform === 'youtube') return <Youtube key={platform} className="h-4 w-4 text-red-600" />;
                if (platform === 'twitter') return <Twitter key={platform} className="h-4 w-4 text-blue-400" />;
                return null;
            })}
        </div>
    );
};

// Content editor component
const ContentEditor = ({
    content,
    setContent,
    onClose
}: {
    content: ContentItem | null,
    setContent: (content: ContentItem) => void,
    onClose: () => void
}) => {
    const { toast } = useToast();
    const [editableContent, setEditableContent] = useState<ContentItem | null>(content);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(content?.platforms || []);
    const [contentText, setContentText] = useState(content?.content || '');
    const [tags, setTags] = useState<string[]>(content?.tags || []);
    const [newTag, setNewTag] = useState('');

    // Handle platform selection
    const togglePlatform = (platform: string) => {
        if (selectedPlatforms.includes(platform)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
        } else {
            setSelectedPlatforms([...selectedPlatforms, platform]);
        }
    };

    // Handle tag addition
    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    // Handle tag removal
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Handle save
    const handleSave = () => {
        const updatedContent = {
            ...editableContent!,
            platforms: selectedPlatforms,
            content: contentText,
            tags: tags
        };

        setContent(updatedContent);
        toast({
            title: "Content updated",
            description: "Your content has been saved successfully."
        });
        onClose();
    };

    if (!editableContent) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Content</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                        value={editableContent.title}
                        onChange={(e) => setEditableContent({ ...editableContent, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Content Type</label>
                    <div className="flex space-x-2">
                        <Button
                            variant={editableContent.type === 'post' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, type: 'post' })}
                        >
                            <FileEdit className="h-4 w-4 mr-1" /> Post
                        </Button>
                        <Button
                            variant={editableContent.type === 'video' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, type: 'video' })}
                        >
                            <VideoIcon className="h-4 w-4 mr-1" /> Video
                        </Button>
                        <Button
                            variant={editableContent.type === 'story' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, type: 'story' })}
                        >
                            <Image className="h-4 w-4 mr-1" /> Story
                        </Button>
                        <Button
                            variant={editableContent.type === 'reel' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, type: 'reel' })}
                        >
                            <VideoIcon className="h-4 w-4 mr-1" /> Reel
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <div className="flex space-x-2">
                        <Button
                            variant={editableContent.status === 'draft' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, status: 'draft' })}
                        >
                            Draft
                        </Button>
                        <Button
                            variant={editableContent.status === 'scheduled' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, status: 'scheduled' })}
                        >
                            Scheduled
                        </Button>
                        <Button
                            variant={editableContent.status === 'published' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEditableContent({ ...editableContent, status: 'published' })}
                        >
                            Published
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Platforms</label>
                    <div className="flex space-x-2">
                        <Button
                            variant={selectedPlatforms.includes('facebook') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => togglePlatform('facebook')}
                        >
                            <Facebook className="h-4 w-4 mr-1 text-blue-600" /> Facebook
                        </Button>
                        <Button
                            variant={selectedPlatforms.includes('instagram') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => togglePlatform('instagram')}
                        >
                            <Instagram className="h-4 w-4 mr-1 text-pink-600" /> Instagram
                        </Button>
                        <Button
                            variant={selectedPlatforms.includes('twitter') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => togglePlatform('twitter')}
                        >
                            <Twitter className="h-4 w-4 mr-1 text-blue-400" /> Twitter
                        </Button>
                        <Button
                            variant={selectedPlatforms.includes('youtube') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => togglePlatform('youtube')}
                        >
                            <Youtube className="h-4 w-4 mr-1 text-red-600" /> YouTube
                        </Button>
                    </div>
                </div>

                {editableContent.status === 'scheduled' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Schedule Date</label>
                        <Input
                            type="datetime-local"
                            value={new Date(editableContent.scheduledFor || Date.now()).toISOString().slice(0, 16)}
                            onChange={(e) => setEditableContent({ ...editableContent, scheduledFor: new Date(e.target.value).toISOString() })}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea
                        className="w-full min-h-[200px] border rounded-md p-2"
                        value={contentText}
                        onChange={(e) => setContentText(e.target.value)}
                        placeholder="Write your content here..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    {editableContent.image ? (
                        <div className="relative">
                            <img
                                src={editableContent.image}
                                alt={editableContent.title}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setEditableContent({ ...editableContent, image: undefined })}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Drag and drop an image or click to upload</p>
                            <Button variant="outline" size="sm" className="mt-2">
                                Choose File
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <div className="flex items-center mb-2">
                        <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            className="mr-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                        />
                        <Button variant="outline" size="sm" onClick={addTag}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <div key={tag} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
                                <Hash className="h-3 w-3" />
                                {tag}
                                <button onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Save Changes
                </Button>
            </div>
        </div>
    );
};

export default function DemoContentPage() {
    const router = useRouter();
    const [user, setUser] = useState<DemoUser | null>(null);
    const [mounted, setMounted] = useState(false);
    const [contentItems, setContentItems] = useState<ContentItem[]>(sampleContentItems);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [showContentEditor, setShowContentEditor] = useState(false);
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [ideaFromUrl, setIdeaFromUrl] = useState<string | null>(null);

    useEffect(() => {
        // Set mounted to true when component has mounted
        setMounted(true);

        // Get idea from URL if available
        const idea = searchParams.get('idea');
        if (idea) {
            setIdeaFromUrl(idea);

            // Create a new content item from the idea
            const newContent: ContentItem = {
                id: Date.now().toString(),
                title: idea,
                type: "post",
                status: "draft",
                platforms: ["instagram", "facebook", "twitter"],
                createdAt: new Date().toISOString(),
                content: `Here's a draft based on your idea: "${idea}".\n\nExpand on this with your specific content.`,
                tags: idea.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 3)
            };

            setSelectedContent(newContent);
            setShowContentEditor(true);
        }

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
    }, [router, searchParams]);

    // If component not mounted yet, show nothing
    if (!mounted) return null;

    // If user not logged in, show nothing (we're redirecting anyway)
    if (!user) return null;

    // Filter content based on active tab and search query
    const filteredContent = contentItems.filter(item => {
        const matchesTab = activeTab === 'all' || item.status === activeTab;
        const matchesSearch = searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    // Handle new content creation
    const handleCreateContent = () => {
        const newContent: ContentItem = {
            id: Date.now().toString(),
            title: "New Content",
            type: "post",
            status: "draft",
            platforms: [],
            createdAt: new Date().toISOString(),
            content: "",
            tags: []
        };

        setSelectedContent(newContent);
        setShowContentEditor(true);
    };

    // Handle content editing
    const handleEditContent = (content: ContentItem) => {
        setSelectedContent(content);
        setShowContentEditor(true);
    };

    // Handle content saving
    const handleSaveContent = (content: ContentItem) => {
        const existingIndex = contentItems.findIndex(item => item.id === content.id);

        if (existingIndex >= 0) {
            // Update existing content
            const updatedItems = [...contentItems];
            updatedItems[existingIndex] = content;
            setContentItems(updatedItems);
        } else {
            // Add new content
            setContentItems([content, ...contentItems]);
        }

        setSelectedContent(null);
        setShowContentEditor(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <DemoSidebar activeItem="content" />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top navigation */}
                <DemoHeader />

                {/* Demo notice */}
                <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>Premium Demo Mode</span>
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {showContentEditor ? (
                        <Card>
                            <CardContent className="pt-6">
                                <ContentEditor
                                    content={selectedContent}
                                    setContent={handleSaveContent}
                                    onClose={() => {
                                        setSelectedContent(null);
                                        setShowContentEditor(false);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Page heading */}
                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Content Management</h1>
                                    <p className="text-muted-foreground">Create, schedule, and manage your social media content</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Button className="gap-2" onClick={handleCreateContent}>
                                        <PlusCircle className="h-4 w-4" />
                                        Create New Content
                                    </Button>
                                </div>
                            </div>

                            {/* Filters and search */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search content..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="max-w-md"
                                    />
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                                    <TabsList>
                                        <TabsTrigger value="all">All</TabsTrigger>
                                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                                        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                                        <TabsTrigger value="published">Published</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Content list */}
                            <div className="space-y-4">
                                {filteredContent.length === 0 ? (
                                    <div className="border rounded-lg p-8 text-center">
                                        <FileEdit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No content found</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {searchQuery
                                                ? "No content matches your search criteria. Try adjusting your filters."
                                                : "You don't have any content yet. Create your first content to get started."}
                                        </p>
                                        <Button onClick={handleCreateContent}>Create Content</Button>
                                    </div>
                                ) : (
                                    filteredContent.map(item => (
                                        <Card key={item.id} className="overflow-hidden">
                                            <div className="flex flex-col md:flex-row">
                                                {item.image && (
                                                    <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 p-4">
                                                    <div className="flex flex-col md:flex-row justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-bold">{item.title}</h3>
                                                            <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                                                <ContentTypeBadge type={item.type} />
                                                                <StatusBadge status={item.status} />
                                                                <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium flex items-center">
                                                                    {renderPlatformIcons(item.platforms)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                                                            <Button variant="outline" size="sm" onClick={() => handleEditContent(item)}>
                                                                <Pencil className="h-4 w-4 mr-1" /> Edit
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <p className="text-muted-foreground mt-2 line-clamp-2">{item.content}</p>

                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {item.tags.map(tag => (
                                                            <div key={tag} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
                                                                <Hash className="h-3 w-3" />
                                                                {tag}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                                                        <div>Created: {formatDate(item.createdAt)}</div>
                                                        {item.scheduledFor && (
                                                            <div>Scheduled for: {formatDate(item.scheduledFor)}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
} 