import { Metadata } from 'next';
import DashboardLayout from '@/app/components/dashboard-layout';
import PostManagement from '@/app/components/content/post-management';

export const metadata: Metadata = {
    title: 'Content Management | BrandSphereAI',
    description: 'Create, schedule, and manage your social media content',
};

export default function ContentPage() {
    return (
        <DashboardLayout>
            <PostManagement />
        </DashboardLayout>
    );
} 