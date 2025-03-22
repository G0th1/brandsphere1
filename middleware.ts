import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/verify-request',
  '/auth/error',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/pricing',
  '/contact',
  '/api/auth',
  '/api/stripe/webhook',
  '/api/health',
  '/api/db-health-check',
];

// API endpoints that should always be accessible
const publicApiPaths = [
  '/api/auth/token-login',
  '/api/auth/login-direct',
  '/api/auth/login-with-token',
  '/api/auth/emergency-login',
  '/api/auth/direct-auth',
  '/api/auth/bypass-login',
  '/api/auth/minimal-login',
  '/api/auth/debug-login',
  '/api/auth/force-login',
  '/api/admin/list-users',
  '/api/webhooks',
];

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

  // Skip middleware for static assets and public API endpoints
  if (
    staticPathPrefixes.some(prefix => pathname.startsWith(prefix)) ||
    publicApiPaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Skip for public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for authentication via NextAuth session cookie or our direct-auth-token
  const sessionCookie = request.cookies.get('next-auth.session-token')?.value
    || request.cookies.get('__Secure-next-auth.session-token')?.value;
  const directAuthToken = request.cookies.get('direct-auth-token')?.value;

  const isAuthenticated = !!sessionCookie || !!directAuthToken;

  // If accessing a protected route without authentication, redirect to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    const callbackUrl = encodeURIComponent(pathname);
    const redirectUrl = `/auth/login?callbackUrl=${callbackUrl}`;

    console.log(`Middleware: Redirecting unauthenticated request from ${pathname} to ${redirectUrl}`);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Otherwise, proceed
  return NextResponse.next();
}

// Configure the paths that should use the middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*'
  ],
};