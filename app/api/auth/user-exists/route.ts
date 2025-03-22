import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        // Extract the email from the request body
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true
            }
        });

        if (user) {
            return NextResponse.json({
                success: true,
                message: 'User found',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                }
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return NextResponse.json(
            { success: false, message: 'Error checking if user exists' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 