"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const navigationOrder = [
  { href: "/", title: "Getting Started" },
  { href: "/fundamentals", title: "React Fundamentals" },
  { href: "/hooks", title: "Hooks & State Management" },
  { href: "/patterns", title: "Component Patterns" },
  { href: "/advanced", title: "Advanced React Features" },
  { href: "/performance", title: "Performance & Testing" },
]

export function NavigationFooter() {
  const pathname = usePathname()
  const currentIndex = navigationOrder.findIndex((item) => item.href === pathname)

  const previousPage = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null
  const nextPage = currentIndex < navigationOrder.length - 1 ? navigationOrder[currentIndex + 1] : null

  if (currentIndex === -1) return null

  return (
    <div className="border-t mt-12 pt-8">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {previousPage && (
            <Link href={previousPage.href}>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <ChevronLeft className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="text-sm font-medium">{previousPage.title}</div>
                </div>
              </Button>
            </Link>
          )}
        </div>

        <div className="flex-1 text-center">
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} of {navigationOrder.length}
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          {nextPage && (
            <Link href={nextPage.href}>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="text-sm font-medium">{nextPage.title}</div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
