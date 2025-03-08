import { DemoGuard } from "@/components/demo/demo-guard";

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <DemoGuard>{children}</DemoGuard>
        </div>
    );
} 