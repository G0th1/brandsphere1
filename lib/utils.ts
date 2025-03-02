import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formaterar ett datum enligt önskat format
 */
export function formatDate(date: Date | string, formatString: string = "PPP") {
  return format(new Date(date), formatString)
}

/**
 * Hämtar bas-URL för applikationen
 */
export function getBaseUrl() {
  // Använd VERCEL_URL om tillgänglig, annars localhost
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

/**
 * Genererar en absolut URL genom att kombinera relativ path med bas-URL
 */
export function absoluteUrl(path: string) {
  return `${getBaseUrl()}${path}`
}
