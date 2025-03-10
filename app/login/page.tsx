"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginRedirect() {
    const router = useRouter();
    const [error, setError] = useState(false);
    const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        try {
            // Försök omdirigera till den nya inloggningssidan med en timeout
            const timeout = setTimeout(() => {
                router.push("/auth/login");
            }, 100);

            setRedirectTimeout(timeout);

            // Cleanup
            return () => {
                if (redirectTimeout) {
                    clearTimeout(redirectTimeout);
                }
            };
        } catch (e) {
            console.error("Redirect error:", e);
            setError(true);
        }
    }, [router]);

    // Om det uppstår ett fel med omdirigeringen
    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-8">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h2 className="text-xl font-medium">Ett fel uppstod vid omdirigering</h2>
                    <p className="text-muted-foreground mb-4">Vänligen försök gå till inloggningssidan manuellt</p>
                    <Button
                        onClick={() => {
                            window.location.href = "/auth/login";
                        }}
                    >
                        Gå till inloggningssidan
                    </Button>
                </div>
            </div>
        );
    }

    // Visa laddningsindikator medan omdirigering sker
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-8">
            <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg">Omdirigerar till inloggningssidan...</p>
            </div>
        </div>
    );
} 