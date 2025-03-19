"use client";

import React, { useState } from "react";

export default function ForceResetPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Call the force reset API
            const response = await fetch("/api/auth/force-password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || "Password reset failed");
            }
        } catch (err) {
            console.error("Reset error:", err);
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-xl p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Emergency Password Reset</h1>

                <form onSubmit={handleReset} className="space-y-4">
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
                        <label className="block mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                            required
                            minLength={6}
                        />
                        <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded font-medium ${loading ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
                            } transition-colors`}
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                </form>

                {result && (
                    <div className="mt-6 bg-green-500/20 border border-green-500 p-4 rounded">
                        <h2 className="text-lg font-medium text-green-400 mb-2">Password Reset Successful!</h2>
                        <p className="text-sm">You can now log in with the new password.</p>

                        <div className="mt-4 flex space-x-3">
                            <a
                                href="/auth/login"
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                            >
                                Go to Login
                            </a>
                            <a
                                href="/simple-login"
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                            >
                                Try Simple Login
                            </a>
                        </div>

                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm text-slate-400">Technical Details</summary>
                            <pre className="mt-2 bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>For diagnostic purposes only.</p>
                    <div className="mt-4 flex justify-center space-x-4">
                        <a href="/auth-debug" className="text-blue-400 hover:underline">Authentication Debugger</a>
                        <a href="/simple-login" className="text-blue-400 hover:underline">Simple Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
} 