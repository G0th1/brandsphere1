import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Simple health check endpoint to verify database connectivity
 */
export async function GET() {
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