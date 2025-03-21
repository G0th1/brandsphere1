/**
 * Helper to ensure the correct database URL is used in all environments
 * with optimized connection parameters for Neon serverless.
 */

// Default Neon PostgreSQL connection string with optimized serverless configuration
const DEFAULT_POSTGRES_URL = "postgres://neondb_owner:npg_5RtxlHfPjv4d@ep-super-fire-a2zkgpm3-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=30&sslmode=require&pgbouncer=true&pool_timeout=30";

/**
 * Ensures a URL has all the necessary Neon optimization parameters
 */
function optimizeNeonUrl(url: URL): URL {
    // Required for SSL
    url.searchParams.set('sslmode', 'require');

    // Connection timeouts - increase for more reliability with slower connections
    url.searchParams.set('connect_timeout', '30'); // Increased from 10 to 30

    // Check if using pooler endpoint
    if (url.hostname.includes('-pooler')) {
        // Configure PgBouncer for pooler endpoints
        url.searchParams.set('pgbouncer', 'true');
        url.searchParams.set('pool_timeout', '30'); // Increased from 10 to 30
    }

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

// Export the DATABASE_URL for use throughout the application
export const DATABASE_URL = getDatabaseUrl(); 