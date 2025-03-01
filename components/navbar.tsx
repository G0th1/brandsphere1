"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="text-xl font-bold">
            BrandSphereAI
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Hem
          </Link>
          <Link 
            href="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/features') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Funktioner
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/pricing') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Priser
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Logga in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Skapa konto
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 