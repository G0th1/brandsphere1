/**
 * Helper to ensure the correct database URL is used in all environments
 */

// Default SQLite connection string for local development
const DEFAULT_SQLITE_URL = "file:./prisma/dev.db";

export function getDatabaseUrl(): string {
    // Check if we're in offline mode
    if (typeof window !== 'undefined' && localStorage.getItem('offlineMode') === 'true') {
        console.log('Using offline mode with SQLite database');
        return DEFAULT_SQLITE_URL;
    }

    // 1. First try the standard DATABASE_URL
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    // 2. Then try Vercel-specific PostgreSQL URLs
    if (process.env.POSTGRES_PRISMA_URL) {
        return process.env.POSTGRES_PRISMA_URL;
    }

    if (process.env.POSTGRES_URL_NON_POOLING) {
        return process.env.POSTGRES_URL_NON_POOLING;
    }

    // 3. Finally, fall back to the SQLite URL for better local development
    console.warn('No database URL found in environment variables. Using SQLite for local development.');
    return DEFAULT_SQLITE_URL;
}

// Export the database URL for direct usage
export const DATABASE_URL = getDatabaseUrl(); 