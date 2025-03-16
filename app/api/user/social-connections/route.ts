import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Define schema for connecting a social account
const connectSocialSchema = z.object({
    userId: z.string(),
    platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok']),
    profileId: z.string(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    expiry: z.string().optional(),
    profileUrl: z.string().optional(),
    username: z.string(),
});

// Define schema for disconnecting a social account
const disconnectSocialSchema = z.object({
    userId: z.string(),
    platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok']),
});

// Connect a social media account
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
        const validationResult = connectSocialSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { userId, platform, profileId, accessToken, refreshToken, expiry, profileUrl, username } = validationResult.data;

        // Ensure the user is connecting to their own profile
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only connect accounts to your own profile' },
                { status: 403 }
            );
        }

        // Check if this connection already exists
        const existingConnection = await db.socialConnection.findFirst({
            where: {
                userId,
                platform,
            },
        });

        if (existingConnection) {
            // Update existing connection
            await db.socialConnection.update({
                where: {
                    id: existingConnection.id,
                },
                data: {
                    profileId,
                    accessToken,
                    refreshToken,
                    expiry,
                    profileUrl,
                    username,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Create new connection
            await db.socialConnection.create({
                data: {
                    userId,
                    platform,
                    profileId,
                    accessToken,
                    refreshToken,
                    expiry,
                    profileUrl,
                    username,
                },
            });
        }

        // Return success response
        return NextResponse.json({
            message: `${platform} account connected successfully`,
            platform,
            username,
        });
    } catch (error) {
        console.error('Error connecting social account:', error);

        return NextResponse.json(
            { error: 'Failed to connect social account' },
            { status: 500 }
        );
    }
}

// Disconnect a social media account
export async function DELETE(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get query parameters
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        const platform = url.searchParams.get('platform');

        // Validate parameters
        if (!userId || !platform) {
            return NextResponse.json(
                { error: 'User ID and platform are required' },
                { status: 400 }
            );
        }

        // Validate platform
        const validPlatforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'];
        if (!validPlatforms.includes(platform)) {
            return NextResponse.json(
                { error: 'Invalid platform' },
                { status: 400 }
            );
        }

        // Ensure the user is disconnecting from their own profile
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only disconnect accounts from your own profile' },
                { status: 403 }
            );
        }

        // Find the connection
        const connection = await db.socialConnection.findFirst({
            where: {
                userId,
                platform: platform as any,
            },
        });

        if (!connection) {
            return NextResponse.json(
                { error: `No ${platform} account connected` },
                { status: 404 }
            );
        }

        // Delete the connection
        await db.socialConnection.delete({
            where: {
                id: connection.id,
            },
        });

        // Return success response
        return NextResponse.json({
            message: `${platform} account disconnected successfully`,
        });
    } catch (error) {
        console.error('Error disconnecting social account:', error);

        return NextResponse.json(
            { error: 'Failed to disconnect social account' },
            { status: 500 }
        );
    }
}

// Get all connected social accounts for a user
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

        // Ensure the user is viewing their own connections
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only view your own social connections' },
                { status: 403 }
            );
        }

        // Get all social connections for this user
        const connections = await db.socialConnection.findMany({
            where: {
                userId,
            },
            select: {
                platform: true,
                username: true,
                profileUrl: true,
            },
        });

        // Return the connections
        return NextResponse.json({
            connections,
        });
    } catch (error) {
        console.error('Error fetching social connections:', error);

        return NextResponse.json(
            { error: 'Failed to fetch social connections' },
            { status: 500 }
        );
    }
} 