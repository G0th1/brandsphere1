"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Check, AlertCircle, ArrowRight, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Översättningar
const translations = {
  en: {
    title: "Contact Us",
    subtitle: "Do you have questions about our services or need help? Fill out the form and we'll get back to you as soon as possible.",
    email: "Email",
    emailResponse: "We usually respond within 24 hours",
    chat: "Chat",
    chatSupport: "Our chat is open on the website during business hours for direct support.",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    subject: "Subject",
    message: "Message",
    sendMessage: "Send Message",
    sending: "Sending...",
    privacy: "By submitting this form, you agree to our",
    privacyPolicy: "privacy policy",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Below you'll find answers to some common questions, but don't hesitate to contact us if you have further inquiries.",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email address",
    messageSent: "Message sent!",
    messageSentDesc: "Thank you for contacting us. We'll get back to you as soon as possible.",
    messageError: "Error sending message",
    messageErrorDesc: "There was an error submitting your message. Please try again.",
    viewAllFaqs: "View all FAQs",
    faqs: [
      {
        question: "How long does it take before you respond?",
        answer: "We strive to respond to all inquiries within 24 hours during weekdays."
      },
      {
        question: "Can I book a video meeting?",
        answer: "Absolutely! Please indicate in your message that you would like a video meeting and we'll get back to you with suggested times."
      },
      {
        question: "Do you offer customized solutions?",
        answer: "Yes, we tailor solutions for companies with specific needs. Contact our sales department for more information."
      },
      {
        question: "How can I report a technical problem?",
        answer: "You can report problems via the form above or contact our support directly at BrandsphereaI@gmail.com."
      }
    ]
  },
  sv: {
    title: "Kontakta oss",
    subtitle: "Har du frågor om våra tjänster eller behöver hjälp? Fyll i formuläret så återkommer vi till dig så snart som möjligt.",
    email: "E-post",
    emailResponse: "Vi svarar vanligtvis inom 24 timmar",
    chat: "Chatt",
    chatSupport: "Vår chatt är öppen på hemsidan under kontorstid för direktsupport.",
    firstName: "Förnamn",
    lastName: "Efternamn",
    emailAddress: "E-postadress",
    subject: "Ämne",
    message: "Meddelande",
    sendMessage: "Skicka meddelande",
    sending: "Skickar...",
    privacy: "Genom att skicka detta formulär godkänner du vår",
    privacyPolicy: "integritetspolicy",
    faqTitle: "Vanliga frågor",
    faqSubtitle: "Nedan hittar du svar på några vanligt förekommande frågor, men tveka inte att kontakta oss om du har ytterligare funderingar.",
    requiredField: "Detta fält är obligatoriskt",
    invalidEmail: "Ange en giltig e-postadress",
    messageSent: "Meddelande skickat!",
    messageSentDesc: "Tack för att du kontaktar oss. Vi återkommer till dig så snart som möjligt.",
    messageError: "Fel vid sändning av meddelandet",
    messageErrorDesc: "Det uppstod ett fel när meddelandet skulle skickas. Vänligen försök igen.",
    viewAllFaqs: "Se alla vanliga frågor",
    faqs: [
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
        answer: "Du kan rapportera problem via formuläret ovan eller kontakta vår support direkt på BrandsphereaI@gmail.com."
      }
    ]
  }
};

// Validera e-post
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language];

  // Formulärtillstånd
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  // Fel och statusar
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Uppdatera formulärvärden
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));

    // Rensa fel när användaren börjar skriva igen
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Validera formulär
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Kontrollera obligatoriska fält
    if (!formState.firstName.trim()) newErrors.firstName = t.requiredField;
    if (!formState.email.trim()) newErrors.email = t.requiredField;
    else if (!isValidEmail(formState.email)) newErrors.email = t.invalidEmail;
    if (!formState.message.trim()) newErrors.message = t.requiredField;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hantera formulärinsändning
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validera först
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulera API-anrop med setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');

      // Återställ formuläret vid framgång
      if (Math.random() > 0.1) { // 90% chans för framgång
        setFormState({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    }, 1500);
  };

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
                    {t.title}
                  </h1>
                  <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl">
                    {t.subtitle}
                  </p>
                </div>

                <div className="grid gap-4 md:gap-8">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">{t.email}</h3>
                      <p className="text-sm text-muted-foreground">
                        <a href="mailto:BrandsphereaI@gmail.com" className="hover:underline">
                          BrandsphereaI@gmail.com
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.emailResponse}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">{t.chat}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.chatSupport}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status alerts */}
                {submitStatus === 'success' && (
                  <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                    <Check className="h-4 w-4 stroke-green-600 dark:stroke-green-400" />
                    <AlertTitle>{t.messageSent}</AlertTitle>
                    <AlertDescription>{t.messageSentDesc}</AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t.messageError}</AlertTitle>
                    <AlertDescription>{t.messageErrorDesc}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-1">
                        {t.firstName} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formState.firstName}
                        onChange={handleChange}
                        placeholder={t.firstName}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t.lastName}</Label>
                      <Input
                        id="lastName"
                        value={formState.lastName}
                        onChange={handleChange}
                        placeholder={t.lastName}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      {t.emailAddress} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder={language === 'en' ? "your@email.com" : "din@email.se"}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t.subject}</Label>
                    <Input
                      id="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      placeholder={language === 'en' ? "What is your message about?" : "Vad gäller ditt meddelande?"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center gap-1">
                      {t.message} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder={language === 'en' ? "Write your message here..." : "Skriv ditt meddelande här..."}
                      className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.sending}
                      </>
                    ) : t.sendMessage}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t.privacy}{" "}
                    <a href="/privacy" className="underline underline-offset-2">
                      {t.privacyPolicy}
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
              <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
              <p className="text-muted-foreground mb-8">
                {t.faqSubtitle}
              </p>
              <div className="grid gap-6 md:grid-cols-2 text-left">
                {t.faqs.map((faq, index) => (
                  <div key={index} className="p-5 rounded-lg bg-card border hover:shadow-md transition-shadow duration-200">
                    <h3 className="font-medium mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" className="gap-2">
                  {t.viewAllFaqs}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 