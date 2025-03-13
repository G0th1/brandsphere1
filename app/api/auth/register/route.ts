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

export async function POST(req: Request) {
    try {
        // Parse and validate the request body
        const body = await req.json();
        const result = userSchema.safeParse(body);

        if (!result.success) {
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
            return NextResponse.json(
                { message: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Create a free subscription for the user
        await db.subscription.create({
            data: {
                userId: user.id,
                plan: "Free",
                status: "active",
                billingCycle: "monthly",
            },
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

        return NextResponse.json(
            {
                message: "An error occurred during registration",
            },
            { status: 500 }
        );
    }
} 