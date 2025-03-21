import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";

    try {
        // Test connection to Neon database
        console.log(`Testing connection to Neon database...`);

        const sql = neon(dbUrl);
        const result = await sql`SELECT NOW() as current_time`;

        // Try to access Users table
        let usersResult;
        try {
            usersResult = await sql`SELECT COUNT(*) as count FROM "Users"`;
        } catch (tableError) {
            usersResult = { error: tableError.message };
        }

        return NextResponse.json({
            success: true,
            serverTime: result[0].current_time,
            users: usersResult,
            environment: {
                nodeEnv: process.env.NODE_ENV,
                nextAuthUrl: process.env.NEXTAUTH_URL?.substring(0, 20) + '...' || 'not set',
                databaseUrl: dbUrl.substring(0, 20) + '...'
            }
        });
    } catch (error) {
        console.error('Neon connection test failed:', error);

        return NextResponse.json({
            success: false,
            error: error.message,
            environment: {
                nodeEnv: process.env.NODE_ENV,
                nextAuthUrl: process.env.NEXTAUTH_URL?.substring(0, 20) + '...' || 'not set',
                databaseUrl: dbUrl.substring(0, 20) + '...'
            }
        }, { status: 500 });
    }
} 