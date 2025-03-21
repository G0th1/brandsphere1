import { MetadataRoute } from 'next'

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/admin/',
        '/auth/',
        '/auth/login/',
        '/signup/',
        '/signup/verify/',
      ],
    },
    sitemap: 'https://brandsphereai.se/sitemap.xml',
  }
} 