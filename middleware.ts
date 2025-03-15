import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/check',
  '/api/auth',
  '/api/db-health-check', // Allow db health check without auth
  '/api/stripe/webhook', // Allow Stripe webhooks without auth
  '/api/stripe/checkout', // Allow checkout API without requiring re-authentication
];

// Routes that should be redirected to dashboard if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Function to check if a path matches a list of routes (exact match or prefix)
const matchesRoute = (path: string, routes: string[]) => {
  if (routes.includes(path)) return true;

  // Check if this is an API route
  if (path.startsWith('/api/')) {
    return routes.some(route => route.startsWith('/api/') && path.startsWith(route));
  }

  return false;
};

// Static assets and paths that should be excluded from middleware processing
const staticPathPrefixes = [
  '/_next',
  '/images',
  '/fonts',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (staticPathPrefixes.some(prefix => pathname.startsWith(prefix)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  console.log(`[Middleware] Processing: ${pathname}`);

  // Create response with universal mode cookies
  const response = NextResponse.next();

  // Set debug cookie
  response.cookies.set('middleware-debug', new Date().toISOString(), {
    path: '/',
    maxAge: 3600 // 1 hour
  });

  // DISABLE AUTH CHECKS FOR DASHBOARD ROUTES TO FIX LOGIN ISSUES
  // SIMPLIFIED APPROACH: Let the client component handle auth instead
  if (pathname.startsWith('/dashboard')) {
    console.log(`[Middleware] Dashboard access: ${pathname} - skipping auth check`);
    return response;
  }

  // Try to get token for other routes
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Set a cookie to indicate auth status
    response.cookies.set('auth-debug', token ? 'authenticated' : 'no-token', {
      path: '/',
      maxAge: 3600 // 1 hour
    });

    // If we're on an auth page but already authenticated, redirect to dashboard
    if (authRoutes.some(route => pathname === route) && token) {
      console.log(`[Middleware] Redirecting authenticated user from ${pathname} to dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.warn('[Middleware] Error checking token:', error);

    // Set error cookie for debugging
    response.cookies.set('auth-error', String(error).substring(0, 100), {
      path: '/',
      maxAge: 3600 // 1 hour
    });
  }

  return response;
}

// Configure the paths that should use the middleware
export const config = {
  matcher: ['/((?!api/auth/[^/]+).*)'],
};