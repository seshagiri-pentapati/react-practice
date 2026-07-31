'use client'

import { useState } from 'react'
import { HeroHeader, HeroBanner } from '@/components/hero-header'
import { SidebarNav } from '@/components/sidebar-nav'
import { InterviewTimer } from '@/components/interview-timer'
import { TypeScriptSection } from '@/components/sections/typescript-section'
import { ReactSection } from '@/components/sections/react-section'
import { PixiSection } from '@/components/sections/pixi-section'
import { SlotSection } from '@/components/sections/slot-section'
import { PerformanceSection } from '@/components/sections/performance-section'
import { WebSocketSection } from '@/components/sections/websocket-section'
import { LiveCodingSection } from '@/components/sections/livecoding-section'
import { TOPICS } from '@/lib/interview-data'

const SECTION_MAP: Record<string, React.ComponentType> = {
  typescript: TypeScriptSection,
  react: ReactSection,
  pixijs: PixiSection,
  slot: SlotSection,
  performance: PerformanceSection,
  websocket: WebSocketSection,
  livecoding: LiveCodingSection,
}

export default function Page() {
  const [activeSection, setActiveSection] = useState('typescript')
  const ActiveComponent = SECTION_MAP[activeSection] ?? TypeScriptSection

  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <InterviewTimer />
              <nav className="p-3 rounded-lg bg-card border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">Topics</p>
                <SidebarNav
                  topics={TOPICS}
                  activeId={activeSection}
                  onSelect={setActiveSection}
                />
              </nav>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Mobile topic switcher */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 snap-x">
              {TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setActiveSection(topic.id)}
                  className={`flex-shrink-0 snap-start px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeSection === topic.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <div className="fade-in-up">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
