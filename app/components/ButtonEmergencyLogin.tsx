"use client";

import { useState } from "react";
import Cookies from 'js-cookie';
import { toast } from "sonner";
import { useAuth } from "./AuthClient";

export default function ButtonEmergencyLogin({
    email,
    callbackUrl = "/dashboard"
}: {
    email: string;
    callbackUrl?: string;
}) {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loginSuccess } = useAuth();

    const handleEmergencyLogin = async () => {
        if (!email) {
            toast.error("Email is required for emergency access");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/force-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show the temporary password
                setPassword(data.tempPassword);
                setShowPassword(true);

                // Set cookies using the direct API for better reliability
                await fetch("/api/auth/set-cookie", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: data.token,
                    }),
                });

                // Set additional cookie for client-side detection
                Cookies.set('direct-auth-token', data.token, {
                    expires: 1, // 1 day
                    path: '/'
                });

                // Update auth context
                loginSuccess(data.user);

                toast.success("Emergency access granted!");

                // Force a hard navigation after a short delay to ensure cookies are set
                setTimeout(() => {
                    window.location.href = callbackUrl;
                }, 500);
            } else {
                throw new Error(data.error || "Emergency login failed");
            }
        } catch (error: any) {
            toast.error(`Emergency login failed: ${error.message}`);
            console.error("Emergency login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {showPassword ? (
                <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded text-yellow-200 text-sm">
                    <p className="font-bold">Emergency access granted!</p>
                    <p className="mt-1">Your password has been reset to:</p>
                    <div className="mt-1 p-2 bg-yellow-950/50 rounded font-mono text-yellow-100">
                        {password}
                    </div>
                    <p className="mt-2 text-xs">
                        You will be redirected to dashboard in a moment...
                    </p>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleEmergencyLogin}
                    disabled={loading || !email}
                    className={`px-3 py-2 text-sm font-medium text-center rounded-md w-full 
            ${!email
                            ? "bg-yellow-900/20 text-yellow-700 cursor-not-allowed"
                            : "bg-yellow-700 hover:bg-yellow-800 text-white"
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Emergency Access"
                    )}
                </button>
            )}
        </div>
    );
} 