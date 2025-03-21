import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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
  '/api/stripe/webhook',    // Allow Stripe webhooks without auth
  '/api/stripe/checkout',   // Allow checkout API without requiring re-authentication
];

// Routes that should be redirected to dashboard if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/register',
  '/forgot-password',
  '/reset-password',
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

  // Common path lists
  const PUBLIC_PATHS = [
    '/',
    '/about',
    '/features',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
    '/robots.txt',
    '/sitemap.xml',
    '/api/webhooks',
    '/auth/login',
    '/auth/register',
    '/login',
    '/register',
    '/signup',
    '/auth/emergency-login',
    '/admin-login',
    '/simple-login',
  ];

  // API endpoints that should always be accessible
  const PUBLIC_API_PATHS = [
    '/api/auth/token-login',
    '/api/auth/login-direct',
    '/api/auth/login-with-token',
    '/api/auth/emergency-login',
    '/api/auth/direct-auth',
    '/api/auth/bypass-login',
    '/api/auth/minimal-login',
    '/api/admin/list-users',
    '/api/webhooks',
  ];

  // Check for API endpoints first
  if (pathname.startsWith('/api/')) {
    // If it's a public API path, allow access
    if (PUBLIC_API_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }
  }

  // For public paths, allow access
  if (PUBLIC_PATHS.some(path => pathname === path) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')) {
    return NextResponse.next();
  }

  // Get auth token - check both standard NextAuth token and our direct-auth-token
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  const directAuthToken = request.cookies.get('direct-auth-token')?.value;

  const isAuthenticated = !!sessionToken || !!directAuthToken;

  // Routes that should be redirected to dashboard if already authenticated
  const AUTH_ROUTES = [
    '/login',
    '/auth/login',
    '/register',
    '/auth/register',
    '/signup',
  ];

  // Check if the user is authenticated
  if (isAuthenticated) {
    // If user is trying to access login/register pages but is already logged in
    if (AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Otherwise, allow access to protected routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/api/'))) {
    // Get the callback URL to redirect back after login
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url));
  }

  // Redirect /login to /auth/login
  if (pathname === '/login') {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '';
    const redirectUrl = callbackUrl ? `/auth/login?callbackUrl=${callbackUrl}` : '/auth/login';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect /register to /auth/register
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/auth/register', request.url));
  }

  return NextResponse.next();
}

// Configure the paths that should use the middleware
export const config = {
  matcher: ['/((?!api/auth/.+).*)', '/dashboard/:path*'],
};