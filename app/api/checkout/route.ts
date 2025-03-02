import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initiera Stripe-klienten
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // Parsa begärans body
        const body = await request.json();
        const { priceId, planName, billingCycle, successUrl, cancelUrl } = body;

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            );
        }

        // Använd skickade URL:er eller fallback till standardvärden
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const success_url = successUrl ? `${baseUrl}${successUrl}` : `${baseUrl}/dashboard/subscribe/success?plan=${encodeURIComponent(planName || 'Pro')}`;
        const cancel_url = cancelUrl ? `${baseUrl}${cancelUrl}` : `${baseUrl}/pricing?canceled=true`;

        // Skapa en Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url,
            cancel_url,
            metadata: {
                planName,
                billingCycle
            },
            // Lägg till en 24-timmars utgångstid på sessionen
            expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        });

        // Returnera checkout URL
        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
} 