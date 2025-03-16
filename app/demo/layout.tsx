import { DemoGuard } from "@/components/demo/demo-guard";

export const metadata = {
    title: "Demo - BrandSphere",
    description: "Try out BrandSphere features in demo mode",
};

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