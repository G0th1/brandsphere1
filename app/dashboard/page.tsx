import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media presence with BrandSphereAI',
};

/**
 * Dashboard Home Page
 * Displays overview stats, upcoming posts, and recent analytics
 */
export default function DashboardPage() {
  // Sample statistics data
  const stats = [
    {
      title: 'Scheduled Posts',
      value: '12',
      change: { value: 8, positive: true },
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: 'Connected Accounts',
      value: '3',
      change: { value: 0, positive: true },
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Total Followers',
      value: '7.4k',
      change: { value: 12, positive: true },
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: { value: 2, positive: true },
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

  // Sample upcoming posts
  const upcomingPosts = [
    {
      id: 1,
      title: 'New product announcement',
      date: '2023-04-21',
      time: '09:00',
      platform: 'Instagram',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Weekly team update',
      date: '2023-04-23',
      time: '10:30',
      platform: 'LinkedIn',
      status: 'scheduled',
    },
    {
      id: 3,
      title: 'Customer testimonial highlight',
      date: '2023-04-25',
      time: '14:00',
      platform: 'Facebook',
      status: 'draft',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Overview of your social media presence</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center pt-2">
                  <span
                    className={`text-xs font-medium flex items-center ${stat.change.positive ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {stat.change.positive ? '+' : '-'}
                    {Math.abs(stat.change.value)}%
                    <ArrowUpRight className={`h-3 w-3 ml-1 ${!stat.change.positive && 'rotate-180'}`} />
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content tabs section */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Upcoming posts tab */}
          <TabsContent value="upcoming" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Upcoming Posts</h3>
                <div className="space-y-4">
                  {upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{post.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {post.date} at {post.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.status === 'scheduled' ? 'default' : 'outline'}>
                          {post.platform}
                        </Badge>
                        <Badge variant={post.status === 'scheduled' ? 'secondary' : 'outline'}>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Posts
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
              <p className="text-muted-foreground mb-6">
                Summary of your social media performance across all platforms.
              </p>
              <div className="h-[200px] flex items-center justify-center bg-accent/30 rounded-md">
                <span className="text-muted-foreground">Analytics visualization will appear here</span>
              </div>
              <div className="mt-6">
                <Button variant="outline" size="sm">
                  View Detailed Analytics
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Activity tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New follower on Instagram</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Post published on LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Yesterday at 15:30</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 