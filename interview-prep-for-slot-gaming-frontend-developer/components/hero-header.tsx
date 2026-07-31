import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const STACK_BADGES = [
  { label: 'TypeScript', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { label: 'React 18/19', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { label: 'PixiJS v7/v8', color: 'bg-primary/15 text-primary border-primary/30' },
  { label: 'WebGL', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { label: 'Slot Gaming', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
]

const STATS = [
  { value: '6', label: 'Topic Sections' },
  { value: '90', label: 'Min Interview' },
  { value: '25+', label: 'Coding Q&As' },
  { value: '100%', label: 'With Solutions' },
]

export function HeroHeader() {
  return (
    <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="size-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm font-mono">
              SL
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm leading-tight">Slot Dev Interview Prep</h1>
              <p className="text-xs text-muted-foreground">PixiJS · React · TypeScript · 4.5 YOE Level</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-sm font-bold text-primary font-mono">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export function HeroBanner() {
  return (
    <div className="border-b border-border bg-card/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
            Frontend Interview Prep · Slot Gaming Company
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance mb-3">
            Master PixiJS, React & TypeScript for Your{' '}
            <span className="text-primary">90-Minute Live Coding</span> Interview
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
            Everything you need to ace a frontend developer interview at a slot gaming company.
            Deep dives into PixiJS animation, TypeScript advanced patterns, React performance,
            and real-world slot game scenarios — all with working code examples and explanations.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {STACK_BADGES.map(badge => (
              <span
                key={badge.label}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
