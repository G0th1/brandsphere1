"use client";

import React from 'react';
import AuthGuard from "@/app/components/auth-guard";

export function DashboardClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
} 