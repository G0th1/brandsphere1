import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Force type to solve linter error
});

// Webhook secret from Stripe dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialize Supabase Admin client for direct database access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer and subscription details
        if (session.customer && session.subscription) {
          const customerId = session.customer.toString();
          const subscriptionId = session.subscription.toString();
          
          // Get the full subscription object
          const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['items.data.price', 'customer'],
          });
          
          // Update the user's subscription status in the database
          await updateUserSubscription(
            customerId,
            subscription
          );
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Retrieve the full subscription with expanded objects
        const fullSubscription = await stripe.subscriptions.retrieve(subscription.id, {
          expand: ['items.data.price', 'customer'],
        });
        
        await updateUserSubscription(
          fullSubscription.customer.toString(),
          fullSubscription
        );
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await deleteUserSubscription(
          subscription.customer.toString(),
          subscription.id
        );
        break;
      }
      
      // Add more event handlers as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json(
      { error: 'Error handling webhook event' },
      { status: 500 }
    );
  }
}

// Helper to update user subscription in Supabase
async function updateUserSubscription(
  customerId: string,
  subscription: Stripe.Subscription
) {
  try {
    // First, find the user by Stripe customer ID
    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.error('Error finding user by customer ID:', userError);
      return;
    }
    
    const userId = users[0].id;
    const priceId = subscription.items.data[0].price.id;
    const price = subscription.items.data[0].price;
    
    // Update user subscription status
    await supabaseAdmin
      .from('users')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
      })
      .eq('id', userId);
    
    // Update or insert the detailed subscription information
    const { error: subError } = await supabaseAdmin
      .from('stripe_subscriptions')
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          price_id: priceId,
          plan_name: price.nickname || 'Pro',
          amount: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'stripe_subscription_id',
        }
      );
    
    if (subError) {
      console.error('Error updating subscription details:', subError);
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

// Helper to delete user subscription
async function deleteUserSubscription(
  customerId: string,
  subscriptionId: string
) {
  try {
    // Update user subscription status
    await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'canceled',
      })
      .eq('stripe_customer_id', customerId);
    
    // Update the subscription record
    await supabaseAdmin
      .from('stripe_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);
  } catch (error) {
    console.error('Error deleting user subscription:', error);
  }
} 