import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUpRight, Users, BarChart3, FileText, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media presence with BrandSphereAI',
};

// Helper functions for mock data
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomChange = () => {
  const num = getRandomInt(-20, 40);
  return { value: num, positive: num >= 0 };
};

export default function DashboardPage() {
  // Sample data
  const stats = [
    {
      title: 'Scheduled Posts',
      value: '12',
      change: getRandomChange(),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: 'Connected Accounts',
      value: '3',
      change: getRandomChange(),
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Total Followers',
      value: '7.4k',
      change: getRandomChange(),
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: getRandomChange(),
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" className="hidden sm:flex gap-2 items-center">
          <Calendar className="h-4 w-4" />
          <span>April 2023</span>
        </Button>
      </div>

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
                <span className={`text-xs font-medium flex items-center ${stat.change.positive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                  }`}>
                  {stat.change.positive ? '+' : ''}{stat.change.value}%
                  <ArrowUpRight className={`h-3 w-3 ml-1 ${!stat.change.positive && 'rotate-180'}`} />
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-primary/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reports</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View All</span>
              </Button>
            </div>
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Platform engagement and growth metrics for the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-primary/60 mb-3" />
                      <div className="text-muted-foreground">
                        Analytics visualization would appear here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>
                    In-depth metrics and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="text-center">
                      <div className="text-muted-foreground text-sm">
                        Detailed analytics content would appear here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Reports</CardTitle>
                  <CardDescription>
                    Your saved and recent reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="text-center">
                      <div className="text-muted-foreground text-sm">
                        Reports would be listed here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Content</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>View All</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingPosts.map((post) => (
                  <div key={post.id} className="flex items-start pb-4 last:pb-0 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{post.title}</div>
                        <Badge variant={post.status === 'draft' ? 'outline' : 'default'} className={post.status !== 'draft' ? 'bg-primary' : ''}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })} at {post.time}
                      </div>
                      <div className="flex items-center">
                        <Badge variant="secondary">{post.platform}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-muted-foreground">
                      {i === 1 ? (
                        <FileText className="h-4 w-4" />
                      ) : i === 2 ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <BarChart3 className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {i === 1
                          ? 'New post published'
                          : i === 2
                            ? 'Connected Instagram account'
                            : 'Weekly analytics report generated'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1
                          ? '2 hours ago'
                          : i === 2
                            ? 'Yesterday at 15:30'
                            : '3 days ago'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 