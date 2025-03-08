import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Middleware för att hantera autentisering med NextAuth
export async function middleware(req: NextRequest) {
  // Hämta token från session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Sökvägen som användaren försöker komma åt
  const { pathname } = req.nextUrl

  // Kontrollera om användaren är inloggad
  const isAuth = !!token
  const isAuthPage = pathname.startsWith('/auth')

  // Om det är en auth-sida och användaren är inloggad, omdirigera till dashboard
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Skyddade sidor - kontrollera om användaren är inloggad
  const protectedPaths = ['/dashboard', '/settings', '/billing']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !isAuth) {
    // Omdirigera till inloggning
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

// Matcher för vilka routes som middleware ska köras på
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/auth/:path*',
  ],
}