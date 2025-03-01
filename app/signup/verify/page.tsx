import Link from "next/link"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-8">
      <Link 
        href="/" 
        className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight animate-fade-in"
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          B
        </div>
        BrandSphereAI
      </Link>

      <Card className="w-full max-w-md overflow-hidden animate-slide-up">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Kontrollera din e-post</CardTitle>
          <CardDescription>
            Vi har skickat en verifieringslänk till din e-post. 
            Klicka på länken för att bekräfta ditt konto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Vi har skickat instruktioner till din e-postadress</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Hittar du inte e-postmeddelandet? Kontrollera din skräppost eller 
            så kan du begära en ny verifieringslänk.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full"
          >
            Skicka verifieringslänk igen
          </Button>
          <Link href="/login" className="w-full">
            <Button 
              variant="ghost" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till inloggning
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 