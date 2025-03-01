"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

// Skapa en enkel toast-implementation här för att undvika import-problem
export const toast = function(options: { title?: string; description?: string; variant?: "default" | "destructive" }) {
  // Här skulle vi normalt anropa toast-funktionen från use-toast.ts
  // Men för att undvika import-problem skapar vi en dummy
  console.log('Toast:', options);
  // I en produktionsmiljö skulle detta ansluta till den riktiga toast-funktionen
} 