"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export function SubscriptionStatus() {
    const { subscription, isLoading, isDemoActive, deactivateDemo } = useSubscription();

    if (isLoading) {
        return (
            <Card className="border border-muted">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" />
                        Loading Subscription...
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    if (!subscription) {
        return null;
    }

    return (
        <Card className={`border ${isDemoActive ? 'border-green-500/50' : 'border-muted'}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                    {isDemoActive ? (
                        <Sparkles className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                        <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    )}
                    {isDemoActive ? 'Demo Mode Active' : 'Your Subscription'}
                </CardTitle>
                <CardDescription className="text-xs">
                    {isDemoActive
                        ? 'You are using the demo features of BrandSphereAI'
                        : 'Manage your subscription details'}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="flex items-center justify-between">
                    <Badge
                        variant={subscription.plan === 'free' ? 'outline' : 'default'}
                        className={subscription.plan !== 'free' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : ''}
                    >
                        {subscription.plan === 'free' ? 'Free Tier' : subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                    </Badge>
                    {isDemoActive && (
                        <Badge variant="outline" className="text-green-500 border-green-500/50">
                            Demo
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                {isDemoActive ? (
                    <Button
                        variant="link"
                        className="text-xs p-0 h-auto text-muted-foreground"
                        onClick={deactivateDemo}
                    >
                        Exit Demo Mode
                    </Button>
                ) : (
                    <Link href="/pricing">
                        <Button variant="link" className="text-xs p-0 h-auto flex items-center gap-1">
                            Upgrade <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
}

export default SubscriptionStatus; 