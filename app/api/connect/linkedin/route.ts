import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// LinkedIn OAuth configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const LINKEDIN_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/linkedin`;

// LinkedIn OAuth endpoint
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

        // Construct OAuth URL
        const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', LINKEDIN_CLIENT_ID);
        authUrl.searchParams.append('redirect_uri', LINKEDIN_REDIRECT_URI);
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', 'r_liteprofile r_emailaddress w_member_social');

        // Redirect to LinkedIn auth page
        return NextResponse.redirect(authUrl.toString());

    } catch (error) {
        console.error('LinkedIn OAuth error:', error);

        // Redirect to error page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=linkedin_oauth_error`);
    }
} 