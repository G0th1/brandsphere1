import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { redis } from '@/lib/services/redis-service'

export async function analyticsMiddleware(req: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()
  
  // Spara start-tid för att beräkna duration
  await redis.set(`request:${requestId}`, startTime, { ex: 60 }) // 60s TTL
  
  const response = NextResponse.next()
  
  // Lägg till request ID i response headers för att kunna matcha i analytics
  response.headers.set('X-Request-ID', requestId)
  
  // Spåra API-anrop asynkront
  trackApiCall(req, response, requestId).catch(console.error)
  
  return response
}

async function trackApiCall(req: NextRequest, res: NextResponse, requestId: string) {
  try {
    const startTime = await redis.get(`request:${requestId}`)
    if (!startTime) return
    
    const duration = Date.now() - Number(startTime)
    const endpoint = req.nextUrl.pathname
    const status = res.status
    
    // Spara analytics data
    await redis.lpush('analytics:api:calls', JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint,
      status,
      duration,
      method: req.method,
      userAgent: req.headers.get('user-agent'),
      ip: req.ip,
    }))
    
    // Behåll bara senaste 1000 anrop
    await redis.ltrim('analytics:api:calls', 0, 999)
    
    // Ta bort temporär timing-data
    await redis.del(`request:${requestId}`)
  } catch (error) {
    console.error('Analytics error:', error)
  }
} 