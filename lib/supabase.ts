import { createClient } from '@supabase/supabase-js';

// NOTE: In this MVP, Supabase is NOT used for authentication
// but only for data storage and other functions.
// All authentication is handled by NextAuth.js.

// Get environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verify required Supabase configuration is available
const isSupabaseConfigured = supabaseUrl && supabaseKey && supabaseServiceKey;

// Create clients only if properly configured
let supabase: any = null;
let supabaseAdmin: any = null;

try {
    if (isSupabaseConfigured) {
        // Create regular client
        supabase = createClient(supabaseUrl!, supabaseKey!);

        // Create admin client for service operations (webhooks, etc.)
        supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);
    } else {
        console.warn('Supabase configuration missing. Supabase features will be disabled.');

        // Create placeholder objects that log warnings
        const createWarningClient = () => {
            return new Proxy({}, {
                get: (target, prop) => {
                    if (prop === 'then') return undefined; // For async compatibility
                    return typeof prop === 'string'
                        ? () => {
                            console.warn(`Supabase not configured: ${prop} operation skipped`);
                            return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
                        }
                        : createWarningClient();
                }
            });
        };

        supabase = createWarningClient();
        supabaseAdmin = createWarningClient();
    }
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);

    // Create dummy clients that do nothing
    const createDummyClient = () => {
        return new Proxy({}, {
            get: () => () => Promise.resolve({ data: null, error: null })
        });
    };

    supabase = createDummyClient();
    supabaseAdmin = createDummyClient();
}

// Export the clients (either real or dummy)
export { supabase, supabaseAdmin }; 