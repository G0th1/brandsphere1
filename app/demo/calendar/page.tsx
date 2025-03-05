"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar as CalendarIcon,
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
    Info,
    Bell,
    Settings,
    User,
    LayoutDashboard,
    PieChart,
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Check,
    Pencil,
    Trash2,
    Eye
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
import { useToast } from "@/components/ui/use-toast";

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

// Calendar event types
interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'post' | 'video' | 'story' | 'reel' | 'meeting' | 'task';
    platforms?: string[];
    description?: string;
    status?: 'scheduled' | 'published' | 'draft';
    color?: string;
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

// Platform icons function
const renderPlatformIcons = (platforms: string[] = []) => {
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

// Generate sample events
const generateSampleEvents = (): CalendarEvent[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const events: CalendarEvent[] = [
        // Posts
        {
            id: '1',
            title: 'New AI Marketing Trends',
            start: new Date(currentYear, currentMonth, now.getDate() + 2, 10, 0),
            end: new Date(currentYear, currentMonth, now.getDate() + 2, 10, 0),
            type: 'post',
            platforms: ['facebook', 'instagram', 'twitter'],
            description: 'Scheduled post about AI marketing trends',
            status: 'scheduled',
            color: '#3b82f6'
        },
        {
            id: '2',
            title: 'Product Line Sneak Peek',
            start: new Date(currentYear, currentMonth, now.getDate() + 1, 14, 30),
            end: new Date(currentYear, currentMonth, now.getDate() + 1, 14, 30),
            type: 'video',
            platforms: ['facebook', 'instagram', 'youtube'],
            description: 'Teaser video for new product line',
            status: 'scheduled',
            color: '#ef4444'
        },
        {
            id: '3',
            title: 'Behind the Scenes - Office Tour',
            start: new Date(currentYear, currentMonth, now.getDate() + 3, 16, 0),
            end: new Date(currentYear, currentMonth, now.getDate() + 3, 16, 0),
            type: 'reel',
            platforms: ['instagram', 'youtube'],
            description: 'Quick office tour reel',
            status: 'scheduled',
            color: '#ec4899'
        },

        // Meetings
        {
            id: '4',
            title: 'Content Strategy Meeting',
            start: new Date(currentYear, currentMonth, now.getDate(), 9, 0),
            end: new Date(currentYear, currentMonth, now.getDate(), 10, 30),
            type: 'meeting',
            description: 'Monthly content strategy planning',
            color: '#8b5cf6'
        },
        {
            id: '5',
            title: 'Team Check-in',
            start: new Date(currentYear, currentMonth, now.getDate() + 2, 15, 0),
            end: new Date(currentYear, currentMonth, now.getDate() + 2, 16, 0),
            type: 'meeting',
            description: 'Weekly team progress review',
            color: '#8b5cf6'
        },

        // Tasks
        {
            id: '6',
            title: 'Prepare Monthly Report',
            start: new Date(currentYear, currentMonth, now.getDate() + 4, 9, 0),
            end: new Date(currentYear, currentMonth, now.getDate() + 4, 12, 0),
            type: 'task',
            description: 'Compile monthly analytics report',
            color: '#10b981'
        },
        {
            id: '7',
            title: 'Content Planning Session',
            start: new Date(currentYear, currentMonth, now.getDate() + 1, 10, 0),
            end: new Date(currentYear, currentMonth, now.getDate() + 1, 11, 30),
            type: 'task',
            description: 'Plan content for next 2 weeks',
            color: '#10b981'
        }
    ];

    // Add some events in past days of the current month
    events.push({
        id: '8',
        title: 'Monday Motivation Quote',
        start: new Date(currentYear, currentMonth, now.getDate() - 3, 8, 0),
        end: new Date(currentYear, currentMonth, now.getDate() - 3, 8, 0),
        type: 'post',
        platforms: ['instagram'],
        description: 'Motivational quote post',
        status: 'published',
        color: '#3b82f6'
    });

    events.push({
        id: '9',
        title: 'E-commerce Tips and Tricks',
        start: new Date(currentYear, currentMonth, now.getDate() - 5, 11, 0),
        end: new Date(currentYear, currentMonth, now.getDate() - 5, 11, 0),
        type: 'post',
        platforms: ['facebook', 'twitter'],
        description: 'Tips for e-commerce businesses',
        status: 'published',
        color: '#3b82f6'
    });

    return events;
};

// Helper functions for calendar
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

// Function to format date for display
const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Calendar Day Component
const CalendarDay = ({
    day,
    month,
    year,
    events,
    today,
    onEventClick
}: {
    day: number,
    month: number,
    year: number,
    events: CalendarEvent[],
    today: Date,
    onEventClick: (event: CalendarEvent) => void
}) => {
    const isToday = day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    // Filter events for this day
    const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === day &&
            eventDate.getMonth() === month &&
            eventDate.getFullYear() === year;
    });

    return (
        <div className={`min-h-32 border p-1 ${isToday ? 'bg-primary/5 border-primary' : ''}`}>
            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                {day}
            </div>
            <div className="space-y-1">
                {dayEvents.map(event => (
                    <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="text-xs p-1 rounded overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: event.color }}
                    >
                        <div className="text-white font-medium truncate">{event.title}</div>
                        <div className="text-white/80 text-[10px] flex items-center">
                            {formatDate(event.start)}
                            {event.platforms && <span className="ml-1">{renderPlatformIcons(event.platforms)}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Event Details Component
const EventDetails = ({
    event,
    onClose,
    onEdit,
    onDelete
}: {
    event: CalendarEvent | null,
    onClose: () => void,
    onEdit: (event: CalendarEvent) => void,
    onDelete: (event: CalendarEvent) => void
}) => {
    if (!event) return null;

    return (
        <Card className="p-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {event.start.toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(event)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: event.color }}></div>
                    <span className="capitalize">{event.type}</span>
                    {event.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === 'published' ? 'bg-green-100 text-green-800' :
                            event.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {event.status}
                        </span>
                    )}
                </div>

                {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                )}

                {event.platforms && event.platforms.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Platforms:</span>
                        <div className="flex gap-1">
                            {renderPlatformIcons(event.platforms)}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-end">
                {event.type.includes('post') || event.type === 'video' || event.type === 'reel' || event.type === 'story' ? (
                    <Button size="sm" className="gap-1">
                        <Eye className="h-4 w-4" /> View Content
                    </Button>
                ) : (
                    <Button size="sm" className="gap-1">
                        <Check className="h-4 w-4" /> Mark as Complete
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default function DemoCalendarPage() {
    const router = useRouter();
    const [user, setUser] = useState<DemoUser | null>(null);
    const [mounted, setMounted] = useState(false);
    const { toast } = useToast();

    // Calendar state
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

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

            // Generate sample events
            setEvents(generateSampleEvents());
        } catch (error) {
            console.error('Error parsing demo user:', error);
            router.push('/demo/login');
        }
    }, [router]);

    // If component not mounted yet, show nothing
    if (!mounted) return null;

    // If user not logged in, show nothing (we're redirecting anyway)
    if (!user) return null;

    // Navigate to previous/next month
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Get calendar data
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    // Get month name
    const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('en-US', { month: 'long' });

    // Handle event actions
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const handleCloseEventDetails = () => {
        setSelectedEvent(null);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        // Create a new array with the updated event
        const updatedEvents = events.map(e =>
            e.id === event.id ? event : e
        );

        setEvents(updatedEvents);
        setSelectedEvent(null);

        toast({
            title: "Event Updated",
            description: `The event "${event.title}" has been updated.`,
        });
    };

    const handleDeleteEvent = (event: CalendarEvent) => {
        // Filter out the deleted event
        const updatedEvents = events.filter(e => e.id !== event.id);
        setEvents(updatedEvents);
        setSelectedEvent(null);

        toast({
            title: "Event Deleted",
            description: `The event "${event.title}" has been deleted.`,
        });
    };

    const handleAddEvent = () => {
        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            title: 'New Event',
            start: new Date(currentYear, currentMonth, 15, 12, 0),
            end: new Date(currentYear, currentMonth, 15, 13, 0),
            type: 'post',
            platforms: ['instagram'],
            description: 'New scheduled post',
            status: 'scheduled',
            color: '#3b82f6'
        };

        setEvents([...events, newEvent]);
        setSelectedEvent(newEvent);

        toast({
            title: "Event Created",
            description: `A new event has been created.`,
        });
    };

    // Generate calendar grid
    const generateCalendarDays = () => {
        const calendarDays = [];

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="border bg-muted/20"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(
                <CalendarDay
                    key={`day-${day}`}
                    day={day}
                    month={currentMonth}
                    year={currentYear}
                    events={events}
                    today={today}
                    onEventClick={handleEventClick}
                />
            );
        }

        return calendarDays;
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <DemoSidebar activeItem="calendar" />

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
                    <div className="space-y-6">
                        {/* Page heading */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Content Calendar</h1>
                                <p className="text-muted-foreground">Manage and schedule your social media content</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tabs defaultValue="month" className="w-auto">
                                    <TabsList>
                                        <TabsTrigger value="month" onClick={() => setViewMode('month')}>Month</TabsTrigger>
                                        <TabsTrigger value="week" onClick={() => setViewMode('week')}>Week</TabsTrigger>
                                        <TabsTrigger value="day" onClick={() => setViewMode('day')}>Day</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <Button className="gap-2" onClick={handleAddEvent}>
                                    <PlusCircle className="h-4 w-4" />
                                    Add Event
                                </Button>
                            </div>
                        </div>

                        {/* Calendar view */}
                        <Card>
                            <CardContent className="p-0">
                                {/* Calendar header */}
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="font-medium">
                                            {monthName} {currentYear}
                                        </div>
                                        <Button variant="outline" size="icon" onClick={goToNextMonth}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Button variant="outline" size="sm" onClick={() => {
                                        setCurrentMonth(today.getMonth());
                                        setCurrentYear(today.getFullYear());
                                    }}>
                                        Today
                                    </Button>
                                </div>

                                {/* Calendar grid - Day names */}
                                <div className="grid grid-cols-7 border-b">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="py-2 text-center text-sm font-medium">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid - Days */}
                                <div className="grid grid-cols-7">
                                    {generateCalendarDays()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming events */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
                            <div className="space-y-3">
                                {events
                                    .filter(event => new Date(event.start) >= new Date())
                                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                                    .slice(0, 3)
                                    .map(event => (
                                        <Card key={event.id} className="p-3 cursor-pointer hover:bg-accent/50" onClick={() => handleEventClick(event)}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: event.color }}></div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{event.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {event.start.toLocaleString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </div>
                                                    {event.platforms && (
                                                        <div className="flex mt-1">
                                                            {renderPlatformIcons(event.platforms)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="capitalize text-xs px-2 py-0.5 rounded-full bg-muted">
                                                    {event.type}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Event details sidebar */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <EventDetails
                            event={selectedEvent}
                            onClose={handleCloseEventDetails}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 