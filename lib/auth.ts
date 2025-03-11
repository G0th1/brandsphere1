import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

// Definiera utökade typer för session
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
        accessToken?: string;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dagar
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
        newUser: "/dashboard",
        verifyRequest: "/auth/verify-request", // Sida för att be användaren verifiera sin e-post
    },
    providers: [
        // E-postverifiering via NextAuth
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST || "",
                port: Number(process.env.EMAIL_SERVER_PORT) || 587,
                auth: {
                    user: process.env.EMAIL_SERVER_USER || "",
                    pass: process.env.EMAIL_SERVER_PASSWORD || "",
                },
            },
            from: process.env.EMAIL_FROM || "noreply@brandsphereai.com",
        }),
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Credentials auth: Saknar e-post eller lösenord");
                    return null;
                }

                try {
                    console.log(`Försöker hitta användare med e-post: ${credentials.email}`);
                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                        include: { subscription: true }
                    });

                    if (!user) {
                        console.log(`Ingen användare hittades med e-post: ${credentials.email}`);
                        return null;
                    }

                    if (!user.password) {
                        console.log(`Användaren har inget lösenord: ${credentials.email}`);
                        return null;
                    }

                    const passwordValid = await compare(credentials.password, user.password);

                    if (!passwordValid) {
                        console.log(`Ogiltigt lösenord för användare: ${credentials.email}`);
                        return null;
                    }

                    console.log(`Lyckad inloggning med användaruppgifter: ${credentials.email}`);
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    };
                } catch (error) {
                    console.error("Fel vid autentisering med användaruppgifter:", error);
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
            if (user) {
                token.sub = user.id;
            }

            // När initial inloggning sker
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
        }
    }
}; 