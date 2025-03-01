import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t py-12 md:py-16 lg:py-20">
      <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">BrandSphereAI</h3>
          <p className="text-sm text-muted-foreground">
            Kraftfull AI-plattform för att hantera sociala medier smartare och effektivare.
          </p>
        </div>
        <nav className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Produkter</h4>
            <ul className="space-y-2">
              {[
                { href: '/features', label: 'Funktioner' },
                { href: '/pricing', label: 'Priser' },
                { href: '/roadmap', label: 'Roadmap' },
                { href: '/integrations', label: 'Integrationer' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Resurser</h4>
            <ul className="space-y-2">
              {[
                { href: '/blog', label: 'Blogg' },
                { href: '/guides', label: 'Guider' },
                { href: '/help', label: 'Hjälpcenter' },
                { href: '/api-docs', label: 'API Dokumentation' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Företag</h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'Om oss' },
                { href: '/careers', label: 'Karriär' },
                { href: '/contact', label: 'Kontakta oss' },
                { href: '/press', label: 'Press' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="mt-8 border-t pt-8 md:col-span-2 lg:col-span-4 lg:flex lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BrandSphereAI. Alla rättigheter förbehållna.
          </p>
          <nav className="mt-4 flex gap-4 lg:mt-0">
            {[
              { href: '/privacy', label: 'Integritetspolicy' },
              { href: '/terms', label: 'Användarvillkor' },
              { href: '/cookies', label: 'Cookies' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
} 