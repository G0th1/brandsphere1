import { NextResponse } from "next/server";
import { neon, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '@/lib/database-url';

// Configure Neon for serverless environments
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineTLS = true;

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        databaseUrl: {
            exists: !!DATABASE_URL,
            truncated: DATABASE_URL ? `${DATABASE_URL.substring(0, 20)}...` : 'not set',
        },
        tests: {
            neonDirect: { success: false, details: {} },
            prisma: { success: false, details: {} },
            connectionPool: { success: false, details: {} },
            transactionTest: { success: false, details: {} },
        },
        recommendations: []
    };

    // Test direct Neon connection
    try {
        const sql = neon(DATABASE_URL);
        const result = await sql`SELECT NOW() as time`;

        // Test schema access
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

        diagnostics.tests.neonDirect = {
            success: true,
            details: {
                serverTime: result[0].time,
                tablesFound: tables.length,
                tableNames: tables.map(t => t.table_name)
            }
        };
    } catch (error) {
        diagnostics.tests.neonDirect = {
            success: false,
            details: {
                error: error.message,
                stack: error.stack?.split('\n')[0] || null
            }
        };
        diagnostics.recommendations.push('Check Neon database connection parameters');
    }

    // Test Prisma connection
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: DATABASE_URL
                }
            },
            log: ['error'],
        });

        await prisma.$connect();

        // Test basic query
        const userCount = await prisma.user.count();
        const subscriptionCount = await prisma.subscription.count();

        diagnostics.tests.prisma = {
            success: true,
            details: {
                connected: true,
                userCount,
                subscriptionCount
            }
        };

        // Test a transaction
        try {
            const result = await prisma.$transaction(async (tx) => {
                const testUser = await tx.user.findFirst({
                    select: { id: true, email: true }
                });

                return { success: true, user: testUser };
            });

            diagnostics.tests.transactionTest = {
                success: true,
                details: {
                    transactionCompleted: true,
                    foundUser: !!result.user
                }
            };
        } catch (txError) {
            diagnostics.tests.transactionTest = {
                success: false,
                details: {
                    error: txError.message,
                    code: txError.code || 'unknown'
                }
            };
            diagnostics.recommendations.push('Transactions may be failing - check connection pooling settings');
        }

        // Test connection pool
        try {
            // Make several parallel queries to test connection pool
            const promises = Array(5).fill(0).map((_, i) =>
                prisma.user.count()
            );

            const results = await Promise.all(promises);

            diagnostics.tests.connectionPool = {
                success: true,
                details: {
                    parallelQueriesSuccessful: true,
                    queriesExecuted: results.length
                }
            };
        } catch (poolError) {
            diagnostics.tests.connectionPool = {
                success: false,
                details: {
                    error: poolError.message
                }
            };
            diagnostics.recommendations.push('Connection pool may be misconfigured or overloaded');
        }

        await prisma.$disconnect();
    } catch (error) {
        diagnostics.tests.prisma = {
            success: false,
            details: {
                error: error.message,
                code: error.code || 'unknown'
            }
        };
        diagnostics.recommendations.push('Prisma connection failed - check database URL and Prisma configuration');
    }

    // Add overall recommendations
    const allTestsPassed = Object.values(diagnostics.tests).every(test => test.success);

    if (allTestsPassed) {
        diagnostics.recommendations.push('All database tests passed. If you are still experiencing issues, check specific queries or schema definitions.');
    } else if (diagnostics.tests.neonDirect.success && !diagnostics.tests.prisma.success) {
        diagnostics.recommendations.push('Neon direct connection works but Prisma fails. Check Prisma schema and configuration.');
    } else if (!diagnostics.tests.neonDirect.success) {
        diagnostics.recommendations.push('Direct database connection failed. Check connection string, network, and database status.');
    }

    // Return diagnostics results
    return NextResponse.json(diagnostics);
} 