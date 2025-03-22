import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Analytics } from '@/components/analytics';
import Script from 'next/script';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/lib/site-config';

// Import startup checks - this runs server-side only
import { registerStartupChecks } from '@/lib/startup';

// Register startup checks in server context
if (typeof window === 'undefined') {
  registerStartupChecks();
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'social media management',
    'ai content generator',
    'content planning',
    'social analytics',
    'engagement tools',
  ],
  authors: [{ name: 'BrandSphereAI Team' }],
  creator: 'BrandSphereAI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brandsphere.ai'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Providers>

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/logo.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* Add cache directive in script */}
        <Script id="performance-config" strategy="afterInteractive">
          {`
            // Performance optimization
            document.addEventListener('DOMContentLoaded', () => {
              // Set default fetch cache policy
              const originalFetch = window.fetch;
              window.fetch = function(input, init) {
                // Add cache control for API requests that aren't mutations
                if (typeof input === 'string' && 
                    input.includes('/api/') && 
                    (!init || init.method === 'GET')) {
                  init = init || {};
                  init.headers = init.headers || {};
                  // Add cache header for GET requests
                  init.headers = {
                    ...init.headers,
                    'Cache-Control': 'max-age=60'
                  };
                }
                return originalFetch.call(this, input, init);
              };
            });
          `}
        </Script>
      </body>
    </html>
  );
} 