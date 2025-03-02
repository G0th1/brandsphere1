import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Kontakta oss | BrandSphereAI',
  description: 'Har du frågor eller funderingar? Kontakta oss på BrandSphereAI för support, försäljning eller för att boka en demo av vår AI-drivna plattform för sociala medier.',
  keywords: ['kontakta BrandSphereAI', 'sociala medier support', 'AI-plattform för innehållsskapande', 'kontaktformulär'],
  metadataBase: new URL('https://brandsphereai.com'),
  openGraph: {
    title: 'Kontakta oss | BrandSphereAI',
    description: 'Har du frågor eller funderingar? Kontakta oss på BrandSphereAI för support, försäljning eller för att boka en demo av vår AI-drivna plattform för sociala medier.',
    type: 'website',
    url: 'https://brandsphereai.se/contact',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'BrandSphereAI Kontakta oss',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakta oss | BrandSphereAI',
    description: 'Har du frågor eller funderingar? Kontakta oss på BrandSphereAI för support, försäljning eller för att boka en demo av vår AI-drivna plattform för sociala medier.',
    images: ['/images/og-contact.jpg'],
  },
} 