"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language: string
  title?: string
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <Card className="relative">
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <span className="text-sm font-medium text-muted-foreground">{title || language.toUpperCase()}</span>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-card">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </Card>
  )
}
