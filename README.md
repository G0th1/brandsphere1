# BrandSphereAI - MVP Version

BrandSphereAI är en plattform för att hantera innehåll på sociala medier med hjälp av AI. Denna version är en MVP (Minimum Viable Product) för att testa centrala funktioner och få feedback från early adopters.

## 🚀 Funktioner i MVP

- **Kontohantering**: Anslut Facebook och YouTube-konton
- **Innehållshantering**: Skapa och schemalägg inlägg med AI-stöd
- **Grundläggande statistik**: Se hur ditt innehåll presterar

## 🔧 Teknisk stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Serverless funktioner, Supabase
- **Databas**: Supabase PostgreSQL
- **Caching**: Upstash Redis
- **Driftsättning**: Vercel

## 🛠️ Installation och utveckling

1. Klona detta repository
```bash
git clone [repository-url]
cd brandsphereai
```

2. Installera beroenden
```bash
npm install --legacy-peer-deps
```

3. Skapa en `.env.local` fil baserad på `.env.example`

4. Starta utvecklingsservern
```bash
npm run dev
```

## 📦 Driftsättning

Projektet är konfigurerat för driftsättning på Vercel:

1. Anslut ditt GitHub-repo till Vercel
2. Konfigurera följande miljövariabler i Vercel-dashboarden:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `ENCRYPTION_KEY`

### Fördelar med Vercel för denna MVP
- Optimerad för Next.js
- Automatisk preview för pull requests
- Serverless funktioner utan extra konfiguration
- Enkel hantering av miljövariabler

## 📝 Feedback och roadmap

Detta är en MVP-version. Vi planerar att lägga till följande funktioner baserat på användarfeedback:

- Stöd för fler sociala medieplattformar (Instagram, LinkedIn, Twitter)
- Avancerad innehållsanalys
- Team-samarbete
- Förbättrad AI-generering av innehåll

## 🤝 Bidrag

Vi välkomnar feedback och bidrag! Om du stöter på problem eller har förslag, vänligen:

1. Kontakta vårt team
2. Skapa en issue
3. Skicka en pull request

## 📄 Licens

Detta projekt är licensierat under [MIT-licensen](LICENSE). 