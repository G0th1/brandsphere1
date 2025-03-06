# Guide för inloggningsproblem i BrandSphereAI

Detta dokument beskriver potentiella problem med inloggning i produktionsmiljön och hur man löser dem.

## Vanliga problem utanför koden

Om inloggningen inte fungerar i produktionsmiljön trots att koden verkar vara korrekt, kan det bero på följande faktorer:

### 1. Miljövariabler saknas eller är felaktiga

Säkerställ att följande miljövariabler är korrekt konfigurerade i Vercel:

```
NEXTAUTH_URL=https://din-produktions-url.com
NEXTAUTH_SECRET=ditt-hemliga-värde

DATABASE_URL=postgresql://...din-produktion-databas-url

GOOGLE_CLIENT_ID=ditt-google-client-id
GOOGLE_CLIENT_SECRET=ditt-google-client-secret
```

### 2. Databasmigreringar

Se till att databasen är uppdaterad med senaste schema:

1. Kör `npx prisma db push` lokalt om du har tillgång till produktionsdatabasen
2. Använd Vercel CLI: `vercel env pull && npx prisma db push`
3. Eller använd databasleverantörens verktyg för att köra migreringarna manuellt

### 3. OAuth-konfiguration

För Google-inloggning:
1. Kontrollera att du har en giltig Google OAuth konfiguration i Google Cloud Console
2. Se till att rätt omdirigerings-URL är konfigurerad: `https://din-produktions-url.com/api/auth/callback/google`
3. Kontrollera att YouTube Data API är aktiverad i ditt Google-projekt

### 4. Skapa en administratörsanvändare manuellt

Om inloggning fortfarande inte fungerar, kan du skapa en administratörsanvändare direkt i databasen:

```sql
INSERT INTO "User" (id, name, email, password, "emailVerified")
VALUES (
  'admin-id-123',
  'Admin User',
  'admin@exempel.se',
  '$2b$10$rKN3RhgXWPcEy3fQHwQ.1.jHJ1wxRl48i6rJE.JHriA4AWzIuXVyW', -- Password123
  CURRENT_TIMESTAMP
);
```

Detta lösenord är `Password123`.

### 5. Cookie-problem

Om cookies inte fungerar korrekt:
1. Säkerställ att `NEXTAUTH_URL` matchar din faktiska produktions-URL exakt
2. Kontrollera att domänen inte har några CORS-problem
3. Om du använder anpassad domän, se till att SSL är korrekt konfigurerat

## Implementerade förbättringar

Vi har gjort följande ändringar för att göra inloggningen mer robust:

1. Tagit bort EmailProvider eftersom det kräver korrekt e-postkonfiguration
2. Förbättrat loggning för att lättare identifiera problem
3. Gjort autentisering mer feltolerant
4. Lagt till ett skript för att skapa testanvändare

## Testanvändare

Använd följande uppgifter för att testa inloggning:

- E-post: `test@example.com`
- Lösenord: `Password123`

För att skapa denna användare i produktionsmiljön, kör `node scripts/create-test-user.js` med rätt databasanslutning. 