"use client";

// This is a Server Component
import "@/app/globals.css";
import DashboardLayout from "@/app/components/dashboard-layout";
import SiteHeader from "@/app/components/site-header";

// Export dynamic marker to prevent static generation
export const dynamic = 'force-dynamic';

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