"use client";

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    MoreVertical,
    Edit2,
    Trash2,
    Calendar,
    Image as ImageIcon,
    Plus,
    Clock,
    Filter,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    SortAsc,
    SortDesc
} from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';

// Types
interface Post {
    id: string;
    title: string;
    content: string;
    scheduledFor: Date;
    platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn';
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    imageUrl?: string;
    engagement?: {
        likes: number;
        comments: number;
        shares: number;
    };
}

interface PostFormValues {
    title: string;
    content: string;
    scheduledFor: string;
    platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn';
    imageUrl?: string;
}

// Mock data
const MOCK_POSTS: Post[] = [
    {
        id: '1',
        title: 'New Product Launch',
        content: 'Excited to announce our latest product! #innovation #launch',
        scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
        platform: 'Instagram',
        status: 'scheduled',
        imageUrl: '/images/mock/product-launch.jpg',
        engagement: {
            likes: 0,
            comments: 0,
            shares: 0
        }
    },
    {
        id: '2',
        title: 'Customer Success Story',
        content: 'Hear how our product helped @CustomerXYZ increase productivity by 200%',
        scheduledFor: new Date(Date.now() + 172800000), // Day after tomorrow
        platform: 'LinkedIn',
        status: 'draft',
        engagement: {
            likes: 0,
            comments: 0,
            shares: 0
        }
    },
    {
        id: '3',
        title: 'Weekly Tips',
        content: '5 ways to improve your social media strategy this week: 1. Consistency 2. Engage with followers 3. Use analytics 4. Create valuable content 5. Leverage trends',
        scheduledFor: new Date(Date.now() - 86400000), // Yesterday
        platform: 'Twitter',
        status: 'published',
        engagement: {
            likes: 45,
            comments: 8,
            shares: 12
        }
    },
];

