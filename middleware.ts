import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Förbättrad felhantering för autentiseringsfel
export async function middleware(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;

    // Hantera omdirigering från gamla signup-sidan till nya register-sidan
    if (pathname === "/signup" || pathname.startsWith('/signup/')) {
      console.log('🔄 Omdirigerar från gamla /signup till /auth/register');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/register';
      return NextResponse.redirect(redirectUrl);
    }

    // Hantera omdirigering från gamla login-sidan till nya login-sidan
    if (pathname === "/login") {
      console.log('🔄 Omdirigerar från gamla /login till /auth/login');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return NextResponse.redirect(redirectUrl);
    }

    // Grundläggande autentiseringskontroll med NextAuth
    console.log(`🔒 Kontrollerar autentisering för: ${pathname}`);

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-dev-secret-do-not-use-in-production'
    });

    if (token) {
      console.log(`✅ Användare autentiserad: ${token.email || token.sub}`);
    } else {
      console.log(`ℹ️ Icke-autentiserad åtkomst till: ${pathname}`);
    }

    // Skyddade rutter som kräver autentisering
    if (pathname.startsWith('/dashboard') && !token) {
      console.log('🔒 Omdirigerar till inloggning: Åtkomst nekad till dashboard');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Autentiserade användare bör inte se vissa sidor (t.ex. login/register)
    if ((pathname.startsWith('/auth/login') ||
      pathname.startsWith('/auth/register')) && token) {
      console.log('ℹ️ Omdirigerar till dashboard: Redan inloggad');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // För alla andra rutter, fortsätt normalt
    return NextResponse.next();
  } catch (error) {
    // Vid fel, logga och fortsätt normalt
    console.error(`⛔ MIDDLEWARE FEL:`, error);
    console.error(`⛔ URL: ${req.url}`);

    // För att undvika att användare fastnar vid autentiseringsfel,
    // tillåter vi åtkomst och låter applikationen hantera felet
    return NextResponse.next();
  }
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