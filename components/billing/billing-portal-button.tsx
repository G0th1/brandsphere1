'use client';

import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface BillingPortalButtonProps extends ButtonProps {
    customerId?: string | null;
}

export default function BillingPortalButton({
    customerId,
    className,
    children,
    ...props
}: BillingPortalButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleClick = async () => {
        if (!customerId) {
            toast({
                title: 'No subscription found',
                description: 'You don\'t have an active subscription to manage.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/stripe/create-portal-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    returnUrl: `${window.location.origin}/dashboard/billing`,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create portal link');
            }

            const { url } = await response.json();

            // Redirect to Stripe Billing Portal
            window.location.href = url;
        } catch (error) {
            console.error('Error creating portal link:', error);
            toast({
                title: 'Error',
                description: 'Failed to access the billing portal. Please try again later.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="default"
            onClick={handleClick}
            disabled={isLoading || !customerId}
            className={cn(className)}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Redirecting...
                </>
            ) : (
                children || 'Manage Subscription'
            )}
        </Button>
    );
} 