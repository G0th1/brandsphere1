import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Hantera olika Stripe-händelser
    switch (event.type) {
        case "checkout.session.completed":
            if (session.mode === "subscription") {
                await handleSubscriptionCreated(session);
            }
            break;

        case "invoice.payment_succeeded":
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.subscription && invoice.customer) {
                await handleInvoicePaid(invoice);
            }
            break;

        case "customer.subscription.updated":
        case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdated(subscription);
            break;

        default:
            console.log(`Ohanterad händelse: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
    try {
        // Användaren måste finnas i metadata
        const userId = session.metadata?.userId;
        if (!userId) {
            throw new Error("Användaren saknas i sessions metadata");
        }

        // Hämta Stripe-prenumerationen för att få mer information
        if (!session.subscription) {
            throw new Error("Ingen prenumeration hittades i sessionen");
        }

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        // Uppdatera användarens prenumerationsinformation i databasen
        await db.subscription.update({
            where: {
                userId,
            },
            data: {
                stripeSubscriptionId: subscription.id,
                status: subscription.status,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                plan: session.metadata?.plan || "Pro",
            },
        });

        console.log(`Prenumeration skapad för användare: ${userId}`);
    } catch (error) {
        console.error("Fel vid prenumerationshantering:", error);
    }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    try {
        // Hämta prenumerationen från Stripe
        const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
        );

        // Hitta användaren baserat på Stripe-kund-ID
        const user = await db.subscription.findFirst({
            where: {
                stripeCustomerId: invoice.customer as string,
            },
            select: {
                userId: true,
            },
        });

        if (!user) {
            throw new Error(`Ingen användare hittades för kund: ${invoice.customer}`);
        }

        // Uppdatera prenumerationsdetaljer
        await db.subscription.update({
            where: {
                userId: user.userId,
            },
            data: {
                status: subscription.status,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });

        console.log(`Faktura betald för användare med ID: ${user.userId}`);
    } catch (error) {
        console.error("Fel vid fakturahantering:", error);
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
        // Hitta användaren baserat på Stripe-prenumerations-ID
        const user = await db.subscription.findFirst({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            select: {
                userId: true,
            },
        });

        if (!user) {
            throw new Error(`Ingen användare hittades för prenumeration: ${subscription.id}`);
        }

        // Uppdatera prenumerationsstatus och period i databasen
        await db.subscription.update({
            where: {
                userId: user.userId,
            },
            data: {
                status: subscription.status,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });

        console.log(`Prenumeration uppdaterad för användare: ${user.userId}, status: ${subscription.status}`);
    } catch (error) {
        console.error("Fel vid prenumerationsuppdatering:", error);
    }
} 