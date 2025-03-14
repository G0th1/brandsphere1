"use client";

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Clock,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, getDay, parseISO, isSameDay, addDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
}

interface PostFormValues {
    title: string;
    content: string;
    scheduledFor: string;
    platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn';
    imageUrl?: string;
}

// Mock data - reusing from post-management.tsx
const MOCK_POSTS: Post[] = [
    {
        id: '1',
        title: 'New Product Launch',
        content: 'Excited to announce our latest product! #innovation #launch',
        scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
        platform: 'Instagram',
        status: 'scheduled',
        imageUrl: '/images/mock/product-launch.jpg'
    },
    {
        id: '2',
        title: 'Customer Success Story',
        content: 'Hear how our product helped @CustomerXYZ increase productivity by 200%',
        scheduledFor: new Date(Date.now() + 172800000), // Day after tomorrow
        platform: 'LinkedIn',
        status: 'draft',
    },
    {
        id: '3',
        title: 'Weekly Tips',
        content: '5 ways to improve your social media strategy this week',
        scheduledFor: new Date(Date.now() + 345600000), // 4 days from now
        platform: 'Twitter',
        status: 'scheduled',
    },
    {
        id: '4',
        title: 'Industry News Roundup',
        content: 'The most important industry updates from this week',
        scheduledFor: new Date(Date.now() + 518400000), // 6 days from now
        platform: 'Facebook',
        status: 'scheduled',
    },
    {
        id: '5',
        title: 'Team Spotlight: Marketing',
        content: 'Meet the awesome people behind our marketing efforts!',
        scheduledFor: new Date(Date.now() + 432000000), // 5 days from now
        platform: 'Instagram',
        status: 'scheduled',
    }
];

// Helper functions for platform UI
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

const getPlatformTextColor = (platform: string) => {
    switch (platform) {
        case 'Instagram':
            return 'text-pink-600';
        case 'Twitter':
            return 'text-sky-500';
        case 'Facebook':
            return 'text-blue-600';
        case 'LinkedIn':
            return 'text-blue-700';
        default:
            return 'text-gray-500';
    }
};

// Format time for display
const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
};

