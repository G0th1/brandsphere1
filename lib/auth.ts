import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { sendVerificationRequest } from "./email";

// Definiera utökade typer för session och token
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string;
            image?: string | null;
            youtubeAccess?: boolean;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string;
        name?: string | null;
        email?: string;
        picture?: string | null;
        provider?: string;
        youtubeAccess?: boolean;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dagar
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
        newUser: "/dashboard",
    },
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM || "noreply@brandsphereai.com",
            sendVerificationRequest,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture?.data?.url,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/youtube.readonly openid email profile',
                },
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub;
                session.user.name = token.name || null;
                session.user.email = token.email || '';
                session.user.image = token.picture;

                if (token.provider === 'google') {
                    session.user.youtubeAccess = token.youtubeAccess;
                }
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.provider = account.provider;

                if (account.provider === 'google') {
                    token.youtubeAccess = true;
                }
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === 'google') {
                    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
                        headers: {
                            Authorization: `Bearer ${account.access_token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error('YouTube API error:', await response.text());
                        return false;
                    }
                    return true;
                }
                return true;
            } catch (error) {
                console.error('Sign in error:', error);
                return false;
            }
        },
    },
    events: {
        async signIn(message) {
            console.log('Sign in event:', message);
        },
        async signOut(message) {
            console.log('Sign out event:', message);
        },
        async error(message) {
            console.error('Auth error:', message);
        },
    },
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60, // 30 dagar
            },
        },
    },
    debug: process.env.NODE_ENV === 'development',
}; 