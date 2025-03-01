import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Redis-konfiguration saknas i miljövariabler')
}

// Skapa en Redis-instans
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Nyckel-prefix för olika typer av data
const KEY_PREFIX = {
  CACHE: 'cache:',
  QUEUE: 'queue:',
  RATE_LIMIT: 'ratelimit:',
}

// Interface för kömeddelanden
interface QueueMessage {
  id: string
  type: string
  data: any
  attempts: number
  maxAttempts: number
  createdAt: number
}

export class EnhancedRedisService {
  // Grundläggande key-value operationer med felhantering
  static async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await redis.set(key, JSON.stringify(value), { ex: ttlSeconds })
      } else {
        await redis.set(key, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error('Redis SET error:', error)
      return false
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value.toString()) : null
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis DELETE error:', error)
      return false
    }
  }

  // Cache-hantering med TTL
  static async setCache<T>(key: string, value: T, ttlSeconds: number): Promise<boolean> {
    return this.set(`${KEY_PREFIX.CACHE}${key}`, value, ttlSeconds)
  }

  static async getCache<T>(key: string): Promise<T | null> {
    return this.get<T>(`${KEY_PREFIX.CACHE}${key}`)
  }

  // Rate limiting med sliding window
  static async checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<{
    success: boolean
    remaining: number
    reset: number
  }> {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
      prefix: KEY_PREFIX.RATE_LIMIT,
    })

    const result = await ratelimit.limit(identifier)
    
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    }
  }

  // Köhantering för bakgrundsuppgifter
  static async enqueue(
    queueName: string,
    data: any,
    options: { maxAttempts?: number } = {}
  ): Promise<string> {
    const id = crypto.randomUUID()
    const message: QueueMessage = {
      id,
      type: queueName,
      data,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: Date.now(),
    }

    const key = `${KEY_PREFIX.QUEUE}${queueName}`
    await redis.lpush(key, JSON.stringify(message))
    return id
  }

  static async dequeue(queueName: string): Promise<QueueMessage | null> {
    const key = `${KEY_PREFIX.QUEUE}${queueName}`
    const message = await redis.rpop(key)
    return message ? JSON.parse(message) : null
  }

  static async processQueue(
    queueName: string,
    processor: (data: any) => Promise<void>,
    options: { 
      batchSize?: number,
      pollInterval?: number 
    } = {}
  ): Promise<void> {
    const batchSize = options.batchSize || 10
    const pollInterval = options.pollInterval || 1000

    while (true) {
      try {
        const messages: QueueMessage[] = []
        
        // Hämta batch av meddelanden
        for (let i = 0; i < batchSize; i++) {
          const message = await this.dequeue(queueName)
          if (!message) break
          messages.push(message)
        }

        if (messages.length === 0) {
          await new Promise(resolve => setTimeout(resolve, pollInterval))
          continue
        }

        // Bearbeta meddelanden parallellt
        await Promise.all(
          messages.map(async (message) => {
            try {
              await processor(message.data)
            } catch (error) {
              message.attempts++
              if (message.attempts < message.maxAttempts) {
                // Lägg tillbaka i kön för återförsök
                await this.enqueue(queueName, message.data, {
                  maxAttempts: message.maxAttempts,
                })
              } else {
                console.error(`Queue processing failed after ${message.attempts} attempts:`, error)
              }
            }
          })
        )
      } catch (error) {
        console.error('Queue processing error:', error)
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
    }
  }

  // Hjälpmetoder för övervakning och underhåll
  static async getQueueLength(queueName: string): Promise<number> {
    return redis.llen(`${KEY_PREFIX.QUEUE}${queueName}`)
  }

  static async clearQueue(queueName: string): Promise<void> {
    await redis.del(`${KEY_PREFIX.QUEUE}${queueName}`)
  }

  static async getQueueStats(queueName: string): Promise<{
    length: number
    oldestMessage?: QueueMessage
  }> {
    const length = await this.getQueueLength(queueName)
    const oldestMessage = length > 0 ? 
      JSON.parse(await redis.lindex(`${KEY_PREFIX.QUEUE}${queueName}`, -1)) : 
      undefined

    return { length, oldestMessage }
  }
} 