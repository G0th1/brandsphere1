/**
 * Helper to ensure the correct database URL is used in all environments
 * with optimized connection parameters for Neon serverless.
 */

import { parseUrl } from "@neondatabase/serverless";

// Default connection string for Neon database - as a fallback
const DEFAULT_POSTGRES_URL = "postgres://neondb_owner:npg_5RtxlHfPjv4d@ep-super-fire-a2zkgpm3.eu-central-1.aws.neon.tech/neondb?connect_timeout=30&sslmode=require";

/**
 * Optimize a Neon database URL by ensuring it has the correct parameters
 * for reliable connections in serverless environments
 */
function optimizeNeonUrl(url: URL): URL {
    // Always ensure critical parameters
    const searchParams = new URLSearchParams(url.search);

    // Add standard connection parameters if missing
    if (!searchParams.has('sslmode')) {
        searchParams.set('sslmode', 'require');
    }

    // Add more robust timeout settings
    if (!searchParams.has('connect_timeout')) {
        searchParams.set('connect_timeout', '30');
    } else if (parseInt(searchParams.get('connect_timeout') || '0') < 15) {
        // Ensure connect timeout is at least 15 seconds for reliability
        searchParams.set('connect_timeout', '30');
    }

    // Add additional reliability parameters
    if (!searchParams.has('application_name')) {
        searchParams.set('application_name', 'brandsphere');
    }

    // Keep-alive settings for better connection stability
    if (!searchParams.has('keepalives')) {
        searchParams.set('keepalives', '1');
    }

    if (!searchParams.has('keepalives_idle')) {
        searchParams.set('keepalives_idle', '30');
    }

    // Update the search portion of the URL
    url.search = searchParams.toString();
    return url;
}

export function getDatabaseUrl(): string {
    let selectedUrl: string;

    // 1. First try Vercel-specific PostgreSQL URLs (preferred for production)
    if (process.env.POSTGRES_PRISMA_URL) {
        // Add serverless configuration if not present
        try {
            const url = optimizeNeonUrl(new URL(process.env.POSTGRES_PRISMA_URL));
            selectedUrl = url.toString();
            console.log('Using POSTGRES_PRISMA_URL with optimized parameters');
            return selectedUrl;
        } catch (error) {
            console.error('Error parsing POSTGRES_PRISMA_URL:', error);
        }
    }

    // 2. Try non-pooling URL for serverless environments
    if (process.env.POSTGRES_URL_NON_POOLING) {
        // Add serverless configuration if not present
        try {
            const url = optimizeNeonUrl(new URL(process.env.POSTGRES_URL_NON_POOLING));
            selectedUrl = url.toString();
            console.log('Using POSTGRES_URL_NON_POOLING with optimized parameters');
            return selectedUrl;
        } catch (error) {
            console.error('Error parsing POSTGRES_URL_NON_POOLING:', error);
        }
    }

    // 3. Then try the standard DATABASE_URL
    if (process.env.DATABASE_URL) {
        // Add serverless configuration if not present
        try {
            const url = optimizeNeonUrl(new URL(process.env.DATABASE_URL));
            selectedUrl = url.toString();
            console.log('Using DATABASE_URL with optimized parameters');
            return selectedUrl;
        } catch (error) {
            console.error('Error parsing DATABASE_URL:', error);
        }
    }

    // 4. Finally, fall back to the default Neon URL
    console.warn('No database URL found in environment variables. Using default Neon connection string.');
    return DEFAULT_POSTGRES_URL;
}

// Export the optimized database URL for use throughout the application
export const DATABASE_URL = getDatabaseUrl(); 