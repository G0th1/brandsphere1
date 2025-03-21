"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [emailList, setEmailList] = useState<string[]>([]);

    // Try to fetch all users on page load
    useEffect(() => {
        async function fetchAllUsers() {
            try {
                const response = await fetch('/api/admin/list-users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ adminToken: 'brandsphere-internal-admin' }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.users && Array.isArray(data.users)) {
                        setEmailList(data.users.map((user: any) => user.email));
                    }
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchAllUsers();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 text-white">
            <div className="w-full max-w-md bg-zinc-800/50 rounded-xl p-8 shadow-lg border border-zinc-700/50">
                <h1 className="text-2xl font-bold mb-6 text-center">Emergency Admin Login</h1>

                <div className="mb-6">
                    <p className="text-zinc-300 mb-2">
                        Having trouble logging in? Use the bypass login link with your email:
                    </p>

                    <div className="bg-zinc-700/50 rounded p-4 mb-4 overflow-auto">
                        <code className="text-sm text-green-400 whitespace-nowrap">
                            /api/auth/bypass-login?email=your@email.com
                        </code>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-input" className="block text-sm font-medium text-zinc-300 mb-1">
                                Enter your email
                            </label>
                            <input
                                id="email-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                            />
                        </div>

                        <Link
                            href={`/api/auth/bypass-login?email=${encodeURIComponent(email)}`}
                            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-center font-medium"
                        >
                            Login with this email
                        </Link>
                    </div>
                </div>

                {emailList.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-3">Available accounts:</h2>
                        <div className="bg-zinc-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <ul className="space-y-2">
                                {emailList.map((email) => (
                                    <li key={email} className="flex justify-between items-center">
                                        <span className="text-zinc-300">{email}</span>
                                        <Link
                                            href={`/api/auth/bypass-login?email=${encodeURIComponent(email)}`}
                                            className="text-xs bg-blue-600 hover:bg-blue-700 py-1 px-2 rounded"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="mt-6 border-t border-zinc-700 pt-4">
                    <Link href="/auth/login" className="text-sm text-blue-400 hover:text-blue-300">
                        ← Back to normal login
                    </Link>
                </div>
            </div>
        </div>
    );
} 