"use client"

import React, { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Pencil, ExternalLink, Trash2, Calendar as CalendarIcon, Instagram, Twitter, Facebook, Linkedin } from "lucide-react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isToday, isEqual, parseISO, formatISO } from "date-fns"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { socialMediaService, SocialMediaPost } from '@/services/social-media'

// Types for calendar posts
interface CalendarPost {
    id: string
    title: string
    content: string
    platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook'
    status: 'draft' | 'scheduled' | 'published'
    scheduledDate: string // ISO string
    image?: string
    tags?: string[]
}

// Sample data for demo posts
const initialPosts: CalendarPost[] = [
    {
        id: "post1",
        title: "Product Launch Announcement",
        content: "Excited to announce our new product line launching next week! Stay tuned for more details. #ProductLaunch",
        platform: "twitter",
        status: "scheduled",
        scheduledDate: formatISO(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 10, 0)),
        tags: ["launch", "product"]
    },
    {
        id: "post2",
        title: "Customer Success Story",
        content: "Check out how our customer achieved 40% growth using our platform!",
        platform: "linkedin",
        status: "scheduled",
        scheduledDate: formatISO(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4, 14, 30)),
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
        tags: ["success", "testimonial"]
    },
    {
        id: "post3",
        title: "Behind the Scenes Photo",
        content: "A sneak peek into our design process. Our team working on the next big thing!",
        platform: "instagram",
        status: "draft",
        scheduledDate: formatISO(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 9, 0)),
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        tags: ["behindthescenes", "team"]
    }
]

