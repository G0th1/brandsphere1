import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Blogg | BrandSphereAI - Insikter om sociala medier och AI',
  description: 'Utforska de senaste trenderna, strategierna och tipsen för att förbättra din närvaro på sociala medier med hjälp av AI och datadriven marknadsföring.',
  metadataBase: new URL('https://brandsphereai.com'),
  openGraph: {
    title: 'BrandSphereAI Blogg - Expertinsikter om sociala medier',
    description: 'Artiklar, guider och strategier för att förbättra din närvaro på sociala medier och maximera ditt varumärke online.',
    images: [
      {
        url: '/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BrandSphereAI Blogg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandSphereAI Blogg - Expertinsikter om sociala medier',
    description: 'Artiklar, guider och strategier för att förbättra din närvaro på sociala medier och maximera ditt varumärke online.',
    images: ['/images/blog-og.jpg'],
  },
} 