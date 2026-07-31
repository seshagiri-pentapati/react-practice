import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  title: string
  subtitle: string
  badge: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({ title, subtitle, badge, children, className }: SectionWrapperProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="border-b border-border pb-4">
        <span className="inline-block text-[10px] font-mono text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 rounded px-2 py-0.5 mb-2">
          {badge}
        </span>
        <h2 className="text-2xl font-bold text-foreground text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

interface ConceptCardProps {
  title: string
  children: React.ReactNode
  accent?: boolean
}

export function ConceptCard({ title, children, accent }: ConceptCardProps) {
  return (
    <div className={cn(
      'rounded-lg border p-4',
      accent ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
    )}>
      <h4 className={cn(
        'text-sm font-semibold mb-2',
        accent ? 'text-primary' : 'text-foreground'
      )}>
        {title}
      </h4>
      <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}

interface InfoGridProps {
  items: { label: string; value: string; accent?: boolean }[]
}

export function InfoGrid({ items }: InfoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map(item => (
        <div
          key={item.label}
          className={cn(
            'rounded-lg border p-3 text-center',
            item.accent ? 'bg-primary/10 border-primary/25' : 'bg-card border-border'
          )}
        >
          <p className={cn('text-lg font-bold font-mono', item.accent ? 'text-primary' : 'text-foreground')}>
            {item.value}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export function QuestionList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>
}
