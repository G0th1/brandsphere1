import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// KRITISK TEKNISK FELSÖKNINGSLOGG
const logMiddlewareError = (req: Request, errorType: string, error: any) => {
  console.error(`⛔ MIDDLEWARE KRITISKT FEL [${errorType}]:`, error);
  console.error(`⛔ URL: ${req.url}`);
  console.error(`⛔ Metod: ${req.method}`);
  console.error(`⛔ Användaragent: ${req.headers.get('user-agent')}`);
  if (error.stack) {
    console.error(`⛔ Stacktrace:`, error.stack);
  }
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
    const res = NextResponse.next();
    const pathname = req.nextUrl.pathname;

    console.log(`🔍 MIDDLEWARE: Bearbetar ${pathname}`);

    // Autentiseringskontroll (Supabase implementering)
    let supabase;
    try {
      supabase = createMiddlewareClient({ req, res });
      const { data: { session } } = await supabase.auth.getSession();

      // Skyddade rutter som kräver autentisering
      if (pathname.startsWith('/dashboard') && !session) {
        console.log('🔒 Omdirigerar till inloggning: Åtkomst nekad till dashboard');
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/auth/login';
        redirectUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Autentiserade användare bör inte se vissa sidor (t.ex. login/signup)
      if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register') ||
        pathname.startsWith('/auth/signup')) && session) {
        console.log('ℹ️ Omdirigerar till dashboard: Redan inloggad');
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (supabaseError) {
      // Kritiskt fel i Supabase-autentisering
      logMiddlewareError(req, 'supabase-auth', supabaseError);

      // För API-anrop, returnera ett felmeddelande
      if (pathname.startsWith('/api/')) {
        return sendDebugResponse('Autentiseringsfel - detta är ett kritiskt fel som kräver åtgärd');
      }

      // För vanliga sidor, låt användaren fortsätta (men logga felet)
      console.error('Supabase-fel i middleware, låter användaren fortsätta');
    }

    // För alla andra rutter, fortsätt normalt
    return res;
  } catch (globalError) {
    // Extremt allvarligt oväntat fel
    logMiddlewareError(req, 'global', globalError);

    // För API-rutter, ge ett vettigt svar
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return sendDebugResponse('Kritiskt systemfel i servertjänst');
    }

    // För vanliga sidor, tillåt fortsättning men med varning
    console.error('⚠️ Kritiskt fel i middleware, försöker fortsätta för att undvika total krasch');
    return NextResponse.next();
  }
}

// Se till att middleware endast körs på relevanta rutter
export const config = {
  matcher: [
    // Skydda alla dashboard-sidor
    '/dashboard/:path*',

    // Autentiseringsrelaterade sidor
    '/auth/:path*',

    // Alla API-rutter
    '/api/:path*',

    // Betalningsrelaterade sidor
    '/checkout/:path*',
    '/pricing',

    // Sidor som behöver åtkomst till användardata
    '/settings/:path*',
  ],
};