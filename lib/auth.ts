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
        accessToken?: string;
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
                    console.log("Credentials auth: Saknar e-post eller lösenord");
                    return null;
                }

                try {
                    console.log(`Försöker hitta användare med e-post: ${credentials.email}`);
                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                        include: { subscription: true } // Inkludera prenumerationsinformation
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

                    console.log(`Lyckad inloggning med användaruppgifter: ${credentials.email}, plan: ${user.subscription?.plan || 'ingen prenumeration'}`);
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
        async jwt({ token, user, account, trigger, session }) {
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

            // Vid uppdatering av sessionen
            if (trigger === "update" && session) {
                // Kopiera relevanta fält från session.user till token
                if (session.user?.name) token.name = session.user.name;
                if (session.user?.email) token.email = session.user.email;
                if (session.user?.image) token.picture = session.user.image;

                console.log(`JWT updated for user: ${token.email}`);
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            try {
                console.log(`Inloggningsförsök med provider: ${account?.provider}`);

                // För credentials provider
                if (account?.provider === 'credentials') {
                    if (!user || !user.email) {
                        console.error('Inloggning misslyckades: Ogiltiga användaruppgifter');
                        return false;
                    }
                    console.log(`Lyckad inloggning med användaruppgifter för: ${user.email}`);
                    return true;
                }

                // För Google-inloggning
                if (account?.provider === 'google') {
                    try {
                        console.log(`Kontrollerar YouTube API-åtkomst med token: ${account.access_token?.substring(0, 10)}...`);
                        const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
                            headers: {
                                Authorization: `Bearer ${account.access_token}`,
                            },
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('YouTube API-fel:', errorText);
                            // Vi tillåter inloggning även om YouTube-åtkomst misslyckas
                            console.log('Tillåter inloggning trots YouTube API-fel');
                            return true;
                        }

                        // Kontrollera om vi behöver skapa en prenumeration för Google-användare
                        if (user && user.id) {
                            try {
                                const existingSub = await db.subscription.findUnique({
                                    where: { userId: user.id }
                                });

                                if (!existingSub) {
                                    await db.subscription.create({
                                        data: {
                                            userId: user.id,
                                            plan: "Free",
                                            status: "active",
                                            billingCycle: "monthly",
                                        }
                                    });
                                    console.log(`Skapade gratis prenumeration för Google-användare: ${user.id}`);
                                }
                            } catch (subError) {
                                console.error('Fel vid kontroll/skapande av prenumeration:', subError);
                            }
                        }

                        console.log('YouTube API-åtkomst lyckades');
                        return true;
                    } catch (apiError) {
                        console.error('YouTube API-fel:', apiError);
                        // Vi tillåter inloggning även om YouTube-åtkomst misslyckas
                        console.log('Tillåter inloggning trots YouTube API-fel');
                        return true;
                    }
                }

                // För övriga providers
                return true;
            } catch (error) {
                console.error('Inloggningsfel:', error);
                return false;
            }
        },
        async redirect({ url, baseUrl }) {
            // Säkerställ att URL:en börjar med basen om det är en relativ URL
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }
            // Om URL:en är för samma webbplats, tillåt redirect
            else if (url.startsWith(baseUrl)) {
                return url;
            }
            // Annars, omdirigera till standardsidan
            return baseUrl;
        }
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

            // Här kan du lägga till ytterligare initialisering av användardata om det behövs
            if (message.user.id) {
                try {
                    // Kontrollera om användaren redan har en prenumeration
                    const existingSubscription = await db.subscription.findUnique({
                        where: { userId: message.user.id }
                    });

                    if (!existingSubscription) {
                        // Skapa en gratis prenumeration för nya användare om ingen redan finns
                        await db.subscription.create({
                            data: {
                                userId: message.user.id,
                                plan: "Free",
                                status: "active",
                                billingCycle: "monthly",
                            }
                        });
                        console.log(`Skapade gratis prenumeration för ny användare: ${message.user.id}`);
                    } else {
                        console.log(`Användare ${message.user.id} har redan en prenumeration: ${existingSubscription.plan}`);
                    }
                } catch (error) {
                    console.error('Fel vid skapande av prenumeration för ny användare:', error);
                    // Vi fortsätter även om prenumerationen inte kunde skapas
                }
            }
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
    debug: process.env.NODE_ENV !== 'production', // Aktivera debug-läge bara i utveckling
}; 