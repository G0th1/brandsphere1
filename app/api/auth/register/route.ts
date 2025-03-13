import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';

// Define validation schema
const userSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// Function to verify and create database file if needed
function ensureDatabaseFile() {
    const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
    const exists = fs.existsSync(dbPath);

    if (!exists) {
        try {
            // Make sure directory exists
            const dirPath = path.dirname(dbPath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Created directory: ${dirPath}`);
            }

            // Create empty database file
            fs.writeFileSync(dbPath, '');
            console.log(`Created empty database file at: ${dbPath}`);
            return true;
        } catch (error) {
            console.error(`Failed to create database file: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
    }

    console.log(`Database file exists at: ${dbPath}`);
    return true;
}

export async function POST(req: Request) {
    console.log("============== REGISTRATION REQUEST ==============");

    // Make sure database file exists or create it
    const dbReady = ensureDatabaseFile();
    if (!dbReady) {
        console.error("DATABASE FILE ISSUE - Registration cannot proceed");
        return NextResponse.json(
            { success: false, message: "Server configuration error. Please try again later." },
            { status: 500 }
        );
    }

    try {
        // Verify database connection before doing anything else
        try {
            await db.$queryRaw`SELECT 1 as test`;
            console.log("✅ Database connection verified before processing request");
        } catch (dbError) {
            console.error("❌ Database connection failed:", dbError);

            // If database file exists but connection fails, database may not be initialized
            return NextResponse.json(
                { success: false, message: "Database initialization required. Please try again later." },
                { status: 503 }
            );
        }

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

        // 3. Hash password
        const hashedPassword = await hash(password, 10);
        console.log("Password hashed successfully");

        // 4. Create user with single query approach for better reliability
        const user = await db.user.upsert({
            where: { email },
            update: {}, // No update if exists - will be skipped due to create failing
            create: {
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

        // 5. Return success with sanitized user data
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