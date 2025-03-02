import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

// Mockdata för demosyfte - ersätt med databasanrop i produktion
const mockSubscription = {
    id: "sub_mock123456",
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar framåt
    plan: 'Pro',
    billingCycle: 'monthly'
};

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Obehörig åtkomst", { status: 401 });
        }

        // Hämta användarens prenumerationsinformation
        const subscription = await db.subscription.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        // Om användaren inte har en prenumeration, returnera standard Free-plan
        if (!subscription) {
            return NextResponse.json({
                plan: "Free",
                status: "inactive",
                billingCycle: "monthly",
                currentPeriodEnd: null,
            });
        }

        // Hämta uppdaterad information från Stripe om användaren har en aktiv prenumeration
        if (subscription.stripeSubscriptionId && subscription.status === "active") {
            try {
                const stripeSubscription = await stripe.subscriptions.retrieve(
                    subscription.stripeSubscriptionId
                );

                // Uppdatera prenumerationsinformation i databasen om det behövs
                if (new Date(stripeSubscription.current_period_end * 1000).getTime() !==
                    subscription.stripeCurrentPeriodEnd?.getTime()) {
                    await db.subscription.update({
                        where: {
                            userId: session.user.id,
                        },
                        data: {
                            status: stripeSubscription.status,
                            stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                        },
                    });
                }
            } catch (error) {
                console.error("Fel vid hämtning av prenumeration från Stripe:", error);
            }
        }

        // Hämta den uppdaterade prenumerationen för att returnera till klienten
        const updatedSubscription = await db.subscription.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        return NextResponse.json(updatedSubscription);
    } catch (error) {
        console.error("Subscription API error:", error);
        return new NextResponse("Internt serverfel", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Obehörig åtkomst", { status: 401 });
        }

        const body = await req.json();
        const { action } = body;

        // Hämta användarens prenumerationsinformation
        const subscription = await db.subscription.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        if (!subscription) {
            return new NextResponse("Ingen prenumeration hittades", { status: 404 });
        }

        let result;

        // Hantera olika åtgärder för prenumerationen
        switch (action) {
            case "cancel":
                if (!subscription.stripeSubscriptionId) {
                    return new NextResponse("Ingen aktiv prenumeration att avbryta", { status: 400 });
                }

                result = await stripe.subscriptions.update(
                    subscription.stripeSubscriptionId,
                    { cancel_at_period_end: true }
                );

                await db.subscription.update({
                    where: {
                        userId: session.user.id,
                    },
                    data: {
                        status: "canceled",
                    },
                });

                break;

            case "reactivate":
                if (!subscription.stripeSubscriptionId) {
                    return new NextResponse("Ingen prenumeration att återaktivera", { status: 400 });
                }

                result = await stripe.subscriptions.update(
                    subscription.stripeSubscriptionId,
                    { cancel_at_period_end: false }
                );

                await db.subscription.update({
                    where: {
                        userId: session.user.id,
                    },
                    data: {
                        status: "active",
                    },
                });

                break;

            case "change_plan":
                const { newPriceId, newPlan } = body;

                if (!newPriceId || !newPlan) {
                    return new NextResponse("Nytt pris-ID och plan krävs", { status: 400 });
                }

                if (subscription.stripeSubscriptionId) {
                    // Uppdatera befintlig prenumeration
                    result = await stripe.subscriptions.update(
                        subscription.stripeSubscriptionId,
                        {
                            items: [
                                {
                                    id: (await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)).items.data[0].id,
                                    price: newPriceId,
                                },
                            ],
                            metadata: {
                                plan: newPlan,
                            },
                        }
                    );

                    await db.subscription.update({
                        where: {
                            userId: session.user.id,
                        },
                        data: {
                            stripePriceId: newPriceId,
                            plan: newPlan,
                            stripeCurrentPeriodEnd: new Date(result.current_period_end * 1000),
                        },
                    });
                } else {
                    return new NextResponse("Ingen aktiv prenumeration att uppdatera", { status: 400 });
                }

                break;

            default:
                return new NextResponse("Ogiltig åtgärd", { status: 400 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Subscription update error:", error);
        return new NextResponse("Internt serverfel", { status: 500 });
    }
} 