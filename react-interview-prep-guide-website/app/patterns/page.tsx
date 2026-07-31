import { ComponentPatterns } from "@/components/patterns/component-patterns"
import { NavigationFooter } from "@/components/navigation-footer"

export default function PatternsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentPatterns />
      <NavigationFooter />
    </div>
  )
}
