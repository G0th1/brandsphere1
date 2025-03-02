import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe client with API key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

/**
 * API route handler to resume a cancelled subscription
 * This handles the POST request to resume a subscription that was cancelled but not yet expired
 */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subscriptionId } = body;

        if (!subscriptionId) {
            return NextResponse.json(
                { error: 'Prenumerations-ID saknas' },
                { status: 400 }
            );
        }

        // Här skulle du anropa din betalningsleverantör (t.ex. Stripe) för att återuppta prenumerationen
        // och sedan uppdatera din databasmodell
        // 
        // Exempel (med Stripe):
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });
        // 
        // await prisma.subscription.update({
        //     where: { id: subscriptionId },
        //     data: { status: 'active' }
        // });

        // För demo returnerar vi mockdata
        const updatedSubscription = {
            id: subscriptionId,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            plan: 'Pro',
            billingCycle: 'monthly'
        };

        return NextResponse.json(updatedSubscription);
    } catch (error) {
        console.error('Fel vid återupptagning av prenumeration:', error);
        return NextResponse.json(
            { error: 'Serverfel vid återupptagning av prenumeration' },
            { status: 500 }
        );
    }
} 