import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

// Define validation schema
const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().optional(),
});

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || '';
const sql = neon(databaseUrl);

export async function POST(req: Request) {
    console.log('🔄 Alternative registration API called');

    try {
        // Parse and validate the request body
        const body = await req.json();
        console.log('📦 Request data received:', {
            email: body.email ? body.email.substring(0, 3) + '...' : 'missing',
            hasPassword: Boolean(body.password),
            hasName: Boolean(body.name)
        });

        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            console.error('❌ Validation errors:', validation.error.format());
            return NextResponse.json(
                {
                    error: 'Invalid input',
                    message: 'Please check your email and password',
                    details: validation.error.format()
                },
                { status: 400 }
            );
        }

        const { email, password, name } = validation.data;

        // Test database connection
        try {
            await sql`SELECT 1 as test`;
            console.log('✅ Database connection successful');
        } catch (connError) {
            console.error('❌ Database connection error:', connError);
            return NextResponse.json(
                {
                    error: 'Database connection error',
                    message: 'Unable to connect to the database. Please try again later.'
                },
                { status: 503 }
            );
        }

        // Check if user already exists
        try {
            const existingUsers = await sql`
        SELECT COUNT(*) as count FROM "Users" WHERE email = ${email}
      `;

            if (existingUsers[0].count > 0) {
                console.log('⚠️ Email already in use');
                return NextResponse.json(
                    {
                        error: 'Email already registered',
                        message: 'This email is already registered. Please login or use a different email.'
                    },
                    { status: 409 }
                );
            }
        } catch (emailCheckError) {
            console.error('❌ Error checking email existence:', emailCheckError);
            // Continue anyway - we'll handle duplicate key errors if they occur
        }

        // Hash password
        let passwordHash;
        try {
            passwordHash = await hash(password, 10);
            console.log('✅ Password hashed successfully');
        } catch (hashError) {
            console.error('❌ Password hashing error:', hashError);
            return NextResponse.json(
                {
                    error: 'Password processing error',
                    message: 'An error occurred while processing your password. Please try again.'
                },
                { status: 500 }
            );
        }

        // Generate UUID
        const userId = crypto.randomUUID();
        console.log('✅ Generated user ID:', userId);

        // Create user with direct SQL
        try {
            await sql`
        INSERT INTO "Users" (
          id, 
          email, 
          password_hash, 
          role, 
          created_at
        ) VALUES (
          ${userId}::uuid,
          ${email},
          ${passwordHash},
          'user',
          NOW()
        )
      `;
            console.log('✅ User created successfully');

            // Try to create subscription but don't fail if it doesn't work
            try {
                const subscriptionId = crypto.randomUUID();
                const oneYearLater = new Date();
                oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

                await sql`
          INSERT INTO "Subscriptions" (
            id,
            user_id,
            plan,
            status,
            start_date,
            end_date
          ) VALUES (
            ${subscriptionId}::uuid,
            ${userId}::uuid,
            'Free',
            'active',
            NOW()::date,
            ${oneYearLater.toISOString().split('T')[0]}::date
          )
        `;
                console.log('✅ Subscription created successfully');
            } catch (subError) {
                console.error('⚠️ Failed to create subscription but continuing:', subError);
                // Non-fatal error, user can still login
            }

            // Return successful response
            return NextResponse.json({
                success: true,
                message: 'Registration successful! You can now login with your email and password.',
                userId: userId
            });
        } catch (createError) {
            console.error('❌ Error creating user:', createError);

            let errorMessage = 'Failed to create user account. Please try again.';
            let statusCode = 500;

            // Handle common errors
            if (createError instanceof Error) {
                if (createError.message.includes('duplicate key')) {
                    errorMessage = 'This email is already registered.';
                    statusCode = 409;
                } else if (createError.message.includes('violates foreign key')) {
                    errorMessage = 'Database constraint error. Please try again.';
                } else if (createError.message.includes('does not exist')) {
                    errorMessage = 'Database schema error. Please contact support.';
                }
            }

            return NextResponse.json(
                {
                    error: 'Registration failed',
                    message: errorMessage,
                    details: process.env.NODE_ENV === 'development' ?
                        (createError instanceof Error ? createError.message : String(createError)) : undefined
                },
                { status: statusCode }
            );
        }
    } catch (error) {
        console.error('❌ Unexpected error in registration process:', error);

        return NextResponse.json(
            {
                error: 'Registration error',
                message: 'An unexpected error occurred. Please try again later.',
                details: process.env.NODE_ENV === 'development' ?
                    (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
} 