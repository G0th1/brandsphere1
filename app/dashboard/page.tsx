import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, BarChart2, FileText, Users, ArrowRight, BookOpen, Zap, BellRing, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsageStats } from '@/app/components/dashboard/usage-stats';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media content and analytics',
};

/**
 * Dashboard Home Page
 * Displays overview stats, upcoming posts, and recent analytics
 */
export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/upgrade">
            <Button className="hidden md:flex" size="sm">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Followers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement Rate
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">
                  +0.4% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Scheduled Posts
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  Posts queued for this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Content Health
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">
                  +2 new recommendations
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Fast access to common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/calendar">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                        <span className="font-medium">Create New Post</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-left">
                        Schedule content across your platforms
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/dashboard/ai-content">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-primary" />
                        <span className="font-medium">AI Content Generator</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-left">
                        Create content ideas and hashtags with AI
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/dashboard/posts">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-primary" />
                        <span className="font-medium">Content Library</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-left">
                        Manage your drafts and published posts
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/dashboard/analytics">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                        <span className="font-medium">Review Analytics</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-left">
                        See how your content is performing
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </Button>
                </Link>

                <Link href="/dashboard/connect">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-primary" />
                        <span className="font-medium">Connect Account</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-left">
                        Add new social media platforms
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Suspense fallback={<div className="h-[400px] rounded-lg border bg-card text-card-foreground shadow-sm flex items-center justify-center">Loading...</div>}>
              <UsageStats />
            </Suspense>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>
                  Your next 3 scheduled posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 rounded-md border p-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <span className="text-xs">IG</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New Product Showcase
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tomorrow at 10:00 AM on Instagram
                      </p>
                    </div>
                    <Link href="/dashboard/posts/1">
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>

                  <div className="flex items-start space-x-4 rounded-md border p-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <span className="text-xs">FB</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Weekly Tips Series
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mar 18, 2023 at 2:30 PM on Facebook
                      </p>
                    </div>
                    <Link href="/dashboard/posts/2">
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>

                  <div className="flex items-start space-x-4 rounded-md border p-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <span className="text-xs">LI</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Industry News Update
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mar 20, 2023 at 9:00 AM on LinkedIn
                      </p>
                    </div>
                    <Link href="/dashboard/posts/3">
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  Stay updated on your activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <BellRing className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Engagement alert
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your post "Summer Collection Launch" is getting high engagement. Check it out!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 hour ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <BellRing className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Post published
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your scheduled post was successfully published to Instagram.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        3 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <BellRing className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New account connected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You successfully connected your TikTok business account.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Yesterday
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Visit the analytics page for detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[20rem] flex items-center justify-center border-t">
              <div className="text-center space-y-2">
                <BarChart2 className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">Engagement Overview</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Visit the full analytics dashboard to view detailed metrics on your social media performance.
                </p>
                <Link href="/dashboard/analytics">
                  <Button className="mt-4">
                    View Analytics Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Today</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Posted new content on Instagram</span>
                      </div>
                      <span className="text-muted-foreground">10:42 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Scheduled 3 posts for next week</span>
                      </div>
                      <span className="text-muted-foreground">9:15 AM</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Yesterday</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Generated AI content suggestions</span>
                      </div>
                      <span className="text-muted-foreground">4:30 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Connected TikTok account</span>
                      </div>
                      <span className="text-muted-foreground">2:15 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500" />
                        <span>Updated profile settings</span>
                      </div>
                      <span className="text-muted-foreground">11:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 