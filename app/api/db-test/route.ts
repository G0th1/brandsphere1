import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Use Prisma's $queryRaw instead of execute method
        const result = await db.$queryRaw`SELECT NOW() as timestamp`;

        return NextResponse.json({
            status: 'connected',
            message: 'Database connection successful',
            timestamp: result[0].timestamp,
        });
    } catch (error) {
        console.error('Database connection error:', error);

        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to database',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
} 