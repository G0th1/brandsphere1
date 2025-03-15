import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        // Hämta användarsession
        const session = await getServerSession(authOptions);

        if (!session?.user || !session?.user.email) {
            return NextResponse.json({
                message: "Unauthorized access. Please log in."
            }, { status: 401 });
        }

        // Hämta data från request
        const { priceId, plan, interval } = await req.json();

        if (!priceId || !plan || !interval) {
            return NextResponse.json({
                message: "Missing required parameters: priceId, plan, or interval"
            }, { status: 400 });
        }

        // Hitta användaren i databasen
        const user = await db.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                subscription: true,
            },
        });

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 });
        }

        // Få eller skapa Stripe-kund
        let stripeCustomerId = user.subscription?.stripeCustomerId;

        // Om användaren inte har ett Stripe-kund-ID, skapa en ny kund
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: {
                    userId: user.id,
                },
            });

            stripeCustomerId = customer.id;

            // Uppdatera eller skapa prenumeration i databasen
            await db.subscription.upsert({
                where: { userId: user.id },
                update: { stripeCustomerId },
                create: {
                    userId: user.id,
                    stripeCustomerId,
                    plan: "Free",
                    status: "inactive",
                    billingCycle: interval === "year" ? "annually" : "monthly",
                },
            });
        }

        // Hämta domänens bas-URL
        const billingUrl = absoluteUrl("/dashboard/billing");

        // Skapa en Stripe Checkout-session
        const stripeSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${billingUrl}?success=true`,
            cancel_url: `${billingUrl}?canceled=true`,
            metadata: {
                userId: user.id,
                plan,
                billingCycle: interval === "year" ? "annually" : "monthly",
            },
            billing_address_collection: "auto",
            payment_method_types: ["card"],
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({
            message: "Failed to create checkout session. Please try again."
        }, { status: 500 });
    }
} 