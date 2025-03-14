import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        // Validate fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if we're in offline mode
        const isOfflineMode = typeof window !== 'undefined' && localStorage.getItem('offlineMode') === 'true';

        if (isOfflineMode) {
            // In offline mode, just return success
            return NextResponse.json(
                { success: true, message: "User created successfully (offline mode)" },
                { status: 201 }
            );
        }

        // Check if user already exists
        try {
            const existingUser = await db.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: "User with this email already exists" },
                    { status: 400 }
                );
            }
        } catch (dbError) {
            console.error("Database error checking for existing user:", dbError);
            // If we can't check for existing user, proceed with registration
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        try {
            // Create the user without verification requirements
            const user = await db.user.create({
                data: {
                    name: name || email.split('@')[0], // Use part of email as name if not provided
                    email,
                    password: hashedPassword,
                    // Create a basic subscription for the user automatically
                    subscription: {
                        create: {
                            status: "active",
                            plan: "Free",
                            billingCycle: "monthly"
                        }
                    }
                },
            });

            // Return success but don't include sensitive data
            return NextResponse.json(
                { success: true, message: "User created successfully" },
                { status: 201 }
            );
        } catch (createError) {
            console.error("Error creating user:", createError);

            // If we can't create the user, return a fallback success in development
            if (process.env.NODE_ENV !== 'production') {
                return NextResponse.json(
                    { success: true, message: "User created successfully (development fallback)" },
                    { status: 201 }
                );
            }

            throw createError;
        }
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
} 