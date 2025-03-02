import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mockdata för demosyfte - ersätt med databasanrop i produktion
const mockSubscription = {
    id: "sub_mock123456",
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar framåt
    plan: 'Pro',
    billingCycle: 'monthly'
};

export async function GET() {
    try {
        // Hämta den inloggade användarens session
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Här skulle du hämta användarens prenumerationsdata från din databasmodell
        // För demo-syften returnerar vi mockdata

        // const subscription = await prisma.subscription.findFirst({
        //     where: { userId: session.user.id }
        // });

        const subscription = mockSubscription;

        if (!subscription) {
            return NextResponse.json(
                { message: 'Ingen prenumeration hittad' },
                { status: 404 }
            );
        }

        return NextResponse.json(subscription);
    } catch (error) {
        console.error('Fel vid hämtning av prenumeration:', error);
        return NextResponse.json(
            { error: 'Serverfel vid hämtning av prenumerationsdata' },
            { status: 500 }
        );
    }
} 