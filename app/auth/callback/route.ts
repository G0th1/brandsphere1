import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  const type = requestUrl.searchParams.get('type') || 'signup';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/auth/error?error=code_exchange_failed', request.url));
      }

      // Get session to check if the user was just created
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.redirect(new URL('/login?error=no_session', request.url));
      }

      // If this is a signup verification and user has verified their email
      if (type === 'signup' && session.user.email_confirmed_at) {
        // Fetch user data to update any needed flags
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);

        if (updateError) {
          console.error('Error updating user verification status:', updateError);
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    } catch (error) {
      console.error('Unexpected error during authentication:', error);
      return NextResponse.redirect(new URL('/auth/error?error=unexpected', request.url));
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', request.url));
} 