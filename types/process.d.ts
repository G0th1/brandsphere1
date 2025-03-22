import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-unused-vars
    namespace NodeJS {
        interface ProcessEnv {
            // Database
            DATABASE_URL: string;
            POSTGRES_PRISMA_URL: string;
            POSTGRES_URL_NON_POOLING: string;
            PRISMA_CLIENT_ENGINE_TYPE?: 'binary' | 'library';
            PRISMA_CONNECTION_RETRIES?: string;
            PRISMA_CONNECTION_RETRY_DELAY?: string;
            PRISMA_SKIP_DATABASE_CHECK?: string;
            SKIP_DB_VALIDATION?: string;

            // NextAuth
            NEXTAUTH_URL: string;
            NEXTAUTH_SECRET: string;

            // Node environment
            NODE_ENV: 'development' | 'production' | 'test';
            NEXT_PUBLIC_APP_URL: string;
            PORT?: string;

            // Redis
            UPSTASH_REDIS_REST_URL?: string;
            UPSTASH_REDIS_REST_TOKEN?: string;

            // OAuth providers
            GOOGLE_CLIENT_ID?: string;
            GOOGLE_CLIENT_SECRET?: string;

            // API keys
            OPENAI_API_KEY?: string;
        }
    }

    // Global Prisma instance
    var prisma: PrismaClient | undefined;
}

export { }; 