import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis-service'

// Förenkla implementeringen för att få bygget att fungera
// Hårdkoda värdena direkt i rateLimiters-objektet istället för att använda RATE_LIMITS
// Detta undviker typfelet med Duration

// Skapa rate limiters för olika endpoints
const rateLimiters = {
  default: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  }),
  youtubeApi: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 m'),
    analytics: true,
    prefix: 'ratelimit:youtube',
  }),
  facebookApi: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 m'),
    analytics: true,
    prefix: 'ratelimit:facebook',
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),
}

export type RateLimitType = keyof typeof rateLimiters

export async function checkRateLimit(identifier: string, type: RateLimitType = 'default') {
  const limiter = rateLimiters[type]
  const result = await limiter.limit(identifier)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
} 