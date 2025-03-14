import { Metadata } from 'next';
import { DashboardLayout } from '@/app/components/dashboard-layout';
import { SocialAccounts } from '@/app/components/account/social-accounts';

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