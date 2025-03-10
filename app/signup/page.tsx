"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Omdirigera till den nya registreringssidan
    router.push("/auth/register");
  }, [router]);

  // Visa laddningsindikator medan omdirigering sker
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Omdirigerar till registreringssidan...</p>
      </div>
    </div>
  );
} 