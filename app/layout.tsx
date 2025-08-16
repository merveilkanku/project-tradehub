import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/hooks/use-theme"
import "./globals.css"

export const metadata: Metadata = {
  title: "TradHub - Marketplace Africain",
  description: "Plateforme de commerce électronique pour l'Afrique francophone",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="tradehub-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
