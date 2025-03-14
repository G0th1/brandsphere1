"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Area, BarChart3, Calendar, Clock, Image, LineChart, MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';

const DEMO_PROJECTS = [
    {
        id: 1,
        name: "Summer Campaign",
        status: "active",
        lastUpdated: "Today",
    },
    {
        id: 2,
        name: "Product Launch",
        status: "pending",
        lastUpdated: "Yesterday",
    },
    {
        id: 3,
        name: "Brand Refresh",
        status: "completed",
        lastUpdated: "2 days ago",
    },
];

const DEMO_POSTS = [
    {
        id: 1,
        title: "New Product Teaser",
        platform: "Instagram",
        scheduled: "Tomorrow, 10:00 AM",
        status: "scheduled"
    },
    {
        id: 2,
        title: "Customer Testimonial",
        platform: "LinkedIn",
        scheduled: "Today, 3:30 PM",
        status: "draft"
    },
    {
        id: 3,
        title: "Weekly Tips",
        platform: "Twitter",
        scheduled: "Thursday, 9:00 AM",
        status: "published"
    }
];

// Function to get status badge color
const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case "active":
        case "published":
            return "default";
        case "pending":
        case "scheduled":
            return "secondary";
        case "completed":
            return "success";
        case "draft":
            return "outline";
        default:
            return "outline";
    }
};

export function DemoDashboardContent() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.2%</div>
                        <p className="text-xs text-muted-foreground mt-1">+1.8% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground mt-1">Next: Tomorrow 10:00 AM</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Content Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground mt-1">2 need approval</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="content" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Upcoming Posts</h3>
                        <Link href="/demo/content">
                            <Button variant="outline" size="sm" className="h-8">
                                <Image className="h-4 w-4 mr-2" />
                                Create Content
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {DEMO_POSTS.map((post) => (
                            <Card key={post.id} className="overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-24 h-24 bg-muted flex items-center justify-center border-r">
                                        {post.platform === "Instagram" && <Image className="h-6 w-6" />}
                                        {post.platform === "LinkedIn" && <MessageSquare className="h-6 w-6" />}
                                        {post.platform === "Twitter" && <LineChart className="h-6 w-6" />}
                                    </div>
                                    <div className="flex-1 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium">{post.title}</h4>
                                                <p className="text-sm text-muted-foreground">{post.platform}</p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(post.status)}>
                                                {post.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                            {post.scheduled}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Active Projects</h3>
                        <Button variant="outline" size="sm" className="h-8">
                            <Area className="h-4 w-4 mr-2" />
                            New Project
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {DEMO_PROJECTS.map((project) => (
                            <Card key={project.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{project.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Last updated: {project.lastUpdated}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusBadgeVariant(project.status)}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Performance Metrics</h3>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-8">
                                <Calendar className="h-4 w-4 mr-2" />
                                Last 30 Days
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Engagement by Platform</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                                    <BarChart3 className="h-8 w-8 text-muted" />
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <p className="text-xs text-muted-foreground">
                                    Instagram shows the highest engagement rate at 7.2%
                                </p>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Audience Growth</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                                    <LineChart className="h-8 w-8 text-muted" />
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <p className="text-xs text-muted-foreground">
                                    +15% follower growth across all channels this month
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default DemoDashboardContent; 