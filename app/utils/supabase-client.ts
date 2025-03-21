import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with error handling for missing environment variables
 * This is particularly useful during build time when environment variables might not be available
 */
export function createSafeSupabaseClient(): SupabaseClient {
    try {
        // Check if we're in a build/SSG environment
        const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production';

        // During build time, if environment variables are missing, return a mock client
        if (isBuildTime && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
            console.warn('Supabase environment variables missing during build, using mock client');
            return createMockSupabaseClient();
        }

        // Otherwise create a real client
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    } catch (error) {
        console.warn('Error creating Supabase client, using mock client', error);
        return createMockSupabaseClient();
    }
}

/**
 * Creates a mock Supabase client that can be used during build time
 * This prevents build errors when environment variables are missing
 */
function createMockSupabaseClient(): SupabaseClient {
    // Return a mock client with the same interface but no-op methods
    return {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            // Add other auth methods as needed
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null }),
                    // Add other query methods as needed
                }),
                // Add other query methods as needed
            }),
            // Add other query methods as needed
        }),
        // Add other Supabase methods as needed
    } as unknown as SupabaseClient;
} 