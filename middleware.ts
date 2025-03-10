import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Enkel loggningsfunktion
const logMiddlewareError = (req: Request, errorType: string, error: any) => {
  console.error(`⛔ MIDDLEWARE FEL [${errorType}]:`, error);
  console.error(`⛔ URL: ${req.url}`);
};

// Detaljerad felsökningsfunktion för att hjälpa användare
const sendDebugResponse = (message: string) => {
  return new NextResponse(
    JSON.stringify({
      error: 'middleware_error',
      message,
      timestamp: new Date().toISOString(),
      support: 'Kontakta supporten med denna information för hjälp',
      retry: 'Försök att ladda om sidan eller logga in igen'
    }),
    {
      status: 500,
      headers: { 'content-type': 'application/json' }
    }
  );
};

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

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
    // Logga fel
    logMiddlewareError(req, 'auth', error);

    // Vid fel, låt användaren fortsätta men utan autentisering
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