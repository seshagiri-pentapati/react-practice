import { PerformanceAndTesting } from "@/components/performance/performance-and-testing"
import { NavigationFooter } from "@/components/navigation-footer"

export default function PerformancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PerformanceAndTesting />
      <NavigationFooter />
    </div>
  )
}
