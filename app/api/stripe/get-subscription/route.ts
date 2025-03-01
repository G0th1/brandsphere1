import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
// Never expose this key on the client side
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Force type to solve linter error
});

export async function GET(request: Request) {
  try {
    // Get customerId from the URL
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    // Return the first active subscription, or null if none found
    if (subscriptions.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = subscriptions.data[0];
    const plan = subscription.items.data[0].price;

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: {
          id: plan.id,
          nickname: plan.nickname || '',
          amount: plan.unit_amount || 0,
          currency: plan.currency,
          interval: plan.recurring?.interval || 'month',
        },
      },
    });
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscription' },
      { status: 500 }
    );
  }
} 