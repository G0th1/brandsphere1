"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/contexts/demo-context";
import { safeNavigate } from "@/lib/utils/navigation";

interface DemoGuardProps {
    children: React.ReactNode;
}

export function DemoGuard({ children }: DemoGuardProps) {
    const { user, isInitialized } = useDemo();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !user) {
            safeNavigate("/demo/login", router);
        }
    }, [isInitialized, user, router]);

    // Visa inget förrän vi vet om användaren är i demo-läge eller inte
    if (!isInitialized) {
        return null;
    }

    // Om användaren inte är i demo-läge, visa inget (vi omdirigerar ändå)
    if (!user) {
        return null;
    }

    // Användaren är i demo-läge, visa innehållet
    return <>{children}</>;
} 