"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';
import subscriptionService, { UserSubscription } from '@/services/subscription-service';

interface SubscriptionContextType {
    subscription: UserSubscription | null;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load the user's subscription when the user is authenticated
    useEffect(() => {
        const loadSubscription = async () => {
            if (!user) {
                setSubscription(null);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const userSubscription = await subscriptionService.getUserSubscription();
                setSubscription(userSubscription);
            } catch (error) {
                console.error('Error loading subscription:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSubscription();
    }, [user]);

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                isLoading
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
} 