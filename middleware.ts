import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Förbättrad felhantering för autentiseringsfel
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Get the token if the user is authenticated
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'default-secret-do-not-use-in-production'
  });

  // Protected routes that require authentication
  if (pathname.startsWith('/dashboard') && !token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Se till att middleware endast körs på relevanta rutter
export const config = {
  matcher: [
    // Gamla och nya registreringssidor
    '/signup',
    '/signup/:path*',
    '/login',

    // Skydda alla dashboard-sidor
    '/dashboard/:path*',

    // Autentiseringsrelaterade sidor
    '/auth/:path*',

    // Sidor som behöver åtkomst till användardata
    '/settings/:path*',
  ],
};