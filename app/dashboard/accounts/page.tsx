import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard-layout';
import SocialAccounts from '@/components/account/social-accounts';

export const metadata: Metadata = {
    title: 'Social Media Accounts | BrandSphereAI',
    description: 'Connect and manage your social media accounts',
};

export default function AccountsPage() {
    return (
        <DashboardLayout>
            <SocialAccounts />
        </DashboardLayout>
    );
} 