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

    // If bypass is requested, return success without checking DB
    if (bypassDb) {
        return NextResponse.json({
            success: true,
            message: 'Database check bypassed',
            mode: 'demo'
        });
    }

    // Regular database check
    try {
        // Attempt a simple database query
        await db.$queryRaw`SELECT 1 as test`;

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
        });
    } catch (error) {
        console.error('Database health check failed:', error);

        // Return error response with appropriate status code
        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: process.env.NODE_ENV === 'development' ? String(error) : 'Internal server error'
        }, { status: 500 });
    }
} 