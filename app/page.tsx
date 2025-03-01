import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Välkommen till BrandSphereAI</h1>
        <p className="text-xl mb-8">
          Din intelligenta plattform för innehållshantering på sociala medier
        </p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Logga in
          </Link>
          <Link 
            href="/signup" 
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90"
          >
            Skapa konto
          </Link>
        </div>
      </div>
    </main>
  )
} 