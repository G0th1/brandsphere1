import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Minimal schema for user registration
const userSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(req: Request) {
    console.log("Registration request received");

    try {
        // Parse and validate request body
        let body;
        try {
            body = await req.json();
            console.log("Request body parsed successfully");
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
            console.error("Validation failed:", result.error.format());
            return NextResponse.json(
                { message: "Invalid data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;
        console.log(`Registration attempt for email: ${email}`);

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await hash(password, 10);
            console.log("Password hashed successfully");
        } catch (error) {
            console.error("Failed to hash password:", error);
            return NextResponse.json(
                { message: "Password processing failed" },
                { status: 500 }
            );
        }

        try {
            // Verify database connection before proceeding
            await db.$queryRaw`SELECT 1`;
            console.log("Database connection verified");

            // Create the user with a more basic approach
            const user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            console.log(`User created with ID: ${user.id}`);

            // Create subscription separately to simplify error handling
            try {
                await db.subscription.create({
                    data: {
                        userId: user.id,
                        status: "active",
                        plan: "Free",
                        billingCycle: "monthly"
                    }
                });
                console.log(`Subscription created for user ${user.id}`);
            } catch (subscriptionError) {
                // Log but don't fail the whole registration if subscription fails
                console.error("Failed to create subscription:", subscriptionError);
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
            console.error("Registration database error:", error);

            // Handle specific Prisma errors
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // P2002 is the Prisma error code for unique constraint violations
                if (error.code === 'P2002') {
                    return NextResponse.json(
                        { message: "This email is already in use." },
                        { status: 409 }
                    );
                }

                // Log the specific Prisma error code for debugging
                console.error(`Prisma error code: ${error.code}`);
                return NextResponse.json(
                    { message: `Database error: ${error.message}` },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { message: "Registration failed. Please try again." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Unexpected error during registration:", error);

        // Provide more specific error message if possible
        const errorMessage = error instanceof Error
            ? `Error: ${error.message}`
            : "An unexpected error occurred";

        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
} 