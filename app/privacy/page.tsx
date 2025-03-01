import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Integritetspolicy
              </h1>
              <p className="text-muted-foreground">
                Senast uppdaterad: 1 juni 2023
              </p>
            </div>

            <div className="prose prose-gray max-w-none dark:prose-invert">
              <p>
                Vi på Bolt värnar om din personliga integritet och strävar alltid efter att skydda dina personuppgifter på bästa sätt. Denna integritetspolicy förklarar hur vi samlar in, använder, lagrar och delar personuppgifter när du använder vår tjänst.
              </p>

              <h2>1. Vilka uppgifter vi samlar in</h2>
              <p>
                Vi samlar in följande typer av information från våra användare:
              </p>
              <ul>
                <li><strong>Kontoinformation:</strong> När du registrerar dig för våra tjänster samlar vi in ditt namn, e-postadress, företagsnamn och andra uppgifter du lämnar under registreringsprocessen.</li>
                <li><strong>Användardata:</strong> Information om hur du använder våra tjänster, inklusive interaktioner, funktioner du använder och tid som tillbringas på plattformen.</li>
                <li><strong>Enhetsinformation:</strong> Information om den enhet du använder för att komma åt vår tjänst, inklusive hårdvarumodell, operativsystem, webbläsare och IP-adress.</li>
                <li><strong>Betalningsinformation:</strong> Om du köper en betald prenumeration samlar vi in betalningsinformation. Dock lagrar vi inte fullständiga kreditkortsuppgifter på våra servrar.</li>
                <li><strong>Kommunikation:</strong> När du kommunicerar med oss via e-post, kontaktformulär eller andra kanaler, sparar vi dessa meddelanden.</li>
              </ul>

              <h2>2. Hur vi använder dina uppgifter</h2>
              <p>
                Vi använder dina personuppgifter för följande ändamål:
              </p>
              <ul>
                <li>Tillhandahålla och förbättra våra tjänster</li>
                <li>Behandla betalningar och hantera din prenumeration</li>
                <li>Skicka dig viktig information om din tjänst, inklusive uppdateringar och säkerhetsmeddelanden</li>
                <li>Svara på dina frågor och ge support</li>
                <li>Anpassa och förbättra din upplevelse av vår tjänst</li>
                <li>Analysera användningsmönster och förbättra vår webbplats och tjänster</li>
                <li>Upptäcka, förhindra och hantera bedräglig aktivitet eller säkerhetsproblem</li>
              </ul>

              <h2>3. Hur vi delar dina uppgifter</h2>
              <p>
                Vi säljer aldrig dina personuppgifter till tredje part. Vi kan dock dela dina uppgifter i följande situationer:
              </p>
              <ul>
                <li><strong>Tjänsteleverantörer:</strong> Vi använder tredjepartsleverantörer för att hjälpa oss att driva vår verksamhet (t.ex. betalningsprocessorer, hostingleverantörer). Dessa har tillgång till dina uppgifter endast för att utföra dessa uppgifter och är förpliktade att inte använda eller avslöja dem för andra ändamål.</li>
                <li><strong>Affärsöverföringar:</strong> Om vi är involverade i en sammanslagning, förvärv eller försäljning av tillgångar, kan dina uppgifter överföras. Vi kommer att meddela dig innan dina personuppgifter överförs och blir föremål för en annan integritetspolicy.</li>
                <li><strong>Juridiska krav:</strong> Vi kan avslöja dina uppgifter om vi är skyldiga att göra det enligt lag eller för att skydda våra rättigheter, egendom eller säkerhet, våra användares eller andras rättigheter, egendom eller säkerhet.</li>
              </ul>

              <h2>4. Lagring av data</h2>
              <p>
                Vi lagrar dina personuppgifter så länge ditt konto är aktivt eller så länge det behövs för att tillhandahålla tjänsten. Vi kan behålla vissa uppgifter även efter att du har stängt ditt konto om det är nödvändigt för att uppfylla våra juridiska skyldigheter, lösa tvister eller verkställa våra avtal.
              </p>

              <h2>5. Dina rättigheter</h2>
              <p>
                Beroende på din hemvist har du vissa rättigheter avseende dina personuppgifter, som kan inkludera:
              </p>
              <ul>
                <li>Rätt att få tillgång till dina personuppgifter</li>
                <li>Rätt att korrigera felaktiga uppgifter</li>
                <li>Rätt att radera dina uppgifter</li>
                <li>Rätt att begränsa behandlingen av dina uppgifter</li>
                <li>Rätt till dataportabilitet</li>
                <li>Rätt att göra invändningar mot behandling av dina uppgifter</li>
              </ul>
              <p>
                För att utöva dessa rättigheter, vänligen kontakta oss via privacy@bolt.se.
              </p>

              <h2>6. Cookies och spårningstekniker</h2>
              <p>
                Vi använder cookies och liknande spårningstekniker för att spåra aktivitet på vår tjänst och lagra viss information. Du kan instruera din webbläsare att vägra alla cookies eller att indikera när en cookie skickas. Om du inte accepterar cookies kan du dock kanske inte använda vissa delar av vår tjänst.
              </p>

              <h2>7. Dataskydd</h2>
              <p>
                Vi använder lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot förlust, missbruk och obehörig åtkomst. Tyvärr kan ingen metod för elektronisk överföring eller lagring vara 100% säker, så vi kan inte garantera absolut säkerhet.
              </p>

              <h2>8. Ändringar i denna policy</h2>
              <p>
                Vi kan uppdatera vår integritetspolicy från tid till annan. Vi kommer att meddela dig om eventuella ändringar genom att publicera den nya integritetspolicyn på denna sida och uppdatera datumet "Senast uppdaterad". Du uppmanas att regelbundet granska denna integritetspolicy för eventuella ändringar.
              </p>

              <h2>9. Kontakta oss</h2>
              <p>
                Om du har frågor om denna integritetspolicy, vänligen kontakta oss:
              </p>
              <ul>
                <li>Via e-post: privacy@bolt.se</li>
                <li>Via post: Bolt AB, Storgatan 1, 123 45 Stockholm, Sverige</li>
                <li>Via telefon: +46 70 123 45 67</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 