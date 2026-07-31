import { SectionWrapper, ConceptCard, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { REACT_QUESTIONS } from '@/lib/interview-data'

const HOOKS_REF_CODE = `// useRef — 3 use cases
import { useRef, useEffect } from 'react';

function SlotCanvas() {
  // 1. DOM reference (typed)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 2. Mutable value that doesn't trigger re-render
  //    Perfect for PixiJS app instance — we don't want React to manage it
  const pixiAppRef = useRef<PIXI.Application | null>(null);

  // 3. Track previous value across renders
  const prevBalanceRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize PixiJS — stored in ref, not state
    pixiAppRef.current = new PIXI.Application();
    pixiAppRef.current.init({ canvas: canvasRef.current });

    return () => {
      // Cleanup on unmount
      pixiAppRef.current?.destroy(true);
      pixiAppRef.current = null;
    };
  }, []); // Empty deps = runs once on mount

  return <canvas ref={canvasRef} />;
}
`

const USE_EFFECT_CODE = `// useEffect — the most commonly misunderstood hook
import { useEffect, useRef } from 'react';

function ReelAnimation({ isSpinning }: { isSpinning: boolean }) {
  const tickerRef = useRef<PIXI.Ticker | null>(null);

  // Effect runs after render, not during
  useEffect(() => {
    if (isSpinning) {
      // Start animation
      tickerRef.current = new PIXI.Ticker();
      tickerRef.current.add((delta) => {
        // Update reel positions
      });
      tickerRef.current.start();
    } else {
      // Stop and clean up
      tickerRef.current?.stop();
      tickerRef.current?.destroy();
      tickerRef.current = null;
    }

    // Cleanup function — runs before next effect OR on unmount
    return () => {
      tickerRef.current?.destroy();
      tickerRef.current = null;
    };
  }, [isSpinning]); // Re-runs when isSpinning changes

  // COMMON MISTAKES:
  // 1. Missing deps — stale closure bugs
  // 2. Not cleaning up — memory leaks in PixiJS
  // 3. Fetching data in useEffect — use SWR/React Query instead
  // 4. Setting state inside effect without deps — infinite loop
}
`

const REACT19_CODE = `// React 19 Key Features

// 1. use() hook — replaces useContext and simplifies async
import { use, Suspense } from 'react';

const SlotConfigContext = createContext<Promise<SlotConfig>>(null!);

function SlotInfo() {
  // use() can unwrap Context AND Promises
  const config = use(SlotConfigContext);
  return <div>RTP: {config.rtp}%</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SlotInfo />
    </Suspense>
  );
}

// 2. Server Actions (Next.js) — async functions that run on server
// 'use server' directive
async function saveHighScore(score: number) {
  'use server';
  await db.insert({ score, timestamp: Date.now() });
}

// 3. useOptimistic — instant UI updates with rollback
import { useOptimistic } from 'react';

function BalanceDisplay({ balance }: { balance: number }) {
  const [optimisticBalance, addOptimistic] = useOptimistic(
    balance,
    (current, bet: number) => current - bet
  );

  return <div>Balance: {optimisticBalance}</div>;
}

// 4. useFormStatus — form submission state
import { useFormStatus } from 'react-dom';

function SpinButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Spinning...' : 'SPIN'}</button>;
}
`

export function ReactSection() {
  return (
    <SectionWrapper
      badge="React + TypeScript"
      title="React with TypeScript"
      subtitle="React hooks, patterns, performance optimization, and React 19 new features — with slot game context. Covers component patterns, state management, and PixiJS integration with React."
    >
      {/* React + PixiJS integration */}
      <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">Critical: React + PixiJS Integration Strategy</h3>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p><strong className="text-foreground">Do NOT manage PixiJS state in React state.</strong> React state triggers re-renders. PixiJS manages its own render loop via Ticker.</p>
          <p>Use <code className="font-mono text-amber-400">useRef</code> to hold the PixiJS Application instance. Use <code className="font-mono text-amber-400">useEffect</code> to initialize and clean up. Bridge React UI (bet, balance) with game events via callbacks.</p>
          <p>The architecture: <strong className="text-foreground">React UI Layer</strong> (state/controls) ↔ <strong className="text-foreground">Event Bridge</strong> (callbacks/EventEmitter) ↔ <strong className="text-foreground">PixiJS Game Layer</strong> (canvas/WebGL)</p>
        </div>
      </div>

      {/* Core hooks */}
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard title="Hook Rules — Always Enforced">
          <ul className="space-y-1">
            <li>• Only call hooks at <strong className="text-foreground">top level</strong> (not inside loops, conditions)</li>
            <li>• Only call hooks in <strong className="text-foreground">React functions</strong> (components, custom hooks)</li>
            <li>• Custom hooks must start with <code className="font-mono text-primary">use</code></li>
            <li>• Hooks run in the <strong className="text-foreground">same order</strong> every render — no branching</li>
          </ul>
        </ConceptCard>

        <ConceptCard title="useState vs useReducer">
          <p><strong className="text-foreground">useState:</strong> simple primitive values, independent pieces of state</p>
          <p><strong className="text-foreground">useReducer:</strong> multiple related sub-values, state that depends on previous state, complex transitions like spin state machines</p>
          <p>Rule: if you have 3+ useState calls managing related state, refactor to useReducer.</p>
        </ConceptCard>

        <ConceptCard title="useRef vs useState">
          <p><strong className="text-foreground">useState</strong> — triggers re-render on change. For values that affect UI output.</p>
          <p><strong className="text-foreground">useRef</strong> — mutable, no re-render. For DOM nodes, PixiJS instances, timers, RAF ids, previous values.</p>
          <p>Never read ref.current inside render — it changes without triggering re-render.</p>
        </ConceptCard>

        <ConceptCard title="Dependency Array Mastery">
          <p><strong className="text-foreground">[]</strong> — run once on mount, clean up on unmount</p>
          <p><strong className="text-foreground">[value]</strong> — run when value changes</p>
          <p><strong className="text-foreground">No array</strong> — run after every render (rarely what you want)</p>
          <p>ESLint exhaustive-deps rule: always include every value read inside the effect.</p>
        </ConceptCard>
      </div>

      {/* Code examples */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">useRef — 3 Key Use Cases</h3>
          <CodeBlock code={HOOKS_REF_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">useEffect — Common Patterns & Mistakes</h3>
          <CodeBlock code={USE_EFFECT_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">React 19 New Features</h3>
          <CodeBlock code={REACT19_CODE} />
        </div>
      </div>

      {/* Q&A */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Interview Questions & Coding Challenges
        </h3>
        <QuestionList>
          {REACT_QUESTIONS.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </QuestionList>
      </div>
    </SectionWrapper>
  )
}
