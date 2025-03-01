import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Routes that require pro subscription
const PRO_ROUTES = [
  '/dashboard/create',
  '/dashboard/schedule',
  '/dashboard/analytics',
];

// Function to check if the user has a pro subscription
export async function checkSubscription(userId: string): Promise<boolean> {
  // Create a server-side Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  // Query the user's subscription status
  const { data, error } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error checking subscription status:', error);
    return false;
  }
  
  // Check if the subscription is active
  return data.subscription_status === 'active' || data.subscription_status === 'trialing';
}

// Middleware to check for subscription status and redirect if necessary
export async function subscriptionMiddleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Check if this is a protected path that requires pro subscription
  const isProRoute = PRO_ROUTES.some(route => pathname.startsWith(route));
  
  // If it's not a pro route, allow the request to proceed
  if (!isProRoute) {
    return NextResponse.next();
  }
  
  // Get the user session from cookies
  try {
    // This would typically be handled by a more robust auth system
    // For now, we'll just check if we have a user ID in cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    
    // Check for the auth token in cookies
    const authCookie = request.cookies.get('sb-auth-token')?.value;
    if (!authCookie) {
      // Redirect to login if no auth cookie
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Get the user from the token
    const { data: { user }, error } = await supabase.auth.getUser(authCookie);
    
    if (error || !user) {
      // Redirect to login if error or no user
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if the user has a pro subscription
    const hasPro = await checkSubscription(user.id);
    
    if (!hasPro) {
      // Redirect to subscription page if no pro plan
      return NextResponse.redirect(new URL('/dashboard/subscribe', request.url));
    }
    
    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Error in subscription middleware:', error);
    // Default to allowing the request in case of errors
    return NextResponse.next();
  }
} 