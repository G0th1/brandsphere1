# KRITISK ÅTGÄRD: Supabase-Prisma-Vercel databaslösning

## PROBLEM

Ditt system kan inte ansluta till databasen i Vercel-produktionsmiljön, vilket orsakar "Internt serverfel" när du försöker registrera nya användare. Specifika felmeddelanden:

- "Kunde inte söka efter befintlig användare" 
- "Can't reach database server at `localhost:5432`"

## ORSAK

Du försöker använda en lokal databas (`localhost:5432`) i produktionsmiljön, vilket är omöjligt eftersom:

1. Vercel har inte någon lokal databas - servern kan inte ansluta dit
2. Supabase har nyligen (januari 2024) migrerat till IPv6, medan Vercel endast stöder IPv4
3. De nödvändiga miljövariablerna för Supabase+Prisma saknas i Vercel-konfigurationen

## OMEDELBAR LÖSNING (steg-för-steg)

### 1. Skapa Supabase-integration i Vercel:

1. Gå till [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Välj ditt projekt: `brandsphere1`
3. Klicka på "Settings" i vänster meny
4. Välj "Integrations" 
5. Klicka på "Browse Marketplace"
6. Sök efter "Supabase" och klicka på integrationen
7. Klicka på "Add Integration"
8. Välj ditt Vercel-projekt och koppla det till ditt Supabase-projekt
9. Detta kommer automatiskt att lägga till de nödvändiga miljövariablerna i ditt Vercel-projekt

### 2. Manuellt uppdatera miljövariabler (om integrationen inte fungerar):

1. Gå till [https://vercel.com/dashboard](https://vercel.com/dashboard) 
2. Välj ditt projekt
3. Klicka på "Settings" -> "Environment Variables"
4. Se till att du har följande miljövariabler:

```
POSTGRES_PRISMA_URL=postgresql://postgres:[PASSWORD]@db.keebszijifukhvpyfnlc.supabase.co:5432/postgres
POSTGRES_URL_NON_POOLING=postgresql://postgres:[PASSWORD]@db.keebszijifukhvpyfnlc.supabase.co:5432/postgres?connect_timeout=30
NODE_ENV=production
```

Ersätt `[PASSWORD]` med ditt faktiska Supabase-databaslösenord

### 3. Skapa databastabeller:

När du har konfigurerat anslutningen, måste du skapa tabellerna i databasen:

```bash
# Installera Prisma CLI globalt
npm install -g prisma

# Generera Prisma-klienten utifrån din schema
npx prisma generate

# Skapa tabeller baserat på ditt schema
npx prisma db push
```

Alternativt kan du köra detta direkt via Vercel-dashboard med kommandot:

```
npx prisma db push
```

### 4. Återdeployera din application:

```bash
vercel --prod
```

## VERIFIERING

När åtgärderna är genomförda bör du kunna:

1. Registrera nya användare utan att få felmeddelandet
2. Kontrollera Vercel-loggarna för att bekräfta att databasanslutningen är framgångsrik
3. Använda Supabase-dashboarden för att verifiera att användartabellen skapas korrekt

## FRAMTIDA SÄKERHET

För att undvika liknande problem i framtiden:

1. Använd alltid separata miljövariabler för utveckling och produktion
2. Testa din applikation i en staging-miljö innan du gör en produktionsdeployment
3. Lägg till omfattande loggning för databasproblem i produktion
4. Skapa automatiserade tester för kritiska flöden som registrering och inloggning 