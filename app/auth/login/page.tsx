"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const translations = {
    en: {
        title: "Sign in to your account",
        description: "Enter your email below to sign in to your account",
        emailLabel: "Email address",
        passwordLabel: "Password",
        magicLinkTab: "Magic Link",
        passwordTab: "Password",
        signIn: "Sign in",
        sendLink: "Send magic link",
        createAccount: "Create an account",
        forgotPassword: "Forgot password?",
        errors: {
            title: "Authentication Error",
            default: "Something went wrong. Please try again.",
            credentialsSignin: "Invalid login credentials.",
            emailSignin: "Could not send verification email. Please try again.",
            facebookSignin: "Could not sign in with Facebook. Please try again.",
            googleSignin: "Could not sign in with Google. Please make sure you have access to YouTube.",
            youtubeAccess: "YouTube access is required. Please make sure you have a YouTube account connected to your Google account.",
            emailCreateAccount: "Could not create account. Please try again.",
            callback: "Could not complete authentication. Please try again.",
            oauthAccountNotLinked: "This account is not linked to any existing account. Please sign in with the correct provider.",
            sessionRequired: "Please sign in to access this page.",
            oauthCallback: "Could not complete authentication. Please try again.",
            oauthCreateAccount: "Could not create account. Please try again."
        },
        loading: "Please wait...",
        success: "Check your email for the login link!",
        socialLogin: "Or continue with",
        facebookLogin: "Continue with Facebook",
        googleLogin: "Continue with Google",
        divider: "or"
    },
    sv: {
        title: "Logga in på ditt konto",
        description: "Ange din e-postadress nedan för att logga in på ditt konto",
        emailLabel: "E-postadress",
        passwordLabel: "Lösenord",
        magicLinkTab: "Magisk länk",
        passwordTab: "Lösenord",
        signIn: "Logga in",
        sendLink: "Skicka magisk länk",
        createAccount: "Skapa ett konto",
        forgotPassword: "Glömt lösenord?",
        errors: {
            title: "Autentiseringsfel",
            default: "Något gick fel. Vänligen försök igen.",
            credentialsSignin: "Ogiltiga inloggningsuppgifter.",
            emailSignin: "Kunde inte skicka verifieringsmail. Vänligen försök igen.",
            facebookSignin: "Kunde inte logga in med Facebook. Vänligen försök igen.",
            googleSignin: "Kunde inte logga in med Google. Kontrollera att du har tillgång till YouTube.",
            youtubeAccess: "YouTube-åtkomst krävs. Kontrollera att du har ett YouTube-konto kopplat till ditt Google-konto.",
            emailCreateAccount: "Kunde inte skapa konto. Vänligen försök igen.",
            callback: "Kunde inte slutföra autentiseringen. Vänligen försök igen.",
            oauthAccountNotLinked: "Detta konto är inte kopplat till något befintligt konto. Vänligen logga in med rätt leverantör.",
            sessionRequired: "Vänligen logga in för att komma åt denna sida.",
            oauthCallback: "Kunde inte slutföra autentiseringen. Vänligen försök igen.",
            oauthCreateAccount: "Kunde inte skapa konto. Vänligen försök igen."
        },
        loading: "Vänligen vänta...",
        success: "Kontrollera din e-post för inloggningslänken!",
        socialLogin: "Eller fortsätt med",
        facebookLogin: "Fortsätt med Facebook",
        googleLogin: "Fortsätt med Google",
        divider: "eller"
    }
};

export default function LoginPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [authType, setAuthType] = useState("magic-link"); // "magic-link" or "password"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (authType === "magic-link") {
                // Skicka magisk länk
                const result = await signIn("email", {
                    email,
                    redirect: false,
                    callbackUrl,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                // Redirect till verify-request sidan
                router.push("/auth/verify-request");
            } else {
                // Lösenordsbaserad inloggning
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                    callbackUrl,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                if (result?.url) {
                    router.push(result.url);
                }
            }
        } catch (error) {
            console.error("Sign in error:", error);
            toast({
                title: "Inloggningsfel",
                description: t.errors.default,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = async (provider: string) => {
        setIsLoading(true);
        try {
            const result = await signIn(provider, {
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                let errorMessage = t.errors.default;
                switch (result.error) {
                    case 'OAuthSignin':
                        errorMessage = t.errors[`${provider}Signin` as keyof typeof t.errors];
                        break;
                    case 'OAuthCallback':
                        errorMessage = t.errors[`${provider}Callback` as keyof typeof t.errors];
                        break;
                    case 'OAuthCreateAccount':
                        errorMessage = t.errors[`${provider}CreateAccount` as keyof typeof t.errors];
                        break;
                    case 'EmailCreateAccount':
                        errorMessage = t.errors.emailCreateAccount;
                        break;
                    case 'Callback':
                        errorMessage = t.errors.callback;
                        break;
                    case 'OAuthAccountNotLinked':
                        errorMessage = t.errors.oauthAccountNotLinked;
                        break;
                    case 'EmailSignin':
                        errorMessage = t.errors.emailSignin;
                        break;
                    case 'CredentialsSignin':
                        errorMessage = t.errors.credentialsSignin;
                        break;
                    case 'SessionRequired':
                        errorMessage = t.errors.sessionRequired;
                        break;
                    default:
                        errorMessage = t.errors.default;
                }
                toast({
                    title: t.errors.title,
                    description: errorMessage,
                    variant: "destructive",
                });
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (error) {
            console.error('Social sign in error:', error);
            toast({
                title: t.errors.title,
                description: t.errors.default,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Visa eventuella felmeddelanden från URL
    React.useEffect(() => {
        if (error) {
            const errorMessage = error === "CredentialsSignin"
                ? t.errors.credentialsSignin
                : error === "EmailSignin"
                    ? t.errors.emailSignin
                    : t.errors.default;

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [error, toast, t.errors]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handleSocialSignIn("facebook")}
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    {t.facebookLogin}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSocialSignIn("google")}
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    {t.googleLogin}
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        {t.divider}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="magic-link" onValueChange={(value) => setAuthType(value)}>
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="magic-link">{t.magicLinkTab}</TabsTrigger>
                                <TabsTrigger value="password">{t.passwordTab}</TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t.emailLabel}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="namn@exempel.se"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <TabsContent value="password" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">{t.passwordLabel}</Label>
                                            <Button variant="link" className="p-0 h-auto font-normal text-xs" asChild>
                                                <a href="/auth/forgot-password">{t.forgotPassword}</a>
                                            </Button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required={authType === "password"}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </TabsContent>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !email || (authType === "password" && !password)}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.loading}
                                        </>
                                    ) : authType === "magic-link" ? t.sendLink : t.signIn}
                                </Button>
                            </form>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button variant="link" asChild>
                            <a href="/auth/register">{t.createAccount}</a>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
} 