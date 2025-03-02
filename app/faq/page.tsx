"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import { Metadata } from "next"
import { useLanguage } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: 'Vanliga frågor | BrandSphereAI',
  description: 'Hitta svar på de vanligaste frågorna om BrandSphereAI, våra tjänster, priser och hur du kommer igång.',
  openGraph: {
    title: 'Vanliga frågor | BrandSphereAI',
    description: 'Hitta svar på de vanligaste frågorna om BrandSphereAI, våra tjänster och hur du kommer igång.'
  }
};

// Översättningar och FAQ-data
const translations = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to the most common questions about BrandSphereAI and our services.",
    notFound: "Didn't find what you were looking for?",
    contactUs: "Contact us",
    explorePricing: "Explore our pricing",
    categories: [
      {
        title: "Getting Started",
        questions: [
          {
            question: "How do I create an account?",
            answer: "It's easy to create an account with us. Click on 'Sign up' in the menu and follow the instructions. You can start with a 14-day free trial without committing to any payment."
          },
          {
            question: "Do I need a credit card to try it?",
            answer: "No, you don't need to enter any credit card information to try our service. The 14-day free trial period is completely without obligation."
          },
          {
            question: "Which social media platforms are supported?",
            answer: "We currently support YouTube and Facebook integration. We're constantly working on integrating more platforms to provide you with a comprehensive social media management solution. Our roadmap includes upcoming integrations with Instagram, Twitter, LinkedIn, and TikTok."
          },
          {
            question: "How do I connect my social media accounts?",
            answer: "After you've registered, go to the 'Connect Accounts' section in your dashboard. There you can easily connect your accounts through authentication via the respective platform."
          }
        ]
      },
      {
        title: "Plans and Pricing",
        questions: [
          {
            question: "Which plan suits me best?",
            answer: "It depends on your needs. For small businesses and solopreneurs, the Pro plan works well. For larger teams or companies with multiple brands, we recommend the Business plan. You can always start with a free plan and upgrade later."
          },
          {
            question: "Can I change plans later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Billing changes will take effect at the next billing period."
          },
          {
            question: "Is there a discount for annual billing?",
            answer: "Yes, you get a 20% discount when you choose annual billing instead of monthly billing."
          },
          {
            question: "How does team management work in the Business plan?",
            answer: "With the Business plan, you can invite an unlimited number of team members and set different permission levels for each. This makes it easy to collaborate on content creation and publishing."
          }
        ]
      },
      {
        title: "Features",
        questions: [
          {
            question: "How does AI content generation work?",
            answer: "Our AI analyzes your brand, target audience, and previously successful content to generate new suggestions. You can give the AI instructions like 'Create an Instagram post about our new product launch' and get multiple suggestions for text and image concepts."
          },
          {
            question: "Can I schedule posts in advance?",
            answer: "Yes, you can schedule posts to all your social media platforms in advance. Our Smart Schedule feature also suggests optimal posting times based on when your audience is most active."
          },
          {
            question: "What type of analytics do you offer?",
            answer: "We offer comprehensive analytics including reach, engagement, follower growth, optimal posting time, content performance, and demographic information about your audience. Pro and Business plans offer more in-depth analytics and custom reports."
          },
          {
            question: "Can I collaborate with my team?",
            answer: "Yes, you can invite team members to collaborate. Different people can have different roles such as content creator, reviewer, publisher, or administrator, depending on your plan."
          }
        ]
      },
      {
        title: "Support and Security",
        questions: [
          {
            question: "How secure are my social media accounts?",
            answer: "We use industry standard OAuth authentication to connect to your accounts, which means we never store your passwords. All communication is encrypted and we strictly follow GDPR and other data protection laws."
          },
          {
            question: "What happens if I need help?",
            answer: "We offer email support to all users. Pro customers get priority support, and Business customers also get phone support and a dedicated contact person."
          },
          {
            question: "Can I get a personal demonstration of the platform?",
            answer: "Absolutely! You can book a personal demonstration by contacting our sales team via the contact page or by clicking 'Book a demo' on the pricing page."
          },
          {
            question: "How often is the platform updated with new features?",
            answer: "We release new features and improvements regularly, usually every three to four weeks. Major updates are always announced in advance via email and in the platform."
          }
        ]
      }
    ]
  },
  sv: {
    title: "Vanliga frågor",
    subtitle: "Hitta svar på de vanligaste frågorna om BrandSphereAI och våra tjänster.",
    notFound: "Hittade du inte det du sökte?",
    contactUs: "Kontakta oss",
    explorePricing: "Utforska våra priser",
    categories: [
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
            answer: "Vi stöder för närvarande YouTube och Facebook-integration. Vi arbetar ständigt med att integrera fler plattformar för att ge dig en omfattande lösning för hantering av sociala medier. Vår utvecklingsplan inkluderar kommande integreringar med Instagram, Twitter, LinkedIn och TikTok."
          },
          {
            question: "Hur ansluter jag mina sociala mediekonton?",
            answer: "Efter att du har registrerat dig går du till 'Anslut konton' i din instrumentpanel. Där kan du enkelt ansluta dina konton genom autentisering via respektive plattform."
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
    ]
  }
};

export default function FAQPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center animate-fade-in mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                {t.title}
              </h1>
              <p className="text-muted-foreground md:text-lg">
                {t.subtitle}
              </p>
            </div>

            {/* FAQ Kategorier */}
            <div className="grid gap-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t.categories.map((category, categoryIndex) => (
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
                {t.notFound}
              </h2>
              <p className="text-muted-foreground mb-6">

              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">{t.contactUs}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">{t.explorePricing}</Link>
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