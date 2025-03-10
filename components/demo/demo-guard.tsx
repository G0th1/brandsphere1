"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDemo } from "@/contexts/demo-context";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoGuardProps {
    children: React.ReactNode;
}

export function DemoGuard({ children }: DemoGuardProps) {
    const { user, isInitialized } = useDemo();
    const router = useRouter();
    const pathname = usePathname();
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [redirectInProgress, setRedirectInProgress] = useState(false);

    // Kolla om vi är på login-sidan
    const isLoginPage = pathname === "/demo/login";

    useEffect(() => {
        // Försök initiera med skyddad kod
        try {
            if (isInitialized) {
                setIsLoading(false);

                // Endast omdirigera om:
                // 1. Vi inte är på login-sidan
                // 2. Ingen användare finns
                // 3. Vi inte redan håller på att omdirigera
                if (!isLoginPage && !user && !redirectInProgress) {
                    console.log("Ingen demo-användare och inte på login-sidan, navigerar till demo/login");
                    setRedirectInProgress(true);

                    // Använd en timeout för att undvika omedelbara omdirigeringar
                    setTimeout(() => {
                        try {
                            window.location.href = "/demo/login";
                        } catch (error) {
                            console.error("Navigeringsfel i DemoGuard:", error);
                            // Absolut sista försöket
                            try {
                                router.push("/demo/login");
                            } catch (routerError) {
                                console.error("Router-navigeringsfel:", routerError);
                            }
                        }
                    }, 300);
                }
            }
        } catch (err) {
            console.error("Fel i DemoGuard:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
            setIsLoading(false);
        }
    }, [isInitialized, user, router, isLoginPage, redirectInProgress]);

    // Om ett fel uppstod, visa ett felmeddelande
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Ett fel uppstod vid laddning av demo
                </h1>
                <p className="mb-6 text-muted-foreground">
                    {error.message || "Okänt fel"}
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => window.location.reload()}>
                        Uppdatera sidan
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = "/"}>
                        Gå till startsidan
                    </Button>
                </div>
            </div>
        );
    }

    // Visa laddningsindikator medan vi initierar
    if (isLoading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Laddar demo...</p>
                </div>
            </div>
        );
    }

    // Specialhantering för login-sidan
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Om användaren inte är i demo-läge och vi är inte på login-sidan,
    // visa laddningsindikator (vi omdirigerar ändå)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Förbereder demo...</p>
                </div>
            </div>
        );
    }

    // Användaren är i demo-läge, visa innehållet
    return <>{children}</>;
} 