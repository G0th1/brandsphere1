import { Metadata } from 'next';
import { InsightsDashboard } from '@/app/components/analytics/insights-dashboard';
import { RecentActivities } from '@/app/components/activity/recent-activities';

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media presence with BrandSphereAI',
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <InsightsDashboard />
      </div>
      <div className="md:col-span-1">
        <RecentActivities />
      </div>
    </div>
  );
} 