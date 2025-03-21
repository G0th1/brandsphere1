'use server';

import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export default async function NeonTestPage() {
    let connectionStatus = 'Not tested';
    let errorMessage = '';
    let results = [];

    try {
        // Connect to the Neon database using the serverless driver
        const sql = neon(process.env.DATABASE_URL || '');

        // Test basic connection with a simple query
        const testResult = await sql`SELECT NOW() as current_time`;
        connectionStatus = 'Connected';
        results.push(testResult);

        // Try to access the users table
        try {
            const users = await sql`SELECT COUNT(*) as user_count FROM "Users"`;
            results.push(users);
        } catch (tableError) {
            results.push({ message: 'User table access error: ' + tableError.message });
        }
    } catch (error) {
        connectionStatus = 'Failed';
        errorMessage = error.message;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Neon Database Connection Test</h1>

            <div className="mb-6 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
                <div className={`text-lg ${connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionStatus}
                </div>
                {errorMessage && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                        <p className="font-medium">Error:</p>
                        <p className="font-mono text-sm">{errorMessage}</p>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Query Results</h2>
                <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-64">
                    {JSON.stringify(results, null, 2)}
                </pre>
            </div>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                <h2 className="text-lg font-semibold mb-2">Connection Details</h2>
                <p>Database URL: {process.env.DATABASE_URL ? '✅ Set (hidden)' : '❌ Not set'}</p>
                <p>PGHOST: {process.env.PGHOST || 'Not set'}</p>
                <p>PGDATABASE: {process.env.PGDATABASE || 'Not set'}</p>
                <p>Using Neon Serverless Driver: ✅</p>
            </div>
        </div>
    );
} 