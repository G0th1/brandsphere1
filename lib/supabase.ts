import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create and export the Supabase admin client
// Detta använder service_role-nyckeln för admin-operationer som behövs i webhooks
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); 