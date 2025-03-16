// This is a Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard-layout";
import SiteHeader from "@/components/site-header";

// Export dynamic marker to prevent static generation
export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Dashboard - BrandSphere",
    description: "Manage your social media content and analytics",
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Hide the site header for dashboard pages */}
            <style jsx global>{`
                header:first-of-type {
                    display: none;
                }
            `}</style>
            <DashboardLayout>{children}</DashboardLayout>
        </>
    );
} 