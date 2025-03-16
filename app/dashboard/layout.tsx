// This is a Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import { DashboardLayout } from "@/app/components/dashboard-layout";

// Export dynamic marker to prevent static generation
export const dynamic = 'force-dynamic';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
} 