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

  const response = NextResponse.next();

  // Skip auth checks for dashboard routes (client-side auth handling)
  if (pathname.startsWith('/dashboard')) {
    return response;
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If we're on an auth page but already authenticated, redirect to dashboard
    if (authRoutes.includes(pathname) && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.warn('[Middleware] Error checking token:', error);
  }

  return response;
}

// Configure the paths that should use the middleware
export const config = {
  matcher: ['/((?!api/auth/[^/]+).*)'],
};