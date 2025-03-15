"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

interface DatabaseStatus {
    status: "loading" | "connected" | "error";
    message?: string;
    details?: string;
    timestamp?: string;
}

export function DashboardConnectionWrapper({ children }: { children: React.ReactNode }) {
    const [dbStatus, setDbStatus] = useState<DatabaseStatus>({ status: "loading" });
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    async function checkDatabaseConnection() {
        try {
            const res = await fetch("/api/db-test", {
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            });

            const data = await res.json();

            if (data.status === "connected") {
                setDbStatus({
                    status: "connected",
                    message: data.message,
                    timestamp: data.timestamp
                });
            } else {
                setDbStatus({
                    status: "error",
                    message: data.message || "Unknown database error",
                    details: data.details,
                    timestamp: data.timestamp
                });
            }
        } catch (err) {
            console.error("Error checking database connection:", err);
            setDbStatus({
                status: "error",
                message: err instanceof Error ? err.message : "Failed to connect to database"
            });
        }
    }

    useEffect(() => {
        // Check connection immediately on component mount
        checkDatabaseConnection();

        // Set up an interval to check periodically if still loading or error
        const interval = setInterval(() => {
            if (dbStatus.status !== "connected") {
                if (retryCount < maxRetries) {
                    checkDatabaseConnection();
                    setRetryCount(prev => prev + 1);
                } else {
                    clearInterval(interval);
                }
            } else {
                clearInterval(interval);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [dbStatus.status, retryCount]);

    if (dbStatus.status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-900 dark:text-white">
                <div className="w-16 h-16 relative animate-pulse">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                </div>
                <h2 className="mt-6 text-xl font-semibold">Connecting to Database</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Please wait while we establish connection...</p>
            </div>
        );
    }

    if (dbStatus.status === "error") {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                <h2 className="text-2xl font-bold mb-4">Database Connection Error</h2>
                <p className="mb-2">{dbStatus.message || "Unable to connect to the database"}</p>

                {dbStatus.details && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 rounded-md overflow-auto">
                        <h3 className="font-semibold mb-2">Error Details:</h3>
                        <pre className="text-sm whitespace-pre-wrap">{dbStatus.details}</pre>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-4">
                    <button
                        onClick={() => {
                            setDbStatus({ status: "loading" });
                            setRetryCount(0);
                            checkDatabaseConnection();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
                    >
                        Retry Connection
                    </button>

                    <div className="border-t border-red-200 dark:border-red-800 pt-4 mt-2">
                        <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Check your database credentials in environment variables</li>
                            <li>Ensure your Neon PostgreSQL database is running</li>
                            <li>Verify that the database migrations have been applied</li>
                            <li>Check server logs for more detailed information</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Database is connected, render children
    return <>{children}</>;
} 