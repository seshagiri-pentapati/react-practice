import { HooksOverview } from "@/components/hooks/hooks-overview"
import { BuiltInHooks } from "@/components/hooks/built-in-hooks"
import { CustomHooks } from "@/components/hooks/custom-hooks"
import { ContextAPI } from "@/components/hooks/context-api"
import { StatePatterns } from "@/components/hooks/state-patterns"
import { NavigationFooter } from "@/components/navigation-footer"

export default function HooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HooksOverview />

      <div id="built-in-hooks" className="scroll-mt-20">
        <BuiltInHooks />
      </div>

      <div id="custom-hooks" className="scroll-mt-20">
        <CustomHooks />
      </div>

      <div id="context-api" className="scroll-mt-20">
        <ContextAPI />
      </div>

      <div id="state-patterns" className="scroll-mt-20">
        <StatePatterns />
      </div>

      <NavigationFooter />
    </div>
  )
}
