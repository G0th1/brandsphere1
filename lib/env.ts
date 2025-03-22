import { z } from 'zod';

// Define schema for environment variables with validation
const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url().nonempty(),
    POSTGRES_PRISMA_URL: z.string().url().nonempty(),
    POSTGRES_URL_NON_POOLING: z.string().url().nonempty(),
    PRISMA_CLIENT_ENGINE_TYPE: z.enum(['binary', 'library']).optional().default('binary'),
    PRISMA_CONNECTION_RETRIES: z.string().regex(/^\d+$/).transform(Number).optional().default('3'),
    PRISMA_CONNECTION_RETRY_DELAY: z.string().regex(/^\d+$/).transform(Number).optional().default('250'),
    PRISMA_SKIP_DATABASE_CHECK: z.string().transform(val => val === 'true').optional().default('false'),
    SKIP_DB_VALIDATION: z.string().transform(val => val === 'true').optional().default('false'),

    // NextAuth
    NEXTAUTH_URL: z.string().url().nonempty(),
    NEXTAUTH_SECRET: z.string().min(32).nonempty(),

    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    PORT: z.string().regex(/^\d+$/).transform(Number).optional(),

    // Redis (optional)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // OAuth providers (optional)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // API keys (optional)
    OPENAI_API_KEY: z.string().optional(),
});

// Function to validate environment variables with detailed error reporting
export function validateEnv() {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        for (const error of result.error.errors) {
            console.error(`  - ${error.path.join('.')}: ${error.message}`);
        }

        // In production, throw to prevent startup with invalid config
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Invalid environment variables, check server logs for details');
        } else {
            console.warn('⚠️ Continuing despite environment validation errors (non-production mode)');
        }

        return false;
    }

    // In strict mode, assign the validated values back to process.env
    // This ensures type safety and default values
    const validatedEnv = result.data;
    for (const key in validatedEnv) {
        // @ts-ignore - we know these keys exist in process.env
        process.env[key] = String(validatedEnv[key]);
    }

    return true;
}

// Export parsed and validated environment with proper types
export const env = envSchema.parse(process.env);

// Safe accessor for environment variables with type checking
export function getEnv<K extends keyof z.infer<typeof envSchema>>(key: K): z.infer<typeof envSchema>[K] {
    return env[key];
} 