'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/code-block'
import { cn } from '@/lib/utils'
import type { CodeQuestion, Difficulty } from '@/lib/interview-data'

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Advanced:     'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Expert:       'bg-red-500/15 text-red-400 border-red-500/30',
}

interface QuestionCardProps {
  question: CodeQuestion
  index: number
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <article className="border border-border rounded-lg overflow-hidden bg-card transition-all duration-200 hover:border-primary/30">
      {/* Header */}
      <button
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-accent/30 transition-colors"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <span className="flex-shrink-0 size-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full border font-medium',
              DIFFICULTY_COLORS[question.difficulty]
            )}>
              {question.difficulty}
            </span>
            {question.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-foreground text-sm leading-snug">{question.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{question.description}</p>
        </div>

        <span className="flex-shrink-0 text-muted-foreground mt-1">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border/50 fade-in-up">
          {/* Concept box */}
          {question.concept && (
            <div className="mx-4 mt-4 flex gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/15">
              <Lightbulb className="size-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{question.concept}</p>
            </div>
          )}

          {/* Code */}
          <div className="p-4">
            <CodeBlock code={question.code} />
          </div>

          {/* Tags */}
          <div className="px-4 pb-3 flex flex-wrap gap-1.5 items-center">
            <Tag className="size-3 text-muted-foreground" />
            {question.tags.map(tag => (
              <span key={tag} className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                #{tag}
              </span>
            ))}
          </div>

          {/* Answer reveal */}
          <div className="border-t border-border/50 p-4">
            <button
              onClick={() => setShowAnswer(a => !a)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm font-medium',
                showAnswer
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-muted/30 border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{showAnswer ? 'Hide Answer & Explanation' : 'Reveal Answer & Explanation'}</span>
              {showAnswer ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {showAnswer && (
              <div className="mt-3 space-y-3 fade-in-up">
                <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {question.answer}
                  </p>
                </div>

                {question.keyPoints && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/15">
                    <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Key Points to Mention</p>
                    <ul className="space-y-1.5">
                      {question.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-0.5 flex-shrink-0">›</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
