"use client";

import React, { useState } from "react";

export default function AuthDebugPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleDebug = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Call our debug endpoint
            const response = await fetch("/api/auth/debug-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    testPassword: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || "Failed to debug user");
            }
        } catch (err) {
            console.error("Debug error:", err);
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Authentication Debugging Tool</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Debug Form */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">User Lookup</h2>

                        <form onSubmit={handleDebug} className="space-y-4">
                            <div>
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Password to Test</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                                    placeholder="Optional"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Enter a password to test against the stored hash
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-900/50 border border-red-500 p-3 rounded">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 rounded font-medium ${loading ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                                    } transition-colors`}
                            >
                                {loading ? "Processing..." : "Debug Authentication"}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Results</h2>

                        {result ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium text-gray-300 mb-2">User Information</h3>
                                    <div className="bg-gray-700 p-3 rounded text-sm">
                                        <p><span className="text-gray-400">ID:</span> {result.id}</p>
                                        <p><span className="text-gray-400">Email:</span> {result.email}</p>
                                        <p><span className="text-gray-400">Role:</span> {result.role || "Not set"}</p>
                                        <p><span className="text-gray-400">Name:</span> {result.name || "Not set"}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-300 mb-2">Password Hash Details</h3>
                                    <div className="bg-gray-700 p-3 rounded text-sm">
                                        <p>
                                            <span className="text-gray-400">Hash Exists:</span>
                                            <span className={result.hash_info.exists ? "text-green-400" : "text-red-400"}>
                                                {result.hash_info.exists ? "Yes" : "No"}
                                            </span>
                                        </p>
                                        <p><span className="text-gray-400">Length:</span> {result.hash_info.length}</p>
                                        <p><span className="text-gray-400">Prefix:</span> {result.hash_info.prefix}...</p>
                                        <p>
                                            <span className="text-gray-400">Valid Format:</span>
                                            <span className={result.hash_info.is_valid_format ? "text-green-400" : "text-red-400"}>
                                                {result.hash_info.is_valid_format ? "Yes" : "No"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {result.password_test && (
                                    <div>
                                        <h3 className="font-medium text-gray-300 mb-2">Password Test Results</h3>
                                        <div className="bg-gray-700 p-3 rounded text-sm">
                                            {result.password_test.error ? (
                                                <>
                                                    <p className="text-red-400">Error during verification:</p>
                                                    <p>{result.password_test.error}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p><span className="text-gray-400">Password Length:</span> {result.password_test.length}</p>
                                                    <p>
                                                        <span className="text-gray-400">Password Match:</span>
                                                        <span className={result.password_test.is_match ? "text-green-400" : "text-red-400"}>
                                                            {result.password_test.is_match ? "Yes ✓" : "No ✗"}
                                                        </span>
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {result.new_hash_info && (
                                    <div>
                                        <h3 className="font-medium text-gray-300 mb-2">New Hash Generation</h3>
                                        <div className="bg-gray-700 p-3 rounded text-sm">
                                            <p><span className="text-gray-400">New Hash Prefix:</span> {result.new_hash_info.prefix}...</p>
                                            <p><span className="text-gray-400">Length:</span> {result.new_hash_info.length}</p>
                                            <p>
                                                <span className="text-gray-400">Valid Format:</span>
                                                <span className={result.new_hash_info.is_valid_format ? "text-green-400" : "text-red-400"}>
                                                    {result.new_hash_info.is_valid_format ? "Yes" : "No"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Raw JSON for developers */}
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-gray-400 text-sm">Raw Response Data</summary>
                                    <pre className="mt-2 bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Enter an email to see user and authentication details</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Authentication Help</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Common Auth Issues:</h3>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                                <li>Password hash might be stored in an invalid format</li>
                                <li>Field name mismatch (password vs password_hash)</li>
                                <li>Cookie/session handling issues</li>
                                <li>CSRF token problems</li>
                                <li>NextAuth configuration errors</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">Diagnostic Resources:</h3>
                            <ul className="space-y-2 mt-2">
                                <li>
                                    <a href="/simple-login" className="text-blue-400 hover:underline">
                                        Try Simple Login Page
                                    </a>
                                    <span className="text-gray-400 ml-2 text-sm">
                                        (Direct login that bypasses NextAuth)
                                    </span>
                                </li>
                                <li>
                                    <a href="/api/auth/check" className="text-blue-400 hover:underline">
                                        Auth System Status Check
                                    </a>
                                    <span className="text-gray-400 ml-2 text-sm">
                                        (Verifies database connection and auth configuration)
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 