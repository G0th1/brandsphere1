import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Define validation schema for registration
const userSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(req: Request) {
    console.log("============== REGISTRATION REQUEST ==============");

    try {
        // 1. Parse request body with robust error handling
        let body;
        try {
            body = await req.json();
            console.log("Request body received:", { ...body, password: '[REDACTED]' });
        } catch (error) {
            console.error("Failed to parse request body:", error);
            return NextResponse.json(
                { success: false, message: "Invalid request format" },
                { status: 400 }
            );
        }

        // 2. Validate user data
        const validation = userSchema.safeParse(body);
        if (!validation.success) {
            console.error("Validation failed:", validation.error.format());
            return NextResponse.json(
                { success: false, message: "Invalid input data", errors: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;
        console.log(`Processing registration for: ${email}`);

        // 3. Verify database connection
        try {
            await db.$queryRaw`SELECT 1 as test`;
            console.log("✅ Database connection verified");
        } catch (dbError) {
            console.error("❌ Database connection failed:", dbError);
            return NextResponse.json(
                { success: false, message: "Database connection error. Please try again later." },
                { status: 503 }
            );
        }

        // 4. Check if email already exists (defensive programming)
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log(`User with email ${email} already exists`);
            return NextResponse.json(
                { success: false, message: "This email is already registered" },
                { status: 409 }
            );
        }

        // 5. Hash password
        const hashedPassword = await hash(password, 10);
        console.log("Password hashed successfully");

        // 6. Create user with single query approach for better reliability
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                subscription: {
                    create: {
                        status: "active",
                        plan: "Free",
                        billingCycle: "monthly"
                    }
                }
            },
            include: {
                subscription: true
            }
        });

        console.log("Registration successful for user:", user.id);

        // 7. Return success with sanitized user data
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
                user: userWithoutPassword
            },
            { status: 201 }
        );

    } catch (error) {
        // Handle specific error types
        console.error("Registration error:", error);

        // Handle known Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const errorCode = error.code;
            console.error(`Prisma error code: ${errorCode}`);

            // P2002: Unique constraint failed - email already exists
            if (errorCode === 'P2002') {
                return NextResponse.json(
                    { success: false, message: "This email is already registered" },
                    { status: 409 }
                );
            }

            // Other Prisma errors
            return NextResponse.json(
                { success: false, message: `Database error (${errorCode})` },
                { status: 500 }
            );
        }

        // General errors
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Registration failed: ${errorMessage}`);

        return NextResponse.json(
            { success: false, message: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
} 