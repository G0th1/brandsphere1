import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Define the schema for profile update requests
const profileUpdateSchema = z.object({
    userId: z.string(),
    name: z.string().min(2).max(50),
    email: z.string().email(),
    bio: z.string().max(500).optional().nullable(),
    company: z.string().max(100).optional().nullable(),
    position: z.string().max(100).optional().nullable(),
    website: z.string().url().optional().nullable().or(z.literal('')),
});

export async function PATCH(req: NextRequest) {
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
        const validationResult = profileUpdateSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { userId, name, bio, company, position, website } = validationResult.data;

        // Ensure the user is updating their own profile
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only update your own profile' },
                { status: 403 }
            );
        }

        // Update the user profile in the database
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                company,
                position,
                website: website || null, // Convert empty string to null
            },
        });

        // Return success response
        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                company: updatedUser.company,
                position: updatedUser.position,
                website: updatedUser.website,
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);

        return NextResponse.json(
            { error: 'Failed to update profile' },
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

        // Get user ID from query params
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // If no userId provided, default to the current user
        const targetUserId = userId || session.user.id;

        // Ensure the user is fetching their own profile unless they have admin rights
        if (session.user.id !== targetUserId) {
            // Check if user has admin rights (implement this check based on your user roles system)
            const isAdmin = false; // Replace with actual admin check

            if (!isAdmin) {
                return NextResponse.json(
                    { error: 'Forbidden: You can only view your own profile' },
                    { status: 403 }
                );
            }
        }

        // Fetch the user profile from the database
        const user = await db.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                company: true,
                position: true,
                website: true,
                createdAt: true,
                subscription: {
                    select: {
                        plan: true,
                        status: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return the user profile
        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);

        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
} 