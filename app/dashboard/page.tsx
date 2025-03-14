import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard-layout';

export const metadata: Metadata = {
  title: 'Dashboard | BrandSphereAI',
  description: 'Manage your social media presence with BrandSphereAI',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Content is rendered directly by the DashboardLayout for the main dashboard page */}
    </DashboardLayout>
  );
} 