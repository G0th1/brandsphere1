import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

// Client component is imported dynamically to prevent server component issues
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const AccountsContent = dynamic(
    () => import('@/app/components/accounts/accounts-content'),
    {
        ssr: false,
        loading: () => (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading accounts...</p>
                </div>
            </div>
        )
    }
);

export default function AccountsPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <Suspense fallback={
                <Card>
                    <CardContent className="flex justify-center items-center py-12">
                        <Spinner size="lg" />
                    </CardContent>
                </Card>
            }>
                <AccountsContent />
            </Suspense>
        </div>
    );
} 