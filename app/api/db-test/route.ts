import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Simple query to test connection
        const result = await db.execute('SELECT NOW() as timestamp');

        if (result && result.rows && result.rows.length > 0) {
            return NextResponse.json({
                status: 'connected',
                message: 'Database connection successful',
                timestamp: result.rows[0].timestamp,
            });
        } else {
            throw new Error('Could not verify database connection');
        }
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