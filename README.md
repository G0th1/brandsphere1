# BrandSphereAI

BrandSphereAI är en plattform för hantering av sociala medier som hjälper företag att optimera sin online-närvaro genom AI-driven innehållshantering och analys.

## Funktioner

- **Prenumerationshantering:** Hantera prenumerationer med stöd för månatliga och årliga betalningar
- **Flerspråksstöd:** Stöd för engelska och svenska
- **Användningsstatistik:** Översikt över resursanvändning som sociala konton, inlägg och lagring
- **Responsiv design:** Fungerar på alla enheter från mobil till desktop
- **Tillgängligt gränssnitt:** Följer WCAG-riktlinjer för bästa tillgänglighet

## Teknisk stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API-routes
- **Databas:** PostgreSQL med Prisma ORM
- **Autentisering:** NextAuth
- **Betalningshantering:** Stripe
- **Deployment:** Vercel/Netlify

## Kom igång

### Förutsättningar

- Node.js 18+ 
- PostgreSQL-databas
- Stripe-konto (för betalningstjänster)

### Installation

1. Klona repot
   ```
   git clone https://github.com/ditt-username/brandsphereai.git
   cd brandsphereai
   ```

2. Installera beroenden
   ```
   npm install
   ```

3. Ställ in miljövariabler
   ```
   cp .env.example .env.local
   ```
   Redigera .env.local för att konfigurera dina egna API-nycklar och inställningar.

4. Ställ in databasen
   ```
   npx prisma migrate dev
   ```

5. Starta utvecklingsservern
   ```
   npm run dev
   ```

## Deployment

### Förbered för produktion

```
npm run build
```

### Databasemigrering i produktion

```
npx prisma migrate deploy
```

### Deploy till Vercel

1. Skapa ett konto på [Vercel](https://vercel.com) om du inte redan har ett
2. Koppla ditt GitHub/GitLab/Bitbucket-repo till Vercel
3. Konfigurera följande miljövariabler i Vercel-projektet:
   - `NEXTAUTH_URL`: Din produktionsdomän (t.ex. https://brandsphereai.vercel.app)
   - `NEXTAUTH_SECRET`: Ett långt slumpmässigt lösenord för säker autentisering
   - `DATABASE_URL`: Connection-string till din PostgreSQL-databas
   - `STRIPE_SECRET_KEY`: Din Stripe hemliga nyckel
   - `STRIPE_WEBHOOK_SECRET`: Din Stripe webhook-secret
   - `STRIPE_PRICE_ID_MONTHLY`: Produkt-ID för månatlig prenumeration
   - `STRIPE_PRICE_ID_YEARLY`: Produkt-ID för årlig prenumeration
   - `EMAIL_SERVER_USER`: Användarnamn för SMTP-server
   - `EMAIL_SERVER_PASSWORD`: Lösenord för SMTP-server
   - `EMAIL_SERVER_HOST`: SMTP-server (t.ex. smtp.gmail.com)
   - `EMAIL_SERVER_PORT`: SMTP-port (vanligtvis 587)
   - `EMAIL_FROM`: Avsändaradress för systemmail
   - `NEXT_PUBLIC_SITE_URL`: URL till din produktionsapp
4. Klicka på "Deploy" och låt Vercel bygga och deploya din app
5. När deployen är klar, kan du komma åt din app på den tilldelade Vercel-domänen

För kontinuerlig deployment, kan du konfigurera Vercel att automatiskt deploya vid varje push till din huvud-branch.

## Underhåll och support

För support, vänligen öppna ett issue i detta repository eller kontakta oss via vår supportsida på [support@brandsphereai.com](mailto:support@brandsphereai.com).

## Licens

Detta projekt är licensierat under [MIT-licensen](LICENSE).

## Stripe-integration

Projektet har integration med Stripe för betalningshantering. För att aktivera detta behöver du:

1. **Skapa konto och få API-nycklar**
   - Skapa ett konto på [Stripe](https://stripe.com)
   - Hämta dina API-nycklar (publik och hemlig) från Stripe-dashboarden

2. **Konfigurera miljövariabler**
   - Lägg till följande miljövariabler i din `.env.local` fil:
     ```
     STRIPE_PUBLIC_KEY=pk_test_your_public_key
     STRIPE_SECRET_KEY=sk_test_your_secret_key
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
     NEXT_PUBLIC_APP_URL=http://localhost:3000  # URL till din app
     ```

3. **Konfigurera Stripe Webhooks (för produktionsmiljö)**
   - Gå till Stripe Dashboard → Utvecklare → Webhooks
   - Lägg till en ny endpoint: `https://your-domain.com/api/webhook/stripe`
   - Välj events att lyssna på (minst: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`)
   - Spara webhook-secret i miljövariablerna

4. **Testa lokalt med Stripe CLI**
   - Installera [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - Kör: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
   - Kopiera webhook-secret och lägg till i dina miljövariabler

5. **Uppdatera Stripe Price IDs**
   - Skapa produkter och priser i Stripe Dashboard
   - Uppdatera priceIds i `app/pricing/page.tsx` med dina faktiska Stripe priceIds 