// Post Item for dragging
const PostItem = ({ post, onEdit, onDelete, onView }: {
    post: CalendarPost,
    onEdit: (post: CalendarPost) => void,
    onDelete: (id: string) => void,
    onView: (id: string) => void
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'POST',
        item: { id: post.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    // Platform color and icon
    const platformColors = {
        instagram: "bg-pink-100 text-pink-700 border-pink-200",
        twitter: "bg-blue-100 text-blue-700 border-blue-200",
        linkedin: "bg-blue-900 text-blue-50 border-blue-800",
        facebook: "bg-blue-600 text-blue-50 border-blue-500",
    }

    // Status styling
    const statusStyles = {
        draft: "bg-gray-100 text-gray-800",
        scheduled: "bg-amber-100 text-amber-800",
        published: "bg-green-100 text-green-800",
    }

    return (
        <div
            ref={drag}
            className={cn(
                "p-2 mb-2 rounded-md border border-gray-200 cursor-move relative",
                platformColors[post.platform],
                isDragging ? "opacity-50" : "opacity-100"
            )}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                <Badge variant="outline" className={cn("text-xs", statusStyles[post.status])}>
                    {post.status}
                </Badge>
            </div>
            <p className="text-xs mt-1 line-clamp-2">{post.content}</p>

            <div className="flex justify-between items-center mt-2">
                <span className="text-xs">{format(parseISO(post.scheduledDate), "h:mm a")}</span>
                <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEdit(post)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onView(post.id)}>
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => onDelete(post.id)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Calendar Day Cell with Drop functionality
const DayCell = ({
    date,
    posts,
    currentMonth,
    onDropPost,
    onEditPost,
    onDeletePost,
    onViewPost,
    onAddPost
}: {
    date: Date,
    posts: CalendarPost[],
    currentMonth: Date,
    onDropPost: (date: Date, postId: string) => void,
    onEditPost: (post: CalendarPost) => void,
    onDeletePost: (id: string) => void,
    onViewPost: (id: string) => void,
    onAddPost: (date: Date) => void
}) => {
    // Filter posts for this day
    const dayPosts = posts.filter(post => {
        const postDate = parseISO(post.scheduledDate)
        return isEqual(
            new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate())
        )
    })

    // Drop functionality
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'POST',
        drop: (item: { id: string }) => {
            onDropPost(date, item.id)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    // Determine cell styling
    const isCurrentMonth = isSameMonth(date, currentMonth)
    const isCurrentDay = isToday(date)

    return (
        <div
            ref={drop}
            className={cn(
                "min-h-[120px] p-2 border border-gray-200",
                isCurrentMonth ? "bg-white" : "bg-gray-50",
                isCurrentDay && "ring-2 ring-primary ring-inset",
                isOver && "bg-blue-50",
                !isCurrentMonth && "opacity-50"
            )}
        >
            <div className="flex justify-between items-center mb-1">
                <span className={cn(
                    "text-sm font-medium",
                    isCurrentDay && "text-primary font-bold"
                )}>
                    {format(date, "d")}
                </span>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onAddPost(date)}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
            <div className="space-y-1">
                {dayPosts.map(post => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onEdit={onEditPost}
                        onDelete={onDeletePost}
                        onView={onViewPost}
                    />
                ))}
            </div>
        </div>
    )
}

// Main Calendar Component
export function ContentCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [posts, setPosts] = useState<SocialMediaPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedView, setSelectedView] = useState('month')
    const [selectedPlatform, setSelectedPlatform] = useState('all')
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
    const [newPost, setNewPost] = useState({
        platform: '',
        content: '',
        scheduledFor: new Date()
    })
    const { toast } = useToast()

    // Get month days
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Calculate actual calendar grid (including padding days)
    const startDay = monthStart.getDay() // 0 = Sunday, 1 = Monday, etc.
    const calendarDays = [...Array(startDay).fill(null), ...monthDays]

    // Fetch posts on mount and when filters change
    useEffect(() => {
        fetchPosts()
    }, [selectedPlatform])

    // Fetch scheduled posts
    const fetchPosts = async () => {
        try {
            setIsLoading(true)

            // In a production app, this would fetch from the API with filters
            // For demo, we'll use a timeout to simulate an API call
            setTimeout(async () => {
                // Simulate API fetch with query params
                const apiUrl = new URL('/api/posts', window.location.origin)
                apiUrl.searchParams.append('status', 'scheduled')
                if (selectedPlatform !== 'all') {
                    apiUrl.searchParams.append('platform', selectedPlatform)
                }

                // In a real implementation:
                // const response = await fetch(apiUrl)
                // const data = await response.json()

                // For demo, fetch from our mock service function
                const response = await fetch('/api/posts')
                const data = await response.json()

                setPosts(data)
                setIsLoading(false)
            }, 800)
        } catch (error) {
            console.error('Error fetching scheduled posts:', error)
            toast({
                title: 'Error',
                description: 'Failed to load scheduled posts',
                variant: 'destructive',
            })
            setIsLoading(false)
        }
    }

    // Navigate to previous month
    const handlePreviousMonth = () => {
        setCurrentDate(prevDate => subMonths(prevDate, 1))
    }

    // Navigate to next month
    const handleNextMonth = () => {
        setCurrentDate(prevDate => addMonths(prevDate, 1))
    }

    // Handle platform filter change
    const handlePlatformChange = (value: string) => {
        setSelectedPlatform(value)
    }

    // Get posts for a specific day
    const getPostsForDay = (date: Date) => {
        return posts.filter(post => {
            const postDate = new Date(post.scheduledFor!)
            return isEqual(date, postDate)
        })
    }

    // Open create post dialog
    const handleCreatePost = (date?: Date) => {
        setNewPost({
            platform: '',
            content: '',
            scheduledFor: date || new Date()
        })
        setIsCreatePostOpen(true)
    }

    // Handle post submission
    const handleSubmitPost = async () => {
        try {
            if (!newPost.platform) {
                toast({
                    title: 'Platform Required',
                    description: 'Please select a platform for your post',
                    variant: 'destructive',
                })
                return
            }

            if (!newPost.content) {
                toast({
                    title: 'Content Required',
                    description: 'Please add content to your post',
                    variant: 'destructive',
                })
                return
            }

            // Schedule the post via our service
            const createdPost = await socialMediaService.schedulePost({
                platform: newPost.platform,
                content: newPost.content,
                mediaUrls: [],
                scheduledFor: newPost.scheduledFor
            })

            if (createdPost) {
                // Add to local state
                setPosts([...posts, createdPost])

                setIsCreatePostOpen(false)
                toast({
                    title: 'Post Scheduled',
                    description: `Your post has been scheduled for ${format(newPost.scheduledFor, 'PPP')}`,
                })
            }
        } catch (error) {
            console.error('Error scheduling post:', error)
            toast({
                title: 'Error',
                description: 'Failed to schedule post',
                variant: 'destructive',
            })
        }
    }

    // Format time
    const formatTime = (date: Date) => {
        return format(date, 'h:mm a')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Content Calendar</h1>
                <Button
                    className="flex items-center gap-1"
                    onClick={() => handleCreatePost()}
                >
                    <Plus className="h-4 w-4" />
                    <span>Schedule Content</span>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-medium">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Tabs defaultValue="month" value={selectedView} onValueChange={setSelectedView}>
                        <TabsList>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="list">List</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-2">
                        <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Platforms</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                        </Select>
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
                        {calendarDays.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} className="pt-2 pb-2 h-24 sm:h-28"></div>

                            const dayPosts = getPostsForDay(day)
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            const isCurrentDay = isToday(day)

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`
                                        border dark:border-gray-800 rounded-md pt-1 px-1 pb-2 h-24 sm:h-28 
                                        overflow-hidden cursor-pointer
                                        ${!isCurrentMonth ? 'opacity-50' : ''} 
                                        ${isCurrentDay ? 'bg-gray-100 dark:bg-gray-800 border-primary dark:border-primary' : ''}
                                    `}
                                    onClick={() => handleCreatePost(day)}
                                >
                                    <div className="text-right mb-1">
                                        <span className={`
                                            inline-block w-6 h-6 rounded-full text-center text-sm
                                            ${isCurrentDay ? 'bg-primary text-primary-foreground' : 'text-foreground'}
                                        `}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {dayPosts.slice(0, 2).map((post) => (
                                            <div
                                                key={post.id}
                                                className="text-xs bg-background dark:bg-gray-900 p-1 rounded truncate border border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="font-medium truncate">{post.content.substring(0, 20)}{post.content.length > 20 ? '...' : ''}</div>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-muted-foreground">{formatTime(new Date(post.scheduledFor!))}</span>
                                                    {getPlatformBadge(post.platform)}
                                                </div>
                                            </div>
                                        ))}
                                        {dayPosts.length > 2 && (
                                            <div className="text-xs text-center text-muted-foreground">
                                                +{dayPosts.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Create Post Dialog */}
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Schedule New Post</DialogTitle>
                        <DialogDescription>
                            Create and schedule content for your social media platforms.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="platform" className="text-right">
                                Platform
                            </Label>
                            <Select
                                value={newPost.platform}
                                onValueChange={(value) => setNewPost({ ...newPost, platform: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="twitter">Twitter</SelectItem>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date & Time
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={format(newPost.scheduledFor, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => {
                                        const date = e.target.value ? new Date(e.target.value) : new Date()
                                        setNewPost({ ...newPost, scheduledFor: date })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="content" className="text-right">
                                Content
                            </Label>
                            <Textarea
                                id="content"
                                className="col-span-3 resize-none"
                                rows={5}
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                placeholder="What's on your mind?"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="images" className="text-right">
                                Media
                            </Label>
                            <div className="col-span-3">
                                <Input id="images" type="file" accept="image/*" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleSubmitPost}>
                            Schedule Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Platform badge styling
const getPlatformBadge = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-1">
                <Instagram className="h-3 w-3" />
                <span>Instagram</span>
            </Badge>
        case 'twitter':
            return <Badge className="bg-sky-500 flex items-center gap-1">
                <Twitter className="h-3 w-3" />
                <span>Twitter</span>
            </Badge>
        case 'facebook':
            return <Badge className="bg-blue-600 flex items-center gap-1">
                <Facebook className="h-3 w-3" />
                <span>Facebook</span>
            </Badge>
        case 'linkedin':
            return <Badge className="bg-blue-800 flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span>LinkedIn</span>
            </Badge>
        default:
            return <Badge>{platform}</Badge>
    }
} 