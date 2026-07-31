"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CodeBlock } from "@/components/code-block"
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react"
import { useState } from "react"

interface InterviewQuestion {
  question: string
  answer: string
  code?: string
  difficulty?: "easy" | "medium" | "hard"
}

interface InterviewQuestionsProps {
  questions: InterviewQuestion[]
}

export function InterviewQuestions({ questions }: InterviewQuestionsProps) {
  const [openQuestions, setOpenQuestions] = useState<number[]>([])

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5" />
          <span>Interview Questions & Answers</span>
        </CardTitle>
        <CardDescription>Common interview questions with detailed explanations and code examples</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((q, index) => (
          <Collapsible key={index} open={openQuestions.includes(index)} onOpenChange={() => toggleQuestion(index)}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                {openQuestions.includes(index) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{q.question}</span>
              </div>
              {q.difficulty && (
                <Badge variant="secondary" className={difficultyColors[q.difficulty]}>
                  {q.difficulty}
                </Badge>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="mt-3 space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p>{q.answer}</p>
                </div>
                {q.code && <CodeBlock code={q.code} language="tsx" />}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}
