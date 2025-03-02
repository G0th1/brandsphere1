import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { sv } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "SEK", locale = "sv-SE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: Date) {
  return format(new Date(date), "PPP", { locale: sv })
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "" // Browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
} 