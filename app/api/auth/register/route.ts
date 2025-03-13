import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
        } catch (error) {
            return NextResponse.json(
                { message: "Invalid request format" },
                { status: 400 }
            );
        }

        // Validate the data
        const result = userSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid data", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Hash the password
        const hashedPassword = await hash(password, 10);

        try {
            // Create the user - this will fail automatically if email exists
            const user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    // Create subscription in a single transaction
                    subscription: {
                        create: {
                            status: "active",
                            plan: "Free",
                            billingCycle: "monthly"
                        }
                    }
                },
                // Include subscription in the response
                include: {
                    subscription: true
                }
            });

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
            console.error("Registration error:", error);

            // Handle specific Prisma errors
            if (error instanceof PrismaClientKnownRequestError) {
                // P2002 is the Prisma error code for unique constraint violations
                if (error.code === 'P2002') {
                    return NextResponse.json(
                        { message: "This email is already in use." },
                        { status: 409 }
                    );
                }
            }

            return NextResponse.json(
                { message: "Registration failed. Please try again." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Unexpected error:", error);

        return NextResponse.json(
            { message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
} 