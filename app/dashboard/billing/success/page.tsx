import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Subscription Successful - BrandSphere',
    description: 'Your subscription has been successfully activated',
};

export default async function SubscriptionSuccessPage({
    searchParams,
}: {
    searchParams: { session_id?: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/login?callbackUrl=/dashboard/billing/success');
    }

    // Verify the checkout session ID if needed
    const checkoutSessionId = searchParams.session_id;

    return (
        <div className="container max-w-md py-16">
            <Card className="border-green-200 shadow-md">
                <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircleIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700">
                        Subscription Successful!
                    </CardTitle>
                    <CardDescription className="text-green-600">
                        Your subscription has been successfully activated
                    </CardDescription>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p>
                        Thank you for subscribing to BrandSphere. Your account has been upgraded and you now have access to all the features included in your plan.
                    </p>

                    <p className="text-sm text-muted-foreground">
                        A confirmation email has been sent to your registered email address with the details of your subscription.
                    </p>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    <Button className="w-full" asChild>
                        <a href="/dashboard">Go to Dashboard</a>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                        <a href="/dashboard/billing">Manage Subscription</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 