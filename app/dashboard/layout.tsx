// This is a Server Component
import "@/app/globals.css";
import { Metadata } from "next";
import Link from "next/link";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";

// Export dynamic marker to prevent static generation
export const dynamic = 'force-dynamic';

// Simple sidebar component
function SimpleSidebar() {
    return (
        <div className="md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 hidden md:block">
            <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pt-5 overflow-y-auto h-full">
                <div className="hidden md:flex items-center justify-center h-16 flex-shrink-0 px-4">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">B</div>
                        <span className="text-xl font-bold">BrandSphere AI</span>
                    </Link>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    <Link href="/dashboard" className="group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800">
                        <div className="mr-3 text-gray-900 dark:text-gray-100">
                            <LayoutDashboard className="h-5 w-5" />
                        </div>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/settings" className="group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900">
                        <div className="mr-3 text-gray-500 dark:text-gray-400">
                            <Settings className="h-5 w-5" />
                        </div>
                        Settings
                    </Link>
                </nav>
            </div>
        </div>
    );
}

// Dashboard styles
const DashboardStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        :root {
            --navy-blue-50: #f0f5fa;
            --navy-blue-100: #dae3f3;
            --navy-blue-600: #1e3a8a;
            --navy-blue-700: #172554;
            --navy-blue-800: #0f172a;
            --navy-blue-900: #0a0f1a;
        }

        body, html {
            overflow-x: hidden;
            background-color: hsl(var(--background));
        }
        
        .dashboard-container {
            display: flex;
            min-height: 100vh;
            width: 100%;
        }
        
        .dashboard-content {
            flex: 1;
            width: 100%;
            padding-left: 0;
        }

        .page-title {
            font-size: 1.875rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 0.5rem;
        }

        .page-description {
            color: hsl(var(--muted-foreground));
            font-size: 0.875rem;
        }
        
        @media (min-width: 768px) {
            .dashboard-content {
                padding-left: 16rem;
            }
        }
    ` }} />
);

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <DashboardStyles />
            <div className="dashboard-container">
                {/* Sidebar navigation */}
                <SimpleSidebar />

                {/* Main content area */}
                <main className="dashboard-content p-4 md:p-8">
                    {children}
                </main>
            </div>
        </>
    );
} 