const getPlatformIcon = (platform: string) => {
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

const getPlatformColor = (platform: string) => {
    switch (platform) {
        case 'Instagram':
            return 'bg-gradient-to-r from-purple-500 to-pink-500';
        case 'Twitter':
            return 'bg-sky-500';
        case 'Facebook':
            return 'bg-blue-600';
        case 'LinkedIn':
            return 'bg-blue-700';
        default:
            return 'bg-gray-500';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'published':
            return 'bg-green-500';
        case 'scheduled':
            return 'bg-blue-500';
        case 'draft':
            return 'bg-gray-500';
        case 'failed':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

// Format date for readability
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);
};

export function PostManagement() {
    const { toast } = useToast();
    const { isDemoActive } = useSubscription();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [formValues, setFormValues] = useState<PostFormValues>({
        title: '',
        content: '',
        scheduledFor: '',
        platform: 'Instagram'
    });
    const [filter, setFilter] = useState({
        platform: 'all',
        status: 'all'
    });
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Fetch posts (using mock data for demo)
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // In a real app, this would be an API call
                setIsLoading(true);
                // Simulate API delay
                setTimeout(() => {
                    setPosts(MOCK_POSTS);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching posts:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load posts',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [toast]);

    // Filter and sort posts
    const filteredPosts = posts
        .filter(post => {
            if (filter.platform !== 'all' && post.platform !== filter.platform) return false;
            if (filter.status !== 'all' && post.status !== filter.status) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'asc'
                    ? a.scheduledFor.getTime() - b.scheduledFor.getTime()
                    : b.scheduledFor.getTime() - a.scheduledFor.getTime();
            } else if (sortBy === 'engagement' && a.engagement && b.engagement) {
                const aTotal = a.engagement.likes + a.engagement.comments + a.engagement.shares;
                const bTotal = b.engagement.likes + b.engagement.comments + b.engagement.shares;
                return sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
            }
            return 0;
        });

    // Handle opening create modal
    const handleCreatePost = () => {
        setFormValues({
            title: '',
            content: '',
            scheduledFor: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
            platform: 'Instagram'
        });
        setIsCreateModalOpen(true);
    };

    // Handle opening edit modal
    const handleEditPost = (post: Post) => {
        setCurrentPost(post);
        setFormValues({
            title: post.title,
            content: post.content,
            scheduledFor: new Date(post.scheduledFor).toISOString().slice(0, 16),
            platform: post.platform,
            imageUrl: post.imageUrl
        });
        setIsEditModalOpen(true);
    };

    // Handle opening delete modal
    const handleDeletePost = (post: Post) => {
        setCurrentPost(post);
        setIsDeleteModalOpen(true);
    };

    // Handle saving a post (create or edit)
    const handleSavePost = (isEdit = false) => {
        if (isDemoActive) {
            // In demo mode, just show a success message
            toast({
                title: isEdit ? 'Post Updated' : 'Post Created',
                description: `Your post has been ${isEdit ? 'updated' : 'created'} successfully.`,
            });

            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            return;
        }

        // In a real app, this would be an API call
        try {
            if (isEdit && currentPost) {
                // Update existing post
                const updatedPosts = posts.map(post =>
                    post.id === currentPost.id
                        ? {
                            ...post,
                            title: formValues.title,
                            content: formValues.content,
                            scheduledFor: new Date(formValues.scheduledFor),
                            platform: formValues.platform,
                            imageUrl: formValues.imageUrl
                        }
                        : post
                );
                setPosts(updatedPosts);
                toast({
                    title: 'Post Updated',
                    description: 'Your post has been updated successfully.',
                });
            } else {
                // Create new post
                const newPost: Post = {
                    id: Date.now().toString(), // Use real IDs in production
                    title: formValues.title,
                    content: formValues.content,
                    scheduledFor: new Date(formValues.scheduledFor),
                    platform: formValues.platform,
                    status: 'scheduled',
                    imageUrl: formValues.imageUrl,
                    engagement: { likes: 0, comments: 0, shares: 0 }
                };
                setPosts([...posts, newPost]);
                toast({
                    title: 'Post Created',
                    description: 'Your post has been created successfully.',
                });
            }

            // Close modals
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error saving post:', error);
            toast({
                title: 'Error',
                description: `Failed to ${isEdit ? 'update' : 'create'} post`,
                variant: 'destructive',
            });
        }
    };

    // Handle deleting a post
    const handleConfirmDelete = () => {
        if (!currentPost) return;

        if (isDemoActive) {
            // In demo mode, just show a success message
            toast({
                title: 'Post Deleted',
                description: 'Your post has been deleted successfully.',
            });

            setIsDeleteModalOpen(false);
            return;
        }

        // In a real app, this would be an API call
        try {
            const updatedPosts = posts.filter(post => post.id !== currentPost.id);
            setPosts(updatedPosts);
            toast({
                title: 'Post Deleted',
                description: 'Your post has been deleted successfully.',
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting post:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete post',
                variant: 'destructive',
            });
        }
    };

    // Handle input changes in form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Handle select changes in form
    const handleSelectChange = (name: string, value: string) => {
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Content Management</h2>
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => setSortBy('date')}>
                        <Clock className="h-4 w-4" />
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>

                    {/* Filter dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Filter Posts</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <div className="p-2">
                                <Label htmlFor="platform-filter">Platform</Label>
                                <Select
                                    value={filter.platform}
                                    onValueChange={(value) => setFilter({ ...filter, platform: value })}
                                >
                                    <SelectTrigger id="platform-filter" className="mt-1">
                                        <SelectValue placeholder="All Platforms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Platforms</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Twitter">Twitter</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-2">
                                <Label htmlFor="status-filter">Status</Label>
                                <Select
                                    value={filter.status}
                                    onValueChange={(value) => setFilter({ ...filter, status: value })}
                                >
                                    <SelectTrigger id="status-filter" className="mt-1">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleCreatePost} className="flex items-center gap-1">
                        <Plus className="h-4 w-4" /> Create Post
                    </Button>
                </div>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                </TabsList>

                {/* All tabs share the same content with different filters */}
                {["upcoming", "published", "drafts", "all"].map((tab) => (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                        {isLoading ? (
                            // Loading state
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
                                            <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                            <div className="h-4 bg-muted rounded w-2/3"></div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="h-5 bg-muted rounded w-1/4"></div>
                                                <div className="h-8 bg-muted rounded w-8"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredPosts.filter(post => {
                            // Filter based on tab
                            if (tab === 'upcoming') return post.status === 'scheduled';
                            if (tab === 'published') return post.status === 'published';
                            if (tab === 'drafts') return post.status === 'draft';
                            return true; // 'all' tab
                        }).length === 0 ? (
                            // Empty state
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="py-10">
                                        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No posts found</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {tab === 'upcoming' && "You don't have any upcoming posts scheduled."}
                                            {tab === 'published' && "You don't have any published posts yet."}
                                            {tab === 'drafts' && "You don't have any drafts saved."}
                                            {tab === 'all' && "You haven't created any posts yet."}
                                        </p>
                                        <Button onClick={handleCreatePost} className="flex items-center gap-1 mx-auto">
                                            <Plus className="h-4 w-4" /> Create Post
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            // Post list
                            <div className="space-y-4">
                                {filteredPosts
                                    .filter(post => {
                                        // Filter based on tab
                                        if (tab === 'upcoming') return post.status === 'scheduled';
                                        if (tab === 'published') return post.status === 'published';
                                        if (tab === 'drafts') return post.status === 'draft';
                                        return true; // 'all' tab
                                    })
                                    .map((post) => (
                                        <Card key={post.id} className="overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col sm:flex-row">
                                                    {/* Platform indicator */}
                                                    <div className={`sm:w-16 h-16 ${getPlatformColor(post.platform)} flex items-center justify-center text-white`}>
                                                        {getPlatformIcon(post.platform)}
                                                    </div>

                                                    {/* Post content */}
                                                    <div className="flex-1 p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-medium">{post.title}</h3>
                                                                <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                                            </div>

                                                            {/* Actions menu */}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                                                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDeletePost(post)} className="text-destructive">
                                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        {/* Post metadata */}
                                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                                            <div className="flex items-center">
                                                                <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(post.scheduledFor)}
                                                                </span>
                                                            </div>
                                                            <Badge variant="outline" className={`text-white ${getStatusColor(post.status)}`}>
                                                                {post.status}
                                                            </Badge>

                                                            {/* Engagement data for published posts */}
                                                            {post.status === 'published' && post.engagement && (
                                                                <div className="flex gap-2 ml-auto">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {post.engagement.likes} likes
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {post.engagement.comments} comments
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            {/* Create Post Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                        <DialogDescription>
                            Create and schedule a new post for your social media accounts.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Post Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formValues.title}
                                onChange={handleInputChange}
                                placeholder="Enter a title for your post"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Post Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formValues.content}
                                onChange={handleInputChange}
                                placeholder="What do you want to share?"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Select
                                    value={formValues.platform}
                                    onValueChange={(value) => handleSelectChange('platform', value)}
                                >
                                    <SelectTrigger id="platform">
                                        <SelectValue placeholder="Select Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Twitter">Twitter</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledFor">Schedule For</Label>
                                <Input
                                    id="scheduledFor"
                                    name="scheduledFor"
                                    type="datetime-local"
                                    value={formValues.scheduledFor}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formValues.imageUrl || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <Button variant="outline" size="icon">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleSavePost(false)}>
                            Create Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Post Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>
                            Make changes to your post and schedule.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Post Title</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={formValues.title}
                                onChange={handleInputChange}
                                placeholder="Enter a title for your post"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-content">Post Content</Label>
                            <Textarea
                                id="edit-content"
                                name="content"
                                value={formValues.content}
                                onChange={handleInputChange}
                                placeholder="What do you want to share?"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-platform">Platform</Label>
                                <Select
                                    value={formValues.platform}
                                    onValueChange={(value) => handleSelectChange('platform', value)}
                                >
                                    <SelectTrigger id="edit-platform">
                                        <SelectValue placeholder="Select Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Twitter">Twitter</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-scheduledFor">Schedule For</Label>
                                <Input
                                    id="edit-scheduledFor"
                                    name="scheduledFor"
                                    type="datetime-local"
                                    value={formValues.scheduledFor}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="edit-imageUrl"
                                    name="imageUrl"
                                    value={formValues.imageUrl || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <Button variant="outline" size="icon">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleSavePost(true)}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {currentPost && (
                        <div className="py-4">
                            <p className="font-medium">{currentPost.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{currentPost.content}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Delete Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PostManagement; 