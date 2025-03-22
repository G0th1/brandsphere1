'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ButtonEmergencyLoginProps {
    email: string;
}

export function ButtonEmergencyLogin({ email }: ButtonEmergencyLoginProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleEmergencyLogin = async () => {
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email first",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/force-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                toast({
                    title: "Emergency Access Granted",
                    description: `Your temporary password is: ${data.resetPassword}`,
                    variant: "default",
                    duration: 10000, // Show for 10 seconds
                });

                // Wait a moment for the toast to be read, then use direct navigation
                console.log("Emergency login successful, redirecting to dashboard");
                setTimeout(() => {
                    // Use window.location for a full page navigation that ensures cookies are properly used
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                toast({
                    title: "Emergency Login Failed",
                    description: data.message || "Could not complete emergency login",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Emergency login error:', error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleEmergencyLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                'Emergency Login'
            )}
        </Button>
    );
} 