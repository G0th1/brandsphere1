import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { compare, hash } from 'bcrypt';

// Define the schema for password change requests
const passwordChangeSchema = z.object({
    userId: z.string(),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const validationResult = passwordChangeSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { userId, currentPassword, newPassword } = validationResult.data;

        // Ensure the user is changing their own password
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only change your own password' },
                { status: 403 }
            );
        }

        // Get the user from the database
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true,
            },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'User not found or no password set' },
                { status: 404 }
            );
        }

        // Verify the current password
        const isCurrentPasswordValid = await compare(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 10);

        // Update the user's password in the database
        await db.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });

        // Return success response
        return NextResponse.json({
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Error changing password:', error);

        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
} 