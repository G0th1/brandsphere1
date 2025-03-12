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

// Loggfunktion för att hjälpa till med debugging
function authLog(message: string, data?: any) {
    console.log(`🔐 Auth: ${message}`, data ? data : '');
}

// Säkerställ att NextAuth har korrekta uppgifter även om miljövariabler saknas
const nextAuthUrl = process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'fallback-dev-secret-do-not-use-in-production';

authLog(`Konfigurerar auth med URL: ${nextAuthUrl}`);

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    secret: nextAuthSecret,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dagar
    },
    debug: process.env.NODE_ENV !== 'production',
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
        newUser: "/dashboard",
        verifyRequest: "/auth/verify-request", // Sida för att be användaren verifiera sin e-post
    },
    providers: [
        // E-postverifiering via NextAuth - bara om miljövariabler finns
        ...(process.env.EMAIL_SERVER_HOST ? [
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
            })
        ] : []),
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    authLog("Credentials auth: Saknar e-post eller lösenord");
                    return null;
                }

                try {
                    authLog(`Försöker hitta användare med e-post: ${credentials.email}`);
                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                        include: { subscription: true }
                    });

                    if (!user) {
                        authLog(`Ingen användare hittades med e-post: ${credentials.email}`);
                        return null;
                    }

                    if (!user.password) {
                        authLog(`Användaren har inget lösenord: ${credentials.email}`);
                        return null;
                    }

                    const passwordValid = await compare(credentials.password, user.password);

                    if (!passwordValid) {
                        authLog(`Ogiltigt lösenord för användare: ${credentials.email}`);
                        return null;
                    }

                    authLog(`✅ Lyckad inloggning med användaruppgifter: ${credentials.email}`);
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    };
                } catch (error) {
                    authLog("Fel vid autentisering med användaruppgifter:", error);
                    return null;
                }
            }
        }),
        // Google Provider - bara om miljövariabler finns
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                authorization: {
                    params: {
                        scope: 'https://www.googleapis.com/auth/youtube.readonly openid email profile',
                        prompt: "consent",
                        access_type: "offline",
                        response_type: "code"
                    },
                },
                profile(profile) {
                    authLog(`Google login profile:`, profile);
                    return {
                        id: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                    };
                },
            })
        ] : []),
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
                authLog(`Creating JWT for account type: ${account.provider}`);
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