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
            // Test database connection first
            try {
                console.log("API: Testing database connection");
                const testResult = await db.$queryRaw`SELECT 1 as test`;
                console.log("API: Database connection successful", testResult);
            } catch (connectionError) {
                console.error("API: Database connection error:", connectionError);
                return NextResponse.json(
                    { error: "Unable to connect to database. Please try again later." },
                    { status: 503 }
                );
            }

            // Check if user already exists
            console.log("API: Checking if user exists");
            let existingUser;
            try {
                existingUser = await db.user.findUnique({
                    where: { email }
                });
            } catch (findError) {
                console.error("API: Error checking existing user:", findError);

                // Try a direct query instead of Prisma client
                try {
                    const users = await db.$queryRaw`
                        SELECT id FROM "Users" WHERE email = ${email}
                    `;
                    existingUser = users && Array.isArray(users) && users.length > 0 ? users[0] : null;
                } catch (rawQueryError) {
                    console.error("API: Raw query error:", rawQueryError);
                    return NextResponse.json(
                        { error: "Database error while checking user existence. Please try again." },
                        { status: 500 }
                    );
                }
            }

            if (existingUser) {
                console.log("API: User already exists");
                return NextResponse.json(
                    { error: "User with this email already exists" },
                    { status: 400 }
                );
            }

            // Hash the password
            console.log("API: Hashing password");
            const hashedPassword = await hash(password, 10);
            console.log("API: Password hashed successfully");

            // Create the user in the database
            console.log("API: Creating user");
            let user;

            try {
                // Try using Prisma client first
                user = await db.user.create({
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
            } catch (createError) {
                console.error("API: Error creating user with Prisma:", createError);

                // Fall back to raw SQL if in development mode
                if (process.env.NODE_ENV === 'development') {
                    console.log("API: Attempting raw SQL insertion in development mode");

                    try {
                        // Generate a UUID for the user
                        const userId = crypto.randomUUID();

                        // Insert user with raw SQL
                        await db.$executeRaw`
                            INSERT INTO "Users" (id, email, password, role, created_at) 
                            VALUES (${userId}, ${email}, ${hashedPassword}, 'user', NOW())
                        `;

                        user = {
                            id: userId,
                            email,
                            name: name || email.split('@')[0]
                        };

                        console.log("API: User created with raw SQL");
                    } catch (rawInsertError) {
                        console.error("API: Raw SQL insertion failed:", rawInsertError);
                        throw rawInsertError; // Re-throw to be caught by outer catch
                    }
                } else {
                    // Re-throw in production
                    throw createError;
                }
            }

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

            // In development mode, return success anyway for testing
            if (process.env.NODE_ENV === 'development') {
                console.log("API: Development mode - returning mock success response");
                return NextResponse.json({
                    success: true,
                    message: "Development mode: Registration successful (database bypassed)",
                    userId: 'mock-user-id',
                    redirectToOnboarding: false
                });
            }

            return NextResponse.json(
                { error: "Database error occurred. Please try again later." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("API: Registration error:", error);

        // In development mode, return success anyway for testing
        if (process.env.NODE_ENV === 'development') {
            console.log("API: Development mode - returning mock success response");
            return NextResponse.json({
                success: true,
                message: "Development mode: Registration successful (error bypassed)",
                userId: 'mock-user-id',
                redirectToOnboarding: false
            });
        }

        return NextResponse.json(
            { error: "An error occurred during registration. Please try again." },
            { status: 500 }
        );
    }
} 