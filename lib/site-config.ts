/**
 * Site configuration
 * Central place to store site-wide settings and constants
 */
export const siteConfig = {
    // Basic site info
    name: 'BrandSphereAI',
    description: 'Revolutionize your social media strategy with AI-powered content generation, scheduling, and analytics.',
    url: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://brandsphere.ai',

    // Branding
    logo: '/images/logo.svg',
    logoText: 'BrandSphereAI',

    // Social links
    links: {
        twitter: 'https://twitter.com/brandsphereai',
        github: 'https://github.com/brandsphereai',
        linkedin: 'https://linkedin.com/company/brandsphereai',
    },

    // Contact info
    contact: {
        email: 'support@brandsphere.ai',
    },

    // SEO default metadata
    defaultSeo: {
        title: 'BrandSphereAI - AI-Powered Social Media Management',
        description: 'Revolutionize your social media strategy with AI-powered content generation, scheduling, and analytics.',
        keywords: [
            'social media management',
            'AI content generation',
            'social media analytics',
            'content scheduling',
            'brand management',
        ],
        openGraph: {
            type: 'website',
            locale: 'en_US',
            site_name: 'BrandSphereAI',
        },
    },

    // Feature flags
    features: {
        analyticsEnabled: true,
        betaFeaturesEnabled: process.env.ENABLE_BETA_FEATURES === 'true',
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
        registrationEnabled: process.env.DISABLE_REGISTRATION !== 'true',
    },

    // Performance settings
    performance: {
        imageCacheTime: 60 * 60 * 24 * 7, // 7 days
        apiCacheTime: 60 * 5, // 5 minutes
    },

    // Rate limiting
    rateLimits: {
        api: {
            standard: {
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100, // limit each IP to 100 requests per windowMs
            },
            critical: {
                windowMs: 60 * 60 * 1000, // 1 hour
                max: 10, // limit each IP to 10 requests per windowMs
            },
        },
        login: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // limit each IP to 5 login attempts per windowMs
        },
    },

    // Database-related settings
    database: {
        connectionPoolSize: 10,
        queryTimeout: 30000, // 30 seconds
    },

    // Security settings
    security: {
        passwordMinLength: 8,
        passwordMinStrength: 2, // 0-4 scale, 2 = medium
        mfaEnabled: process.env.ENABLE_MFA === 'true',
        sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // Analytics
    analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
        posthogApiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    },

    // API timeouts (in ms)
    timeouts: {
        default: 30000, // 30 seconds
        login: 10000, // 10 seconds
        ai: 60000, // 60 seconds for AI operations
    },
} as const; 