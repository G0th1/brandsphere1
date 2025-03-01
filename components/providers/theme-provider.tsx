"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Använd any för att komma runt typfelet tills vi kan installera rätt typdefinitioner
type ThemeProviderProps = {
  children: React.ReactNode;
  [key: string]: any;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 