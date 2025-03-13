import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
// Import Supabase conditionally to avoid build errors
let supabaseAdmin: any = null;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdmin = require("@/lib/supabase").supabaseAdmin;
  }
} catch (error) {
  console.warn("Supabase configuration missing or invalid. Supabase features disabled.");
}
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (!webhookSecret) {
      throw new Error("Stripe webhook secret is missing");
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      // New subscription created
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        if (checkoutSession.mode === "subscription") {
          const subscriptionId = checkoutSession.subscription as string;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = checkoutSession.customer as string;
          const userId = checkoutSession.metadata?.userId;
          const plan = checkoutSession.metadata?.plan;
          const billingCycle = checkoutSession.metadata?.billingCycle || "monthly";

          if (userId && plan) {
            await db.subscription.upsert({
              where: { userId },
              update: {
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                plan,
                status: "active",
                billingCycle: billingCycle as "monthly" | "annually",
              },
              create: {
                userId,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                plan,
                status: "active",
                billingCycle: billingCycle as "monthly" | "annually",
              },
            });
          }
        }
        break;
      }

      // Subscription updated (e.g., upgrade/downgrade)
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = invoice.customer as string;

        // Find user from Stripe customer metadata
        const stripeCustomer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = stripeCustomer.metadata?.userId;

        if (userId && subscription.status === "active") {
          // Find price information
          const priceId = subscription.items.data[0]?.price.id;
          let plan = "Pro"; // Default

          // Identify plan based on metadata or pricing
          if (subscription.metadata?.plan) {
            plan = subscription.metadata.plan;
          }

          // Identify billing period
          const interval = subscription.items.data[0]?.price.recurring?.interval;
          const billingCycle = interval === "year" ? "annually" : "monthly";

          await db.subscription.update({
            where: { userId },
            data: {
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              plan,
              status: "active",
              billingCycle,
            },
          });
        }
        break;
      }

      // Subscription ended
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user from Stripe customer
        const stripeCustomer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = stripeCustomer.metadata?.userId;

        if (userId) {
          await db.subscription.update({
            where: { userId },
            data: {
              status: "canceled",
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      // Subscription updated
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user from Stripe customer
        const stripeCustomer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = stripeCustomer.metadata?.userId;

        if (userId) {
          if (subscription.status === "active") {
            await db.subscription.update({
              where: { userId },
              data: {
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: "active",
              },
            });
          } else if (subscription.status === "canceled") {
            // Subscription cancels at end of period
            await db.subscription.update({
              where: { userId },
              data: {
                status: "canceled",
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
          } else if (
            ["unpaid", "past_due", "incomplete", "incomplete_expired"].includes(subscription.status)
          ) {
            // Subscription has payment issues
            await db.subscription.update({
              where: { userId },
              data: {
                status: subscription.status === "unpaid"
                  ? "unpaid"
                  : subscription.status === "past_due"
                    ? "past_due"
                    : "inactive",
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Helper to update user subscription in Supabase
async function updateUserSubscription(
  customerId: string,
  subscription: Stripe.Subscription
) {
  // Skip Supabase operations if not configured
  if (!supabaseAdmin) {
    console.log('Supabase not configured, skipping updateUserSubscription');
    return;
  }

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

// Helper to delete user subscription in Supabase
async function deleteUserSubscription(
  customerId: string,
  subscriptionId: string
) {
  // Skip Supabase operations if not configured
  if (!supabaseAdmin) {
    console.log('Supabase not configured, skipping deleteUserSubscription');
    return;
  }

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

    // Update subscription status to canceled
    await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'canceled',
      })
      .eq('id', userId);

    // Update the subscription record
    const { error: subError } = await supabaseAdmin
      .from('stripe_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (subError) {
      console.error('Error updating subscription details:', subError);
    }
  } catch (error) {
    console.error('Error deleting user subscription:', error);
  }
} 