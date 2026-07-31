import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"

export const metadata: Metadata = {
  title: "Seshagiri Pentapati React Guide - Complete Interview Preparation",
  description: "Comprehensive React with TypeScript interview preparation guide from beginner to expert level",
  generator: "v0.app",
  keywords: "React, TypeScript, Interview, JavaScript, Frontend, Development, Guide",
  authors: [{ name: "Seshagiri Pentapati" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
              <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
                <div className="text-center text-sm text-muted-foreground">
                  © 2025 by Seshagiri Pentapati. All rights reserved.
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
