'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'typescript', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = highlightTS(code)

  return (
    <div className={cn('code-block group relative', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre
        className="text-sm font-mono leading-relaxed overflow-x-auto p-4"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  )
}

// Simple TypeScript syntax highlighter
function highlightTS(code: string): string {
  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'extends', 'implements', 'interface', 'type', 'enum', 'namespace',
    'import', 'export', 'default', 'from', 'async', 'await', 'new', 'this',
    'typeof', 'instanceof', 'in', 'of', 'switch', 'case', 'break', 'continue',
    'try', 'catch', 'finally', 'throw', 'void', 'never', 'null', 'undefined',
    'true', 'false', 'readonly', 'private', 'public', 'protected', 'static',
    'abstract', 'override', 'declare', 'as', 'is', 'keyof', 'infer',
  ]
  const types = [
    'string', 'number', 'boolean', 'any', 'unknown', 'object', 'symbol',
    'bigint', 'Array', 'Promise', 'Record', 'Partial', 'Required', 'Readonly',
    'Pick', 'Omit', 'Exclude', 'Extract', 'ReturnType', 'Parameters', 'Map', 'Set',
  ]

  // Escape HTML
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Comments (single line)
  result = result.replace(/(\/\/[^\n]*)/g, '<span class="cmt">$1</span>')

  // Template literals (basic) — use [^`] for simple matching (no dotAll flag)
  result = result.replace(/(`[^`\n]*`)/g, (m) =>
    `<span class="str">${m}</span>`
  )

  // Strings
  result = result.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g,
    '<span class="str">$1</span>'
  )

  // Numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>')

  // Types
  types.forEach(type => {
    result = result.replace(
      new RegExp(`\\b(${type})\\b`, 'g'),
      '<span class="typ">$1</span>'
    )
  })

  // Keywords
  keywords.forEach(kw => {
    result = result.replace(
      new RegExp(`\\b(${kw})\\b`, 'g'),
      '<span class="kw">$1</span>'
    )
  })

  // Function names (word followed by open paren, not keyword)
  result = result.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*\()/g, (match, name, paren) => {
    if (keywords.includes(name)) return match
    return `<span class="fn">${name}</span>${paren}`
  })

  return result
}