export function ContentCalendar() {
    const { toast } = useToast();
    const { isDemoActive } = useSubscription();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [formValues, setFormValues] = useState<PostFormValues>({
        title: '',
        content: '',
        scheduledFor: '',
        platform: 'Instagram'
    });
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [filterPlatform, setFilterPlatform] = useState('all');

    // Generate calendar days based on current week start date
    useEffect(() => {
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
        setCalendarDays(days);
    }, [currentWeekStart]);

    // Fetch posts (using mock data for demo)
    useEffect(() => {
        const fetchPosts = async () => {
            try {
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

    // Filter posts for the calendar
    const filteredPosts = posts.filter(post => {
        if (post.status !== 'scheduled') return false;
        if (filterPlatform !== 'all' && post.platform !== filterPlatform) return false;
        return true;
    });

    // Navigate to previous week
    const goToPreviousWeek = () => {
        setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    };

    // Navigate to next week
    const goToNextWeek = () => {
        setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    };

    // Open create post modal with pre-selected date
    const handleCreatePost = (date?: Date) => {
        const scheduledDate = date || new Date();
        setSelectedDate(scheduledDate);

        // Initialize form with default values and selected date
        setFormValues({
            title: '',
            content: '',
            scheduledFor: scheduledDate.toISOString().slice(0, 16), // Format for datetime-local input
            platform: 'Instagram'
        });

        setIsCreateModalOpen(true);
    };

    // Open edit post modal
    const handleEditPost = (post: Post) => {
        setCurrentPost(post);
        setFormValues({
            title: post.title,
            content: post.content,
            scheduledFor: post.scheduledFor.toISOString().slice(0, 16),
            platform: post.platform,
            imageUrl: post.imageUrl
        });
        setIsEditModalOpen(true);
    };

    // Open delete post modal
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

            // If we're creating a new post in demo mode, add it to the list
            if (!isEdit) {
                const newPost: Post = {
                    id: Date.now().toString(),
                    title: formValues.title,
                    content: formValues.content,
                    scheduledFor: new Date(formValues.scheduledFor),
                    platform: formValues.platform,
                    status: 'scheduled',
                    imageUrl: formValues.imageUrl
                };

                setPosts([...posts, newPost]);
            } else if (currentPost) {
                // If editing, update the post in the list
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
            }

            // Close modals
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
                    id: Date.now().toString(),
                    title: formValues.title,
                    content: formValues.content,
                    scheduledFor: new Date(formValues.scheduledFor),
                    platform: formValues.platform,
                    status: 'scheduled',
                    imageUrl: formValues.imageUrl
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

            // Remove the post from the list
            const updatedPosts = posts.filter(post => post.id !== currentPost.id);
            setPosts(updatedPosts);
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

    // Handle drag and drop of posts
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        // Get the post being dragged
        const post = posts.find(p => p.id === draggableId);
        if (!post) return;

        // Calculate new date based on destination
        const dayIndex = parseInt(destination.droppableId.split('-')[1]);
        const day = calendarDays[dayIndex];

        // Set time from source to maintain the time
        const newDate = new Date(day);
        newDate.setHours(post.scheduledFor.getHours());
        newDate.setMinutes(post.scheduledFor.getMinutes());

        // Update post with new date
        const updatedPosts = posts.map(p =>
            p.id === post.id
                ? { ...p, scheduledFor: newDate }
                : p
        );

        setPosts(updatedPosts);

        toast({
            title: 'Post Rescheduled',
            description: `"${post.title}" has been rescheduled to ${format(newDate, 'MMMM d, yyyy')} at ${formatTime(newDate)}.`,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Content Calendar</h2>
                    <p className="text-muted-foreground">
                        Schedule and manage your social media posts
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Select
                        value={filterPlatform}
                        onValueChange={setFilterPlatform}
                    >
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
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

                    <Button onClick={() => handleCreatePost()} className="flex items-center gap-1">
                        <Plus className="h-4 w-4" /> Create Post
                    </Button>
                </div>
            </div>

            {/* Calendar navigation */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={goToNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="text-lg font-medium">
                        {format(currentWeekStart, 'MMMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMMM d, yyyy')}
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant={viewMode === 'week' ? 'default' : 'outline'}
                        className="flex items-center gap-1"
                        onClick={() => setViewMode('week')}
                    >
                        Week
                    </Button>
                    <Button
                        variant={viewMode === 'month' ? 'default' : 'outline'}
                        className="flex items-center gap-1"
                        onClick={() => setViewMode('month')}
                    >
                        Month
                    </Button>
                </div>
            </div>

            {/* Calendar view */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {/* Day headers */}
                    {calendarDays.map((day, index) => (
                        <div
                            key={`header-${index}`}
                            className="p-2 text-center font-medium"
                        >
                            <div className="text-sm uppercase">{format(day, 'EEE')}</div>
                            <div className="text-xl">{format(day, 'd')}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 h-[600px]">
                    {/* Calendar cells */}
                    {calendarDays.map((day, index) => (
                        <Droppable droppableId={`day-${index}`} key={`day-${index}`}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`
                                        border rounded-lg p-2 overflow-y-auto h-full
                                        ${isSameDay(day, new Date()) ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''}
                                    `}
                                    onClick={() => handleCreatePost(day)}
                                >
                                    {/* Posts for this day */}
                                    {filteredPosts
                                        .filter(post => isSameDay(post.scheduledFor, day))
                                        .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())
                                        .map((post, postIndex) => (
                                            <Draggable key={post.id} draggableId={post.id} index={postIndex}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`
                                                            mb-2 p-2 rounded-md border-l-4 bg-white dark:bg-gray-800 text-sm
                                                            shadow-sm hover:shadow-md transition-shadow
                                                            ${getPlatformTextColor(post.platform)} border-l-${post.platform.toLowerCase()}
                                                        `}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditPost(post);
                                                        }}
                                                        style={{
                                                            borderLeftColor:
                                                                post.platform === 'Instagram' ? '#ec4899' :
                                                                    post.platform === 'Twitter' ? '#0ea5e9' :
                                                                        post.platform === 'Facebook' ? '#2563eb' :
                                                                            post.platform === 'LinkedIn' ? '#1d4ed8' : 'gray'
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-medium truncate">{post.title}</div>
                                                                <div className="flex items-center space-x-2 text-xs mt-1">
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {formatTime(post.scheduledFor)}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        {getPlatformIcon(post.platform)}
                                                                        {post.platform}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 ml-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeletePost(post);
                                                                }}
                                                            >
                                                                <Trash2 className="h-3 w-3 text-muted-foreground" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}

                                    {/* Empty state for days with no posts */}
                                    {filteredPosts.filter(post => isSameDay(post.scheduledFor, day)).length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                                            <Plus className="h-4 w-4 mb-1" />
                                            <span>Add post</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

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
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={formValues.imageUrl || ''}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                            />
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
                            <Input
                                id="edit-imageUrl"
                                name="imageUrl"
                                value={formValues.imageUrl || ''}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                            />
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
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                <span>Scheduled for {format(currentPost.scheduledFor, 'MMMM d, yyyy')} at {formatTime(currentPost.scheduledFor)}</span>
                            </div>
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

export default ContentCalendar; 