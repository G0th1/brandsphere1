import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Minimal schema for user registration
const userSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(req: Request) {
    console.log("Registration request received");

    try {
        // Parse request body
        let body;
        try {
            body = await req.json();
            console.log("Registration data received:", { ...body, password: "[REDACTED]" });
        } catch (error) {
            console.error("Failed to parse request body:", error);
            return NextResponse.json(
                { message: "Invalid request format" },
                { status: 400 }
            );
        }

        // Validate the data
        const result = userSchema.safeParse(body);
        if (!result.success) {
            console.log("Validation failed:", result.error.errors);
            return NextResponse.json(
                { message: "Invalid data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Check if user already exists - with error handling
        try {
            const existingUser = await db.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                console.log(`User with email ${email} already exists`);
                return NextResponse.json(
                    { message: "An account with this email already exists" },
                    { status: 409 }
                );
            }
        } catch (error) {
            console.error("Error checking for existing user:", error);
            return NextResponse.json(
                { message: "Failed to check if user exists. Please try again." },
                { status: 500 }
            );
        }

        // Hash the password - with error handling
        let hashedPassword;
        try {
            hashedPassword = await hash(password, 10);
            console.log("Password hashed successfully");
        } catch (error) {
            console.error("Failed to hash password:", error);
            return NextResponse.json(
                { message: "Failed to process your password. Please try again." },
                { status: 500 }
            );
        }

        // Create the user - with error handling
        let user;
        try {
            user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            console.log(`User created with ID: ${user.id}`);
        } catch (error) {
            console.error("Failed to create user:", error);

            // Check for unique constraint violations
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { message: "This email is already in use." },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { message: "Failed to create your account. Please try again." },
                { status: 500 }
            );
        }

        // Create a free subscription - with separate error handling
        try {
            await db.subscription.create({
                data: {
                    userId: user.id,
                    plan: "Free",
                    status: "active",
                    billingCycle: "monthly",
                },
            });
            console.log(`Subscription created for user ${user.id}`);
        } catch (error) {
            // If subscription creation fails, log it but don't fail the registration
            console.error("Failed to create subscription:", error);
        }

        // Remove password from the response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        // Global error handler
        console.error("Unexpected registration error:", error);

        return NextResponse.json(
            { message: "Registration failed due to an unexpected error. Please try again." },
            { status: 500 }
        );
    }
} 