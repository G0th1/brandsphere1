import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth, prisma } from '@/lib/prisma';
import { validateEnv } from '@/lib/env';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: {
        database: {
            status: 'healthy' | 'degraded' | 'unhealthy';
            responseTime?: number;
            error?: string;
            details?: any;
        };
        environment: {
            status: 'valid' | 'invalid' | 'warning';
            details?: string[];
        };
        memory: {
            status: 'healthy' | 'warning' | 'critical';
            used: number;
            total: number;
            percentUsed: number;
        };
        uptime: number; // seconds
    };
    timestamp: string;
}

/**
 * GET health status of the application
 * This is useful for monitoring and load balancers
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    const isAuthorized = req.headers.get('x-api-key') === process.env.INTERNAL_API_KEY ||
        req.headers.get('Authorization') === `Bearer ${process.env.INTERNAL_API_KEY}`;

    // Basic check for unauthorized requests
    const isDetailed = isAuthorized || req.nextUrl.searchParams.has('detailed');

    try {
        // Get process stats
        const memoryUsage = process.memoryUsage();
        const usedMemoryMB = Math.round(memoryUsage.rss / 1024 / 1024);
        const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
        const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
        const memoryUsedPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

        // Check database
        const dbHealth = await checkDatabaseHealth();

        // Check environment
        let envStatus: 'valid' | 'invalid' | 'warning' = 'valid';
        const envIssues: string[] = [];

        try {
            if (!validateEnv()) {
                envStatus = process.env.NODE_ENV === 'production' ? 'invalid' : 'warning';
                envIssues.push('Some environment variables are missing or invalid');
            }
        } catch (error) {
            envStatus = 'invalid';
            envIssues.push(error instanceof Error ? error.message : 'Unknown environment validation error');
        }

        // Determine overall status
        let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

        if (!dbHealth.ok || envStatus === 'invalid') {
            overallStatus = 'unhealthy';
        } else if (dbHealth.status === 'degraded' || envStatus === 'warning' || memoryUsedPercent > 85) {
            overallStatus = 'degraded';
        }

        // Build response
        const healthStatus: HealthStatus = {
            status: overallStatus,
            checks: {
                database: {
                    status: dbHealth.ok ? (dbHealth.status || 'healthy') : 'unhealthy',
                    responseTime: dbHealth.responseTime,
                    ...(dbHealth.ok ? {} : { error: dbHealth.error }),
                    ...(isDetailed && dbHealth.metrics ? { details: dbHealth.metrics } : {})
                },
                environment: {
                    status: envStatus,
                    ...(isDetailed && envIssues.length > 0 ? { details: envIssues } : {})
                },
                memory: {
                    status: memoryUsedPercent > 90 ? 'critical' : memoryUsedPercent > 75 ? 'warning' : 'healthy',
                    used: usedMemoryMB,
                    total: heapTotalMB,
                    percentUsed: memoryUsedPercent
                },
                uptime: Math.floor(process.uptime())
            },
            timestamp: new Date().toISOString()
        };

        // If basic check requested, return simplified status
        if (!isDetailed) {
            return NextResponse.json({
                status: healthStatus.status,
                uptime: healthStatus.checks.uptime,
                timestamp: healthStatus.timestamp
            });
        }

        return NextResponse.json(healthStatus);
    } catch (error) {
        console.error('Health check error:', error);

        // Even on error, try to return a structured response
        return NextResponse.json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error processing health check',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 