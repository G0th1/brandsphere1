import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

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

export const authOptions: NextAuthOptions = {
    // We're not using PrismaAdapter since our schema is different
    secret: process.env.NEXTAUTH_SECRET || 'default-secret-do-not-use-in-production',
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        newUser: "/dashboard",
    },
    providers: [
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    // Allow bypass in development mode with any credentials
                    const isDev = process.env.NODE_ENV === 'development';

                    if (isDev) {
                        console.log("Development mode - bypassing authentication");
                        return {
                            id: 'dev-user-id',
                            name: credentials.email.split('@')[0],
                            email: credentials.email,
                            image: null,
                            role: 'admin'
                        };
                    }

                    // Production authentication flow
                    // First check DB connection
                    try {
                        console.log("Testing DB connection");
                        await db.$queryRaw`SELECT 1`;
                        console.log("DB connection successful");
                    } catch (dbError) {
                        console.error("Database connection test failed:", dbError);
                        throw new Error("Database connection failed");
                    }

                    // Use raw query to directly access the Users table
                    console.log("Querying user from database");
                    const users = await db.$queryRaw`
                        SELECT id, email, password, password_hash, role
                        FROM "Users" 
                        WHERE email = ${credentials.email}
                    `;

                    console.log("Query result:", JSON.stringify(users, null, 2));

                    // Handle array result from raw query
                    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    // Support for both password_hash or password fields
                    const passwordField = user.password_hash || user.password;

                    if (!passwordField) {
                        console.log("No password hash found for user");
                        return null;
                    }

                    console.log("Comparing passwords");
                    const passwordValid = await compare(credentials.password, passwordField);

                    if (!passwordValid) {
                        console.log("Password invalid");
                        return null;
                    }

                    console.log("Authentication successful");
                    return {
                        id: user.id,
                        name: credentials.email.split('@')[0], // Derive name from email
                        email: user.email,
                        image: null,
                        role: user.role || 'user'
                    };
                } catch (error) {
                    console.error("Authentication error:", error);

                    // Fallback for development mode even on errors
                    if (process.env.NODE_ENV === 'development') {
                        console.log("Development mode - fallback on error");
                        return {
                            id: 'demo-user-id',
                            name: credentials.email.split('@')[0],
                            email: credentials.email,
                            image: null,
                            role: 'admin'
                        };
                    }

                    // Rethrow error for better debugging
                    throw error;
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub;
                session.user.name = token.name || null;
                session.user.email = token.email || '';
                session.user.image = token.picture;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Handle redirects
            if (url.startsWith(baseUrl) || url.startsWith('/')) {
                return url;
            }
            return baseUrl + '/dashboard';
        }
    },
    debug: process.env.NODE_ENV === 'development',
}; 