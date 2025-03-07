"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SuccessPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                setLoading(true);

                // Get Supabase client
                const supabase = createClientComponentClient();

                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    setError("You must be logged in to view this page");
                    setLoading(false);
                    return;
                }

                // Check if user has an active subscription
                const { data: userData, error: profileError } = await supabase
                    .from("users")
                    .select("subscription_status")
                    .eq("id", user.id)
                    .single();

                if (profileError) {
                    setError("Failed to verify subscription status");
                    setLoading(false);
                    return;
                }

                // If subscription is not active, show error
                if (userData?.subscription_status !== "active" &&
                    userData?.subscription_status !== "trialing") {
                    setError("Your subscription is not active yet. It may take a few moments to process.");
                }

                setLoading(false);
            } catch (err) {
                setError("An unexpected error occurred");
                setLoading(false);
            }
        };

        checkSubscription();
    }, [router]);

    return (
        <div className="container max-w-6xl py-10">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                    <CardDescription>
                        Thank you for upgrading to our Pro plan
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <p className="text-center">Verifying your subscription...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <p className="text-center">
                            Your account has been successfully upgraded to Pro. You now have access to all premium features.
                        </p>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center">
                    <Button onClick={() => router.push("/dashboard")}>
                        Go to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 