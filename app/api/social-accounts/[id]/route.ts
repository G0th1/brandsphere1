import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { socialMediaService } from '@/services/social-media';

// DELETE /api/social-accounts/[id] - Disconnect a social account
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const accountId = params.id;
        if (!accountId) {
            return NextResponse.json(
                { error: 'Account ID is required' },
                { status: 400 }
            );
        }

        // Disconnect the account
        const success = await socialMediaService.disconnect(accountId);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to disconnect account' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error disconnecting social account:', error);
        return NextResponse.json(
            { error: 'Failed to disconnect social account' },
            { status: 500 }
        );
    }
}

// GET /api/social-accounts/[id] - Get a specific social account
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const accountId = params.id;
        if (!accountId) {
            return NextResponse.json(
                { error: 'Account ID is required' },
                { status: 400 }
            );
        }

        // Get all accounts and find the requested one
        const accounts = await socialMediaService.getAccounts();
        const account = accounts.find(acc => acc.id === accountId);

        if (!account) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(account);
    } catch (error) {
        console.error('Error fetching social account:', error);
        return NextResponse.json(
            { error: 'Failed to fetch social account' },
            { status: 500 }
        );
    }
} 