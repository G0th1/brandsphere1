import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Instagram uses the same app as Facebook (Meta)
const INSTAGRAM_APP_ID = process.env.META_APP_ID || '';
const INSTAGRAM_APP_SECRET = process.env.META_APP_SECRET || '';
const INSTAGRAM_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/instagram`;

// Instagram OAuth endpoint (utilizes Facebook's OAuth system)
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
            timestamp: Date.now(),
            platform: 'instagram'
        })).toString('base64');

        // Construct OAuth URL - Instagram uses Facebook's OAuth
        const authUrl = new URL('https://www.facebook.com/v16.0/dialog/oauth');
        authUrl.searchParams.append('client_id', INSTAGRAM_APP_ID);
        authUrl.searchParams.append('redirect_uri', INSTAGRAM_REDIRECT_URI);
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', 'instagram_basic,instagram_content_publish,pages_show_list');

        // Redirect to Instagram auth page (via Facebook)
        return NextResponse.redirect(authUrl.toString());

    } catch (error) {
        console.error('Instagram OAuth error:', error);

        // Redirect to error page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=instagram_oauth_error`);
    }
} 