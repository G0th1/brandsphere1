"use client";

import { DemoGuard } from "@/components/demo/demo-guard";

// Metadata should be defined in a separate file for client components
export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Hide the site header for demo pages */}
            <style jsx global>{`
                header:first-of-type {
                    display: none;
                }
            `}</style>
            <div className="min-h-screen">
                <DemoGuard>{children}</DemoGuard>
            </div>
        </>
    );
} 