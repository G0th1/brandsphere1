import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/services/rate-limit-service'
import { subscriptionMiddleware } from './middleware/subscription-middleware'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Om användaren inte är inloggad och försöker nå en skyddad route
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Om användaren är inloggad och försöker nå login/signup
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Applicera rate limiting på API-anrop
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const identifier = session?.user?.id || req.ip || 'anonymous'
    let rateLimitType: 'default' | 'youtubeApi' | 'facebookApi' | 'auth' = 'default'

    // Bestäm vilken typ av rate limit som ska användas
    if (req.nextUrl.pathname.includes('/api/auth/')) {
      rateLimitType = 'auth'
    } else if (req.nextUrl.pathname.includes('/api/youtube/')) {
      rateLimitType = 'youtubeApi'
    } else if (req.nextUrl.pathname.includes('/api/facebook/')) {
      rateLimitType = 'facebookApi'
    }

    const rateLimit = await checkRateLimit(identifier, rateLimitType)

    if (!rateLimit.success) {
      return new NextResponse('För många förfrågningar. Försök igen senare.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
        },
      })
    }

    // Lägg till rate limit headers
    res.headers.set('X-RateLimit-Limit', rateLimit.limit.toString())
    res.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    res.headers.set('X-RateLimit-Reset', rateLimit.reset.toString())
  }

  // Check if this path requires subscription verification
  if (req.nextUrl.pathname.startsWith('/dashboard/')) {
    // Then check subscription for pro routes
    return subscriptionMiddleware(req)
  }

  return res
}

export const config = {
  // Specify which paths this middleware should run on
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
    '/signup'
  ]
}