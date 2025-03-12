# Guide för att lösa inloggningsproblem i BrandSphereAI

## Snabb lösning

Om du har problem med inloggningen, kör följande kommando i terminalen från projektets rot:

```bash
node scripts/fix-auth.js
```

Detta skript kommer att:
1. Rensa gamla sessioner
2. Verifiera miljövariabler
3. Skapa/återställa en testanvändare
4. Återställa autentiseringskonfigurationen

Efter att skriptet har körts, starta om servern:

```bash
npm run dev
```

Du kan nu logga in med följande uppgifter:
- E-post: `test@example.com`
- Lösenord: `Password123`

## Om du fortfarande har problem

Om du fortfarande har problem med inloggningen, följ dessa steg:

### 1. Kontrollera miljövariabler

Säkerställ att följande miljövariabler är korrekt konfigurerade i din `.env`-fil:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ett-slumpmässigt-värde
```

För produktionsmiljöer bör NEXTAUTH_URL peka på din produktions-URL.

### 2. Rensa cachen och sessioner

Problem med inloggning kan ibland bero på cachelagrad data. Prova följande:

1. Rensa webbläsarens cache och cookies
2. Öppna appen i inkognitoläge
3. Starta om utvecklingsservern
4. Kör `node scripts/diagnose-auth.js` för att se detaljerad diagnostik

### 3. Verifiera att databasen fungerar

Säkerställ att databasen är korrekt konfigurerad och tillgänglig:

```bash
npx prisma studio
```

Detta öppnar ett gränssnitt där du kan inspektera databasen.

### 4. Manuell lösning för krislägen

Om inget annat fungerar, kan du skapa en användare direkt i databasen:

```sql
INSERT INTO "User" (id, name, email, password, "emailVerified")
VALUES (
  'admin-123',
  'Admin User',
  'admin@exempel.se',
  '$2b$10$rKN3RhgXWPcEy3fQHwQ.1.jHJ1wxRl48i6rJE.JHriA4AWzIuXVyW', -- Password123
  CURRENT_TIMESTAMP
);
```

Därefter kan du logga in med:
- E-post: `admin@exempel.se`
- Lösenord: `Password123`

## Tekniska detaljer

BrandSphereAI använder NextAuth.js för autentisering med följande providers:

1. **Credentials Provider**: Tillåter inloggning med e-post och lösenord
2. **Google Provider**: Tillåter inloggning med Google (om konfigurerat)
3. **Email Provider**: För lösenordsåterställning (om konfigurerat)

All autentiseringslogik finns i `lib/auth.ts` och API-rutten i `app/api/auth/[...nextauth]/route.ts`.

Middleware som skyddar rutter finns i `middleware.ts`.

## Kontakta support

Om du fortfarande har problem, vänligen kontakta vårt team via:

- Email: support@brandsphereai.com
- Github Issues: Skapa ett nytt ärende 