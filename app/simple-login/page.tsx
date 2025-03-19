"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SimpleLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState<any>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResponse(null);

        try {
            console.log("Attempting direct login with:", { email, password });

            // Call the direct login API
            const res = await fetch("/api/auth/login-direct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log("Login response:", data);

            setResponse(data);

            if (res.ok && data.status === "success") {
                setError("");
                // Redirect to dashboard on success
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred during login");
            setResponse(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-lg p-8 text-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Simple Direct Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded font-medium ${loading ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                            } transition-colors`}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                {response && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">Response Details:</h2>
                        <pre className="bg-slate-900 p-4 rounded overflow-x-auto text-xs">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>Try one of these credentials:</p>
                    <p className="mt-1">edvin.gothager@edu.nacka.se / password123</p>
                    <p className="mt-1">test1742414576163@example.com / testpassword123</p>
                </div>
            </div>
        </div>
    );
} 