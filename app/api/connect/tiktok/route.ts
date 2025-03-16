import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// TikTok OAuth configuration
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';
const TIKTOK_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/tiktok`;

// TikTok OAuth endpoint
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

        // Generate CSRF state token
        const csrfState = uuidv4();

        // Store state with user ID for verification during callback
        // In a real implementation, you would store this in a database or Redis
        // Store mapping of csrfState -> session.user.id

        // Construct OAuth URL
        const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
        authUrl.searchParams.append('client_key', TIKTOK_CLIENT_KEY);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', 'user.info.basic,video.publish');
        authUrl.searchParams.append('redirect_uri', TIKTOK_REDIRECT_URI);
        authUrl.searchParams.append('state', csrfState);

        // Redirect to TikTok auth page
        return NextResponse.redirect(authUrl.toString());

    } catch (error) {
        console.error('TikTok OAuth error:', error);

        // Redirect to error page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=tiktok_oauth_error`);
    }
} 