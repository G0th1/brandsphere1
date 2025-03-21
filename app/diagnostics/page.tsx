'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReloadIcon, CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';

export default function DiagnosticsPage() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const runDiagnostics = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/db-diagnostics');

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message || 'An unknown error occurred');
            console.error('Diagnostics error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runDiagnostics();
    }, []);

    return (
        <div className="container py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Database Diagnostics</h1>
                <Button
                    onClick={runDiagnostics}
                    disabled={loading}
                    variant="outline"
                >
                    {loading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                        </>
                    ) : (
                        'Run Diagnostics'
                    )}
                </Button>
            </div>

            {error && (
                <Card className="border-red-300 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-700">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700">{error}</p>
                    </CardContent>
                </Card>
            )}

            {results && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Environment Information</CardTitle>
                            <CardDescription>Basic information about the environment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                                    <dd>{results.timestamp}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Environment</dt>
                                    <dd>{results.environment}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Database URL</dt>
                                    <dd>
                                        {results.databaseUrl.exists ?
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Set</Badge> :
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Not Set</Badge>
                                        }
                                        <span className="ml-2 text-gray-500 text-xs">{results.databaseUrl.truncated}</span>
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(results.tests).map(([testName, testResults]: [string, any]) => (
                            <Card key={testName} className={`border-l-4 ${testResults.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="capitalize">
                                            {testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </CardTitle>
                                        {testResults.success ?
                                            <CheckIcon className="h-5 w-5 text-green-500" /> :
                                            <CrossCircledIcon className="h-5 w-5 text-red-500" />
                                        }
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm space-y-2">
                                        {testResults.success ? (
                                            <ul className="space-y-1">
                                                {Object.entries(testResults.details).map(([key, value]: [string, any]) => (
                                                    <li key={key} className="flex items-start">
                                                        <span className="font-medium capitalize mr-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                                        <span className="text-gray-700">
                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-red-600 space-y-1">
                                                <p><span className="font-medium">Error:</span> {testResults.details.error}</p>
                                                {testResults.details.code && (
                                                    <p><span className="font-medium">Code:</span> {testResults.details.code}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {results.recommendations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {results.recommendations.map((rec: string, i: number) => (
                                        <li key={i} className="text-blue-700">{rec}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
} 