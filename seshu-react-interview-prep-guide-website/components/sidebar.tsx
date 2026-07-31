"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, BookOpen, Code, Zap, Layers, Rocket, TestTube, Home, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionItem {
  id: string
  title: string
  href: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  subsections?: { title: string; href: string }[]
}

const sections: SectionItem[] = [
  {
    id: "home",
    title: "Getting Started",
    href: "/",
    level: "beginner",
  },
  {
    id: "fundamentals",
    title: "React Fundamentals",
    href: "/fundamentals",
    level: "beginner",
    subsections: [
      { title: "JSX & Components", href: "/fundamentals#jsx-components" },
      { title: "Props & State", href: "/fundamentals#props-state" },
      { title: "Event Handling", href: "/fundamentals#event-handling" },
      { title: "Conditional Rendering", href: "/fundamentals#conditional-rendering" },
    ],
  },
  {
    id: "hooks",
    title: "Hooks & State Management",
    href: "/hooks",
    level: "intermediate",
    subsections: [
      { title: "Built-in Hooks", href: "/hooks#built-in-hooks" },
      { title: "Custom Hooks", href: "/hooks#custom-hooks" },
      { title: "Context API", href: "/hooks#context-api" },
      { title: "State Patterns", href: "/hooks#state-patterns" },
    ],
  },
  {
    id: "patterns",
    title: "Component Patterns",
    href: "/patterns",
    level: "intermediate",
    subsections: [
      { title: "Composition Patterns", href: "/patterns#composition" },
      { title: "Design Patterns", href: "/patterns#design" },
      { title: "TypeScript Patterns", href: "/patterns#typescript" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced React Features",
    href: "/advanced",
    level: "advanced",
    subsections: [
      { title: "Concurrent Features", href: "/advanced#concurrent" },
      { title: "Suspense & Loading", href: "/advanced#suspense" },
      { title: "Error Boundaries", href: "/advanced#boundaries" },
    ],
  },
  {
    id: "performance",
    title: "Performance & Testing",
    href: "/performance",
    level: "expert",
    subsections: [
      { title: "Performance Optimization", href: "/performance#performance" },
      { title: "Profiling & Debugging", href: "/performance#profiling" },
      { title: "Testing Strategies", href: "/performance#testing" },
    ],
  },
  {
    id: "react-latest",
    title: "React 2025-2026 Updates",
    href: "/react-latest",
    level: "expert",
    subsections: [
      { title: "Overview", href: "/react-latest#overview" },
      { title: "New Features", href: "/react-latest#new-features" },
      { title: "Breaking Changes", href: "/react-latest#breaking-changes" },
      { title: "TypeScript Changes", href: "/react-latest#typescript-changes" },
    ],
  },
]

const levelColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const sectionIcons = {
  home: Home,
  fundamentals: BookOpen,
  hooks: Zap,
  patterns: Layers,
  advanced: Rocket,
  performance: TestTube,
  "react-latest": Sparkles,
}

export function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["fundamentals"])
  const pathname = usePathname()

  const [visitedSections, setVisitedSections] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const currentSection = sections.find((section) =>
      section.href === "/" ? pathname === "/" : pathname.startsWith(section.href),
    )

    if (currentSection && !visitedSections.includes(currentSection.id)) {
      const newVisited = [...visitedSections, currentSection.id]
      setVisitedSections(newVisited)

      // Calculate progress based on visited sections
      const progressPercentage = Math.round((newVisited.length / sections.length) * 100)
      setProgress(progressPercentage)
    }
  }, [pathname, visitedSections])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const isActiveSection = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-80 bg-card border-r h-screen sticky top-0 flex-shrink-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-blue-600" />
            <h2 className="font-bold text-lg">React Guide</h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Complete React interview preparation</p>
        </div>

        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-2 py-4">
            {sections.map((section) => {
              const Icon = sectionIcons[section.id as keyof typeof sectionIcons]
              const isExpanded = expandedSections.includes(section.id)
              const isActive = isActiveSection(section.href)
              const isVisited = visitedSections.includes(section.id)

              return (
                <div key={section.id} className="space-y-1">
                  <div className="flex items-center">
                    <Link href={section.href} className="flex-1">
                      <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start h-auto p-2">
                  <div className="flex items-center space-x-2 flex-1">
                          {Icon ? <Icon className={cn("h-4 w-4", isVisited ? "text-green-600" : "text-muted-foreground")} /> : <Code className={cn("h-4 w-4", isVisited ? "text-green-600" : "text-muted-foreground")} />}
                          <span className="text-sm font-medium">{section.title}</span>
                          <Badge variant="secondary" className={cn("text-xs", levelColors[section.level])}>
                            {section.level}
                          </Badge>
                          {isVisited && <div className="w-2 h-2 bg-green-600 rounded-full ml-auto" />}
                        </div>
                      </Button>
                    </Link>
                    {section.subsections && (
                      <Button variant="ghost" size="sm" className="ml-1 p-1" onClick={() => toggleSection(section.id)}>
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>

                  {isExpanded && section.subsections && (
                    <div className="ml-6 space-y-1">
                      {section.subsections.map((subsection) => (
                        <Link key={subsection.href} href={subsection.href}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto p-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            {subsection.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="border-t pt-4 pb-4">
            <div className="px-2">
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Progress Tracker</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Completion</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {visitedSections.length} of {sections.length} sections completed
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
