import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface PlatformConfig {
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    apiUrl: string;
}

// Map of platform configurations
const platformConfigs: Record<string, PlatformConfig> = {
    twitter: {
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        clientId: process.env.TWITTER_CLIENT_ID || '',
        clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/twitter`,
        apiUrl: 'https://api.twitter.com/2'
    },
    facebook: {
        tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
        clientId: process.env.META_APP_ID || '',
        clientSecret: process.env.META_APP_SECRET || '',
        redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/facebook`,
        apiUrl: 'https://graph.facebook.com/v16.0'
    },
    instagram: {
        tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
        clientId: process.env.META_APP_ID || '',
        clientSecret: process.env.META_APP_SECRET || '',
        redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/instagram`,
        apiUrl: 'https://graph.facebook.com/v16.0'
    },
    linkedin: {
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        clientId: process.env.LINKEDIN_CLIENT_ID || '',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/linkedin`,
        apiUrl: 'https://api.linkedin.com/v2'
    },
    tiktok: {
        tokenUrl: 'https://open-api.tiktok.com/oauth/access_token/',
        clientId: process.env.TIKTOK_CLIENT_KEY || '',
        clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/tiktok`,
        apiUrl: 'https://open-api.tiktok.com'
    }
};

export async function GET(
    req: NextRequest,
    { params }: { params: { platform: string } }
) {
    try {
        const { platform } = params;
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        // Check for errors from OAuth provider
        if (error) {
            console.error(`${platform} OAuth error:`, error);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=${platform}_connection_failed&reason=${error}`
            );
        }

        // Validate code parameter
        if (!code) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=${platform}_connection_failed&reason=no_code`
            );
        }

        // Get platform configuration
        const config = platformConfigs[platform];
        if (!config) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=invalid_platform`
            );
        }

        // Get user session
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?callbackUrl=/dashboard/profile`
            );
        }

        // Validate state parameter (CSRF protection)
        // In a real implementation, you would verify the state from the database
        // Here we're just decoding the base64 state to get the user ID
        let decodedState;
        try {
            if (state) {
                decodedState = JSON.parse(Buffer.from(state, 'base64').toString());

                // Verify the user ID in the state matches the logged-in user
                if (decodedState.userId !== session.user.id) {
                    throw new Error('User ID mismatch in state parameter');
                }

                // Check if the state is expired (e.g., older than 10 minutes)
                const stateTimestamp = decodedState.timestamp;
                const currentTime = Date.now();
                if (currentTime - stateTimestamp > 10 * 60 * 1000) {
                    throw new Error('State parameter expired');
                }
            }
        } catch (e) {
            console.error('Error validating state parameter:', e);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=${platform}_connection_failed&reason=invalid_state`
            );
        }

        // Exchange the authorization code for an access token
        const tokenResponse = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code,
                redirect_uri: config.redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error(`Error exchanging code for token (${platform}):`, errorData);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=${platform}_connection_failed&reason=token_exchange_failed`
            );
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;
        const expiresIn = tokenData.expires_in;

        // Calculate token expiration date
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + (expiresIn || 3600));

        // Get user info from the platform API
        // Note: This differs by platform and would need to be implemented for each
        let accountId = '';
        let username = '';

        // Example for a generic implementation
        // In a real app, you would implement specific API calls for each platform

        // Save the connection to the database
        // In a real implementation, this would save to your actual database
        await db.socialAccount.upsert({
            where: {
                userId_platform: {
                    userId: session.user.id,
                    platform,
                },
            },
            update: {
                accessToken,
                refreshToken: refreshToken || null,
                expiresAt: expirationDate,
                accountId,
                username,
                lastUsed: new Date(),
            },
            create: {
                userId: session.user.id,
                platform,
                accessToken,
                refreshToken: refreshToken || null,
                expiresAt: expirationDate,
                accountId,
                username,
                lastUsed: new Date(),
            },
        });

        // Redirect back to the profile page with success message
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?success=${platform}_connected`
        );

    } catch (error) {
        console.error('OAuth callback error:', error);

        // Redirect to error page
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profile?error=oauth_callback_error`
        );
    }
} 