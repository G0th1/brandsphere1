"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Folder, Instagram, Twitter, Facebook, Linkedin, CalendarClock, Users, MoreHorizontal, Filter, Search, Edit, Trash2, Loader2, BookOpen, Grid2X2, GridIcon, List } from 'lucide-react';

// Project statuses
const PROJECT_STATUSES = {
    active: { label: 'Active', color: 'default' },
    draft: { label: 'Draft', color: 'secondary' },
    completed: { label: 'Completed', color: 'outline' },
    archived: { label: 'Archived', color: 'outline' }
};

// Mock projects data
const MOCK_PROJECTS = [
    {
        id: '1',
        name: 'Summer Campaign 2023',
        description: 'Promotional campaign for summer product line',
        status: 'active',
        platforms: ['instagram', 'facebook', 'twitter'],
        createdAt: '2023-04-05',
        updatedAt: '2023-05-10',
        teamMembers: ['1', '2'],
        postsCount: 12,
        scheduledCount: 5,
        endDate: '2023-08-30'
    },
    {
        id: '2',
        name: 'Product Launch: X1 Series',
        description: 'New product line announcement and promotion',
        status: 'draft',
        platforms: ['instagram', 'facebook', 'linkedin'],
        createdAt: '2023-05-20',
        updatedAt: '2023-05-20',
        teamMembers: ['1', '3'],
        postsCount: 8,
        scheduledCount: 0,
        endDate: '2023-09-15'
    },
    {
        id: '3',
        name: 'Brand Awareness Q2',
        description: 'General brand awareness campaign for Q2',
        status: 'completed',
        platforms: ['instagram', 'twitter'],
        createdAt: '2023-03-01',
        updatedAt: '2023-06-30',
        teamMembers: ['2', '4'],
        postsCount: 24,
        scheduledCount: 0,
        endDate: '2023-06-30'
    },
    {
        id: '4',
        name: 'Holiday Promotion 2022',
        description: 'End-of-year holiday promotional campaign',
        status: 'archived',
        platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
        createdAt: '2022-11-01',
        updatedAt: '2023-01-15',
        teamMembers: ['1', '2', '3', '4'],
        postsCount: 30,
        scheduledCount: 0,
        endDate: '2023-01-15'
    }
];

// Social platform icons
const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'instagram':
            return <Instagram className="h-4 w-4" />;
        case 'facebook':
            return <Facebook className="h-4 w-4" />;
        case 'twitter':
            return <Twitter className="h-4 w-4" />;
        case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
        default:
            return null;
    }
};

export default function ProjectsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState(MOCK_PROJECTS);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [isCreating, setIsCreating] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        platforms: [] as string[]
    });

    // Handle creating a new project
    const handleCreateProject = () => {
        if (!newProject.name.trim()) {
            toast({
                title: "Missing Information",
                description: "Project name is required",
                variant: "destructive"
            });
            return;
        }

        setIsCreating(true);

        // Simulate API call
        setTimeout(() => {
            const createdProject = {
                id: Date.now().toString(),
                name: newProject.name,
                description: newProject.description,
                status: 'draft',
                platforms: newProject.platforms.length ? newProject.platforms : ['instagram'],
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0],
                teamMembers: ['1'],
                postsCount: 0,
                scheduledCount: 0,
                endDate: ''
            };

            setProjects([createdProject, ...projects]);
            setNewProject({ name: '', description: '', platforms: [] });
            setIsCreating(false);

            toast({
                title: "Project Created",
                description: "Your new project has been created successfully"
            });
        }, 1500);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Filter projects based on search and status filter
    const filteredProjects = projects
        .filter(project => project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(project => filter === 'all' || project.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">Manage your social media campaigns and projects</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            <span>New Project</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                Start a new social media campaign or project. You can add content and team members later.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="project-name">Project name</Label>
                                <Input
                                    id="project-name"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="e.g. Summer Campaign 2023"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="project-description">Description</Label>
                                <Textarea
                                    id="project-description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Brief description of your project"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Platforms</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['instagram', 'facebook', 'twitter', 'linkedin'].map(platform => (
                                        <Button
                                            key={platform}
                                            type="button"
                                            variant={newProject.platforms.includes(platform) ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                                const updated = newProject.platforms.includes(platform)
                                                    ? newProject.platforms.filter(p => p !== platform)
                                                    : [...newProject.platforms, platform];
                                                setNewProject({ ...newProject, platforms: updated });
                                            }}
                                            className="flex items-center gap-1"
                                        >
                                            <PlatformIcon platform={platform} />
                                            <span className="capitalize">{platform}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setNewProject({ name: '', description: '', platforms: [] })}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateProject} disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : "Create Project"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Projects</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search projects..."
                                    className="pl-8 w-[200px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Projects</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex border rounded-md overflow-hidden">
                                <Button
                                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => setView('grid')}
                                >
                                    <GridIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={view === 'list' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => setView('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {view === 'grid' ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(project => (
                                    <Card key={project.id} className="overflow-hidden">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <Badge variant={PROJECT_STATUSES[project.status].color as any}>
                                                    {PROJECT_STATUSES[project.status].label}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-3">
                                            <div className="flex items-center gap-1 mb-3">
                                                {project.platforms.map(platform => (
                                                    <div key={platform} className="bg-muted rounded-full p-1">
                                                        <PlatformIcon platform={platform} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>{project.postsCount} posts</span>
                                                </div>
                                                {project.status === 'active' && (
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <CalendarClock className="h-4 w-4" />
                                                        <span>{project.scheduledCount} scheduled</span>
                                                    </div>
                                                )}
                                                {project.endDate && project.status !== 'draft' && (
                                                    <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                                                        <CalendarClock className="h-4 w-4" />
                                                        <span>{formatDate(project.endDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="border-t pt-3 flex justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2].map(i => (
                                                    <Avatar key={i} className="h-7 w-7 border-2 border-background">
                                                        <AvatarFallback>U{i}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {project.teamMembers.length > 2 && (
                                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                                        +{project.teamMembers.length - 2}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Updated {formatDate(project.updatedAt)}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12">
                                    <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="font-medium text-xl mb-1">No projects found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchQuery || filter !== 'all' ?
                                            "Try adjusting your filters" :
                                            "Get started by creating your first project"}
                                    </p>
                                    {!searchQuery && filter === 'all' && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <PlusCircle className="h-4 w-4 mr-2" />
                                                    Create Project
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                {/* Same dialog content as above */}
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Platforms</TableHead>
                                        <TableHead>Posts</TableHead>
                                        <TableHead>Team</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map(project => (
                                            <TableRow key={project.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{project.name}</div>
                                                        <div className="text-sm text-muted-foreground line-clamp-1">{project.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={PROJECT_STATUSES[project.status].color as any}>
                                                        {PROJECT_STATUSES[project.status].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {project.platforms.map(platform => (
                                                            <div key={platform} className="bg-muted rounded-full p-1">
                                                                <PlatformIcon platform={platform} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{project.postsCount}</TableCell>
                                                <TableCell>
                                                    <div className="flex -space-x-2">
                                                        {[1, 2].map(i => (
                                                            <Avatar key={i} className="h-7 w-7 border-2 border-background">
                                                                <AvatarFallback>U{i}</AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                        {project.teamMembers.length > 2 && (
                                                            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                                                +{project.teamMembers.length - 2}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatDate(project.updatedAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Folder className="h-8 w-8 text-muted-foreground mb-2" />
                                                    <h3 className="font-medium mb-1">No projects found</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchQuery || filter !== 'all' ?
                                                            "Try adjusting your filters" :
                                                            "Get started by creating your first project"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 