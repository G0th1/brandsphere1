"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { safeNavigate, useSafeRouter } from '@/lib/utils/navigation';

export default function ButtonDebugPage() {
    const [clickCount, setClickCount] = useState<Record<string, number>>({
        basic: 0,
        link: 0,
        router: 0,
        safe: 0,
        safeRouter: 0
    });

    const router = useRouter();
    const safeRouter = useSafeRouter();

    const handleClick = (buttonType: string) => {
        console.log(`Button clicked: ${buttonType}`);
        setClickCount(prev => ({
            ...prev,
            [buttonType]: (prev[buttonType] || 0) + 1
        }));
    };

    const handleNavigation = (buttonType: string, url: string) => {
        console.log(`Navigation button clicked: ${buttonType} to ${url}`);
        handleClick(buttonType);

        // Different navigation methods
        if (buttonType === 'router') {
            router.push(url);
        } else if (buttonType === 'safe') {
            safeNavigate(url);
        } else if (buttonType === 'safeRouter') {
            safeRouter.navigate(url);
        }
        // link and basic handled by their own mechanisms
    };

    return (
        <div className="container mx-auto py-12 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Button Debug Page</h1>
                <p className="text-muted-foreground">Testing different button implementation approaches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Button Click Test */}
                <div className="p-6 border rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold">Basic Click Test</h2>
                    <div className="space-y-3">
                        <Button
                            onClick={() => handleClick('basic')}
                            className="w-full"
                        >
                            Basic Button ({clickCount.basic || 0} clicks)
                        </Button>
                    </div>
                </div>

                {/* Navigation Test Section */}
                <div className="p-6 border rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold">Navigation Test</h2>
                    <div className="space-y-3">
                        <Link href="/dashboard" passHref>
                            <Button
                                className="w-full"
                                onClick={() => handleClick('link')}
                                asChild
                            >
                                <a>Link + Button ({clickCount.link || 0} clicks)</a>
                            </Button>
                        </Link>

                        <Button
                            className="w-full"
                            onClick={() => handleNavigation('router', '/dashboard')}
                        >
                            Router Navigation ({clickCount.router || 0} clicks)
                        </Button>

                        <Button
                            className="w-full"
                            onClick={() => handleNavigation('safe', '/dashboard')}
                        >
                            Safe Navigation ({clickCount.safe || 0} clicks)
                        </Button>

                        <Button
                            className="w-full"
                            onClick={() => handleNavigation('safeRouter', '/dashboard')}
                        >
                            Safe Router Navigation ({clickCount.safeRouter || 0} clicks)
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setClickCount({
                    basic: 0,
                    link: 0,
                    router: 0,
                    safe: 0,
                    safeRouter: 0
                })}>
                    Reset Click Counts
                </Button>
            </div>
        </div>
    );
} 