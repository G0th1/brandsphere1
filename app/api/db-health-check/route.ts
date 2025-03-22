import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/prisma';
import { safeJsonResponse, errorResponse } from "@/lib/api-utils";

/**
 * API Route for checking database health
 * 
 * This endpoint performs a basic database query to verify connectivity
 * Used by the client to determine if there are database connection issues
 */
export async function GET(req: NextRequest) {
    try {
        const health = await checkDatabaseHealth();

        if (!health.ok) {
            return NextResponse.json({
                status: 'error',
                message: health.error || 'Database connection failed',
                timestamp: new Date().toISOString()
            }, { status: 503 });
        }

        return NextResponse.json({
            status: 'ok',
            responseTime: health.responseTime,
            message: 'Database connection successful',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database health check error:', error);

        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown database error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
    return safeJsonResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
} 