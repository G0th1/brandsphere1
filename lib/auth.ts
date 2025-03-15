import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string;
        name?: string | null;
        email?: string;
        picture?: string | null;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
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
                    console.log("No credentials provided");
                    return null;
                }

                try {
                    console.log("Attempting database lookup for:", credentials.email);

                    // SIMPLIFIED MODE: Skip database check in development 
                    // or if development mode is set in the URL
                    const isDev = process.env.NODE_ENV === 'development' ||
                        (typeof window !== 'undefined' &&
                            window.location.href.includes('dev=true'));

                    if (isDev) {
                        console.log("Development mode: Using demo login");
                        return {
                            id: 'dev-user-id',
                            name: credentials.email.split('@')[0],
                            email: credentials.email,
                            image: null
                        };
                    }

                    // Regular production flow - check database
                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        console.log("User not found or no password set");
                        return null;
                    }

                    const passwordValid = await compare(credentials.password, user.password);

                    if (!passwordValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    console.log("Login successful for:", user.email);
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    };
                } catch (error) {
                    console.error("Authentication error:", error);

                    // Always allow login in development mode when database errors occur
                    if (process.env.NODE_ENV === 'development') {
                        console.log("Development mode: Using fallback authentication");

                        return {
                            id: 'demo-user-id',
                            name: credentials.email.split('@')[0],
                            email: credentials.email,
                            image: null
                        };
                    }

                    return null;
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
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Simple redirect logic
            if (url.startsWith(baseUrl) || url.startsWith('/')) {
                console.log("Redirecting to:", url);
                return url;
            }

            console.log("Redirecting to dashboard");
            return baseUrl + '/dashboard';
        }
    },
    debug: process.env.NODE_ENV === 'development',
}; 