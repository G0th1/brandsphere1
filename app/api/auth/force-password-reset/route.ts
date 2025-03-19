import { NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';
import bcrypt from "bcrypt";

// Create a direct database connection
const sql = neon(process.env.DATABASE_URL || '');

/**
 * Force Password Reset API
 * 
 * This endpoint allows directly setting a user's password by email.
 * NOTE: This is for development/debugging only and should be removed in production.
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash the new password
        const passwordHash = await bcrypt.hash(password, 10);

        // Log the hash details for debugging
        console.log(`Generated hash for ${email}:`, {
            hashLength: passwordHash.length,
            hashPrefix: passwordHash.substring(0, 20),
            isValidFormat: /^\$2[aby]\$\d+\$/.test(passwordHash)
        });

        // Find user
        const users = await sql`
      SELECT id, email FROM "Users" WHERE email = ${email}
    `;

        // If user doesn't exist, return error
        if (!users || users.length === 0) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = users[0];

        // Update user's password
        await sql`
      UPDATE "Users" 
      SET password_hash = ${passwordHash}
      WHERE id = ${user.id}
    `;

        // Verify the password was updated correctly
        const updatedUser = await sql`
      SELECT password_hash FROM "Users" WHERE id = ${user.id}
    `;

        if (!updatedUser || updatedUser.length === 0) {
            throw new Error("Failed to retrieve updated user");
        }

        // Test the password works with bcrypt compare
        const passwordValid = await bcrypt.compare(password, updatedUser[0].password_hash);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Password reset successfully",
                verification: {
                    password_hash_length: updatedUser[0].password_hash.length,
                    password_verification: passwordValid ? "Success" : "Failed"
                }
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        console.error("Force password reset error:", error);

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