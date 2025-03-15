'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { LanguageProvider } from '@/contexts/language-context'
import { DemoProvider } from '@/contexts/demo-context'
import { SubscriptionProvider } from '@/contexts/subscription-context'
import DbErrorBoundary from "@/app/components/db-error-boundary"
import ErrorBoundary from "@/app/components/error-boundary"

// Create a combined Providers component to reduce nesting
export function Providers({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary>
            <DbErrorBoundary>
                <AuthProvider>
                    <LanguageProvider>
                        <DemoProvider>
                            <SubscriptionProvider>
                                {children}
                            </SubscriptionProvider>
                        </DemoProvider>
                    </LanguageProvider>
                </AuthProvider>
            </DbErrorBoundary>
        </ErrorBoundary>
    )
} 