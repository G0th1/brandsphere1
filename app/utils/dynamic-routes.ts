// This file contains utilities to mark routes as dynamic
// to prevent Next.js from statically generating them during build

// This function is used to mark a page as dynamic
// Add this export to any page that requires server-side rendering
export const dynamic = 'force-dynamic'

// This function is used to mark a page as requiring authentication
// It will prevent static generation and ensure the page is rendered on the server
export function generateMetadata() {
    return {
        title: 'Authentication Required',
        description: 'This page requires authentication'
    }
} 