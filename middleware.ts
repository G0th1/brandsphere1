import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Get the token if the user is authenticated
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'default-secret-do-not-use-in-production'
    });

    // Special handling for /dashboard/auth-check endpoint to check auth status
    if (pathname === '/dashboard/auth-check') {
      return token
        ? NextResponse.json({ authenticated: true })
        : NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check for auth_in_progress in session storage via cookies
    const authInProgress = req.cookies.get('auth_in_progress')?.value === 'true';

    // Protected routes that require authentication
    if (pathname.startsWith('/dashboard') && !token) {
      // If authentication is in progress, let them through temporarily
      if (authInProgress) {
        console.log('Auth in progress, allowing temporary access');
        return NextResponse.next();
      }

      console.log('Unauthorized access attempt to dashboard, redirecting to login');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
      console.log('Authenticated user tried to access auth page, redirecting to dashboard');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // For all other routes, continue normally
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of errors, allow the request to proceed
    return NextResponse.next();
  }
}

// Only run middleware on relevant routes
export const config = {
  matcher: [
    // Old and new registration pages
    '/signup',
    '/signup/:path*',
    '/login',

    // Protect all dashboard pages
    '/dashboard/:path*',

    // Auth-related pages
    '/auth/:path*',

    // Pages that need access to user data
    '/settings/:path*',
  ],
};