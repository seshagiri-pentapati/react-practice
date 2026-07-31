"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Github, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">React TypeScript Guide</h1>
            <span className="text-sm text-muted-foreground">by Seshagiri Pentapati</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Sun className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-foreground">React TypeScript Guide</h1>
          <span className="text-sm text-muted-foreground">by Seshagiri Pentapati</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">React Docs</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
