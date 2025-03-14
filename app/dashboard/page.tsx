import { Suspense } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media presence with BrandSphereAI',
};

// Simplified dashboard components
function StatsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">12</span>
            <span className="text-sm text-muted-foreground">Scheduled Posts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">3</span>
            <span className="text-sm text-muted-foreground">Connected Accounts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">7.4k</span>
            <span className="text-sm text-muted-foreground">Total Followers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="font-medium">Post scheduled for Instagram</p>
            <p className="text-sm text-muted-foreground">2 hours ago</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="font-medium">Analytics report generated</p>
            <p className="text-sm text-muted-foreground">Yesterday</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="font-medium">New follower milestone reached</p>
            <p className="text-sm text-muted-foreground">3 days ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Engagement Rate</span>
              <span className="text-sm font-medium">4.2%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Click-through Rate</span>
              <span className="text-sm font-medium">2.8%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Growth Rate</span>
              <span className="text-sm font-medium">6.5%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading fallback component
function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
      <div className="md:col-span-1">
        <Skeleton className="h-[520px] w-full rounded-md" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="relative z-50">
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <StatsCard />
            <InsightsCard />
          </div>
          <div className="md:col-span-1">
            <ActivityCard />
          </div>
        </div>
      </Suspense>
    </div>
  );
} 