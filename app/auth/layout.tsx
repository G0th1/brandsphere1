"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const [renderError, setRenderError] = useState(false);

    // Markera när komponenten har monterats på klientsidan
    useEffect(() => {
        setMounted(true);
    }, []);

    // Visa laddningsindikator innan klientsidan är redo
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    try {
        return (
            <div className="min-h-screen bg-background">
                {children}
            </div>
        );
    } catch (error) {
        // Om det uppstår ett renderingsfel
        console.error("Error rendering AuthLayout:", error);
        if (!renderError) {
            setRenderError(true);
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Ett fel inträffade vid laddning av sidan
                </h1>
                <div className="flex gap-4 mt-6">
                    <Button onClick={() => window.location.reload()}>
                        Uppdatera sidan
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Gå till startsidan
                    </Button>
                </div>
            </div>
        );
    }
} 