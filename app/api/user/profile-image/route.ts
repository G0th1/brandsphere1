import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

// Define maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
];

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

        // Parse the multipart form data
        const formData = await req.formData();
        const file = formData.get('profileImage') as File;
        const userId = formData.get('userId') as string;

        // Validate file and userId
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Ensure the user is updating their own profile image
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only update your own profile image' },
                { status: 403 }
            );
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size exceeds the limit (5MB)' },
                { status: 400 }
            );
        }

        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' },
                { status: 400 }
            );
        }

        // Generate a unique filename
        const fileExtension = path.extname(file.name);
        const fileName = `${uuidv4()}${fileExtension}`;

        // Create the upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-images');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Error creating upload directory:', error);
        }

        // Save the file
        const filePath = path.join(uploadDir, fileName);
        const fileUrl = `/uploads/profile-images/${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // Update the user's profile image in the database
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                image: fileUrl,
            },
        });

        // Return success response
        return NextResponse.json({
            message: 'Profile image updated successfully',
            imageUrl: fileUrl,
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);

        return NextResponse.json(
            { error: 'Failed to upload profile image' },
            { status: 500 }
        );
    }
}

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

        // Get user ID from query params
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Ensure the user is removing their own profile image
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You can only remove your own profile image' },
                { status: 403 }
            );
        }

        // Update the user's profile image in the database (set to null)
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                image: null,
            },
        });

        // Return success response
        return NextResponse.json({
            message: 'Profile image removed successfully',
        });
    } catch (error) {
        console.error('Error removing profile image:', error);

        return NextResponse.json(
            { error: 'Failed to remove profile image' },
            { status: 500 }
        );
    }
} 