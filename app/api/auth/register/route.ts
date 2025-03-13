import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for validating user data
const userSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// Verify database connection
async function checkDbConnection() {
    try {
        await db.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error("Database connection error:", error);
        return false;
    }
}

export async function POST(req: Request) {
    try {
        // First check if database is connected
        const isConnected = await checkDbConnection();
        if (!isConnected) {
            return NextResponse.json(
                { message: "Database connection error. Please try again later." },
                { status: 500 }
            );
        }

        // Parse and validate the request body
        const body = await req.json();
        console.log("Registration request body:", { ...body, password: "[REDACTED]" });

        const result = userSchema.safeParse(body);

        if (!result.success) {
            console.log("Validation error:", result.error.errors);
            return NextResponse.json(
                { message: "Invalid data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Check if user already exists
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

        // Hash the password
        const hashedPassword = await hash(password, 10);
        console.log("Password hashed successfully");

        try {
            // Create the user
            const user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            console.log(`User created with ID: ${user.id}`);

            // Create a free subscription for the user
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
            } catch (subscriptionError) {
                // If subscription creation fails, log but continue
                console.error("Failed to create subscription:", subscriptionError);
                // We don't want to fail the whole registration if only the subscription fails
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
        } catch (dbError: any) {
            // Handle specific database errors
            console.error("Database error during user creation:", dbError);

            if (dbError.code === 'P1001') {
                return NextResponse.json(
                    { message: "Could not connect to the database" },
                    { status: 500 }
                );
            } else if (dbError.code === 'P2002') {
                return NextResponse.json(
                    { message: "This email is already in use" },
                    { status: 409 }
                );
            } else {
                throw dbError; // Re-throw to be caught by outer catch
            }
        }
    } catch (error) {
        console.error("Registration error:", error);

        // Return a more specific error message if possible
        const errorMessage = error instanceof Error
            ? `Registration failed: ${error.message}`
            : "An error occurred during registration";

        return NextResponse.json(
            {
                message: errorMessage,
            },
            { status: 500 }
        );
    }
} 