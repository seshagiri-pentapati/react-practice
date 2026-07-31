import { FundamentalsOverview } from "@/components/fundamentals/fundamentals-overview"
import { JSXComponents } from "@/components/fundamentals/jsx-components"
import { PropsAndState } from "@/components/fundamentals/props-and-state"
import { EventHandling } from "@/components/fundamentals/event-handling"
import { ConditionalRendering } from "@/components/fundamentals/conditional-rendering"
import { NavigationFooter } from "@/components/navigation-footer"

export default function FundamentalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FundamentalsOverview />

      <div id="jsx-components" className="scroll-mt-20">
        <JSXComponents />
      </div>

      <div id="props-state" className="scroll-mt-20">
        <PropsAndState />
      </div>

      <div id="event-handling" className="scroll-mt-20">
        <EventHandling />
      </div>

      <div id="conditional-rendering" className="scroll-mt-20">
        <ConditionalRendering />
      </div>

      <NavigationFooter />
    </div>
  )
}
