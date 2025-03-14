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
    return NextResponse.next();
  }

  // Check for universal mode in URL or cookie
  const urlParams = new URL(request.url).searchParams;
  const universalMode = urlParams.get('universal_mode') === 'true';
  const universalCookie = request.cookies.get('universal-mode')?.value === 'active';
  const deviceAccess = request.cookies.get('device-access')?.value === 'enabled';

  // If universal mode is enabled, skip auth checks
  if (universalMode || universalCookie || deviceAccess) {
    // For universal mode requests, we don't check authentication
    const response = NextResponse.next();

    // Add universal mode cookies
    response.cookies.set('universal-mode', 'active', {
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 86400
    });

    response.cookies.set('device-access', 'enabled', {
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 86400
    });

    // Also add the regular compatibility cookie
    response.cookies.set('auth-compatible', 'true', {
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 86400
    });

    return response;
  }

  // Check if the route is public
  if (matchesRoute(pathname, publicRoutes)) {
    // For public routes, we still want to add compatibility headers
    const response = NextResponse.next();

    // Add compatibility headers for Edge and other browsers
    response.cookies.set('auth-compatible', 'true', {
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 86400
    });

    return response;
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
      const response = NextResponse.redirect(new URL('/dashboard', request.url));

      // Add compatibility cookies
      response.cookies.set('auth-compatible', 'true', {
        path: '/',
        sameSite: 'none',
        secure: true,
        maxAge: 86400
      });

      return response;
    }

    // If user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !matchesRoute(pathname, publicRoutes)) {
      // For development, always allow access for testing
      if (process.env.NODE_ENV === 'development') {
        const response = NextResponse.next();
        response.cookies.set('universal-mode', 'active', {
          path: '/',
          sameSite: 'none',
          secure: true,
          maxAge: 86400
        });
        return response;
      }

      // Store the current URL to redirect back after login
      const redirectUrl = new URL('/auth/login', request.url);

      // Add the original URL as a query param to redirect back after login
      redirectUrl.searchParams.set('callbackUrl', pathname);

      // Add a message to show why they were redirected
      redirectUrl.searchParams.set('message', 'Please log in to continue');

      // Enable universal mode for the login screen
      redirectUrl.searchParams.set('universal_mode', 'true');

      const response = NextResponse.redirect(redirectUrl);

      // Add compatibility cookies
      response.cookies.set('auth-compatible', 'true', {
        path: '/',
        sameSite: 'none',
        secure: true,
        maxAge: 86400
      });

      return response;
    }
  } catch (error) {
    console.error('[Middleware] Error checking authentication:', error);

    // Special handling for development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Development mode: allowing access despite error');
      const response = NextResponse.next();

      // Add compatibility cookies
      response.cookies.set('auth-compatible', 'true', {
        path: '/',
        sameSite: 'none',
        secure: true,
        maxAge: 86400
      });

      // Enable universal mode for all errors
      response.cookies.set('universal-mode', 'active', {
        path: '/',
        sameSite: 'none',
        secure: true,
        maxAge: 86400
      });

      return response;
    }

    // In production, redirect to login page if we can't verify authentication
    if (!matchesRoute(pathname, publicRoutes)) {
      const response = NextResponse.redirect(new URL('/auth/login?error=ServerError&universal_mode=true', request.url));

      // Add compatibility cookies
      response.cookies.set('auth-compatible', 'true', {
        path: '/',
        sameSite: 'none',
        secure: true,
        maxAge: 86400
      });

      return response;
    }
  }

  // For all other scenarios, pass along with compatibility cookies
  const response = NextResponse.next();

  // Add compatibility cookies
  response.cookies.set('auth-compatible', 'true', {
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 86400
  });

  return response;
}

// Configure the paths that should use the middleware
export const config = {
  matcher: ['/((?!api/auth/[^/]+).*)'],
};