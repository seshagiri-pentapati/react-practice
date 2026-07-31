import { WelcomeSection } from "@/components/welcome-section"
import { NavigationFooter } from "@/components/navigation-footer"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeSection />
      <NavigationFooter />
    </div>
  )
}
