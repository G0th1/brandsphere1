"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyPage() {
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState("")
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // Try to get the email from localStorage if it was saved during signup
  useEffect(() => {
    // Säkerställ att vi är i webbläsaren innan vi använder localStorage
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("signupEmail")
      if (storedEmail) {
        setEmail(storedEmail)
      }
    }
  }, []) // Tom beroende-array för att köra endast vid montering

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email not found",
        description: "Please go back to the signup page and try again.",
        variant: "destructive"
      })
      return
    }

    setIsResending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link."
      })
    } catch (error) {
      console.error("Error resending verification:", error)
      toast({
        title: "Failed to resend verification",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive"
      })
    } finally {
      setIsResending(false)
    }
  }

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
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email.
            Click the link to confirm your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>We've sent instructions to {email ? email : "your email address"}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Can't find the email? Check your spam folder or
            you can request a new verification link.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend verification link"}
          </Button>
          <Link href="/login" className="w-full">
            <Button
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 