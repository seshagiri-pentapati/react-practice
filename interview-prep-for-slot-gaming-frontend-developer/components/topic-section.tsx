'use client'

import { QuestionCard } from '@/components/question-card'
import type { CodeQuestion } from '@/lib/interview-data'

interface TopicSectionProps {
  title: string
  description: string
  questions: CodeQuestion[]
  badge?: string
}

export function TopicSection({ title, description, questions, badge }: TopicSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        {badge && (
          <span className="flex-shrink-0 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))}
      </div>
    </section>
  )
}
