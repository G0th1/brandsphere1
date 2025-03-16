"use client"

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostEditor } from '@/app/components/content/post-editor';
import { SocialMediaPost } from '@/services/social-media';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export const metadata: Metadata = {
    title: 'Content Calendar | BrandSphereAI',
    description: 'Plan and schedule your social media content calendar',
};

// Sample calendar data
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const currentDay = new Date().getDate();

const scheduledContent = [
    {
        day: 4,
        items: [
            { id: 1, title: 'Product Launch', platform: 'Instagram', time: '09:00' },
        ]
    },
    {
        day: 10,
        items: [
            { id: 2, title: 'Team Spotlight', platform: 'LinkedIn', time: '14:00' },
        ]
    },
    {
        day: 15,
        items: [
            { id: 3, title: 'Customer Testimonial', platform: 'Facebook', time: '10:30' },
            { id: 4, title: 'Industry News', platform: 'Twitter', time: '16:00' },
        ]
    },
    {
        day: 22,
        items: [
            { id: 5, title: 'How-to Tutorial', platform: 'Instagram', time: '12:00' },
        ]
    },
    {
        day: currentDay,
        items: [
            { id: 6, title: 'Weekly Update', platform: 'LinkedIn', time: '15:00' },
        ]
    },
];

// Sample connected accounts
const connectedAccounts = [
    {
        id: '1',
        platform: 'Instagram',
        username: 'mybrand',
        avatarUrl: '/placeholder-avatar.jpg',
    },
    {
        id: '2',
        platform: 'LinkedIn',
        username: 'My Brand',
        avatarUrl: '/placeholder-avatar.jpg',
    },
    {
        id: '3',
        platform: 'Facebook',
        username: 'My Brand Page',
        avatarUrl: '/placeholder-avatar.jpg',
    },
    {
        id: '4',
        platform: 'Twitter',
        username: '@mybrand',
        avatarUrl: '/placeholder-avatar.jpg',
    },
];

// Platform badge styling
const getPlatformBadge = (platform: string) => {
    switch (platform) {
        case 'Instagram':
            return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">{platform}</Badge>;
        case 'LinkedIn':
            return <Badge className="bg-blue-600">{platform}</Badge>;
        case 'Facebook':
            return <Badge className="bg-indigo-600">{platform}</Badge>;
        case 'Twitter':
            return <Badge className="bg-sky-500">{platform}</Badge>;
        default:
            return <Badge>{platform}</Badge>;
    }
};

export default function CalendarPage() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    // Get content for a specific day
    const getContentForDay = (day: number) => {
        return scheduledContent.find(content => content.day === day)?.items || [];
    };

    // Handle creating a new post
    const handleCreatePost = () => {
        setIsDialogOpen(true);
    };

    // Handle day click to schedule a post on that specific day
    const handleDayClick = (day: number) => {
        setSelectedDay(day);
        setIsDialogOpen(true);
    };

    // Handle saving a post
    const handleSavePost = async (post: Partial<SocialMediaPost>) => {
        try {
            // In a real app, you'd save this to your backend
            console.log('Saving post:', post);

            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: post.status === 'published' ? 'Post Published!' : (post.status === 'scheduled' ? 'Post Scheduled!' : 'Draft Saved!'),
                description: 'Your content has been successfully saved.',
            });

            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving post:', error);
            toast({
                title: 'Error',
                description: 'Failed to save post. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Content Calendar</h1>
                <Button className="flex items-center gap-1" onClick={handleCreatePost}>
                    <Plus className="h-4 w-4" />
                    <span>Schedule Content</span>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-medium">
                        {currentMonth} {currentYear}
                    </h2>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Tabs defaultValue="month">
                        <TabsList>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="list">List</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Platforms</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Monthly View</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {/* Placeholder for empty days at start of month */}
                        <div className="pt-2 pb-2 h-24 sm:h-28"></div>
                        <div className="pt-2 pb-2 h-24 sm:h-28"></div>
                        <div className="pt-2 pb-2 h-24 sm:h-28"></div>
                        {days.map((day) => {
                            const dayContent = getContentForDay(day);
                            const isToday = day === currentDay;

                            return (
                                <div
                                    key={day}
                                    className={`border dark:border-gray-800 rounded-md pt-1 px-1 pb-2 h-24 sm:h-28 overflow-hidden cursor-pointer hover:border-primary transition-colors ${isToday ? 'bg-gray-100 dark:bg-gray-800 border-primary dark:border-primary' : ''
                                        }`}
                                    onClick={() => handleDayClick(day)}
                                >
                                    <div className="text-right mb-1">
                                        <span className={`inline-block w-6 h-6 rounded-full text-center text-sm ${isToday
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-foreground'
                                            }`}>
                                            {day}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {dayContent.map((item) => (
                                            <div
                                                key={item.id}
                                                className="text-xs bg-background dark:bg-gray-900 p-1 rounded truncate border border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="font-medium truncate">{item.title}</div>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-muted-foreground">{item.time}</span>
                                                    {getPlatformBadge(item.platform)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-lg font-medium mb-4">Upcoming Content</h3>
                <div className="space-y-3">
                    {scheduledContent
                        .flatMap(day => day.items.map(item => ({ ...item, day: day.day })))
                        .sort((a, b) => a.day - b.day)
                        .slice(0, 3)
                        .map(item => (
                            <Card key={item.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(2023, 3, item.day).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })} at {item.time}
                                        </div>
                                    </div>
                                    <div>
                                        {getPlatformBadge(item.platform)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>

            {/* Post Creation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
                    <PostEditor
                        initialPost={selectedDay ? {
                            scheduledFor: new Date(currentYear, new Date().getMonth(), selectedDay, 9, 0, 0)
                        } : undefined}
                        accounts={connectedAccounts}
                        onSave={handleSavePost}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
} 