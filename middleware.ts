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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, images, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.') // Handles files like favicon.ico, manifest.json, etc.
  ) {
    return NextRequest.nextResponse;
  }

  // Check if the route is public
  if (matchesRoute(pathname, publicRoutes)) {
    // No need to check authentication for public routes
    return NextResponse.next();
  }

  // Start by assuming user is not authenticated
  let isAuthenticated = false;

  try {
    // Get the token from next-auth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if token exists
    isAuthenticated = !!token;

    // Debug output
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] Path: ${pathname}, Auth: ${isAuthenticated ? 'yes' : 'no'}`);
    }

    // If user is authenticated and trying to access an auth route, redirect to dashboard
    if (isAuthenticated && matchesRoute(pathname, authRoutes)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !matchesRoute(pathname, publicRoutes)) {
      // Store the current URL to redirect back after login
      const redirectUrl = new URL('/auth/login', request.url);

      // Add the original URL as a query param to redirect back after login
      redirectUrl.searchParams.set('callbackUrl', pathname);

      // Add a message to show why they were redirected
      redirectUrl.searchParams.set('message', 'Please log in to continue');

      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('[Middleware] Error checking authentication:', error);

    // Special handling for development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Development mode: allowing access despite error');
      return NextResponse.next();
    }

    // In production, redirect to login page if we can't verify authentication
    if (!matchesRoute(pathname, publicRoutes)) {
      return NextResponse.redirect(new URL('/auth/login?error=ServerError', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the paths that should use the middleware
export const config = {
  matcher: ['/((?!api/auth/[^/]+).*)'],
};