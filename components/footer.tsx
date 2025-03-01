export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Om oss</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/about" className="hover:text-primary">Vårt team</a>
              </li>
              <li>
                <a href="/careers" className="hover:text-primary">Karriär</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Tjänster</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/features" className="hover:text-primary">Funktioner</a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-primary">Priser</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/contact" className="hover:text-primary">Kontakta oss</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-primary">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Juridiskt</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacy" className="hover:text-primary">Integritetspolicy</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary">Användarvillkor</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BrandSphereAI. Alla rättigheter förbehållna.
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com" className="text-muted-foreground hover:text-primary">
              Twitter
            </a>
            <a href="https://facebook.com" className="text-muted-foreground hover:text-primary">
              Facebook
            </a>
            <a href="https://instagram.com" className="text-muted-foreground hover:text-primary">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 