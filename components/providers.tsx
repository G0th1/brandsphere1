'use client'

import { ReactNode } from 'react'

// Authentication provider
import { AuthProvider } from '@/contexts/auth-context'

// Application-specific providers
import { LanguageProvider } from '@/contexts/language-context'
import { DemoProvider } from '@/contexts/demo-context'
import { SubscriptionProvider } from '@/contexts/subscription-context'

// Error handling components
import DbErrorBoundary from "@/app/components/db-error-boundary"
import ErrorBoundary from "@/app/components/error-boundary"

/**
 * Combined providers component to reduce nesting depth
 * Order matters: inner providers can access outer providers' context
 */
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