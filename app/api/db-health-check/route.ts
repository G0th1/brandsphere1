import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint to verify database connectivity
 * Includes a bypass option for demo mode
 */
export async function GET(request: Request) {
    // Check for bypass flag in URL
    const url = new URL(request.url);
    const bypassDb = url.searchParams.get('bypass_db') === 'true';

    // Get browser compatibility info from headers
    const userAgent = request.headers.get('user-agent') || '';
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1;
    const isCompatMode = request.headers.get('X-Browser-Compat') === 'true';

    // If bypass is requested, return success without checking DB
    if (bypassDb) {
        return NextResponse.json({
            success: true,
            message: 'Database check bypassed',
            mode: 'demo'
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Browser-Compat'
            }
        });
    }

    // For non-Chrome browsers without compat mode, provide special handling
    if (!isChrome && !isCompatMode) {
        console.log('Non-Chrome browser detected without compatibility mode');
        // Set cookies to help with cross-browser compatibility
        const headers = new Headers({
            'Cache-Control': 'no-store, max-age=0',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Browser-Compat',
            'Access-Control-Allow-Credentials': 'true',
            'Set-Cookie': 'db-compat=true; path=/; SameSite=None; Secure'
        });

        return NextResponse.json({
            success: true,
            message: 'Database compatibility mode enabled',
            browser: { isChrome, userAgent }
        }, { headers });
    }

    // Regular database check
    try {
        // Attempt a simple database query
        await db.$queryRaw`SELECT 1 as test`;

        // Return success response with CORS headers
        const headers = new Headers({
            'Cache-Control': 'no-store, max-age=0',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Browser-Compat',
            'Access-Control-Allow-Credentials': 'true'
        });

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            browser: { isChrome, userAgent }
        }, { headers });
    } catch (error) {
        console.error('Database health check failed:', error);

        // Return error response with appropriate status code and CORS headers
        const headers = new Headers({
            'Cache-Control': 'no-store, max-age=0',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Browser-Compat',
            'Access-Control-Allow-Credentials': 'true'
        });

        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: process.env.NODE_ENV === 'development' ? String(error) : 'Internal server error',
            browser: { isChrome, userAgent }
        }, {
            status: 500,
            headers
        });
    }
} 