"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ButtonTest() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
        console.log('Knapp klickad!');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Knapptest</h1>

            <div className="flex flex-col gap-4 w-full max-w-md">
                <div className="p-4 border rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Standard knappar</h2>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleClick} variant="default">Default</Button>
                        <Button onClick={handleClick} variant="destructive">Destructive</Button>
                        <Button onClick={handleClick} variant="outline">Outline</Button>
                        <Button onClick={handleClick} variant="secondary">Secondary</Button>
                        <Button onClick={handleClick} variant="ghost">Ghost</Button>
                        <Button onClick={handleClick} variant="link">Link</Button>
                    </div>
                </div>

                <div className="p-4 border rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Knappar med ikoner</h2>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            Lägg till
                        </Button>

                        <Button onClick={handleClick} variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            Med ikon
                        </Button>
                    </div>
                </div>

                <div className="p-4 border rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Resultat</h2>
                    <p>Antal klick: <strong>{count}</strong></p>
                </div>
            </div>
        </div>
    );
} 