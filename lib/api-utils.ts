import { NextResponse } from 'next/server';

/**
 * Creates a safe JSON response with proper error handling
 * 
 * @param data Object to be serialized to JSON
 * @param options Optional response options
 * @returns A NextResponse object with proper content type
 */
export function safeJsonResponse(
    data: any,
    options?: {
        status?: number;
        headers?: Record<string, string>;
    }
) {
    try {
        // Attempt to serialize the data
        const jsonString = JSON.stringify(data);

        // Create response with specific content type
        return new NextResponse(jsonString, {
            status: options?.status || 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store, max-age=0',
                ...options?.headers
            }
        });
    } catch (error) {
        // If JSON serialization fails, return a fallback response
        console.error('Failed to serialize response to JSON:', error);

        return new NextResponse(
            JSON.stringify({
                error: 'SerializationError',
                message: 'Failed to serialize response'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'no-store, max-age=0'
                }
            }
        );
    }
}

/**
 * Creates a safe error response with proper error handling
 * 
 * @param error Error object or message
 * @param status HTTP status code (default: 500)
 * @returns A NextResponse object with proper error format
 */
export function errorResponse(
    error: Error | string,
    status: number = 500
) {
    const message = error instanceof Error ? error.message : error;
    const name = error instanceof Error ? error.name : 'Error';

    console.error(`API Error [${status}]: ${name} - ${message}`);

    return safeJsonResponse({
        error: name,
        message,
        timestamp: new Date().toISOString()
    }, { status });
}

/**
 * Error handler middleware for API routes
 * 
 * @param handler Async function that handles the API request
 * @returns Wrapped handler that catches errors
 */
export function withErrorHandler(handler: Function) {
    return async (...args: any[]) => {
        try {
            return await handler(...args);
        } catch (error) {
            console.error('API route error:', error);
            return errorResponse(error instanceof Error ? error : String(error));
        }
    };
} 