'use client'

import React from 'react'
import Script from 'next/script'

/**
 * Analytics component used to add analytics scripts to the application 
 * without blocking the main render thread.
 * 
 * @returns A Script component that loads analytics code
 */
export function Analytics() {
    // No-op implementation for now, since actual analytics credentials aren't available
    // Replace with your actual analytics implementation when ready

    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
        // Skip analytics in development
        return null
    }

    return (
        <>
            {/* 
        You can add your analytics script here, for example:
        - Google Analytics
        - Plausible
        - Fathom
        - etc.
      */}
            <Script
                strategy="afterInteractive"
                data-domain="yourdomain.com"
                src="https://placeholder-for-analytics.com/script.js"
                onError={() => console.error('Analytics script failed to load')}
            />
        </>
    )
} 