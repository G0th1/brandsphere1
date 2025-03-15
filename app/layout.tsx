import { Inter } from 'next/font/google'
import './globals.css'

// Import providers
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Providers } from '@/components/providers'
import { Toaster } from "../components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { BrowserCompat } from '@/components/BrowserCompat'

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata = {
  title: 'BrandSphereAI - Hantera dina sociala medier smartare',
  description: 'BrandSphereAI hjälper dig att skapa, schemaläggа och analysera innehåll för sociala medier med hjälp av artificiell intelligens.',
  keywords: 'AI, sociala medier, innehållsplanering, schemaläggning, innehållsanalys',
  authors: [{ name: 'BrandSphereAI Team' }],
  creator: 'BrandSphereAI',
  metadataBase: new URL('https://brandsphereai.com'),
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://brandsphereai.com',
    title: 'BrandSphereAI - Hantera dina sociala medier smartare',
    description: 'BrandSphereAI hjälper dig att skapa, schemaläggа och analysera innehåll för sociala medier med hjälp av artificiell intelligens.',
    siteName: 'BrandSphereAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandSphereAI - Hantera dina sociala medier smartare',
    description: 'BrandSphereAI hjälper dig att skapa, schemaläggа och analysera innehåll för sociala medier med hjälp av artificiell intelligens.',
    creator: '@brandsphereai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={`${inter.variable}`} suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
          <Toaster />
          <Analytics />
          <BrowserCompat />
        </ThemeProvider>
      </body>
    </html>
  )
} 