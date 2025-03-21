import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from "@/lib/db";
import { createUser, getUserByEmail } from "@/lib/neon-db";
import { z } from "zod";

// Define validation schema with improved validation
const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().optional()
});

export async function POST(req: Request) {
    console.log("🚀 API: Registration request received");

    try {
        // Test database connection first to catch connection issues early
        try {
            const testConn = await sql`SELECT 1 as test`;
            console.log("✅ API: Database connection test successful");
        } catch (connError) {
            console.error("❌ API: Database connection test failed", connError);
            return NextResponse.json(
                {
                    error: "Database connection error",
                    message: "Unable to connect to the database. Please try again later.",
                    details: process.env.NODE_ENV === 'development' ?
                        (connError instanceof Error ? connError.message : "Unknown error") : undefined
                },
                { status: 503 }
            );
        }

        const body = await req.json();
        console.log("📦 API: Request body received", {
            email: body.email ? `${body.email.substring(0, 3)}...` : 'missing',
            hasPassword: !!body.password,
            hasName: !!body.name
        });

        // Validate request body
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            console.error("❌ API: Validation error", validation.error.format());
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validation.error.format(),
                    message: "Please check your email and password"
                },
                { status: 400 }
            );
        }

        const { email, password, name } = validation.data;
        console.log(`✅ API: Validation successful for: ${email.substring(0, 3)}...`);

        // First check if the email already exists
        try {
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                console.log("⚠️ API: Email already exists");
                return NextResponse.json(
                    {
                        error: "Email already registered",
                        message: "This email address is already registered. Please login or use a different email."
                    },
                    { status: 409 }
                );
            }
            console.log("✅ API: Email is available");
        } catch (emailCheckError) {
            console.error("❌ API: Error checking email existence", emailCheckError);
            return NextResponse.json(
                {
                    error: "Email validation error",
                    message: "Unable to validate email. Please try again."
                },
                { status: 500 }
            );
        }

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await hash(password, 10);
            console.log("✅ API: Password hashed successfully");
        } catch (hashError) {
            console.error("❌ API: Password hashing failed", hashError);
            return NextResponse.json(
                {
                    error: "Password processing error",
                    message: "Unable to process password. Please try again."
                },
                { status: 500 }
            );
        }

        // Create the user
        console.log("👤 API: Creating user with subscription");
        let user;

        try {
            // Notify that we're starting the registration process
            console.log(`🔍 API: Starting non-transactional user creation for: ${email.substring(0, 3)}...`);

            // More robust timeout handling
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new Error("Database operation timed out"));
                }, 10000); // 10 second timeout
            });

            // Race the user creation against the timeout
            user = await Promise.race([
                createUser(email, hashedPassword, 'user'),
                timeoutPromise
            ]);

            console.log(`✅ API: User created successfully, id: ${user.id}`);

            // Return success response even if subscription creation had issues
            return NextResponse.json({
                success: true,
                message: "Registration successful! You can now login with your email and password.",
                userId: user.id
            });
        } catch (createError) {
            console.error("❌ API: User creation failed", createError);

            // Attempting to log as much info as possible
            try {
                console.error("Error details:", JSON.stringify(createError, Object.getOwnPropertyNames(createError)));
            } catch (e) {
                console.error("Could not stringify error:", e);
            }

            // Provide detailed error information for debugging
            let errorDetails = "Unknown error";
            let errorMessage = "Unable to create user account. Please try again.";
            let statusCode = 500;

            if (createError instanceof Error) {
                errorDetails = createError.message;
                console.error("Error name:", createError.name);
                console.error("Error message:", createError.message);

                if (createError.stack) {
                    console.error("Error stack:", createError.stack);
                }

                // Attempt to provide more specific error messages based on common issues
                if (createError.message.includes('duplicate key') || createError.message.includes('already registered') || createError.message.includes('already exists')) {
                    errorMessage = "This email is already registered.";
                    statusCode = 409;
                } else if (createError.message.includes('violates foreign key')) {
                    errorMessage = "Error creating user account structure. Please try again.";
                } else if (createError.message.includes('relation') && createError.message.includes('does not exist')) {
                    errorMessage = "Database setup issue. Please contact support.";
                } else if (createError.message.includes('date/time field value out of range')) {
                    errorMessage = "Invalid date format in system. Please try again.";
                } else if (createError.message.includes('null value in column')) {
                    errorMessage = "Missing required information. Please try again.";
                } else if (createError.message.includes('subscription')) {
                    errorMessage = "User account created but subscription setup failed. You can still login.";
                    statusCode = 201; // Created with warning
                } else if (createError.message.includes('timed out')) {
                    errorMessage = "Registration request timed out. Please try again later.";
                    statusCode = 504; // Gateway Timeout
                } else if (createError.message.includes('connection')) {
                    errorMessage = "Database connection error. Please try again later.";
                    statusCode = 503; // Service Unavailable
                }
            }

            console.log(`⚠️ API: Returning error to client: ${errorMessage} (${statusCode})`);

            return NextResponse.json(
                {
                    error: "User creation failed",
                    message: errorMessage,
                    details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
                },
                { status: statusCode }
            );
        }
    } catch (error) {
        console.error("❌ API: Unexpected error in registration flow:", error);

        return NextResponse.json(
            {
                error: "Registration error",
                message: "An unexpected error occurred during registration. Please try again.",
                details: process.env.NODE_ENV === 'development' ?
                    (error instanceof Error ? error.message : "Unknown error") : undefined
            },
            { status: 500 }
        );
    }
} 