import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Enkel middleware för att hantera Supabase-autentisering
export async function middleware(req: NextRequest) {
  // Vi skapar en respons som initialt är samma som den ursprungliga requesten
  const res = NextResponse.next()

  // Skapa en Supabase-klient specifikt för middleware
  const supabase = createMiddlewareClient({ req, res })

  // Vi försöker förnya access-token genom session-cookie
  await supabase.auth.getSession()

  return res
}

// Matcher för vilka routes som middleware ska köras på
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}