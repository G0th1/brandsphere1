# BrandSphereAI - Social Media Management Platform

BrandSphereAI is a comprehensive social media management platform designed to help businesses and entrepreneurs streamline their social media presence. It combines AI-powered content creation, post scheduling, and analytics in one intuitive platform.

## Features

### Social Media Account Management
- Connect Instagram, Twitter, Facebook, LinkedIn, and TikTok accounts
- Manage all your social media profiles in one place
- Monitor account health and connection status

### Content Planning & Scheduling
- Visual content calendar for planning posts across platforms
- Schedule posts with optimal posting time recommendations
- Draft content with AI assistance and hashtag suggestions
- Media upload and management

### Analytics & Insights
- Track follower growth and engagement metrics
- Identify top-performing content
- Monitor audience demographics and behavior
- Receive trend detection and content recommendations

### Automations
- Automatic post publishing based on schedule
- Engagement reminders for new posts
- Weekly performance reports
- Content recommendations based on trending topics

### Team Collaboration
- Invite team members with custom permission levels
- Collaborative workflow for content approval
- Activity tracking for team coordination

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- Yarn or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/brandsphereai.git
cd brandsphereai
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration values.

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies

BrandSphereAI is built with a modern tech stack:

- **Next.js** - React framework for server-rendered applications
- **React** - Frontend library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication for Next.js applications
- **Neon** - PostgreSQL database
- **Upstash Redis** - Redis for caching and real-time features
- **Vercel** - Deployment platform

## API

BrandSphereAI offers a comprehensive REST API for integrating with your applications. Check our [API Documentation](/api-documentation) for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback, please contact us at support@brandsphereai.com.

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

## Migrering från Supabase till NextAuth

Projektet har migrerats från att använda både Supabase Auth och NextAuth till att endast använda NextAuth. Om du har en befintlig databas med användare i Supabase, följ dessa steg för att migrera dem:

### 1. Kör migreringsskriptet

```bash
# Se till att alla miljövariabler är konfigurerade först
node scripts/migrate-to-nextauth.js
```

### 2. Uppdatera miljövariabler

Ta bort dessa Supabase-relaterade miljövariabler från din `.env`-fil om du inte använder Supabase för andra ändamål:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Lägg till dessa miljövariabler för e-postverifiering med NextAuth:

```
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@brandsphereai.com
```

### 3. Uppdatera beroenden (valfritt)

Om du inte använder Supabase för andra ändamål kan du ta bort följande beroenden:

```bash
npm uninstall @supabase/auth-helpers-nextjs @supabase/supabase-js
```

## Tekniska designbeslut

// ... existing code ... 