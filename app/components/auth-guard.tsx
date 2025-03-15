"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

// Custom hook to access the authenticated user
export function useAuthUser() {
    const { data: session } = useSession();
    return session?.user;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication after hydration
        if (status === "loading") {
            return;
        }

        if (!session) {
            // Redirect to login page if not authenticated
            router.push("/auth/login?callbackUrl=/dashboard");
        } else {
            setIsLoading(false);
        }
    }, [session, status, router]);

    // Show loading state
    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If authenticated, render children
    return <>{session ? children : null}</>;
}

// Default export to avoid import errors
export default AuthGuard; 