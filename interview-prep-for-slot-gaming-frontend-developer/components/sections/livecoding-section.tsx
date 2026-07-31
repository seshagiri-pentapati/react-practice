import { SectionWrapper, ConceptCard, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { LIVE_CODING } from '@/lib/interview-data'

const TIPS_CODE = `// 90-Minute Interview Strategy

// === MINUTE 0-5: Clarify ===
// ASK BEFORE CODING:
// "Can I use TypeScript?" (always yes for a TS role)
// "Which version of PixiJS does your team use — v7 or v8?"
// "Should I think about error handling / edge cases?"
// "Is this the complete problem or will there be follow-ups?"

// === MINUTE 5-20: Write the interface/types FIRST ===
// Shows TypeScript mastery immediately
interface SpinRequest {
  bet: number;
  paylines: number;
  sessionId: string;
}

interface SpinResult {
  grid: string[][];
  wins: WinLine[];
  totalWin: number;
  newBalance: number;
  features?: { type: 'freespins' | 'bonus'; value: number };
}

interface WinLine {
  paylineId: number;
  symbol: string;
  count: number;
  payout: number;
}

// === MINUTE 20-60: Core implementation ===
// Write clean, readable code. Name variables clearly.
// Add comments for non-obvious logic.

// === MINUTE 60-75: Add error handling ===
class SlotAPI {
  async spin(req: SpinRequest): Promise<SpinResult> {
    // Validate input first (shows defensive programming)
    if (req.bet <= 0) throw new Error('Bet must be positive');
    if (req.paylines < 1 || req.paylines > 25) throw new Error('Invalid paylines');

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(\`Server error: \${response.status}\`);
      }

      return await response.json() as SpinResult;
    } catch (error) {
      // Don't swallow errors — log and rethrow
      console.error('Spin failed:', error);
      throw error;
    }
  }
}

// === MINUTE 75-85: Optimize / discuss trade-offs ===
// "I'd add object pooling here for the particle effects"
// "In production we'd cache the spritesheet on app init"
// "This could be extracted to a custom hook for testability"

// === MINUTE 85-90: Walk through your code ===
// Explain your decisions, not just what it does
`

const COMMON_PATTERNS_CODE = `// Patterns Every Frontend Slot Dev Must Know

// === 1. Promise-based animation sequence ===
async function runWinSequence(wins: WinLine[]): Promise<void> {
  // Highlight each winning line sequentially
  for (const win of wins) {
    await highlightLine(win.paylineId);    // animate payline
    await countUpBalance(win.payout);      // count up win
  }
  await delay(500);
  await clearHighlights();
}

// === 2. Cancellable async operations ===
function createCancellableDelay(ms: number): {
  promise: Promise<void>;
  cancel: () => void;
} {
  let rejectFn: (reason: string) => void;

  const promise = new Promise<void>((resolve, reject) => {
    rejectFn = reject;
    setTimeout(resolve, ms);
  });

  return {
    promise,
    cancel: () => rejectFn('cancelled'),
  };
}

// === 3. Event bus for cross-system communication ===
// React UI ↔ PixiJS game layer
type GameEvent = {
  'spin:request': { bet: number };
  'spin:result': { wins: WinLine[]; total: number };
  'balance:update': { amount: number };
  'bonus:trigger': { type: string };
};

class TypedEventBus {
  private handlers = new Map<keyof GameEvent, Set<Function>>();

  on<K extends keyof GameEvent>(
    event: K,
    handler: (data: GameEvent[K]) => void
  ): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  emit<K extends keyof GameEvent>(event: K, data: GameEvent[K]): void {
    this.handlers.get(event)?.forEach(fn => fn(data));
  }
}

export const gameBus = new TypedEventBus();

// In React component:
// gameBus.on('balance:update', ({ amount }) => setBalance(amount));

// In PixiJS game:
// gameBus.emit('balance:update', { amount: newBalance });

// === 4. Retry with exponential backoff ===
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 500
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1); // 500, 1000, 2000
      console.warn(\`Attempt \${attempt} failed. Retrying in \${delayMs}ms...\`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Should not reach here');
}

async function tryHighlightLine(paylineId: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 300));
}
async function highlightLine(paylineId: number): Promise<void> {
  return retryWithBackoff(() => tryHighlightLine(paylineId));
}
async function countUpBalance(amount: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 600));
}
async function clearHighlights(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 200));
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
`

const JS_FUNDAMENTALS_CODE = `// Core JS Concepts That Always Come Up

// === Closures ===
function createReelController(reelIndex: number) {
  let position = 0; // Private via closure

  return {
    getPosition: () => position,
    advance: (by: number) => { position += by; },
    reset: () => { position = 0; },
  };
}
const reel0 = createReelController(0);
reel0.advance(120);
console.log(reel0.getPosition()); // 120 — position is preserved in closure

// === Prototype chain ===
// Every object has __proto__ chain. class syntax is syntactic sugar over prototypes.
class SlotSymbol {
  constructor(public name: string) {}
  toString() { return \`[Symbol: \${this.name}]\`; }
}
class WildSymbol extends SlotSymbol {
  substituteFor(symbol: string): boolean { return symbol !== 'SCATTER'; }
}
// WildSymbol.prototype → SlotSymbol.prototype → Object.prototype → null

// === Event Loop ===
// Microtasks (Promise.then, queueMicrotask) run BEFORE macrotasks (setTimeout)
console.log('1');
setTimeout(() => console.log('4'), 0);  // macrotask queue
Promise.resolve().then(() => console.log('2')); // microtask queue
console.log('3');
// Output: 1, 3, 2, 4 — CRITICAL for understanding PixiJS + async interactions

// === this binding ===
class ReelManager {
  private speed = 40;

  // Arrow function — this is lexically bound to class instance
  // Safe to pass as Ticker callback
  private update = (ticker: { deltaTime: number }) => {
    // this.speed is ALWAYS the ReelManager instance
    const delta = this.speed * ticker.deltaTime;
  };

  // Regular method — this depends on CALLER
  updateRegular(ticker: { deltaTime: number }) {
    // PROBLEM: if passed as ticker.add(manager.updateRegular)
    // then "this" = undefined in strict mode
    const delta = this.speed * ticker.deltaTime;
  }
}
`

export function LiveCodingSection() {
  return (
    <SectionWrapper
      badge="Live Coding"
      title="Live Coding Challenges (90 Min)"
      subtitle="Interview-style coding problems you will actually face in a 90-minute session. Each has a complete solution with explanation. Practice these until you can write them from memory under pressure."
    >
      {/* Strategy box */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h3 className="text-sm font-semibold text-primary mb-3">90-Minute Interview Game Plan</h3>
          <div className="space-y-2">
            {[
              { time: '0-5 min', action: 'Clarify requirements — ask about PixiJS version, TypeScript strictness, error handling expectations' },
              { time: '5-15 min', action: 'Write interfaces and types FIRST — demonstrates TypeScript mastery before any logic' },
              { time: '15-60 min', action: 'Implement core logic with clear variable names. Write comments for non-obvious parts.' },
              { time: '60-75 min', action: 'Add error handling, edge cases, input validation' },
              { time: '75-85 min', action: 'Discuss optimizations: object pooling, memoization, batching — even if not implemented' },
              { time: '85-90 min', action: 'Walk through code, explain decisions, mention what you would add with more time' },
            ].map(step => (
              <div key={step.time} className="flex gap-3 text-xs">
                <span className="font-mono text-primary flex-shrink-0 w-16">{step.time}</span>
                <span className="text-muted-foreground">{step.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <ConceptCard title="Things to Always Say">
            <ul className="space-y-1">
              <li>• &quot;Let me define the types first&quot;</li>
              <li>• &quot;I&apos;m thinking about edge cases like...&quot;</li>
              <li>• &quot;For production I&apos;d add...&quot;</li>
              <li>• &quot;The trade-off here is...&quot;</li>
              <li>• &quot;Should I handle the case where...?&quot;</li>
            </ul>
          </ConceptCard>
          <ConceptCard title="Red Flags to Avoid">
            <ul className="space-y-1">
              <li>• Silent on what you&apos;re doing</li>
              <li>• Skipping types / using any</li>
              <li>• No cleanup in useEffect</li>
              <li>• setInterval for animation</li>
              <li>• Not handling loading/error</li>
            </ul>
          </ConceptCard>
        </div>
      </div>

      {/* Strategy code */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">Interview Strategy in Code</h3>
          <CodeBlock code={TIPS_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">Must-Know Patterns for Gaming Interviews</h3>
          <CodeBlock code={COMMON_PATTERNS_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">Core JS Fundamentals — Always Tested</h3>
          <CodeBlock code={JS_FUNDAMENTALS_CODE} />
        </div>
      </div>

      {/* Final mindset */}
      <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">Key Questions to Expect — Quick Answers</h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
          {[
            { q: 'What does deltaTime do?', a: 'Normalizes movement to be FPS-independent — multiply all movement by it' },
            { q: 'Why use spritesheet?', a: 'One GPU texture bind for all symbols = 1 draw call instead of 12' },
            { q: 'How do you prevent memory leaks?', a: 'Remove ticker listeners, remove event listeners, call destroy() with { children: true, texture: true }' },
            { q: 'Why useRef for PixiJS?', a: 'Mutating ref.current does not trigger React re-render — PixiJS manages its own render loop' },
            { q: 'Why split Context into state + dispatch?', a: 'Dispatch is stable (never changes), state changes on every action. Splitting means SpinButton never re-renders' },
            { q: 'What is a discriminated union?', a: 'Union type with a common literal field (status, type) used as a discriminant for type narrowing' },
            { q: 'v7 vs v8 biggest change?', a: 'app.init() is now async, app.canvas (not app.view), Assets API replaces Loader, eventMode replaces interactive' },
            { q: 'How to stop double-spin?', a: 'State machine — SPINNING state has no SPIN transition. Check machine.can("SPIN") before enabling the button' },
          ].map(item => (
            <div key={item.q} className="text-xs py-2 border-b border-border/40 last:border-0">
              <p className="text-foreground font-medium mb-0.5">{item.q}</p>
              <p className="text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Q&A */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Live Coding Problems with Full Solutions
        </h3>
        <QuestionList>
          {LIVE_CODING.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </QuestionList>
      </div>
    </SectionWrapper>
  )
}
