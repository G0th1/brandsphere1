import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Twitter OAuth configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_API_KEY || '';
const TWITTER_CLIENT_SECRET = process.env.TWITTER_API_SECRET || '';
const TWITTER_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/twitter`;

// Twitter OAuth endpoint
export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Generate state parameter for security (to prevent CSRF)
        const state = Buffer.from(JSON.stringify({
            userId: session.user.id,
            timestamp: Date.now()
        })).toString('base64');

        // Save state to session/database for verification during callback

        // Construct OAuth URL
        const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
        authUrl.searchParams.append('client_id', TWITTER_CLIENT_ID);
        authUrl.searchParams.append('redirect_uri', TWITTER_REDIRECT_URI);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
        authUrl.searchParams.append('state', state);

        // Redirect to Twitter auth page
        return NextResponse.redirect(authUrl.toString());

    } catch (error) {
        console.error('Twitter OAuth error:', error);

        // Redirect to error page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=twitter_oauth_error`);
    }
} 