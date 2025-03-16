import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Facebook OAuth configuration
const FACEBOOK_APP_ID = process.env.META_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.META_APP_SECRET || '';
const FACEBOOK_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/facebook`;

// Facebook OAuth endpoint
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
        const authUrl = new URL('https://www.facebook.com/v16.0/dialog/oauth');
        authUrl.searchParams.append('client_id', FACEBOOK_APP_ID);
        authUrl.searchParams.append('redirect_uri', FACEBOOK_REDIRECT_URI);
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish');

        // Redirect to Facebook auth page
        return NextResponse.redirect(authUrl.toString());

    } catch (error) {
        console.error('Facebook OAuth error:', error);

        // Redirect to error page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=facebook_oauth_error`);
    }
} 