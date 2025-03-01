import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Vanliga frågor | BrandSphereAI',
  description: 'Hitta svar på de vanligaste frågorna om BrandSphereAI, våra tjänster, priser och hur du kommer igång.',
  openGraph: {
    title: 'Vanliga frågor | BrandSphereAI',
    description: 'Hitta svar på de vanligaste frågorna om BrandSphereAI, våra tjänster och hur du kommer igång.'
  }
};

// FAQ-kategorier och frågor
const faqCategories = [
  {
    title: "Komma igång",
    questions: [
      {
        question: "Hur skapar jag ett konto?",
        answer: "Det är enkelt att skapa ett konto hos oss. Klicka på 'Skapa konto' i menyn och följ instruktionerna. Du kan börja med en gratis testperiod på 14 dagar utan att binda dig till någon betalning."
      },
      {
        question: "Behöver jag ett kreditkort för att prova?",
        answer: "Nej, du behöver inte ange något kreditkort för att prova vår tjänst. Den 14-dagars gratis testperioden är helt utan förpliktelser."
      },
      {
        question: "Vilka sociala medieplattformar stöds?",
        answer: "Vi stödjer för närvarande alla större sociala medieplattformar: Instagram, Facebook, Twitter, LinkedIn, Pinterest och TikTok. Vi jobbar ständigt med att lägga till stöd för fler plattformar."
      },
      {
        question: "Hur ansluter jag mina sociala mediekonton?",
        answer: "Efter att du har registrerat dig går du till 'Anslutningar' i din dashboard. Där kan du enkelt ansluta dina konton genom autentisering via respektive plattform."
      }
    ]
  },
  {
    title: "Planer och prissättning",
    questions: [
      {
        question: "Vilken plan passar mig bäst?",
        answer: "Det beror på dina behov. För småföretag och soloprenörer passar Pro-planen bra. För större team eller företag med många varumärken rekommenderar vi Business-planen. Du kan alltid börja med en gratisplan och uppgradera senare."
      },
      {
        question: "Kan jag byta plan senare?",
        answer: "Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringar i fakturering träder i kraft vid nästa betalningsperiod."
      },
      {
        question: "Finns det någon rabatt för årlig fakturering?",
        answer: "Ja, du får 20% rabatt när du väljer årlig fakturering istället för månadsvis fakturering."
      },
      {
        question: "Hur fungerar teamhantering i Business-planen?",
        answer: "Med Business-planen kan du bjuda in obegränsat antal teammedlemmar och ställa in olika behörighetsnivåer för var och en. Detta gör det enkelt att samarbeta kring innehållsskapande och publicering."
      }
    ]
  },
  {
    title: "Funktioner",
    questions: [
      {
        question: "Hur fungerar AI-innehållsgenereringen?",
        answer: "Vår AI analyserar ditt varumärke, målgrupp och tidigare framgångsrikt innehåll för att generera nya förslag. Du kan ge AI-en instruktioner som 'Skapa ett Instagram-inlägg om vår nya produktlansering' och få flera förslag på text och bildkoncept."
      },
      {
        question: "Kan jag schemalägga inlägg i förväg?",
        answer: "Ja, du kan schemalägga inlägg till alla dina sociala medieplattformar i förväg. Vår Smart Schedule-funktion föreslår även optimala publiceringstider baserat på när din publik är mest aktiv."
      },
      {
        question: "Vilken typ av analyser erbjuder ni?",
        answer: "Vi erbjuder omfattande analyser inklusive räckvidd, engagemang, tillväxt av följare, optimal publiceringstid, innehållsprestanda och demografisk information om din publik. Pro- och Business-planer erbjuder mer djupgående analyser och anpassade rapporter."
      },
      {
        question: "Kan jag samarbeta med mitt team?",
        answer: "Ja, du kan bjuda in teammedlemmar att samarbeta. Olika personer kan ha olika roller som innehållsskapare, granskare, utgivare eller administratör, beroende på vilken plan du har."
      }
    ]
  },
  {
    title: "Support och säkerhet",
    questions: [
      {
        question: "Hur säkra är mina sociala mediekonton?",
        answer: "Vi använder industristandard OAuth-autentisering för att ansluta till dina konton, vilket betyder att vi aldrig lagrar dina lösenord. All kommunikation är krypterad och vi följer strikt GDPR och andra dataskyddslagar."
      },
      {
        question: "Vad händer om jag behöver hjälp?",
        answer: "Vi erbjuder e-postsupport till alla användare. Pro-kunder får prioriterad support, och Business-kunder får dessutom telefonsupport och en dedikerad kontaktperson."
      },
      {
        question: "Kan jag få en personlig demonstration av plattformen?",
        answer: "Absolut! Du kan boka en personlig demonstration genom att kontakta vårt försäljningsteam via kontaktsidan eller genom att klicka på 'Boka demo' på prissidan."
      },
      {
        question: "Hur ofta uppdateras plattformen med nya funktioner?",
        answer: "Vi släpper nya funktioner och förbättringar regelbundet, vanligtvis var tredje till fjärde vecka. Stora uppdateringar meddelas alltid i förväg via e-post och i plattformen."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center animate-fade-in mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Vanliga frågor
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Hitta svar på de vanligaste frågorna om BrandSphereAI och våra tjänster.
              </p>
            </div>

            {/* FAQ Kategorier */}
            <div className="grid gap-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    {category.questions.map((item, questionIndex) => (
                      <details 
                        key={questionIndex} 
                        className="group border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary"
                      >
                        <summary className="flex items-center justify-between gap-2 p-4 cursor-pointer list-none bg-muted/30">
                          <h3 className="font-medium">{item.question}</h3>
                          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="p-4 pt-2 border-t">
                          <p className="text-muted-foreground">{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Kontakta oss sektion */}
            <div className="mt-16 text-center bg-muted/30 p-6 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl font-bold mb-2">
                Hittade du inte det du sökte?
              </h2>
              <p className="text-muted-foreground mb-6">
                Kontakta oss direkt så hjälper vi dig med dina frågor och funderingar.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">Kontakta oss</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">Utforska våra priser</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 