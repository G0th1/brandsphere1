import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { neon } from '@neondatabase/serverless';

// Direct database connection
const sql = neon(process.env.DATABASE_URL || '');

/**
 * Admin API to list users
 * Requires admin token for security
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { adminToken } = body;

        // Very basic security check - would be stronger in production
        if (adminToken !== 'brandsphere-internal-admin') {
            return safeJsonResponse({
                error: "Unauthorized",
                message: "Invalid admin token",
                status: "error"
            }, { status: 401 });
        }

        // Query all users
        const users = await sql`
            SELECT id, email, role
            FROM "Users"
            ORDER BY created_at DESC
        `;

        return safeJsonResponse({
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role
            })),
            status: "success"
        });
    } catch (error) {
        console.error("Error listing users:", error);

        return safeJsonResponse({
            error: "ServerError",
            message: "Failed to list users",
            status: "error"
        }, { status: 500 });
    }
} 