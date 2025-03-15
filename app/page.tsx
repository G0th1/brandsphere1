import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check, Star, Zap, ArrowRight, Globe } from 'lucide-react'
import { homeTranslations } from '@/lib/translations'
import dynamic from 'next/dynamic'

// Dynamically import the client component with loading fallback
const HomePageClient = dynamic(
  () => import('./components/home-page-client'),
  {
    loading: () => (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: true // Pre-render this component on the server
  }
)

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomePageClient />
      <Footer />
    </>
  );
} 