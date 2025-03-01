import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Kontakta oss
                  </h1>
                  <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl">
                    Har du frågor om våra tjänster eller behöver hjälp? 
                    Fyll i formuläret så återkommer vi till dig så snart som möjligt.
                  </p>
                </div>

                <div className="grid gap-4 md:gap-8">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">E-post</h3>
                      <p className="text-sm text-muted-foreground">
                        <a href="mailto:info@bolt.se" className="hover:underline">
                          info@bolt.se
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vi svarar vanligtvis inom 24 timmar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Telefon</h3>
                      <p className="text-sm text-muted-foreground">
                        <a href="tel:+46701234567" className="hover:underline">
                          +46 70 123 45 67
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mån-fre 9:00-17:00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Adress</h3>
                      <p className="text-sm text-muted-foreground">
                        Storgatan 1<br />
                        123 45 Stockholm<br />
                        Sverige
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Chatt</h3>
                      <p className="text-sm text-muted-foreground">
                        Vår chatt är öppen på hemsidan under kontorstid för direktsupport.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Förnamn</Label>
                      <Input id="first-name" placeholder="Ditt förnamn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Efternamn</Label>
                      <Input id="last-name" placeholder="Ditt efternamn" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-postadress</Label>
                    <Input id="email" type="email" placeholder="din@email.se" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Ämne</Label>
                    <Input id="subject" placeholder="Vad gäller ditt meddelande?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Meddelande</Label>
                    <Textarea
                      id="message"
                      placeholder="Skriv ditt meddelande här..."
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Skicka meddelande
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Genom att skicka detta formulär godkänner du vår{" "}
                    <a href="/privacy" className="underline underline-offset-2">
                      integritetspolicy
                    </a>
                    .
                  </p>
                </form>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-[800px] mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold mb-4">Vanliga frågor</h2>
              <p className="text-muted-foreground mb-8">
                Nedan hittar du svar på några vanligt förekommande frågor, 
                men tveka inte att kontakta oss om du har ytterligare funderingar.
              </p>
              <div className="grid gap-6 md:grid-cols-2 text-left">
                {[
                  {
                    question: "Hur lång tid tar det innan ni svarar?",
                    answer: "Vi strävar efter att svara på alla förfrågningar inom 24 timmar under vardagar."
                  },
                  {
                    question: "Kan jag boka ett videomöte?",
                    answer: "Absolut! Ange gärna i ditt meddelande att du önskar ett videomöte så återkommer vi med förslag på tider."
                  },
                  {
                    question: "Erbjuder ni kundanpassade lösningar?",
                    answer: "Ja, vi skräddarsyr lösningar för företag med specifika behov. Kontakta vår försäljningsavdelning för mer information."
                  },
                  {
                    question: "Hur kan jag rapportera ett tekniskt problem?",
                    answer: "Du kan rapportera problem via formuläret ovan eller kontakta vår support direkt på support@bolt.se."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg bg-card border">
                    <h3 className="font-medium mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 