"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function CancelPage() {
    const router = useRouter();

    return (
        <div className="container max-w-6xl py-10">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
                    <CardDescription>
                        Your payment process was cancelled
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <p className="text-center">
                        You have cancelled the payment process. No charges have been made to your account.
                    </p>
                    <p className="text-center mt-4">
                        If you have any questions or need assistance, please contact our support team.
                    </p>
                </CardContent>

                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                        Go to Dashboard
                    </Button>
                    <Button onClick={() => router.push("/dashboard/upgrade")}>
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}