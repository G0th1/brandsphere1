import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initiera Stripe-klienten
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-02-24.acacia',
});

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

        // Här skulle du anropa din betalningsleverantör (t.ex. Stripe) för att avsluta prenumerationen
        // och sedan uppdatera din databasmodell
        // 
        // Exempel (med Stripe):
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
        // 
        // await prisma.subscription.update({
        //     where: { id: subscriptionId },
        //     data: { status: 'canceled' }
        // });

        // För demo returnerar vi mockdata
        const updatedSubscription = {
            id: subscriptionId,
            status: 'canceled',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            plan: 'Pro',
            billingCycle: 'monthly'
        };

        return NextResponse.json(updatedSubscription);
    } catch (error) {
        console.error('Fel vid avslutning av prenumeration:', error);
        return NextResponse.json(
            { error: 'Serverfel vid avslutning av prenumeration' },
            { status: 500 }
        );
    }
} 