import { SectionWrapper, ConceptCard, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { TYPESCRIPT_QUESTIONS } from '@/lib/interview-data'

const TS_VERSIONS = [
  { version: 'TS 4.1', highlight: 'Template Literal Types, Recursive Conditional Types' },
  { version: 'TS 4.4', highlight: 'Symbol & Template String Indexes, Class Static Blocks' },
  { version: 'TS 4.5', highlight: 'Awaited<T>, Import Type Modifier, Tail Recursion Optimization' },
  { version: 'TS 4.7', highlight: 'ES Modules in Node, Variance Annotations, Object.hasOwn' },
  { version: 'TS 4.9', highlight: 'satisfies operator, Auto Accessors, const type parameters' },
  { version: 'TS 5.0', highlight: 'const Type Parameters, enum improvements, --verbatimModuleSyntax' },
  { version: 'TS 5.2', highlight: 'using / await using (Explicit Resource Management)' },
  { version: 'TS 5.4', highlight: 'NoInfer<T>, Preserved Narrowing in Closures, Array.fromAsync' },
  { version: 'TS 5.5', highlight: 'Inferred Type Predicates, Regular Expression Syntax Checking' },
]

const SATISFIES_CODE = `// TS 4.9+ satisfies operator
// Problem: 'as' loses type info, direct annotation is too strict
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, string | number[]>;

// Still knows red is number[] (not string | number[])
palette.red.map(x => x);      // OK — TypeScript knows it's number[]
palette.green.toUpperCase();  // OK — TypeScript knows it's string

// In slot games: validate symbol config shape while keeping precise types
const SYMBOL_CONFIG = {
  wild:    { multiplier: 10, animated: true,  frames: 8 },
  scatter: { multiplier: 0,  animated: true,  frames: 12 },
  seven:   { multiplier: 100, animated: false, frames: 1 },
} satisfies Record<string, { multiplier: number; animated: boolean; frames: number }>;

// TypeScript still knows seven.animated is false (literal), not boolean
`

const USING_CODE = `// TS 5.2 using / await using — Explicit Resource Management
// Automatically disposes resources when leaving scope

class PixiAppManager implements Disposable {
  private app: PIXI.Application;

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application();
    this.app.init({ canvas });
  }

  [Symbol.dispose]() {
    // Called automatically when block exits
    this.app.destroy(true, { children: true, texture: true });
    console.log('PixiJS app destroyed');
  }
}

// Usage — no need for try/finally
function initGame(canvas: HTMLCanvasElement) {
  using manager = new PixiAppManager(canvas);
  // ... setup game ...
  // manager.[Symbol.dispose]() called automatically here
}

// Async version for database connections, fetch cleanup etc.
async function loadSlotAssets() {
  await using loader = new AsyncAssetLoader();
  const assets = await loader.load(['symbols.atlas', 'reels.json']);
  return assets;
  // loader cleanup runs automatically
}
`

export function TypeScriptSection() {
  return (
    <SectionWrapper
      badge="TypeScript"
      title="TypeScript Deep Dive"
      subtitle="Advanced TypeScript patterns, utility types, generics, and modern features essential for slot game frontend development. Covers TS 4.x through 5.x with real gaming examples."
    >
      {/* Version Timeline */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">TypeScript Version History — What to Know</h3>
        <div className="space-y-1.5">
          {TS_VERSIONS.map(v => (
            <div key={v.version} className="flex items-start gap-3 p-2.5 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
              <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5 flex-shrink-0">{v.version}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">{v.highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key concepts grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard title="Type System Fundamentals" accent>
          <p>TypeScript is a <strong className="text-foreground">structural type system</strong> — types are compatible if shapes match, not names.</p>
          <p>Core hierarchy: <span className="font-mono text-primary">unknown</span> (top type) → specific types → <span className="font-mono text-primary">never</span> (bottom type)</p>
          <p><strong className="text-foreground">Type widening</strong>: <code className="font-mono">let x = 5</code> infers <code>number</code>, not <code>5</code>. Use <code className="font-mono text-primary">const</code> or <code>as const</code> for literal types.</p>
        </ConceptCard>

        <ConceptCard title="Generics — The Core of Reusability">
          <p>Generics are <strong className="text-foreground">type parameters</strong> — placeholders for types determined at call-site.</p>
          <p>Constraints (<code className="font-mono text-primary">T extends X</code>) restrict what types are valid and enable property access.</p>
          <p>Default type params (<code className="font-mono text-primary">T = string</code>) work like function default args since TS 2.3.</p>
        </ConceptCard>

        <ConceptCard title="Type Narrowing">
          <p>TypeScript tracks control flow to narrow union types:</p>
          <ul className="space-y-0.5 mt-1">
            <li>• <code className="font-mono text-primary">typeof x === 'string'</code> — primitive check</li>
            <li>• <code className="font-mono text-primary">x instanceof SlotMachine</code> — class check</li>
            <li>• <code className="font-mono text-primary">x.status === 'win'</code> — discriminant narrowing</li>
            <li>• <code className="font-mono text-primary">in</code> operator — property existence</li>
            <li>• User-defined type guards: <code className="font-mono text-primary">x is WinState</code></li>
          </ul>
        </ConceptCard>

        <ConceptCard title="Declaration Merging & Module Augmentation">
          <p>Interfaces can be merged across files — useful for extending third-party types like PixiJS:</p>
          <p><code className="font-mono text-xs text-primary">declare module &apos;pixi.js&apos; &#123; interface Container &#123; slotData?: SlotMeta &#125; &#125;</code></p>
          <p>Namespace merging lets you add static members to classes without modifying originals.</p>
        </ConceptCard>
      </div>

      {/* Modern TS features */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Must-Know Modern Features</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono uppercase">satisfies operator (TS 4.9)</p>
            <CodeBlock code={SATISFIES_CODE} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono uppercase">using / await using (TS 5.2)</p>
            <CodeBlock code={USING_CODE} />
          </div>
        </div>
      </div>

      {/* Q&A */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Interview Questions & Coding Challenges
        </h3>
        <QuestionList>
          {TYPESCRIPT_QUESTIONS.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </QuestionList>
      </div>
    </SectionWrapper>
  )
}
