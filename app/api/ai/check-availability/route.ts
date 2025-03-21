import { NextResponse } from 'next/server';
import { openRouterAI } from '@/lib/ai';

export async function GET() {
    try {
        // Check if OpenRouter API key is configured
        const isInitialized = openRouterAI.initialize();

        if (!isInitialized) {
            return NextResponse.json(
                {
                    available: false,
                    message: 'OpenRouter API key is not configured'
                },
                { status: 200 }
            );
        }

        // Test the OpenRouter API with a simple prompt
        try {
            const testMessages = [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Respond with "OK" if you can read this message.' }
            ];

            const response = await openRouterAI.generateCompletion({ messages: testMessages });
            const isWorking = response.includes('OK') || response.toLowerCase().includes('yes');

            return NextResponse.json(
                {
                    available: true,
                    working: isWorking,
                    message: 'OpenRouter API is available and working'
                },
                { status: 200 }
            );
        } catch (apiError) {
            console.error('OpenRouter API test failed:', apiError);

            return NextResponse.json(
                {
                    available: false,
                    message: 'OpenRouter API key is configured but the API test failed',
                    error: process.env.NODE_ENV === 'development' ? String(apiError) : undefined
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error checking OpenRouter availability:', error);

        return NextResponse.json(
            {
                available: false,
                message: 'Error checking OpenRouter availability',
                error: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 }
        );
    }
} 