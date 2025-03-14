/**
 * Helper to ensure the correct database URL is used in all environments
 */

// Default Neon PostgreSQL connection string
const DEFAULT_POSTGRES_URL = "postgres://neondb_owner:npg_5RtxlHfPjv4d@ep-super-fire-a2zkgpm3-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

export function getDatabaseUrl(): string {
    // 1. First try Vercel-specific PostgreSQL URLs (preferred for production)
    if (process.env.POSTGRES_PRISMA_URL) {
        return process.env.POSTGRES_PRISMA_URL;
    }

    if (process.env.POSTGRES_URL_NON_POOLING) {
        return process.env.POSTGRES_URL_NON_POOLING;
    }

    // 2. Then try the standard DATABASE_URL
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    // 3. Finally, fall back to the default Neon URL
    console.warn('No database URL found in environment variables. Using default Neon connection string.');
    return DEFAULT_POSTGRES_URL;
}

// Export the database URL for direct usage
export const DATABASE_URL = getDatabaseUrl(); 