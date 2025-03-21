import { NextRequest } from "next/server";
import { prisma, withErrorHandling } from "@/lib/prisma";
import { safeJsonResponse, errorResponse } from "@/lib/api-utils";

/**
 * API Route for checking database health
 * 
 * This endpoint performs a basic database query to verify connectivity
 * Used by the client to determine if there are database connection issues
 */
export async function GET(request: NextRequest) {
    try {
        const startTime = Date.now();

        // Run a simple query to check connection
        await withErrorHandling(async () => {
            const result = await prisma.$queryRaw`SELECT 1 as connected`;
            return result;
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Return success response with timing information
        return safeJsonResponse({
            status: "ok",
            message: "Database connection successful",
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        // Return detailed error information
        return errorResponse({
            name: "DatabaseError",
            message: "Database connection failed: " + (error instanceof Error ? error.message : "Unknown error")
        } as Error, 503); // Service Unavailable
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