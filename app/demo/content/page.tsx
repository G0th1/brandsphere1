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
    Hash,
    Copy,
    Trash2
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
                    <Button variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                        <Link href="/demo/dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                    <Button variant={activeItem === 'content' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                        <Link href="/demo/content">
                            <FileEdit className="h-4 w-4" />
                            Content
                        </Link>
                    </Button>
                    <Button variant={activeItem === 'calendar' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                        <Link href="/demo/calendar">
                            <CalendarClock className="h-4 w-4" />
                            Calendar
                        </Link>
                    </Button>
                    <Button variant={activeItem === 'insights' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                        <Link href="/demo/insights">
                            <PieChart className="h-4 w-4" />
                            Insights
                        </Link>
                    </Button>
                    <Button variant={activeItem === 'profile' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                        <Link href="/demo/profile">
                            <User className="h-4 w-4" />
                            User Profile
                        </Link>
                    </Button>
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
    const [editedContent, setEditedContent] = useState<ContentItem>(content || {
        id: "",
        title: "",
        type: "post",
        status: "draft",
        platforms: [],
        createdAt: new Date().toISOString(),
        content: "",
        tags: []
    });
    const [newTag, setNewTag] = useState('');
    const [showAIOptions, setShowAIOptions] = useState(false);

    // Hantera plattformstogglar
    const togglePlatform = (platform: string) => {
        const platforms = editedContent.platforms || [];

        if (platforms.includes(platform)) {
            setEditedContent({
                ...editedContent,
                platforms: platforms.filter(p => p !== platform)
            });
        } else {
            setEditedContent({
                ...editedContent,
                platforms: [...platforms, platform]
            });
        }
    };

    // Lägg till tagg
    const addTag = () => {
        if (newTag.trim() === '') return;

        if (!editedContent.tags.includes(newTag.trim())) {
            setEditedContent({
                ...editedContent,
                tags: [...editedContent.tags, newTag.trim()]
            });
        }

        setNewTag('');
    };

    // Ta bort tagg
    const removeTag = (tagToRemove: string) => {
        setEditedContent({
            ...editedContent,
            tags: editedContent.tags.filter(tag => tag !== tagToRemove)
        });
    };

    // Spara ändringar
    const handleSave = () => {
        setContent(editedContent);
        toast({
            title: "Content updated",
            description: "Your content has been saved successfully."
        });
        onClose();
    };

    return (
        <div className="bg-card rounded-lg shadow-lg border max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    {content?.id?.startsWith('new') ? 'Skapa nytt innehåll' : 'Redigera innehåll'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    {/* Titel */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Titel</Label>
                        <Input
                            id="title"
                            value={editedContent.title}
                            onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                            placeholder="Ange en titel för ditt inlägg"
                        />
                    </div>

                    {/* Typ */}
                    <div className="space-y-2">
                        <Label>Innehållstyp</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant={editedContent.type === 'post' ? 'default' : 'outline'}
                                onClick={() => setEditedContent({ ...editedContent, type: 'post' })}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <FileEdit className="h-4 w-4" />
                                Inlägg
                            </Button>
                            <Button
                                type="button"
                                variant={editedContent.type === 'video' ? 'default' : 'outline'}
                                onClick={() => setEditedContent({ ...editedContent, type: 'video' })}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <VideoIcon className="h-4 w-4" />
                                Video
                            </Button>
                            <Button
                                type="button"
                                variant={editedContent.type === 'story' ? 'default' : 'outline'}
                                onClick={() => setEditedContent({ ...editedContent, type: 'story' })}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <Image className="h-4 w-4" />
                                Story
                            </Button>
                            <Button
                                type="button"
                                variant={editedContent.type === 'reel' ? 'default' : 'outline'}
                                onClick={() => setEditedContent({ ...editedContent, type: 'reel' })}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <VideoIcon className="h-4 w-4" />
                                Reel
                            </Button>
                        </div>
                    </div>

                    {/* Plattformar */}
                    <div className="space-y-2">
                        <Label>Plattformar</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant={editedContent.platforms?.includes('instagram') ? 'default' : 'outline'}
                                onClick={() => togglePlatform('instagram')}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <Instagram className="h-4 w-4" />
                                Instagram
                            </Button>
                            <Button
                                type="button"
                                variant={editedContent.platforms?.includes('facebook') ? 'default' : 'outline'}
                                onClick={() => togglePlatform('facebook')}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <Facebook className="h-4 w-4" />
                                Facebook
                            </Button>
                            <Button
                                type="button"
                                variant={editedContent.platforms?.includes('twitter') ? 'default' : 'outline'}
                                onClick={() => togglePlatform('twitter')}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <Twitter className="h-4 w-4" />
                                Twitter
                            </Button>
                            <Button
                                type="button"
                                variant={editedContent.platforms?.includes('youtube') ? 'default' : 'outline'}
                                onClick={() => togglePlatform('youtube')}
                                className="flex items-center gap-1"
                                size="sm"
                            >
                                <Youtube className="h-4 w-4" />
                                YouTube
                            </Button>
                        </div>
                    </div>

                    {/* Innehåll */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="content">Innehåll</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-yellow-500"
                                onClick={() => setShowAIOptions(!showAIOptions)}
                            >
                                <Zap className="h-4 w-4" />
                                AI-assistent
                            </Button>
                        </div>
                        <Textarea
                            id="content"
                            value={editedContent.content}
                            onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
                            placeholder="Skriv ditt inlägg här..."
                            rows={6}
                        />
                    </div>

                    {/* Taggar */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Taggar</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="tags"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Lägg till tagg..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addTag}
                                size="icon"
                            >
                                <Hash className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {editedContent.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    #{tag}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeTag(tag)}
                                        size="icon"
                                        className="h-4 w-4 p-0 ml-1"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t flex justify-between">
                <Button variant="outline" onClick={onClose}>Avbryt</Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowAIOptions(true)}
                        className="flex items-center gap-1"
                    >
                        <Zap className="h-4 w-4 text-yellow-500" />
                        AI-generera innehåll
                    </Button>
                    <Button onClick={handleSave}>Spara</Button>
                </div>
            </div>
        </div>
    );
};

export default function DemoContentPage() {
    const router = useRouter();
    const [contentItems, setContentItems] = useState<ContentItem[]>(sampleContentItems);
    const [activeTab, setActiveTab] = useState('all');
    const [showEditor, setShowEditor] = useState(false);
    const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
    const [user, setUser] = useState<DemoUser | null>(null);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        setMounted(true);

        // Hämta demo-användardata från localStorage
        const storedUser = localStorage.getItem('demoUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Om ingen demo-användare finns, omdirigera till startsidan
            router.push('/');
        }
    }, []);

    // Filtrera innehåll baserat på aktiv flik och sökning
    const filteredContent = contentItems.filter(item => {
        const matchesTab = activeTab === 'all' || item.status === activeTab;
        const matchesSearch = searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesTab && matchesSearch;
    });

    // Hantera skapande av nytt innehåll
    const handleCreateContent = () => {
        const newContent: ContentItem = {
            id: `new-${Date.now()}`,
            title: "Nytt inlägg",
            type: "post",
            status: "draft",
            platforms: ["instagram"],
            createdAt: new Date().toISOString(),
            content: "",
            tags: [],
        };

        setCurrentContent(newContent);
        setShowEditor(true);
    };

    // Hantera redigering av befintligt innehåll
    const handleEditContent = (content: ContentItem) => {
        setCurrentContent(content);
        setShowEditor(true);
    };

    // Spara innehåll (nytt eller redigerat)
    const handleSaveContent = (content: ContentItem) => {
        // Kontrollera om det är nytt innehåll eller uppdatering
        if (contentItems.find(item => item.id === content.id)) {
            // Uppdatera befintligt innehåll
            setContentItems(contentItems.map(item =>
                item.id === content.id ? content : item
            ));
            toast({
                title: "Innehåll uppdaterat",
                description: "Ditt inlägg har uppdaterats.",
            });
        } else {
            // Lägg till nytt innehåll
            setContentItems([content, ...contentItems]);
            toast({
                title: "Innehåll skapat",
                description: "Ditt nya inlägg har skapats.",
            });
        }

        setShowEditor(false);
        setCurrentContent(null);
    };

    // Hantera radering av innehåll
    const handleDeleteContent = (id: string) => {
        setContentItems(contentItems.filter(item => item.id !== id));
        toast({
            title: "Innehåll raderat",
            description: "Inlägget har tagits bort.",
        });
    };

    // Hantera statusändring (schemalägg/publicera)
    const handleStatusChange = (id: string, newStatus: 'draft' | 'scheduled' | 'published') => {
        setContentItems(contentItems.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, status: newStatus };

                // Om statusen ändras till scheduled och vi inte har ett schemalagt datum
                if (newStatus === 'scheduled' && !item.scheduledFor) {
                    // Schemalägg för 24 timmar framåt
                    updatedItem.scheduledFor = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                }

                return updatedItem;
            }
            return item;
        }));

        toast({
            title: newStatus === 'published' ? "Innehåll publicerat" :
                newStatus === 'scheduled' ? "Innehåll schemalagt" : "Sparat som utkast",
            description: newStatus === 'published' ? "Inlägget har publicerats (demo)." :
                newStatus === 'scheduled' ? "Inlägget har schemalagts för publicering." :
                    "Inlägget har sparats som utkast.",
        });
    };

    // Generera AI-förslag
    const generateAISuggestions = () => {
        setAiGenerating(true);
        setShowAIAssistant(true);

        // Simulera laddningstid för AI-generering
        setTimeout(() => {
            const suggestions = [
                "10 sätt att öka engagemanget på Instagram med hjälp av BrandSphereAI",
                "Hur framgångsrika företag förbereder sig för högsäsong",
                "De bästa hashtags inom din bransch den här veckan",
                "Bakom kulisserna - presentera ditt team på ett personligt sätt",
                "Kundnöjdhetsundersökning - fråga följare vad de vill se mer av"
            ];
            setAiSuggestions(suggestions);
            setAiGenerating(false);
        }, 2000);
    };

    // Använd AI-förslag
    const useAISuggestion = (suggestion: string) => {
        if (!currentContent) return;

        setSelectedSuggestion(suggestion);

        // Simulera AI som skapar innehåll baserat på förslaget
        setTimeout(() => {
            const generatedContent = `${suggestion}\n\nHär är lite AI-genererat innehåll baserat på din valda rubrik. Detta skulle vara en mycket längre och mer detaljerad text i den riktiga produkten, med specifika förslag och idéer för ditt sociala medieinlägg.`;

            const updatedContent = {
                ...currentContent,
                title: suggestion,
                content: generatedContent,
                tags: ['AI-genererat', 'BrandSphereAI', 'Sociala Medier'],
            };

            setCurrentContent(updatedContent);
            setShowAIAssistant(false);
            setSelectedSuggestion('');

            toast({
                title: "AI-genererat innehåll tillagt",
                description: "Innehållet har genererats av vår AI (demo).",
            });
        }, 1500);
    };

    // Schemalägg flera inlägg
    const bulkSchedule = () => {
        const draftItems = contentItems.filter(item => item.status === 'draft');

        if (draftItems.length === 0) {
            toast({
                title: "Inga utkast att schemalägga",
                description: "Du har inga utkaststinlägg att schemalägga.",
                variant: "destructive"
            });
            return;
        }

        // Schemalägg varje utkast med ett jämnt fördelat tidsintervall över nästa vecka
        const updatedItems = contentItems.map(item => {
            if (item.status === 'draft') {
                // Beräkna ett slumpmässigt datum inom nästa vecka
                const daysToAdd = Math.floor(Math.random() * 7) + 1;
                const hoursToAdd = Math.floor(Math.random() * 12) + 9; // 9 AM - 9 PM

                const newDate = new Date();
                newDate.setDate(newDate.getDate() + daysToAdd);
                newDate.setHours(hoursToAdd, 0, 0, 0);

                return {
                    ...item,
                    status: 'scheduled' as const,
                    scheduledFor: newDate.toISOString()
                };
            }
            return item;
        });

        setContentItems(updatedItems);

        toast({
            title: "Inlägg schemalagda",
            description: `${draftItems.length} inlägg har schemalagts för publicering.`,
        });
    };

    // Duplicera innehåll
    const duplicateContent = (content: ContentItem) => {
        const newContent: ContentItem = {
            ...content,
            id: `duplicate-${Date.now()}`,
            title: `Kopia av: ${content.title}`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            scheduledFor: undefined
        };

        setContentItems([newContent, ...contentItems]);

        toast({
            title: "Innehåll duplicerat",
            description: "En kopia av inlägget har skapats.",
        });
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen flex">
            <DemoSidebar activeItem="content" />

            <div className="flex-1 flex flex-col">
                <DemoHeader />

                <main className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Innehållshantering</h1>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={bulkSchedule}
                                className="hidden md:flex items-center gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                Schemalägg alla utkast
                            </Button>
                            <Button onClick={handleCreateContent} className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Skapa innehåll
                            </Button>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList>
                                    <TabsTrigger value="all">Alla</TabsTrigger>
                                    <TabsTrigger value="draft">Utkast</TabsTrigger>
                                    <TabsTrigger value="scheduled">Schemalagda</TabsTrigger>
                                    <TabsTrigger value="published">Publicerade</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Sök innehåll..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {filteredContent.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredContent.map(content => (
                                <Card key={content.id} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {content.image && (
                                            <div className="w-full md:w-48 h-48 overflow-hidden bg-muted">
                                                <img
                                                    src={content.image}
                                                    alt={content.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <ContentTypeBadge type={content.type} />
                                                        <StatusBadge status={content.status} />
                                                    </div>
                                                    <h3 className="text-lg font-semibold">{content.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditContent(content)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => duplicateContent(content)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteContent(content.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <p className="text-muted-foreground line-clamp-2">{content.content}</p>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-1">
                                                {content.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="mt-4 flex flex-wrap justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-sm text-muted-foreground">
                                                        Skapad: {formatDate(content.createdAt)}
                                                    </div>
                                                    {content.scheduledFor && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Schemalagd: {formatDate(content.scheduledFor)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-2 md:mt-0">
                                                    {renderPlatformIcons(content.platforms)}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-2">
                                                {content.status === 'draft' && (
                                                    <>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(content.id, 'scheduled')}
                                                        >
                                                            Schemalägg
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(content.id, 'published')}
                                                        >
                                                            Publicera nu
                                                        </Button>
                                                    </>
                                                )}
                                                {content.status === 'scheduled' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(content.id, 'draft')}
                                                        >
                                                            Avbryt schemaläggning
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(content.id, 'published')}
                                                        >
                                                            Publicera nu
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileEdit className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Inga inlägg hittades</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? 'Ingen träff på din sökning. Prova med något annat.' : 'Börja med att skapa ditt första inlägg.'}
                            </p>
                            <Button onClick={handleCreateContent}>Skapa innehåll</Button>
                        </div>
                    )}
                </main>
            </div>

            {/* Innehållseditor */}
            {showEditor && currentContent && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <ContentEditor
                        content={currentContent}
                        setContent={handleSaveContent}
                        onClose={() => {
                            setShowEditor(false);
                            setCurrentContent(null);
                            setShowAIAssistant(false);
                        }}
                    />

                    {/* AI-assistent panel */}
                    {showAIAssistant && (
                        <div className="absolute top-0 right-0 bottom-0 w-full md:w-96 bg-card border-l shadow-xl p-4 overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    AI-innehållsassistent
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowAIAssistant(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {aiGenerating ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                    <p className="text-center text-muted-foreground">
                                        Genererar innehållsförslag med AI...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Välj ett av våra AI-genererade innehållsförslag för att komma igång snabbt.
                                    </p>

                                    <div className="space-y-2">
                                        {aiSuggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                onClick={() => useAISuggestion(suggestion)}
                                                className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedSuggestion === suggestion
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'hover:bg-accent'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium">{suggestion}</p>
                                                    {selectedSuggestion === suggestion && (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => generateAISuggestions()}
                                        >
                                            Generera fler förslag
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 