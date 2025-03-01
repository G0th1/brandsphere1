import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
// Never expose this key on the client side
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Force type to solve linter error
});

export async function POST(request: Request) {
  try {
    const { customerId, returnUrl } = await request.json();

    if (!customerId || !returnUrl) {
      return NextResponse.json(
        { error: 'Customer ID and return URL are required' },
        { status: 400 }
      );
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal link:', error);
    return NextResponse.json(
      { error: 'Failed to create portal link' },
      { status: 500 }
    );
  }
} 