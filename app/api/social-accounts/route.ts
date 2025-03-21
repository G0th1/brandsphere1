import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { socialMediaService } from '@/services/social-media';

// GET /api/social-accounts - Get all social accounts for the current user
export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // In a real app, we would use the user's ID from the session
        // to fetch their connected accounts from the database
        const accounts = await socialMediaService.getAccounts();

        return NextResponse.json(accounts);
    } catch (error) {
        console.error('Error fetching social accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch social accounts' },
            { status: 500 }
        );
    }
}

// POST /api/social-accounts - Connect a new social account
export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get connection data from request body
        const data = await req.json();
        const { platform, authCode } = data;

        if (!platform || !authCode) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Connect the account
        const account = await socialMediaService.connect(platform, authCode);

        if (!account) {
            return NextResponse.json(
                { error: 'Failed to connect account' },
                { status: 500 }
            );
        }

        return NextResponse.json(account);
    } catch (error) {
        console.error('Error connecting social account:', error);
        return NextResponse.json(
            { error: 'Failed to connect social account' },
            { status: 500 }
        );
    }
} 