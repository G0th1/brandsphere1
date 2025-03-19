import { NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';
import bcrypt from "bcrypt";

// Create a direct database connection
const sql = neon(process.env.DATABASE_URL || '');

/**
 * Debug User API
 * 
 * This API retrieves a user by email and returns detailed information about the user
 * including password hash details for debugging authentication issues.
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, testPassword } = body;

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Query the database directly
        const users = await sql`
      SELECT id, email, password_hash, role, name
      FROM "Users"
      WHERE email = ${email}
    `;

        if (!users || users.length === 0) {
            return new Response(
                JSON.stringify({ error: "User not found", email }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = users[0];

        // Create response with user details (without revealing the full hash)
        const response: any = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            hash_info: {
                exists: !!user.password_hash,
                length: user.password_hash?.length || 0,
                prefix: user.password_hash?.substring(0, 10) || "",
                is_valid_format: /^\$2[aby]\$\d+\$/.test(user.password_hash || "")
            }
        };

        // If a test password is provided, try to verify it
        if (testPassword && user.password_hash) {
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password_hash);
                response.password_test = {
                    provided_password: testPassword.replace(/./g, '*'),
                    length: testPassword.length,
                    is_match: isMatch
                };

                // Generate a new hash for comparison
                const newHash = await bcrypt.hash(testPassword, 10);
                response.new_hash_info = {
                    prefix: newHash.substring(0, 10),
                    length: newHash.length,
                    is_valid_format: /^\$2[aby]\$\d+\$/.test(newHash)
                };
            } catch (verifyError: any) {
                response.password_test = {
                    error: verifyError.message || "Unknown error during password verification",
                    error_type: verifyError.name || "Error"
                };
            }
        }

        return new Response(
            JSON.stringify(response),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        console.error("Debug user error:", error);

        return new Response(
            JSON.stringify({
                error: "Server error",
                message: error.message || "Unknown error",
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
} 