"use client";

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
// Here you would import your database connection, for example:
// import { supabase } from '@/lib/supabase';
import { sendFailedPaymentNotification } from '@/lib/email/payment-notification';

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Webhook Secret from Stripe Dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    // Verify that the request comes from Stripe
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different types of events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handler functions for different event types

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Get customer email and metadata
    const customerId = session.customer as string;
    const customerEmail = session.customer_details?.email || '';
    const planName = session.metadata?.planName || 'Pro';
    const billingCycle = session.metadata?.billingCycle || 'monthly';

    // Get subscription ID if available
    let subscriptionId = session.subscription as string;

    console.log(`Checkout completed for ${customerEmail}. Plan: ${planName}, Billing: ${billingCycle}`);

    // Here you would update your database, for example:
    /*
    const { data, error } = await supabase
      .from('users')
      .update({
        stripe_customer_id: customerId,
        subscription_id: subscriptionId,
        plan: planName,
        billing_cycle: billingCycle,
        subscription_status: 'active',
        subscription_updated_at: new Date()
      })
      .eq('email', customerEmail);
      
    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    */
  } catch (error: any) {
    console.error('Error handling checkout.session.completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // Get subscription information
    const customerId = subscription.customer as string;
    const status = subscription.status;
    const planId = subscription.items.data[0]?.plan.id;

    // Get customer information from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    // Ensure the customer is not deleted and has an email address
    const customerEmail = (typeof customer !== 'string' && !customer.deleted) ? customer.email || '' : '';

    console.log(`Subscription created for customer: ${customerId}. Status: ${status}, Plan: ${planId}`);

    // Here you would update your database, for example:
    /*
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        user_email: customerEmail,
        status: status,
        plan_id: planId,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end
      });
      
    if (error) {
      throw new Error(`Failed to create subscription record: ${error.message}`);
    }
    */
  } catch (error: any) {
    console.error('Error handling subscription.created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const subscriptionId = subscription.id;
    const customerId = subscription.customer as string;
    const status = subscription.status;
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;

    console.log(`Subscription updated: ${subscriptionId}. Status: ${status}`);

    // Here you would update your database, for example:
    /*
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: cancelAtPeriodEnd,
        updated_at: new Date()
      })
      .eq('stripe_subscription_id', subscriptionId);
      
    if (error) {
      throw new Error(`Failed to update subscription record: ${error.message}`);
    }

    // Also update the user's subscription status
    const userUpdate = await supabase
      .from('users')
      .update({
        subscription_status: status,
        subscription_updated_at: new Date()
      })
      .eq('stripe_customer_id', customerId);
    */
  } catch (error: any) {
    console.error('Error handling subscription.updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const subscriptionId = subscription.id;
    const customerId = subscription.customer as string;

    console.log(`Subscription deleted: ${subscriptionId}`);

    // Here you would update your database, for example:
    /*
    // Update subscription table
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date(),
        updated_at: new Date()
      })
      .eq('stripe_subscription_id', subscriptionId);
      
    if (error) {
      throw new Error(`Failed to update subscription record: ${error.message}`);
    }

    // Update user table
    const userUpdate = await supabase
      .from('users')
      .update({
        subscription_status: 'canceled',
        plan: 'free',
        subscription_updated_at: new Date()
      })
      .eq('stripe_customer_id', customerId);
    */
  } catch (error: any) {
    console.error('Error handling subscription.deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    const customerId = invoice.customer as string;
    const amount = invoice.amount_paid;

    console.log(`Payment succeeded for invoice: ${invoice.id}. Amount: ${amount / 100}`);

    // Here you would update your database, for example:
    /*
    // Log the payment
    const { data, error } = await supabase
      .from('payments')
      .insert({
        stripe_invoice_id: invoice.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        amount: amount / 100,
        currency: invoice.currency,
        status: 'paid',
        payment_date: new Date()
      });
      
    if (error) {
      throw new Error(`Failed to log payment: ${error.message}`);
    }
    */
  } catch (error: any) {
    console.error('Error handling invoice.payment_succeeded:', error);
  }
}

// Custom type definition to handle last_payment_error from Stripe
interface StripeError {
  message?: string;
  code?: string;
  type?: string;
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    const customerId = invoice.customer as string;

    console.log(`Payment failed for invoice: ${invoice.id}`);

    // Get additional information about the invoice and customer
    const { payment_intent } = invoice;

    // Get customer information to send notification
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (typeof customer !== 'string' && !customer.deleted) ? customer.email || '' : '';
    const customerName = (typeof customer !== 'string' && !customer.deleted) ? customer.name || 'Valued Customer' : 'Valued Customer';

    // Get payment method if available
    let paymentMethodDetails = 'Credit Card';
    let failureReason = 'There was an issue processing your payment. It may be declined, expired, or have insufficient funds.';

    if (typeof payment_intent === 'string' && payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

        // Get reason for failed payment from paymentIntent
        if (paymentIntent.last_payment_error) {
          failureReason = paymentIntent.last_payment_error.message || failureReason;
        }

        const pmId = paymentIntent.payment_method as string;
        if (pmId) {
          const paymentMethod = await stripe.paymentMethods.retrieve(pmId);
          if (paymentMethod.type === 'card' && paymentMethod.card) {
            paymentMethodDetails = `${paymentMethod.card.brand.toUpperCase()} ending in ${paymentMethod.card.last4}`;
          }
        }
      } catch (e) {
        console.error('Error fetching payment intent details:', e);
      }
    }

    // Create a link for the customer to update their payment method
    const retryLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings/payment?invoice=${invoice.id}`;

    // Log failed payment in database
    /*
    const { data, error } = await supabase
      .from('payments')
      .insert({
        stripe_invoice_id: invoice.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        status: 'failed',
        payment_date: new Date()
      });
      
    if (error) {
      throw new Error(`Failed to log failed payment: ${error.message}`);
    }
    */

    // Send email notification to customer about failed payment
    if (customerEmail) {
      try {
        await sendFailedPaymentNotification({
          email: customerEmail,
          customerName,
          invoiceId: invoice.id,
          amount: invoice.amount_due / 100,
          paymentMethod: paymentMethodDetails,
          failureReason,
          retryLink,
          // Get user's language preference from database
          // For demo purposes we use English as default
          language: 'en'
        });

        console.log(`Payment failure notification sent to ${customerEmail}`);
      } catch (emailError) {
        console.error('Failed to send payment failure email:', emailError);
      }
    }
  } catch (error: any) {
    console.error('Error handling invoice.payment_failed:', error);
  }
} 