import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// DELETE endpoint to disconnect a social media account
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get user session
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        // Validate ID parameter
        if (!id) {
            return NextResponse.json(
                { error: 'Invalid account ID' },
                { status: 400 }
            );
        }

        // Verify the account belongs to the current user
        const account = await db.socialAccount.findUnique({
            where: { id },
            select: { userId: true, platform: true },
        });

        if (!account) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        if (account.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'You are not authorized to disconnect this account' },
                { status: 403 }
            );
        }

        // Handle platform-specific revocation (optional)
        // This would revoke the token on the provider's end
        // Implementation depends on each platform's API

        // Delete the account from database
        await db.socialAccount.delete({
            where: { id },
        });

        // Return success response
        return NextResponse.json(
            {
                message: `Successfully disconnected ${account.platform} account`,
                disconnectedPlatform: account.platform
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error disconnecting social account:', error);

        return NextResponse.json(
            { error: 'Failed to disconnect account' },
            { status: 500 }
        );
    }
} 