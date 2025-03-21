import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, BarChart2, FileText, Users, ArrowRight, BookOpen, Zap, BellRing, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense, lazy } from 'react';

// Lazy load components that are not needed for initial render
const UsageStats = lazy(() => import('@/app/components/dashboard/usage-stats').then(mod => ({ default: mod.UsageStats })));

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media content and analytics',
};

// Split into smaller components for better rendering
const DashboardStats = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Followers
        </CardTitle>
        <Users className="h-4 w-4 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+1,234</div>
        <p className="text-xs text-zinc-400">
          +12% from last month
        </p>
      </CardContent>
    </Card>
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Engagement Rate
        </CardTitle>
        <BarChart2 className="h-4 w-4 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">3.2%</div>
        <p className="text-xs text-zinc-400">
          +0.4% from last month
        </p>
      </CardContent>
    </Card>
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Scheduled Posts
        </CardTitle>
        <Calendar className="h-4 w-4 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">7</div>
        <p className="text-xs text-zinc-400">
          Posts queued for this week
        </p>
      </CardContent>
    </Card>
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Content Health
        </CardTitle>
        <FileText className="h-4 w-4 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Good</div>
        <p className="text-xs text-zinc-400">
          +2 new recommendations
        </p>
      </CardContent>
    </Card>
  </div>
);

// Quick actions component
const QuickActions = () => (
  <Card className="md:col-span-2 bg-zinc-800 border-zinc-700 text-zinc-100">
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription className="text-zinc-400">
        Fast access to common tasks
      </CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href="/dashboard/calendar">
        <Button variant="outline" className="w-full justify-start h-auto py-4 bg-zinc-700 text-zinc-200 border-zinc-600 hover:bg-zinc-600">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Create New Post</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-left">
              Schedule content across your platforms
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-zinc-400" />
        </Button>
      </Link>

      <Link href="/dashboard/ai-content">
        <Button variant="outline" className="w-full justify-start h-auto py-4 bg-zinc-700 text-zinc-200 border-zinc-600 hover:bg-zinc-600">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">AI Content Generator</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-left">
              Create content ideas and hashtags with AI
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-zinc-400" />
        </Button>
      </Link>

      <Link href="/dashboard/posts">
        <Button variant="outline" className="w-full justify-start h-auto py-4 bg-zinc-700 text-zinc-200 border-zinc-600 hover:bg-zinc-600">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Content Library</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-left">
              Manage your drafts and published posts
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-zinc-400" />
        </Button>
      </Link>

      <Link href="/dashboard/analytics">
        <Button variant="outline" className="w-full justify-start h-auto py-4 bg-zinc-700 text-zinc-200 border-zinc-600 hover:bg-zinc-600">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Review Analytics</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-left">
              See how your content is performing
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-zinc-400" />
        </Button>
      </Link>

      <Link href="/dashboard/connect">
        <Button variant="outline" className="w-full justify-start h-auto py-4 bg-zinc-700 text-zinc-200 border-zinc-600 hover:bg-zinc-600">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Connect Account</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-left">
              Add new social media platforms
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-zinc-400" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

// Upcoming Schedule component
const UpcomingSchedule = () => (
  <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
    <CardHeader>
      <CardTitle>Upcoming Schedule</CardTitle>
      <CardDescription className="text-zinc-400">
        Your next 3 scheduled posts
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-start space-x-4 rounded-md border border-zinc-700 p-3 bg-zinc-750">
          <div className="w-10 h-10 rounded-full bg-pink-900/50 flex items-center justify-center text-pink-400">
            <span className="text-xs">IG</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              New Product Showcase
            </p>
            <p className="text-xs text-zinc-400">
              Tomorrow at 10:00 AM on Instagram
            </p>
          </div>
          <Link href="/dashboard/posts/1">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-700">View</Button>
          </Link>
        </div>

        <div className="flex items-start space-x-4 rounded-md border border-zinc-700 p-3 bg-zinc-750">
          <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
            <span className="text-xs">FB</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Weekly Tips Series
            </p>
            <p className="text-xs text-zinc-400">
              Mar 18, 2023 at 2:30 PM on Facebook
            </p>
          </div>
          <Link href="/dashboard/posts/2">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-700">View</Button>
          </Link>
        </div>

        <div className="flex items-start space-x-4 rounded-md border border-zinc-700 p-3 bg-zinc-750">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
            <span className="text-xs">LI</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Industry News Update
            </p>
            <p className="text-xs text-zinc-400">
              Mar 20, 2023 at 9:00 AM on LinkedIn
            </p>
          </div>
          <Link href="/dashboard/posts/3">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-700">View</Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Dashboard Home Page
 * Displays overview stats, upcoming posts, and recent analytics
 */
export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Analytics</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<div className="h-28 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
            <DashboardStats />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Suspense fallback={<div className="md:col-span-2 h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
              <QuickActions />
            </Suspense>

            <Suspense fallback={<div className="h-[300px] rounded-lg border bg-card text-card-foreground shadow-sm flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>}>
              <UsageStats />
            </Suspense>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
              <UpcomingSchedule />
            </Suspense>

            {/* Recent Notifications Card */}
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>
                    Stay updated on your activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <BellRing className="h-5 w-5 text-primary" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">New comment on your post</p>
                        <p className="text-xs text-muted-foreground">35 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Post published successfully</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Users className="h-5 w-5 text-primary" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">10 new followers this week</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Your social media performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Select a date range to view detailed analytics
                </p>
              </CardContent>
            </Card>
          </Suspense>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Post scheduled</p>
                      <p className="text-xs text-muted-foreground">
                        You scheduled a new post for Instagram on March 17, 2023
                      </p>
                      <p className="text-xs text-muted-foreground">Today at 2:15 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <BarChart2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Analytics viewed</p>
                      <p className="text-xs text-muted-foreground">
                        You viewed your Instagram analytics
                      </p>
                      <p className="text-xs text-muted-foreground">Yesterday at 11:30 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">AI content generated</p>
                      <p className="text-xs text-muted-foreground">
                        You generated 5 content ideas using AI
                      </p>
                      <p className="text-xs text-muted-foreground">March 15, 2023 at 4:20 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
} 