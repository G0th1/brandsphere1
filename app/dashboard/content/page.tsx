import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, Edit, Trash2, Eye, Calendar, Instagram, Twitter, Facebook, Linkedin, Filter, Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const metadata: Metadata = {
    title: 'Content Management | BrandSphereAI',
    description: 'Create and manage your social media content',
};

// Platform icon helper
const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return <Instagram className="h-4 w-4" />;
        case 'facebook':
            return <Facebook className="h-4 w-4" />;
        case 'twitter':
            return <Twitter className="h-4 w-4" />;
        case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

export default function ContentPage() {
    // Mock data for posts
    const posts = [
        {
            id: '1',
            title: 'New Product Launch Announcement',
            status: 'scheduled',
            scheduledFor: new Date('2023-05-15T10:00:00'),
            platform: 'Instagram',
            engagement: null,
            imageUrl: '/images/mock/post1.jpg'
        },
        {
            id: '2',
            title: 'Customer Success Story',
            status: 'published',
            scheduledFor: new Date('2023-05-02T14:30:00'),
            platform: 'LinkedIn',
            engagement: 246,
            imageUrl: '/images/mock/post2.jpg'
        },
        {
            id: '3',
            title: 'Weekly Industry Insights',
            status: 'draft',
            scheduledFor: null,
            platform: 'Twitter',
            engagement: null,
            imageUrl: null
        },
        {
            id: '4',
            title: 'Behind the Scenes: Our Design Process',
            status: 'published',
            scheduledFor: new Date('2023-04-28T09:15:00'),
            platform: 'Instagram',
            engagement: 587,
            imageUrl: '/images/mock/post3.jpg'
        },
        {
            id: '5',
            title: 'Monthly Newsletter Highlights',
            status: 'scheduled',
            scheduledFor: new Date('2023-05-18T08:00:00'),
            platform: 'Facebook',
            engagement: null,
            imageUrl: '/images/mock/post4.jpg'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
                <div>
                    <h1 className="page-title">Content</h1>
                    <p className="page-description">Create and manage your social media posts</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search posts..."
                            className="max-w-sm"
                            prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                        />
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Post
                    </Button>
                </div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="all">All Posts</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    </TabsList>

                    <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Showing <strong>5</strong> out of <strong>24</strong> posts
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="all" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <Card key={post.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge className={`${post.status === 'published' ? 'bg-green-600' :
                                                    post.status === 'scheduled' ? 'bg-blue-600' :
                                                        'bg-secondary text-secondary-foreground'
                                                }`}>
                                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                            </Badge>
                                            <div className="flex items-center">
                                                <PlatformIcon platform={post.platform} />
                                            </div>
                                        </div>
                                        <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
                                        {post.scheduledFor && (
                                            <CardDescription className="flex items-center mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {post.scheduledFor.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })} at {post.scheduledFor.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`aspect-video rounded-md bg-muted mb-3 overflow-hidden ${!post.imageUrl ? 'flex items-center justify-center' : ''}`}>
                                            {post.imageUrl ? (
                                                <div
                                                    className="w-full h-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                                                ></div>
                                            ) : (
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        {post.engagement && (
                                            <div className="text-sm">
                                                <span className="font-medium">{post.engagement}</span> engagements
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-0">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                            Preview
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="scheduled">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.filter(post => post.status === 'scheduled').map((post) => (
                                <Card key={post.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge className="bg-blue-600">Scheduled</Badge>
                                            <div className="flex items-center">
                                                <PlatformIcon platform={post.platform} />
                                            </div>
                                        </div>
                                        <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {post.scheduledFor?.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })} at {post.scheduledFor?.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`aspect-video rounded-md bg-muted mb-3 overflow-hidden ${!post.imageUrl ? 'flex items-center justify-center' : ''}`}>
                                            {post.imageUrl ? (
                                                <div
                                                    className="w-full h-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                                                ></div>
                                            ) : (
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-0">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                            Preview
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Other tabs would follow similar pattern with filtered data */}
                </Tabs>
            </div>
        </div>
    );
} 