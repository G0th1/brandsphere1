import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 md:py-24">
        <div className="max-w-md space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">404</h1>
            <h2 className="text-2xl font-medium mb-8">Sidan kunde inte hittas</h2>
            <p className="text-muted-foreground">
              Vi kan tyvärr inte hitta den sida du letar efter. Den kan ha flyttats, tagits bort 
              eller så kan adressen ha skrivits in fel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                Tillbaka till startsidan
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Kontakta support
              </Link>
            </Button>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Har du frågor eller behöver hjälp? Kontakta oss på 
              <a 
                href="mailto:support@bolt.se" 
                className="text-primary underline underline-offset-2 hover:text-primary/80 ml-1"
              >
                support@bolt.se
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 