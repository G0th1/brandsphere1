import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Profile | BrandSphereAI',
    description: 'Manage your profile information and account settings',
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return children;
} 