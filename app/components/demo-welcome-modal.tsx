"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useDemo } from '@/contexts/demo-context';

export function DemoWelcomeModal() {
    const [open, setOpen] = useState(false);
    const { user: demoUser } = useDemo();

    useEffect(() => {
        // Show the modal when demo mode is activated for the first time
        if (demoUser) {
            // Check if the user has seen the welcome message before
            const hasSeenWelcome = localStorage.getItem('demo-welcome-seen');
            if (!hasSeenWelcome) {
                // Wait a moment before showing the modal
                const timer = setTimeout(() => {
                    setOpen(true);
                    // Mark that the user has seen the welcome message
                    localStorage.setItem('demo-welcome-seen', 'true');
                }, 1000);

                return () => clearTimeout(timer);
            }
        }
    }, [demoUser]);

    // List of features available in demo mode
    const demoFeatures = [
        'Experience all Free tier features',
        'Create and schedule sample social media posts',
        'View analytics dashboards with sample data',
        'Test content creation tools',
        'Explore projects and calendar features'
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="h-5 w-5 text-green-500" />
                        Welcome to Demo Mode
                    </DialogTitle>
                    <DialogDescription>
                        You're now using BrandSphereAI in demo mode. Explore all the Free tier features available to you.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    <p className="text-sm text-muted-foreground">
                        As a Free tier user, you have access to these demo features:
                    </p>

                    <ul className="space-y-2">
                        {demoFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-muted/50 p-4 rounded-lg mt-4">
                        <p className="text-sm font-medium flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-blue-500" />
                            Want more features?
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upgrade to Pro for advanced AI content generation, unlimited posts, and more.
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Got it
                    </Button>
                    <Link href="/pricing">
                        <Button className="w-full sm:w-auto gap-1">
                            View Pricing <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DemoWelcomeModal; 