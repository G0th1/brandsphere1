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

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

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
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
} 