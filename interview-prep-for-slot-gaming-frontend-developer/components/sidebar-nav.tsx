'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import type { TopicSection } from '@/lib/interview-data'

interface SidebarNavProps {
  topics: TopicSection[]
  activeId: string
  onSelect: (id: string) => void
}

export function SidebarNav({ topics, activeId, onSelect }: SidebarNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavButtons = () => (
    <div className="space-y-1">
      {topics.map(topic => (
        <button
          key={topic.id}
          onClick={() => {
            onSelect(topic.id)
            setMobileOpen(false)
          }}
          className={cn(
            'w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group border',
            activeId === topic.id
              ? 'bg-primary/10 border-primary/20 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          <span className={cn(
            'flex-shrink-0 size-7 rounded flex items-center justify-center text-[10px] font-bold font-mono border transition-colors',
            activeId === topic.id
              ? 'bg-primary/20 border-primary/40 text-primary'
              : 'bg-muted/50 border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary/70'
          )}>
            {topic.icon}
          </span>
          <div className="min-w-0">
            <p className="font-medium truncate leading-snug">{topic.label}</p>
            <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">{topic.description}</p>
          </div>
        </button>
      ))}
    </div>
  )

  return (
    <>
      <NavButtons />

      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-72 h-full bg-card border-l border-border p-4 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">Topics</p>
            <NavButtons />
          </div>
        </div>
      )}
    </>
  )
}
