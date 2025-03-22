import { PrismaClient } from '@prisma/client';
import { validateEnv } from './env';
import { prisma } from './prisma';

interface StartupCheck {
    name: string;
    check: () => Promise<{ success: boolean; message?: string; critical?: boolean }>;
}

/**
 * Run all startup checks and initialization tasks
 * This function should be called when the application starts
 * to ensure everything is properly configured
 */
export async function runStartupChecks() {
    console.log('🚀 Running application startup checks...');

    // List of all startup checks to perform
    const checks: StartupCheck[] = [
        {
            name: 'Environment Variables',
            check: async () => {
                try {
                    const isValid = validateEnv();
                    return {
                        success: isValid,
                        message: isValid ? 'All required environment variables are set' : 'Some environment variables are missing or invalid',
                        critical: process.env.NODE_ENV === 'production' && !isValid
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error instanceof Error ? error.message : 'Unknown error validating environment',
                        critical: process.env.NODE_ENV === 'production'
                    };
                }
            }
        },
        {
            name: 'Database Connection',
            check: async () => {
                try {
                    // Try a simple query
                    await prisma.$queryRaw`SELECT 1 as connection_test`;
                    return { success: true, message: 'Database connection successful' };
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    return {
                        success: false,
                        message: `Database connection failed: ${errorMessage}`,
                        critical: process.env.NODE_ENV === 'production'
                    };
                }
            }
        },
        {
            name: 'Database Schema',
            check: async () => {
                try {
                    // Check if we can access the Users table
                    const userCount = await prisma.user.count();
                    return {
                        success: true,
                        message: `Schema check successful (${userCount} users in database)`
                    };
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    return {
                        success: false,
                        message: `Schema check failed: ${errorMessage}`,
                        critical: process.env.NODE_ENV === 'production'
                    };
                }
            }
        },
        {
            name: 'NextAuth Configuration',
            check: async () => {
                // Check for required NextAuth config
                const nextAuthUrl = process.env.NEXTAUTH_URL;
                const nextAuthSecret = process.env.NEXTAUTH_SECRET;

                if (!nextAuthUrl) {
                    return {
                        success: false,
                        message: 'NEXTAUTH_URL is not set',
                        critical: process.env.NODE_ENV === 'production'
                    };
                }

                if (!nextAuthSecret) {
                    return {
                        success: false,
                        message: 'NEXTAUTH_SECRET is not set',
                        critical: process.env.NODE_ENV === 'production'
                    };
                }

                // Check if URL is valid
                try {
                    new URL(nextAuthUrl);
                } catch (error) {
                    return {
                        success: false,
                        message: `NEXTAUTH_URL is not a valid URL: ${nextAuthUrl}`,
                        critical: process.env.NODE_ENV === 'production'
                    };
                }

                // Check if secret is secure
                if (nextAuthSecret.length < 32) {
                    return {
                        success: false,
                        message: 'NEXTAUTH_SECRET should be at least 32 characters for security',
                        critical: process.env.NODE_ENV === 'production'
                    };
                }

                return { success: true, message: 'NextAuth configuration is valid' };
            }
        }
    ];

    // Run all checks
    const results = await Promise.all(checks.map(async check => {
        try {
            console.log(`Checking ${check.name}...`);
            const result = await check.check();
            return { name: check.name, ...result };
        } catch (error) {
            return {
                name: check.name,
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error during check',
                critical: process.env.NODE_ENV === 'production'
            };
        }
    }));

    // Log results
    console.log('\nStartup Check Results:');
    console.log('=====================\n');

    results.forEach(result => {
        const icon = result.success ? '✅' : result.critical ? '❌' : '⚠️';
        console.log(`${icon} ${result.name}: ${result.message}`);
    });

    // Check if any critical checks failed
    const criticalFailures = results.filter(r => !r.success && r.critical);

    if (criticalFailures.length > 0) {
        console.error('\n❌ Critical startup checks failed. Application may not function correctly.');

        if (process.env.NODE_ENV === 'production') {
            console.error('Application will exit due to critical failures in production mode.');
            // In production, exit on critical failures
            process.exit(1);
        }
    } else if (results.some(r => !r.success)) {
        console.warn('\n⚠️ Some non-critical startup checks failed. Application may have limited functionality.');
    } else {
        console.log('\n✅ All startup checks passed!');
    }

    return {
        success: criticalFailures.length === 0,
        results
    };
}

/**
 * Register application startup checks
 * This function should be called in a server-side context
 */
export function registerStartupChecks() {
    // Only run in server context
    if (typeof window === 'undefined') {
        // Run checks on module load in production
        if (process.env.NODE_ENV === 'production') {
            runStartupChecks().catch(error => {
                console.error('Failed to run startup checks:', error);
            });
        }

        // Handle application shutdown
        ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal => {
            process.once(signal, async () => {
                console.log(`Received ${signal}, shutting down gracefully...`);
                setTimeout(() => {
                    console.error('Forced shutdown after timeout');
                    process.exit(1);
                }, 5000).unref();

                try {
                    // Disconnect from database
                    if (prisma) {
                        await (prisma as any).disconnect?.();
                    }
                    console.log('Clean shutdown complete');
                    process.exit(0);
                } catch (error) {
                    console.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });
        });
    }
} 