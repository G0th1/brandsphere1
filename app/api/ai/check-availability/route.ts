import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        return NextResponse.json(
            {
                available: true,
                message: 'AI API availability check endpoint'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking API availability:', error);

        return NextResponse.json(
            {
                available: false,
                message: 'Error checking API availability',
                error: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 }
        );
    }
} 