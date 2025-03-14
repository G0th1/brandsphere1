import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard-layout';
import RecentActivities from '@/components/activity/recent-activities';

export const metadata: Metadata = {
    title: 'Recent Activity | BrandSphereAI',
    description: 'Track your recent activities and notifications',
};

export default function ActivityPage() {
    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <RecentActivities />
            </div>
        </DashboardLayout>
    );
} 