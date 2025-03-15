import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    console.log("API: Registration request received");

    try {
        const body = await req.json();
        const { email, password, name } = body;
        console.log(`API: Registration attempt for email: ${email && email.substring(0, 3)}...`);

        // Validate fields
        if (!email || !password) {
            console.log("API: Missing required fields");
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        try {
            // Check if user already exists
            const existingUser = await db.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                console.log("API: User already exists");
                return NextResponse.json(
                    { error: "User with this email already exists" },
                    { status: 400 }
                );
            }

            // Hash the password
            const hashedPassword = await hash(password, 10);
            console.log("API: Password hashed successfully");

            // Create the user in the database
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

            console.log(`API: User created successfully, id: ${user.id}`);

            // Return success with the new user ID for redirection to dashboard directly
            return NextResponse.json({
                success: true,
                message: "Registration successful",
                userId: user.id,
                redirectToOnboarding: false
            });
        } catch (dbError) {
            console.error("API: Database error:", dbError);
            return NextResponse.json(
                { error: "Database error occurred. Please try again later." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("API: Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration. Please try again." },
            { status: 500 }
        );
    }
} 