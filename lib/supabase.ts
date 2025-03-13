import { createClient } from '@supabase/supabase-js';

// NOTE: In this MVP, Supabase is NOT used for authentication
// but only for data storage and other functions.
// All authentication is handled by NextAuth.js.

// These are the public environment variables that are used in the browser
// They are prefixed with NEXT_PUBLIC_ so that they are available in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a dummy client that logs warnings but doesn't throw errors
// This is useful for static site generation and build time
const createDummyClient = () => {
    const dummyFn = (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Supabase client was called without proper configuration');
        }
        return {
            data: null,
            error: new Error('Supabase client was called without proper configuration'),
        };
    };

    const dummyAuthObj = {
        getSession: dummyFn,
        getUser: dummyFn,
        signInWithPassword: dummyFn,
        signUp: dummyFn,
        signOut: dummyFn,
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        resend: dummyFn,
    };

    return {
        from: () => ({
            select: () => ({
                eq: dummyFn,
                single: dummyFn,
                order: () => ({
                    limit: dummyFn,
                }),
            }),
            insert: dummyFn,
            update: () => ({
                eq: dummyFn,
                match: dummyFn,
            }),
            delete: () => ({
                eq: dummyFn,
            }),
        }),
        auth: dummyAuthObj,
        rpc: dummyFn,
    };
};

// Check if we have the required environment variables
const hasRequiredEnvVars = supabaseUrl && supabaseAnonKey;

// Create the Supabase client for the browser
// If we don't have the required environment variables, create a dummy client
export const supabase = hasRequiredEnvVars
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createDummyClient() as ReturnType<typeof createClient>;

// Create the Supabase admin client for server-side operations
// This client has admin privileges and should only be used in server-side code
export const supabaseAdmin = hasRequiredEnvVars && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : createDummyClient() as ReturnType<typeof createClient>; 