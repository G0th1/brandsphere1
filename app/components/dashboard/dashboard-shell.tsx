import { ReactNode } from "react";

interface DashboardShellProps {
    children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                    <div className="h-full py-6 pl-8 pr-6 lg:py-8">
                        {/* Sidebar content can be added here if needed */}
                    </div>
                </aside>
                <main className="flex w-full flex-col overflow-hidden p-4 md:py-8 md:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 