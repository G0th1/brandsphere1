import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

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

// Get user by email using Prisma
export async function getUserByEmail(email: string) {
    try {
        console.log(`🔍 Auth: Looking up user by email: ${email}`);

        // Query database using Prisma
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                password_hash: true,
                name: true,
                role: true
            },
        });

        if (!user) {
            console.log(`⚠️ Auth: User not found in database for email: ${email}`);
            return null;
        }

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
        maxAge: 30 * 24 * 60 * 60, // 30 days for better persistence
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            }
        }
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

                    // Get the user from the database
                    const user = await getUserByEmail(credentials.email);

                    if (!user) {
                        console.log("❌ Auth: User not found");
                        // For test user in development only
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

                    // Simple direct password verification with bcrypt compare
                    const passwordValid = await compare(credentials.password, user.password_hash);

                    if (!passwordValid) {
                        console.log("❌ Auth: Invalid password");
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
                    console.error("❌ Auth: Authentication error", error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.email = user.email;
                token.name = user.name || null;
                token.role = user.role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.email = token.email || '';
                session.user.name = token.name || null;
                session.user.role = token.role || 'user';
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development',
}; 