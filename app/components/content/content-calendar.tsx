"use client"

import React, { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Pencil, ExternalLink, Trash2, Calendar as CalendarIcon } from "lucide-react"
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
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [posts, setPosts] = useState<CalendarPost[]>(initialPosts)
    const [editingPost, setEditingPost] = useState<CalendarPost | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newPostDate, setNewPostDate] = useState<Date | null>(null)
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
    const { toast } = useToast()

    // Calendar calculations
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    // Next/Previous Month
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

    // Handle post drop on a date
    const handleDropPost = (date: Date, postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    // Keep the same time, just change the date
                    const currentPostDate = parseISO(post.scheduledDate)
                    const newDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        currentPostDate.getHours(),
                        currentPostDate.getMinutes()
                    )

                    return {
                        ...post,
                        scheduledDate: formatISO(newDate)
                    }
                }
                return post
            })
        )

        toast({
            title: "Post Rescheduled",
            description: `Post has been rescheduled to ${format(date, "MMMM d, yyyy")}`,
        })
    }

    // Add new post
    const handleAddPost = (date: Date) => {
        setNewPostDate(date)
        setEditingPost(null)
        setIsDialogOpen(true)
    }

    // Edit existing post
    const handleEditPost = (post: CalendarPost) => {
        setEditingPost(post)
        setNewPostDate(null)
        setIsDialogOpen(true)
    }

    // Delete post
    const handleDeletePost = (id: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
        toast({
            title: "Post Deleted",
            description: "The post has been removed from your calendar",
        })
    }

    // View post (in demo, just show a toast)
    const handleViewPost = (id: string) => {
        const post = posts.find(p => p.id === id)
        toast({
            title: "View Post Details",
            description: `Viewing details for: ${post?.title}`,
        })
    }

    // Save post (new or edited)
    const handleSavePost = (formData: any) => {
        if (editingPost) {
            // Update existing post
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === editingPost.id ? { ...post, ...formData } : post
                )
            )
            toast({
                title: "Post Updated",
                description: "Your post has been updated successfully",
            })
        } else {
            // Create new post
            const newPost: CalendarPost = {
                id: `post${Date.now()}`,
                ...formData,
                status: 'scheduled',
            }
            setPosts(prevPosts => [...prevPosts, newPost])
            toast({
                title: "Post Created",
                description: "Your post has been scheduled successfully",
            })
        }
        setIsDialogOpen(false)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="h-6 w-6" />
                            Content Calendar
                        </h2>
                        <Badge variant="outline" className="ml-2">
                            {format(currentMonth, 'MMMM yyyy')}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tabs
                            value={viewMode}
                            onValueChange={(value) => setViewMode(value as 'month' | 'week')}
                            className="mr-4"
                        >
                            <TabsList>
                                <TabsTrigger value="month">Month</TabsTrigger>
                                <TabsTrigger value="week">Week</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button variant="outline" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
                            Today
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleAddPost(new Date())}>
                            <Plus className="h-4 w-4 mr-2" /> New Post
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Calendar Headers */}
                        <div className="grid grid-cols-7 border-b">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                <div key={i} className="p-2 text-center font-medium">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7">
                            {days.map((day, dayIdx) => (
                                <DayCell
                                    key={dayIdx}
                                    date={day}
                                    posts={posts}
                                    currentMonth={currentMonth}
                                    onDropPost={handleDropPost}
                                    onEditPost={handleEditPost}
                                    onDeletePost={handleDeletePost}
                                    onViewPost={handleViewPost}
                                    onAddPost={handleAddPost}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Post Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
                        <DialogDescription>
                            {editingPost
                                ? "Make changes to your scheduled post."
                                : "Schedule a new post to your content calendar."}
                        </DialogDescription>
                    </DialogHeader>

                    <PostForm
                        initialPost={editingPost}
                        initialDate={newPostDate}
                        onSubmit={handleSavePost}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </DndProvider>
    )
}

// Post Form Component
function PostForm({
    initialPost,
    initialDate,
    onSubmit,
    onCancel
}: {
    initialPost: CalendarPost | null,
    initialDate: Date | null,
    onSubmit: (data: any) => void,
    onCancel: () => void
}) {
    // Form state
    const [formData, setFormData] = useState<Partial<CalendarPost>>({
        title: initialPost?.title || "",
        content: initialPost?.content || "",
        platform: initialPost?.platform || "twitter",
        status: initialPost?.status || "scheduled",
        scheduledDate: initialPost?.scheduledDate ||
            (initialDate ? formatISO(initialDate) : formatISO(new Date())),
        image: initialPost?.image || "",
        tags: initialPost?.tags || [],
    })

    // Update form state when initialPost changes
    useEffect(() => {
        if (initialPost) {
            setFormData({
                title: initialPost.title,
                content: initialPost.content,
                platform: initialPost.platform,
                status: initialPost.status,
                scheduledDate: initialPost.scheduledDate,
                image: initialPost.image || "",
                tags: initialPost.tags || [],
            })
        } else if (initialDate) {
            setFormData(prev => ({
                ...prev,
                scheduledDate: formatISO(initialDate)
            }))
        }
    }, [initialPost, initialDate])

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Handle platform select change
    const handlePlatformChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            platform: value as 'instagram' | 'twitter' | 'linkedin' | 'facebook'
        }))
    }

    // Handle status select change
    const handleStatusChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            status: value as 'draft' | 'scheduled' | 'published'
        }))
    }

    // Handle date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateInput = e.target.value
        // Convert the HTML date input to an ISO string with the same time
        const currentDate = formData.scheduledDate ? parseISO(formData.scheduledDate) : new Date()
        const [year, month, day] = dateInput.split('-').map(Number)

        const newDate = new Date(
            year,
            month - 1, // JavaScript months are 0-indexed
            day,
            currentDate.getHours(),
            currentDate.getMinutes()
        )

        setFormData(prev => ({
            ...prev,
            scheduledDate: formatISO(newDate)
        }))
    }

    // Handle time change
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeInput = e.target.value
        // Convert the HTML time input to an ISO string with the same date
        const currentDate = formData.scheduledDate ? parseISO(formData.scheduledDate) : new Date()
        const [hours, minutes] = timeInput.split(':').map(Number)

        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            hours,
            minutes
        )

        setFormData(prev => ({
            ...prev,
            scheduledDate: formatISO(newDate)
        }))
    }

    // Handle tags input
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagsInput = e.target.value
        const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)

        setFormData(prev => ({
            ...prev,
            tags: tagsArray
        }))
    }

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    // Extract date and time for form inputs
    const scheduledDate = formData.scheduledDate ? parseISO(formData.scheduledDate) : new Date()
    const dateValue = format(scheduledDate, 'yyyy-MM-dd')
    const timeValue = format(scheduledDate, 'HH:mm')

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter post title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="What do you want to share?"
                    rows={4}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                        value={formData.platform}
                        onValueChange={handlePlatformChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={dateValue}
                        onChange={handleDateChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        type="time"
                        value={timeValue}
                        onChange={handleTimeChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                    id="image"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                    id="tags"
                    name="tags"
                    value={formData.tags?.join(', ') || ''}
                    onChange={handleTagsChange}
                    placeholder="marketing, product, launch"
                />
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialPost ? 'Update Post' : 'Create Post'}
                </Button>
            </DialogFooter>
        </form>
    )
} 