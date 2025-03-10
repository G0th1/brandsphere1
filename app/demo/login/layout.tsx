"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DemoLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Simulera laddning och sätt sedan loading till false
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Hantera oväntade fel
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Ett fel inträffade vid laddning av demo-sidan
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

    // Visar en laddningsindikator under första renderingen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Skyddad rendering med try/catch
    try {
        return <>{children}</>;
    } catch (renderError) {
        console.error("Error rendering demo login layout:", renderError);
        setError(true);

        // Fallback-rendering
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Ett fel inträffade vid rendering av sidan
                </h1>
                <div className="flex gap-4 mt-6">
                    <Button onClick={() => window.location.reload()}>
                        Uppdatera sidan
                    </Button>
                </div>
            </div>
        );
    }
} 