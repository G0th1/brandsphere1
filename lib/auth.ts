import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare, hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { neon } from '@neondatabase/serverless';

// Define extended types for session
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string;
            image?: string | null;
            role?: string;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string;
        name?: string | null;
        email?: string;
        picture?: string | null;
        role?: string;
    }
}

// Caching mechanism to avoid repeated database calls
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const sql = neon(process.env.DATABASE_URL || '');

// Get user by email using direct Neon connection
export async function getUserByEmail(email: string) {
    console.log(`🔍 Auth: Looking up user by email: ${email.substring(0, 3)}...`);
    // Check cache first
    const cachedUser = userCache.get(email);
    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_TTL) {
        console.log(`✅ Auth: User found in cache`);
        return cachedUser.user;
    }

    try {
        // Query database using Neon serverless
        console.log(`🔌 Auth: Querying database for user`);
        console.log(`Using database URL: ${process.env.DATABASE_URL?.substring(0, 15)}...`);

        // Verify basic connection first
        try {
            const testResult = await sql`SELECT 1 as test`;
            console.log(`Database connection test: ${testResult.length > 0 ? 'Successful' : 'Failed'}`);
        } catch (connError) {
            console.error(`Database connection test failed:`, connError);
        }

        const users = await sql`
            SELECT id, email, password_hash, name, role
            FROM "Users"
            WHERE email = ${email}
        `;

        console.log(`Query returned ${users?.length || 0} results`);

        if (!users || users.length === 0) {
            console.log(`⚠️ Auth: User not found in database for email: ${email.substring(0, 3)}...`);
            return null;
        }

        const user = users[0];

        // Log user data for debugging (without exposing full password hash)
        console.log(`User found:`, {
            id: user.id,
            email: user.email,
            hasPasswordHash: !!user.password_hash,
            passwordHashLength: user.password_hash?.length,
            role: user.role
        });

        // Verify the data structure has expected fields
        if (!user.id || !user.email || !user.password_hash) {
            console.error(`❌ Auth: Retrieved user data is missing required fields:`,
                JSON.stringify({
                    hasId: !!user.id,
                    hasEmail: !!user.email,
                    hasPasswordHash: !!user.password_hash
                })
            );
            return null;
        }

        // Update cache
        userCache.set(email, {
            user,
            timestamp: Date.now()
        });

        console.log(`✅ Auth: User found in database, id: ${user.id}`);
        return user;
    } catch (error) {
        console.error(`❌ Auth: Error getting user from database:`, error);
        return null;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("❌ Auth: Missing credentials");
                    return null;
                }

                try {
                    console.log(`🔍 Auth: Authenticating user: ${credentials.email}`);

                    // Verify database connection first
                    try {
                        const testConnection = await sql`SELECT 1 as test`;
                        if (!testConnection || testConnection.length === 0) {
                            console.error("❌ Auth: Database connection test failed");
                            throw new Error("Database connection failed");
                        }
                        console.log("✅ Auth: Database connection test passed");
                    } catch (dbError) {
                        console.error("❌ Auth: Database connection error", dbError);
                        throw new Error("Database connection error: " + (dbError instanceof Error ? dbError.message : "Unknown error"));
                    }

                    // Get the user from the database
                    const user = await getUserByEmail(credentials.email);

                    if (!user) {
                        console.log("❌ Auth: User not found");
                        // For test user in development
                        if (
                            process.env.NODE_ENV === 'development' &&
                            credentials.email === 'test@example.com' &&
                            credentials.password === 'password'
                        ) {
                            console.log("✅ Auth: Using test user for development");
                            return {
                                id: 'test-user-id',
                                email: 'test@example.com',
                                role: 'user',
                            };
                        }

                        return null;
                    }

                    console.log(`✅ Auth: User found, verifying password`);

                    // Verify password with more robust error handling
                    let passwordValid = false;

                    // Log password details for debugging (never log the actual password)
                    console.log(`Password verification:`, {
                        passwordProvided: !!credentials.password,
                        passwordLength: credentials.password.length,
                        hashExists: !!user.password_hash,
                        hashLength: user.password_hash?.length
                    });

                    try {
                        // Improved password verification that properly handles bcrypt hashes
                        const password = credentials.password.trim();

                        // Log details for debugging (never log the actual password)
                        console.log(`Debug - Stored hash for comparison: ${user.password_hash.substring(0, 10)}...`);

                        // First, verify the hash format is valid bcrypt
                        const validHashFormat = /^\$2[aby]\$\d+\$/.test(user.password_hash);

                        if (!validHashFormat) {
                            console.log("❌ Invalid hash format - not a valid bcrypt hash");
                            throw new Error("Password hash in database is not in a valid bcrypt format");
                        }

                        try {
                            // Standard bcrypt compare with proper error handling
                            passwordValid = await compare(password, user.password_hash);
                            console.log(`Password comparison result: ${passwordValid ? 'Valid' : 'Invalid'}`);
                        } catch (compareError) {
                            console.error("❌ Standard bcrypt compare failed:", compareError);

                            // If standard compare fails, try with proper encoding
                            try {
                                // Ensure we're working with properly encoded strings
                                const encodedPassword = Buffer.from(password).toString('utf8');
                                const cleanHash = Buffer.from(user.password_hash).toString('utf8');

                                // Try the compare again with clean strings
                                passwordValid = await compare(encodedPassword, cleanHash);
                                console.log(`Clean encoding comparison: ${passwordValid ? 'Valid' : 'Invalid'}`);
                            } catch (encodingError) {
                                console.error("❌ Encoding-fixed compare failed:", encodingError);
                                throw new Error("Password verification failed with both standard and encoding-fixed comparisons");
                            }
                        }
                    } catch (passwordError) {
                        console.error("❌ Auth: Password comparison error", passwordError);
                        throw new Error("Password verification failed: " + (passwordError instanceof Error ? passwordError.message : "Unknown error"));
                    }

                    if (!passwordValid) {
                        console.log("❌ Auth: Invalid password");
                        // In development, allow 'password' to work for test accounts
                        if (
                            process.env.NODE_ENV === 'development' &&
                            credentials.email === 'test@example.com' &&
                            credentials.password === 'password'
                        ) {
                            console.log("✅ Auth: Using development password override");
                            return {
                                id: user.id,
                                email: user.email,
                                role: user.role || 'user',
                            };
                        }

                        return null;
                    }

                    console.log(`✅ Auth: Password valid, authentication successful`);
                    // Format user object correctly for NextAuth
                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role || 'user',
                        name: user.name || null,
                    };
                } catch (error) {
                    console.error("❌ Auth: Error in authorize function:", error);

                    // In development mode, provide a fallback for easier testing
                    if (process.env.NODE_ENV === 'development' &&
                        credentials.email === 'test@example.com' &&
                        credentials.password === 'password') {
                        console.log('🔧 Auth error occurred but returning test user for development mode');
                        return {
                            id: 'test-user-fallback',
                            email: 'test@example.com',
                            role: 'user',
                        };
                    }

                    // Convert error to a standard format for better handling upstream
                    if (error instanceof Error) {
                        if (error.message.includes("database") || error.message.includes("connection")) {
                            throw new Error(`Database error: ${error.message}`);
                        } else if (error.message.includes("password")) {
                            throw new Error(`Password verification error: ${error.message}`);
                        }
                    }

                    throw error; // Let NextAuth handle it
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('🔐 Auth: Setting JWT from user:', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    role: user.role || 'user'
                }));

                return {
                    ...token,
                    id: user.id,
                    role: user.role || 'user',
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                console.log('🔐 Auth: Setting session from token:', JSON.stringify({
                    id: token.id || token.sub,
                    role: token.role
                }));

                // Ensure we have a valid id, falling back to sub if needed
                session.user.id = (token.id as string) || token.sub;
                session.user.role = (token.role as string) || 'user';
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === "development",
}; 