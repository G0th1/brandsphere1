import { Redis } from '@upstash/redis';

// Create a global variable to store the Redis client instance
let redisClient: Redis | null = null;

// Define TTL values for different cache types (in seconds)
export const CACHE_TTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 60 * 5, // 5 minutes
    LONG: 60 * 60, // 1 hour
    DAY: 60 * 60 * 24, // 1 day
};

export function getRedisClient(): Redis {
    if (!redisClient) {
        // Initialize Redis client if it doesn't exist
        redisClient = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL || '',
            token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
        });
    }
    return redisClient;
}

// Cache wrapper for API routes
export async function withCache<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM,
    forceRefresh: boolean = false
): Promise<T> {
    const redis = getRedisClient();

    // Skip cache in development mode for easier debugging
    if (process.env.NODE_ENV === 'development' && process.env.USE_CACHE !== 'true') {
        return fetchData();
    }

    try {
        // If forceRefresh is true, skip the cache lookup
        if (!forceRefresh) {
            const cachedData = await redis.get(key);
            if (cachedData) {
                console.log(`Cache hit for key: ${key}`);
                return cachedData as T;
            }
        }

        // Cache miss, fetch fresh data
        console.log(`Cache miss for key: ${key}, fetching fresh data`);
        const freshData = await fetchData();

        // Only cache if we have data
        if (freshData) {
            // Store in cache with TTL
            await redis.set(key, freshData, { ex: ttl });
        }

        return freshData;
    } catch (error) {
        console.error(`Redis cache error for key ${key}:`, error);
        // Fallback to direct fetch on any Redis error
        return fetchData();
    }
}

// Function to invalidate cache for specific key or pattern
export async function invalidateCache(keyOrPattern: string): Promise<void> {
    try {
        const redis = getRedisClient();

        // Check if it's a pattern (contains *)
        if (keyOrPattern.includes('*')) {
            const keys = await redis.keys(keyOrPattern);
            if (keys.length > 0) {
                const pipeline = redis.pipeline();
                keys.forEach(key => {
                    pipeline.del(key);
                });
                await pipeline.exec();
                console.log(`Invalidated ${keys.length} keys matching pattern: ${keyOrPattern}`);
            }
        } else {
            // Single key invalidation
            await redis.del(keyOrPattern);
            console.log(`Invalidated cache for key: ${keyOrPattern}`);
        }
    } catch (error) {
        console.error(`Error invalidating cache for ${keyOrPattern}:`, error);
    }
}

export default {
    getClient: getRedisClient,
    withCache,
    invalidateCache,
    CACHE_TTL,
}; 