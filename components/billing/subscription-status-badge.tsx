'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused';

interface SubscriptionStatusBadgeProps {
    status: string;
    className?: string;
}

export default function SubscriptionStatusBadge({
    status,
    className,
}: SubscriptionStatusBadgeProps) {
    const getVariant = (status: string) => {
        switch (status) {
            case 'active':
            case 'trialing':
                return 'success';
            case 'canceled':
                return 'warning';
            case 'past_due':
            case 'unpaid':
            case 'incomplete':
            case 'incomplete_expired':
                return 'destructive';
            case 'paused':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'canceled':
                return 'Canceled';
            case 'past_due':
                return 'Past Due';
            case 'unpaid':
                return 'Unpaid';
            case 'incomplete':
                return 'Incomplete';
            case 'incomplete_expired':
                return 'Expired';
            case 'trialing':
                return 'Trial';
            case 'paused':
                return 'Paused';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const variant = getVariant(status);
    const label = getLabel(status);

    return (
        <Badge
            variant={variant as any}
            className={cn('capitalize', className)}
        >
            {label}
        </Badge>
    );
} 