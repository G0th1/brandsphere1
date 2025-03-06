import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

// Definiera utökade typer för session och token
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string;
            image?: string | null;
            youtubeAccess?: boolean;
            hasSocialAccounts?: boolean;
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
        hasSocialAccounts?: boolean;
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
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Credentials auth: Missing email or password");
                    return null;
                }

                try {
                    console.log(`Attempting to find user with email: ${credentials.email}`);
                    const user = await db.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user) {
                        console.log(`No user found with email: ${credentials.email}`);
                        return null;
                    }

                    if (!user.password) {
                        console.log(`User has no password: ${credentials.email}`);
                        return null;
                    }

                    const passwordValid = await compare(credentials.password, user.password);

                    if (!passwordValid) {
                        console.log(`Invalid password for user: ${credentials.email}`);
                        return null;
                    }

                    console.log(`Successful credentials login: ${credentials.email}`);
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    };
                } catch (error) {
                    console.error("Error during credentials auth:", error);
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/youtube.readonly openid email profile',
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                },
            },
            profile(profile) {
                console.log(`Google login profile:`, profile);
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

                // Kontrollera om användaren har kopplat sociala mediekonton
                session.user.hasSocialAccounts = token.hasSocialAccounts ||
                    token.youtubeAccess ||
                    false;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                console.log(`Creating JWT for account type: ${account.provider}`);
                token.accessToken = account.access_token;
                token.provider = account.provider;

                if (account.provider === 'google') {
                    token.youtubeAccess = true;
                    token.hasSocialAccounts = true;
                }
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            try {
                console.log(`Sign in attempt with provider: ${account?.provider}`);

                if (account?.provider === 'google') {
                    try {
                        console.log(`Checking YouTube API access with token: ${account.access_token?.substring(0, 10)}...`);
                        const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
                            headers: {
                                Authorization: `Bearer ${account.access_token}`,
                            },
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('YouTube API error:', errorText);
                            // Vi tillåter inloggning även om YouTube-åtkomst misslyckas
                            console.log('Allowing sign in despite YouTube API error');
                            return true;
                        }
                        console.log('YouTube API access successful');
                        return true;
                    } catch (apiError) {
                        console.error('YouTube API error:', apiError);
                        // Vi tillåter inloggning även om YouTube-åtkomst misslyckas
                        console.log('Allowing sign in despite YouTube API error');
                        return true;
                    }
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
        async createUser(message) {
            console.log('Create user event:', message);
        },
        async linkAccount(message) {
            console.log('Link account event:', message);
        }
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? `__Secure-next-auth.session-token`
                : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60, // 30 dagar
            },
        },
    },
    debug: true, // Aktivera debug-läge för att se mer information
}; 