import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Define the schema for security preferences
const securityPreferencesSchema = z.object({
    userId: z.string().uuid(),
    loginNotifications: z.boolean().default(false),
    sessionTimeout: z.number().min(15).default(60),
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
        const validationResult = securityPreferencesSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { userId, loginNotifications, sessionTimeout } = validationResult.data;

        // Ensure the user is updating their own preferences
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only update your own security preferences' },
                { status: 403 }
            );
        }

        // Update the user's security preferences in the database
        // First, check if a security_setting record exists for this user
        const existingSettings = await db.securitySetting.findUnique({
            where: { userId },
        });

        if (existingSettings) {
            // Update existing record
            await db.securitySetting.update({
                where: { userId },
                data: {
                    loginNotifications,
                    sessionTimeout,
                },
            });
        } else {
            // Create new record
            await db.securitySetting.create({
                data: {
                    userId,
                    loginNotifications,
                    sessionTimeout,
                },
            });
        }

        // Return success response
        return NextResponse.json({
            message: 'Security preferences updated successfully',
            data: {
                loginNotifications,
                sessionTimeout,
            },
        });
    } catch (error) {
        console.error('Error updating security preferences:', error);

        return NextResponse.json(
            { error: 'Failed to update security preferences' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the user ID from query parameters
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Ensure the user is viewing their own preferences
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only view your own security preferences' },
                { status: 403 }
            );
        }

        // Get the user's security preferences from the database
        const securitySettings = await db.securitySetting.findUnique({
            where: { userId },
        });

        // If no settings found, return default values
        if (!securitySettings) {
            return NextResponse.json({
                loginNotifications: false,
                sessionTimeout: 60,
            });
        }

        // Return the security preferences
        return NextResponse.json({
            loginNotifications: securitySettings.loginNotifications,
            sessionTimeout: securitySettings.sessionTimeout,
        });
    } catch (error) {
        console.error('Error fetching security preferences:', error);

        return NextResponse.json(
            { error: 'Failed to fetch security preferences' },
            { status: 500 }
        );
    }
} 