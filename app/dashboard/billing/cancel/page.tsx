import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { XCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Subscription Cancelled - BrandSphere',
    description: 'Your subscription purchase was cancelled',
};

export default async function SubscriptionCancelPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/dashboard/billing/cancel');
    }

    return (
        <div className="container max-w-md py-16">
            <Card className="border-amber-200 shadow-md">
                <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <XCircleIcon className="h-10 w-10 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-amber-700">
                        Subscription Cancelled
                    </CardTitle>
                    <CardDescription className="text-amber-600">
                        Your subscription purchase was not completed
                    </CardDescription>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p>
                        You've cancelled the subscription process. No charges have been made to your account.
                    </p>

                    <p className="text-sm text-muted-foreground">
                        If you encountered any issues during the checkout process or have questions about our plans, please don't hesitate to contact our support team.
                    </p>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    <Button className="w-full" asChild>
                        <a href="/pricing">View Plans</a>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                        <a href="/dashboard">Return to Dashboard</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 