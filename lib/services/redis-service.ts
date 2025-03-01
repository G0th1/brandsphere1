import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Redis-konfiguration saknas')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Cache-nycklar
export const CACHE_KEYS = {
  YOUTUBE_CHANNEL: (userId: string) => `youtube:channel:${userId}`,
  YOUTUBE_VIDEOS: (userId: string) => `youtube:videos:${userId}`,
  FACEBOOK_PAGES: (userId: string) => `facebook:pages:${userId}`,
  FACEBOOK_POSTS: (userId: string, pageId: string) => `facebook:posts:${userId}:${pageId}`,
}

// Cache-tider (i sekunder)
export const CACHE_TTL = {
  YOUTUBE_CHANNEL: 3600, // 1 timme
  YOUTUBE_VIDEOS: 1800, // 30 minuter
  FACEBOOK_PAGES: 3600, // 1 timme
  FACEBOOK_POSTS: 900, // 15 minuter
}

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Försök hämta från cache först
    const cached = await redis.get<T>(key)
    if (cached) {
      return cached
    }

    // Om inget finns i cache, hämta ny data
    const data = await fetchFn()
    
    // Spara i cache med TTL
    await redis.set(key, data, { ex: ttl })
    
    return data
  } catch (error) {
    console.error('Redis error:', error)
    // Om något går fel med Redis, returnera färsk data
    return fetchFn()
  }
} 