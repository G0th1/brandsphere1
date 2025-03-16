import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Content Calendar | BrandSphereAI',
    description: 'Plan and schedule your social media content calendar',
};

export default function CalendarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    );
} 