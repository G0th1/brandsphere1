import { Metadata } from 'next';
import DashboardLayout from '@/app/components/dashboard-layout';
import { ContentCalendar } from '@/app/components/content/content-calendar';

export const metadata: Metadata = {
    title: 'Content Calendar | BrandSphereAI',
    description: 'Schedule and manage your social media content calendar.',
};

export default function CalendarPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <ContentCalendar />
            </div>
        </DashboardLayout>
    );
} 