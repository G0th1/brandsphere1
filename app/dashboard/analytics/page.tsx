import { Metadata } from 'next';
import DashboardLayout from '@/app/components/dashboard-layout';
import { InsightsDashboard } from '@/app/components/analytics/insights-dashboard';

export const metadata: Metadata = {
    title: 'Analytics & Insights | BrandSphereAI',
    description: 'Track and analyze your social media performance',
};

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <InsightsDashboard />
            </div>
        </DashboardLayout>
    );
} 