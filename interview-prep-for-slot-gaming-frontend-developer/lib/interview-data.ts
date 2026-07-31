export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type Category = 'TypeScript' | 'React' | 'PixiJS' | 'Slot Gaming' | 'Performance' | 'Live Coding'

export interface CodeQuestion {
  id: string
  title: string
  difficulty: Difficulty
  category: Category
  tags: string[]
  description: string
  concept?: string
  code: string
  answer: string
  keyPoints?: string[]
}

export interface TopicSection {
  id: string
  label: string
  icon: string
  description: string
}

export const TOPICS: TopicSection[] = [
  { id: 'typescript', label: 'TypeScript Deep Dive', icon: 'TS', description: 'Types, Generics, Utility Types, Decorators' },
  { id: 'react', label: 'React + TypeScript', icon: 'RX', description: 'Hooks, Context, Patterns, Performance' },
  { id: 'pixijs', label: 'PixiJS Complete Guide', icon: 'PX', description: 'Application, Sprites, Ticker, Filters, WebGL' },
  { id: 'slot', label: 'Slot Game Scenarios', icon: 'SL', description: 'Reels, RNG, Paylines, Animations, State' },
  { id: 'performance', label: 'Performance & Optimization', icon: 'PF', description: 'FPS, Memory Leaks, Object Pooling, GPU' },
  { id: 'websocket', label: 'WebSocket & Real-Time', icon: 'WS', description: 'WS protocol, reconnect, heartbeat, slot integration' },
  { id: 'livecoding', label: 'Live Coding Challenges', icon: 'LC', description: '90-min interview style problems with solutions' },
]

export const TYPESCRIPT_QUESTIONS: CodeQuestion[] = [
  {
    id: 'ts-1',
    title: 'Generics with Constraints',
    difficulty: 'Intermediate',
    category: 'TypeScript',
    tags: ['generics', 'constraints', 'keyof'],
    description: 'Write a generic function that safely gets a property from an object using keyof constraints.',
    concept: 'Generics allow you to write reusable, type-safe code. The <T, K extends keyof T> constraint ensures K is always a valid key of T.',
    code: `// Q: Implement a type-safe property getter
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Usage
const slotConfig = {
  reels: 5,
  rows: 3,
  paylines: 25,
  rtp: 96.5,
};

const reels = getProperty(slotConfig, 'reels'); // type: number
const rtp = getProperty(slotConfig, 'rtp');     // type: number
// getProperty(slotConfig, 'invalid');           // TS ERROR: compile-time safety`,
    answer: `The key insight is using TWO generic parameters:
- T: the object type (inferred from argument)
- K extends keyof T: ensures K is a valid key of T
- Return type T[K]: indexed access type gives exact value type

This is called an "indexed access type" and is fundamental to slot config systems where you need to safely read specific fields.`,
    keyPoints: [
      'keyof T creates a union of all keys of T',
      'K extends keyof T constrains K to valid keys only',
      'T[K] is an indexed access type (lookup type)',
      'Return type is automatically inferred correctly',
    ],
  },
  {
    id: 'ts-2',
    title: 'Utility Types in Practice',
    difficulty: 'Intermediate',
    category: 'TypeScript',
    tags: ['Partial', 'Required', 'Readonly', 'Pick', 'Omit', 'Record'],
    description: 'Use TypeScript built-in utility types to model a slot game configuration system.',
    concept: 'Utility types are type-level functions that transform existing types into new shapes without writing them from scratch.',
    code: `interface SlotGameConfig {
  gameId: string;
  reels: number;
  rows: number;
  paylines: number;
  rtp: number;
  minBet: number;
  maxBet: number;
  symbols: string[];
  features: string[];
}

// Partial — all optional (useful for config updates/patches)
type SlotConfigPatch = Partial<SlotGameConfig>;

// Required — all required (opposite of Partial)
type FullConfig = Required<SlotGameConfig>;

// Readonly — immutable config (prevent accidental mutation)
type FrozenConfig = Readonly<SlotGameConfig>;

// Pick — select subset of fields
type SlotPreview = Pick<SlotGameConfig, 'gameId' | 'reels' | 'rows' | 'rtp'>;

// Omit — exclude specific fields
type PublicConfig = Omit<SlotGameConfig, 'rtp' | 'minBet' | 'maxBet'>;

// Record — map type (symbol name → payout multiplier)
type SymbolPayouts = Record<string, number>;
const payouts: SymbolPayouts = {
  wild: 10,
  scatter: 5,
  seven: 100,
  bar: 20,
};

// ReturnType — extract return type from function
function getWinAmount(bet: number, multiplier: number) {
  return bet * multiplier;
}
type WinResult = ReturnType<typeof getWinAmount>; // number

// Parameters — extract function params as tuple
type GetWinParams = Parameters<typeof getWinAmount>; // [number, number]`,
    answer: `Utility types are essential for maintaining clean slot game codebases:
- Partial<T>: perfect for config update functions that only change some fields
- Readonly<T>: prevents RNG seeds and payout tables from being mutated at runtime
- Record<K,V>: great for symbol→payout and payline→positions mappings
- Pick/Omit: create API response types that expose only what clients should see`,
    keyPoints: [
      'Partial<T> = { [P in keyof T]?: T[P] }',
      'Required<T> = { [P in keyof T]-?: T[P] }',
      'Readonly<T> = { readonly [P in keyof T]: T[P] }',
      'Record<K,V> = { [P in K]: V }',
    ],
  },
  {
    id: 'ts-3',
    title: 'Discriminated Unions',
    difficulty: 'Advanced',
    category: 'TypeScript',
    tags: ['union types', 'discriminant', 'type narrowing', 'exhaustive checks'],
    description: 'Model slot game spin states using discriminated unions and exhaustive type narrowing.',
    concept: 'Discriminated unions (tagged unions) use a common literal type property as a "discriminant" to safely narrow union types.',
    code: `// Model all possible spin states
type SpinState =
  | { status: 'idle' }
  | { status: 'spinning'; startTime: number; duration: number }
  | { status: 'stopping'; reelIndex: number; finalSymbols: string[] }
  | { status: 'evaluating'; grid: string[][]; paylines: number[] }
  | { status: 'win'; amount: number; winningLines: WinLine[] }
  | { status: 'lose'; spinNumber: number }
  | { status: 'bonus'; feature: 'freespins' | 'multiplier' | 'pick'; data: unknown };

interface WinLine {
  paylineId: number;
  symbols: string[];
  multiplier: number;
}

// Exhaustive type guard — TS will error if a case is missing
function handleSpinState(state: SpinState): string {
  switch (state.status) {
    case 'idle':
      return 'Ready to spin';
    case 'spinning':
      return \`Spinning for \${state.duration}ms\`;
    case 'stopping':
      return \`Reel \${state.reelIndex} stopping\`;
    case 'evaluating':
      return \`Evaluating \${state.grid.length}x\${state.grid[0].length} grid\`;
    case 'win':
      return \`Won \$\{state.amount.toFixed(2)}\`;
    case 'lose':
      return \`No win on spin #\${state.spinNumber}\`;
    case 'bonus':
      return \`Bonus: \${state.feature}\`;
    default:
      // Exhaustive check — compiler error if any case is unhandled
      const _exhaustive: never = state;
      return _exhaustive;
  }
}`,
    answer: `Discriminated unions are perfect for slot game state machines:
1. The 'status' field is the discriminant — a literal string type unique per variant
2. TypeScript narrows the type inside each case automatically
3. The never check on default ensures all states are handled — if you add a new state type, it becomes a compile error
4. This pattern eliminates entire classes of runtime bugs in game logic`,
    keyPoints: [
      'The discriminant must be a literal type (string literal, number literal)',
      'TypeScript auto-narrows inside switch/if blocks',
      'never in default branch = exhaustiveness checking',
      'Great for Redux actions, event types, API response models',
    ],
  },
  {
    id: 'ts-4',
    title: 'Conditional & Mapped Types',
    difficulty: 'Expert',
    category: 'TypeScript',
    tags: ['conditional types', 'mapped types', 'infer', 'template literals'],
    description: 'Build advanced type utilities using conditional types, mapped types, and the infer keyword.',
    concept: 'Conditional types let you write type-level if/else. Mapped types iterate over unions to transform type shapes.',
    code: `// Conditional type — DeepReadonly for nested slot configs
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

// Extract specific state data based on status discriminant
type ExtractState<T extends { status: string }, S extends T['status']> =
  T extends { status: S } ? T : never;

type SpinState =
  | { status: 'idle' }
  | { status: 'spinning'; startTime: number }
  | { status: 'win'; amount: number };

type WinState = ExtractState<SpinState, 'win'>;
// Result: { status: 'win'; amount: number }

// Template Literal Types — auto-generate event names
type SlotEvent = 'spin' | 'win' | 'bonus' | 'reel';
type EventHandlers = {
  [K in SlotEvent as \`on\${Capitalize<K>}\`]: () => void;
};
// Result: { onSpin: () => void; onWin: () => void; onBonus: () => void; onReel: () => void }

// Mapped type with filtering (Awaited is built-in since TS 4.5)
type NonNullableProps<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};

// infer keyword — extract promise value type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

async function fetchSpinResult(): Promise<{ win: boolean; amount: number }> {
  return { win: true, amount: 50 };
}
type SpinResult = UnwrapPromise<ReturnType<typeof fetchSpinResult>>;
// Result: { win: boolean; amount: number }`,
    answer: `These advanced types power robust slot game infrastructure:
- DeepReadonly prevents any deeply nested mutation of game configs
- ExtractState is how libraries like XState implement typed state machines
- Template literal types auto-generate typed event name strings — zero typos
- infer is TS's most powerful tool for "looking inside" complex types`,
    keyPoints: [
      'infer can only be used inside conditional type extends clauses',
      'Mapped types with as allow key remapping (renaming/filtering)',
      'Capitalize<S> and other intrinsic string types built into TS 4.1+',
      'DeepReadonly prevents accidental mutation of nested config objects',
    ],
  },
]

export const REACT_QUESTIONS: CodeQuestion[] = [
  {
    id: 'rx-1',
    title: 'Custom Hook: useSlotGame',
    difficulty: 'Intermediate',
    category: 'React',
    tags: ['custom hooks', 'useReducer', 'useCallback', 'TypeScript'],
    description: 'Build a fully typed custom React hook for managing slot game state with useReducer.',
    concept: 'Custom hooks extract stateful logic into reusable functions. useReducer is preferred over useState when state has multiple sub-values and complex transitions.',
    code: `import { useReducer, useCallback } from 'react';

type GameStatus = 'idle' | 'spinning' | 'win' | 'lose';

interface GameState {
  status: GameStatus;
  balance: number;
  bet: number;
  lastWin: number;
  totalSpins: number;
  grid: string[][];
}

type GameAction =
  | { type: 'SPIN_START' }
  | { type: 'SPIN_RESULT'; payload: { grid: string[][]; win: number } }
  | { type: 'SET_BET'; payload: number }
  | { type: 'RESET' };

const initialState: GameState = {
  status: 'idle',
  balance: 1000,
  bet: 1,
  lastWin: 0,
  totalSpins: 0,
  grid: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SPIN_START':
      return {
        ...state,
        status: 'spinning',
        balance: state.balance - state.bet,
        lastWin: 0,
      };
    case 'SPIN_RESULT': {
      const { grid, win } = action.payload;
      return {
        ...state,
        status: win > 0 ? 'win' : 'lose',
        balance: state.balance + win,
        lastWin: win,
        totalSpins: state.totalSpins + 1,
        grid,
      };
    }
    case 'SET_BET':
      return { ...state, bet: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useSlotGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const spin = useCallback(async () => {
    if (state.status === 'spinning' || state.balance < state.bet) return;

    dispatch({ type: 'SPIN_START' });

    // Simulate async spin
    await new Promise(resolve => setTimeout(resolve, 2000));

    const symbols = ['7', 'BAR', 'BELL', 'CHERRY', 'LEMON'];
    const grid = Array.from({ length: 3 }, () =>
      Array.from({ length: 5 }, () =>
        symbols[Math.floor(Math.random() * symbols.length)]
      )
    );
    const win = Math.random() > 0.6 ? state.bet * (Math.floor(Math.random() * 10) + 1) : 0;

    dispatch({ type: 'SPIN_RESULT', payload: { grid, win } });
  }, [state.status, state.balance, state.bet]);

  const setBet = useCallback((bet: number) => {
    dispatch({ type: 'SET_BET', payload: bet });
  }, []);

  return { ...state, spin, setBet };
}`,
    answer: `Key patterns used here:
1. useReducer over useState — when state transitions are complex and interrelated
2. Discriminated union for GameAction — exhaustive, type-safe action dispatching
3. useCallback with proper deps — prevents unnecessary re-renders in child components
4. All async logic lives inside the hook, not in components — clean separation of concerns`,
    keyPoints: [
      'useReducer is preferable when nextState depends on prevState',
      'useCallback deps array must include all values the callback closes over',
      'Dispatch function from useReducer is stable (no need in deps)',
      'Return spread + methods = ergonomic hook API',
    ],
  },
  {
    id: 'rx-2',
    title: 'React.memo, useMemo, useCallback',
    difficulty: 'Advanced',
    category: 'React',
    tags: ['memoization', 'React.memo', 'useMemo', 'useCallback', 'performance'],
    description: 'Explain and demonstrate the three memoization tools in React, with slot game examples.',
    concept: 'Memoization prevents expensive re-computations and unnecessary re-renders. Critical for 60fps slot game UIs with many animating symbols.',
    code: `import React, { memo, useMemo, useCallback, useState } from 'react';

interface Symbol {
  id: string;
  type: string;
  isWinning: boolean;
}

// React.memo — prevents re-render if props unchanged
// Without memo, this re-renders on every parent state change
const SlotSymbol = memo(function SlotSymbol({ symbol, onClick }: {
  symbol: Symbol;
  onClick: (id: string) => void;
}) {
  console.log('SlotSymbol render:', symbol.id);
  return (
    <div
      className={\`symbol \${symbol.isWinning ? 'winning' : ''}\`}
      onClick={() => onClick(symbol.id)}
    >
      {symbol.type}
    </div>
  );
});

// Parent component
function SlotGrid() {
  const [symbols, setSymbols] = useState<Symbol[]>([
    { id: '1', type: '7', isWinning: false },
    { id: '2', type: 'BAR', isWinning: true },
  ]);
  const [balance, setBalance] = useState(1000);

  // useMemo — expensive calculation only re-runs when symbols change
  // NOT on every render (e.g., when balance changes)
  const totalWinAmount = useMemo(() => {
    console.log('Computing win amount...');
    return symbols
      .filter(s => s.isWinning)
      .reduce((sum, s) => sum + getSymbolValue(s.type), 0);
  }, [symbols]); // Only recalculates when symbols array changes

  // useCallback — stable function reference for child memo to work
  // Without useCallback, new function on every render = memo is useless
  const handleSymbolClick = useCallback((id: string) => {
    console.log('Symbol clicked:', id);
    setSymbols(prev =>
      prev.map(s => s.id === id ? { ...s, isWinning: !s.isWinning } : s)
    );
  }, []); // Empty deps = created once, stable forever

  return (
    <div>
      <p>Balance: {balance} | Win: {totalWinAmount}</p>
      <button onClick={() => setBalance(b => b + 10)}>Add Balance</button>
      {symbols.map(symbol => (
        // SlotSymbol will NOT re-render when balance changes
        // because: symbols unchanged + handleSymbolClick is stable
        <SlotSymbol
          key={symbol.id}
          symbol={symbol}
          onClick={handleSymbolClick}
        />
      ))}
    </div>
  );
}

function getSymbolValue(type: string): number {
  const values: Record<string, number> = { '7': 100, 'BAR': 20, 'BELL': 10 };
  return values[type] ?? 1;
}`,
    answer: `The critical insight is that all three work together:
1. React.memo — checks if props REFERENCE changed (shallow compare)
2. useCallback — gives stable function reference so memo's check passes
3. useMemo — caches expensive computed values

Without useCallback, even with React.memo, every parent render creates a new function reference → child always re-renders. This is the most common memoization bug.`,
    keyPoints: [
      'React.memo does shallow reference equality check on all props',
      'Functions are new references every render — use useCallback to stabilize',
      'useMemo dependency array = when to invalidate the cache',
      'Overusing memo adds overhead — only apply to proven bottlenecks',
    ],
  },
  {
    id: 'rx-3',
    title: 'Context API + Performance',
    difficulty: 'Advanced',
    category: 'React',
    tags: ['Context', 'Provider', 'useContext', 'splitting context', 'performance'],
    description: 'Build an optimized game context that avoids unnecessary re-renders by splitting state and actions.',
    concept: 'Context re-renders ALL consumers when value changes. Splitting into state context and dispatch context is the standard optimization pattern.',
    code: `import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// --- Types ---
interface SlotState {
  balance: number;
  bet: number;
  isSpinning: boolean;
}

type SlotAction =
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'SET_BET'; payload: number }
  | { type: 'TOGGLE_SPIN' };

// --- SPLIT into TWO contexts (critical optimization) ---
// 1. State context — holds data (changes often)
// 2. Dispatch context — holds stable dispatch function (never changes)
const SlotStateContext = createContext<SlotState | null>(null);
const SlotDispatchContext = createContext<React.Dispatch<SlotAction> | null>(null);

function slotReducer(state: SlotState, action: SlotAction): SlotState {
  switch (action.type) {
    case 'SET_BALANCE': return { ...state, balance: action.payload };
    case 'SET_BET': return { ...state, bet: action.payload };
    case 'TOGGLE_SPIN': return { ...state, isSpinning: !state.isSpinning };
    default: return state;
  }
}

// --- Provider ---
export function SlotProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(slotReducer, {
    balance: 1000,
    bet: 1,
    isSpinning: false,
  });

  return (
    <SlotStateContext.Provider value={state}>
      <SlotDispatchContext.Provider value={dispatch}>
        {children}
      </SlotDispatchContext.Provider>
    </SlotStateContext.Provider>
  );
}

// --- Custom hooks with null guards ---
export function useSlotState() {
  const ctx = useContext(SlotStateContext);
  if (!ctx) throw new Error('useSlotState must be used inside SlotProvider');
  return ctx;
}

export function useSlotDispatch() {
  const ctx = useContext(SlotDispatchContext);
  if (!ctx) throw new Error('useSlotDispatch must be used inside SlotProvider');
  return ctx;
}

// --- Consumers ---
// This component ONLY re-renders when balance/bet changes
function BalanceDisplay() {
  const { balance, bet } = useSlotState();
  return <div>Balance: {balance} | Bet: {bet}</div>;
}

// This component NEVER re-renders on state changes
// because dispatch reference is stable!
function SpinButton() {
  const dispatch = useSlotDispatch();
  return (
    <button onClick={() => dispatch({ type: 'TOGGLE_SPIN' })}>
      SPIN
    </button>
  );
}`,
    answer: `The split context pattern is essential for performant slot UIs:
- Single context: EVERY consumer re-renders when ANY state field changes
- Split context: SpinButton only subscribes to dispatch (stable), never re-renders
- BalanceDisplay only subscribes to state, re-renders on balance/bet changes only

This is the pattern used by React's own useReducer docs and libraries like Zustand internally.`,
    keyPoints: [
      'dispatch from useReducer is a stable reference — never changes',
      'Splitting state/dispatch contexts isolates re-render scope',
      'Always throw if context is null — fail fast with clear error',
      'For complex apps, consider Zustand/Jotai which handle this automatically',
    ],
  },
]

export const PIXIJS_QUESTIONS: CodeQuestion[] = [
  {
    id: 'px-1',
    title: 'PixiJS Application Setup',
    difficulty: 'Beginner',
    category: 'PixiJS',
    tags: ['Application', 'Canvas', 'WebGL', 'setup', 'React'],
    description: 'Initialize a PixiJS Application inside a React component with proper cleanup to avoid memory leaks.',
    concept: 'PixiJS creates a WebGL (or Canvas) renderer. It MUST be initialized async in PixiJS v8. Always destroy the app on component unmount to prevent GPU memory leaks.',
    code: `// PixiJS v8 setup inside React (useEffect pattern)
import { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';

export function SlotCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let app: Application;

    async function initPixi() {
      if (!containerRef.current) return;

      // PixiJS v8: init() is ASYNC
      app = new Application();
      await app.init({
        width: 800,
        height: 600,
        background: '#1a1a2e',
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,       // adjusts CSS size vs pixel size
        powerPreference: 'high-performance', // request discrete GPU
      });

      // Append canvas to DOM
      containerRef.current.appendChild(app.canvas);
      appRef.current = app;

      // Add a test graphic
      const bg = new Graphics();
      bg.rect(0, 0, 800, 600);
      bg.fill(0x1a1a2e);
      app.stage.addChild(bg);

      // Main game loop via Ticker
      app.ticker.add((ticker) => {
        // ticker.deltaTime = time since last frame (FPS-independent)
        // ticker.deltaMS = milliseconds since last frame
        // ticker.FPS = current frames per second
        console.log('FPS:', Math.round(ticker.FPS));
      });
    }

    initPixi();

    // CRITICAL: Cleanup prevents GPU memory leaks
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,    // destroy all children
          texture: true,     // free GPU texture memory
          textureSource: true,
        });
        appRef.current = null;
      }
    };
  }, []); // Empty deps = run once on mount

  return (
    <div
      ref={containerRef}
      style={{ width: '800px', height: '600px' }}
    />
  );
}`,
    answer: `Critical PixiJS v8 changes vs v7:
1. app.init() is now ASYNC — must be awaited
2. Use app.canvas instead of app.view
3. Always destroy with { children: true, texture: true } to free GPU memory
4. devicePixelRatio + autoDensity handles retina/HiDPI displays correctly
5. powerPreference: 'high-performance' requests the dedicated GPU on hybrid systems`,
    keyPoints: [
      'PixiJS v8: Application.init() is async — always await it',
      'app.canvas replaces app.view in v8',
      'destroy(true, {texture: true}) is critical for preventing GPU memory leaks',
      'autoDensity + resolution handles HiDPI screens',
    ],
  },
  {
    id: 'px-2',
    title: 'Sprites, Textures & Spritesheets',
    difficulty: 'Intermediate',
    category: 'PixiJS',
    tags: ['Sprite', 'Texture', 'Spritesheet', 'Assets', 'TextureAtlas'],
    description: 'Load and manage slot symbol textures efficiently using PixiJS Assets and spritesheets.',
    concept: 'A spritesheet packs multiple images into one texture atlas. This minimizes GPU draw calls (one texture bind for all symbols) and improves rendering performance significantly.',
    code: `import { Application, Assets, Sprite, Spritesheet, Texture } from 'pixi.js';

// === Method 1: Load individual textures ===
async function loadIndividualTextures() {
  const textures = await Assets.load([
    '/symbols/seven.png',
    '/symbols/bar.png',
    '/symbols/bell.png',
    '/symbols/cherry.png',
    '/symbols/wild.png',
    '/symbols/scatter.png',
  ]);
  return textures;
}

// === Method 2: Spritesheet (PREFERRED for slot games) ===
// symbols.json generated by TexturePacker or PixiJS CLI
async function loadSpritesheet() {
  // One network request + one GPU upload for ALL symbols
  const sheet: Spritesheet = await Assets.load('/sprites/symbols.json');
  await sheet.parse(); // Only needed in v7, auto in v8

  // Access individual frames by name
  const sevenTexture: Texture = sheet.textures['seven.png'];
  const barTexture: Texture = sheet.textures['bar.png'];
  return sheet.textures;
}

// === Creating sprites from textures ===
function createSymbolSprite(texture: Texture, x: number, y: number): Sprite {
  const sprite = new Sprite(texture);

  // Anchor point: 0,0 = top-left; 0.5,0.5 = center
  sprite.anchor.set(0.5);  // Center anchor for easier positioning
  sprite.x = x;
  sprite.y = y;
  sprite.width = 120;
  sprite.height = 120;

  // Interactive (replaces interactive + buttonMode in v7)
  sprite.eventMode = 'static';  // PixiJS v8 API
  sprite.cursor = 'pointer';
  sprite.on('pointerdown', () => console.log('Symbol clicked!'));

  return sprite;
}

// === Texture caching (manual) ===
const textureCache = new Map<string, Texture>();

function getCachedTexture(name: string): Texture {
  if (!textureCache.has(name)) {
    // Assets.cache.get is the v8 API for the global texture cache
    const texture = Assets.cache.get(name) as Texture;
    textureCache.set(name, texture);
  }
  return textureCache.get(name)!;
}

// === Object Pooling for performance (reuse sprites) ===
class SpritePool {
  private pool: Sprite[] = [];
  private texture: Texture;

  constructor(texture: Texture, initialSize = 20) {
    this.texture = texture;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new Sprite(texture));
    }
  }

  get(): Sprite {
    return this.pool.pop() ?? new Sprite(this.texture);
  }

  release(sprite: Sprite): void {
    sprite.visible = false;
    this.pool.push(sprite);
  }
}`,
    answer: `Spritesheet best practices for slot games:
1. One spritesheet per reel = minimal GPU texture switches
2. Use TexturePacker to generate optimized atlas + JSON descriptor
3. Object pooling is CRITICAL for reels — creating/destroying sprites every spin tanks performance
4. Assets.load() in v8 handles caching automatically — no double loading`,
    keyPoints: [
      'Spritesheet = fewer draw calls = better GPU performance',
      'sprite.anchor.set(0.5) makes rotation/scaling simpler',
      'eventMode: "static" replaces interactive:true in PixiJS v8',
      'Object pool: pre-allocate sprites at init, reuse instead of new/destroy',
    ],
  },
  {
    id: 'px-3',
    title: 'Reel Animation with Ticker',
    difficulty: 'Advanced',
    category: 'PixiJS',
    tags: ['Ticker', 'animation', 'easing', 'Container', 'masking'],
    description: 'Build a smooth, masked slot reel with proper easing using the PixiJS Ticker.',
    concept: 'The Ticker calls a callback each animation frame. Delta-time-based movement ensures consistent speed regardless of FPS. Masking clips the reel display to the visible window.',
    code: `import { Application, Container, Sprite, Graphics, Ticker, Texture } from 'pixi.js';

const SYMBOL_HEIGHT = 120;
const VISIBLE_ROWS = 3;
const REEL_HEIGHT = SYMBOL_HEIGHT * VISIBLE_ROWS;
const SYMBOLS = ['7', 'BAR', 'BELL', 'CHERRY', 'LEMON', 'WILD'];

interface ReelSymbol {
  sprite: Sprite;
  symbolIndex: number;
}

class SlotReel {
  container: Container;
  private symbols: ReelSymbol[] = [];
  private position = 0;       // Current scroll position in pixels
  private targetPosition = 0; // Target scroll position
  private spinning = false;
  private speed = 0;          // Current speed in px/frame
  private maxSpeed = 50;
  private app: Application;

  constructor(app: Application, x: number, textures: Record<string, Texture>) {
    this.app = app;

    // Outer container — positioned in the scene
    this.container = new Container();
    this.container.x = x;
    this.container.y = 0;

    // Create mask — clips reel to visible area only
    const mask = new Graphics();
    mask.rect(0, 0, 100, REEL_HEIGHT);
    mask.fill(0xffffff);
    this.container.addChild(mask);
    this.container.mask = mask;

    // Create enough symbols to fill reel + buffer above/below
    const totalSymbols = VISIBLE_ROWS + 2; // extra symbols for smooth looping
    for (let i = 0; i < totalSymbols; i++) {
      const symbolIdx = Math.floor(Math.random() * SYMBOLS.length);
      const name = SYMBOLS[symbolIdx];
      const sprite = new Sprite(textures[name] ?? Texture.WHITE);
      sprite.width = 100;
      sprite.height = SYMBOL_HEIGHT;
      sprite.y = i * SYMBOL_HEIGHT;

      this.symbols.push({ sprite, symbolIndex: symbolIdx });
      this.container.addChild(sprite);
    }

    // Register update loop
    this.app.ticker.add(this.update, this);
  }

  spin(resultSymbols: string[]): Promise<void> {
    return new Promise(resolve => {
      this.spinning = true;
      this.speed = this.maxSpeed;
      // totalDistance = enough to cycle through many symbols + land on result
      const extraSpins = 5;
      this.targetPosition = this.position + (SYMBOL_HEIGHT * SYMBOLS.length * extraSpins);

      const checkDone = () => {
        if (!this.spinning) {
          this.app.ticker.remove(checkDone);
          resolve();
        }
      };
      this.app.ticker.add(checkDone);
    });
  }

  private update = (ticker: Ticker): void => {
    if (!this.spinning) return;

    const remaining = this.targetPosition - this.position;

    if (remaining <= 0) {
      this.spinning = false;
      this.speed = 0;
      return;
    }

    // Ease-out deceleration when close to target
    if (remaining < SYMBOL_HEIGHT * 3) {
      // Linear ease-out: slow down proportionally
      this.speed = Math.max(5, (remaining / (SYMBOL_HEIGHT * 3)) * this.maxSpeed);
    }

    // Delta-time scaling — consistent speed at any FPS
    const delta = this.speed * ticker.deltaTime;
    this.position += delta;

    // Update symbol Y positions (infinite scroll via modulo)
    const totalHeight = this.symbols.length * SYMBOL_HEIGHT;
    this.symbols.forEach((sym, i) => {
      // Wrapping: scrolls continuously without gaps
      const yPos = ((i * SYMBOL_HEIGHT - this.position) % totalHeight + totalHeight) % totalHeight;
      sym.sprite.y = yPos - SYMBOL_HEIGHT; // -1 row offset for buffer
    });
  };

  destroy(): void {
    this.app.ticker.remove(this.update, this);
    this.container.destroy({ children: true });
  }
}`,
    answer: `Key animation concepts for slot reels:
1. ticker.deltaTime ensures the reel moves at the same speed regardless of FPS
2. Masking with a Graphics object clips rendering to the visible window — essential
3. Modulo wrapping (%) creates infinite scroll effect without creating new sprites
4. Ease-out deceleration simulates reel inertia naturally
5. Always ticker.remove() in destroy() — ticker callbacks are a major memory leak source`,
    keyPoints: [
      'ticker.deltaTime compensates for dropped frames — always multiply movement by it',
      'Graphics mask clips child rendering to the mask shape bounds',
      'Modulo wrapping recycles symbol positions for infinite reel effect',
      'Ease-out: speed = (remaining / totalDistance) * maxSpeed',
    ],
  },
  {
    id: 'px-4',
    title: 'Win Line Animation & Filters',
    difficulty: 'Advanced',
    category: 'PixiJS',
    tags: ['Filters', 'GlowFilter', 'Graphics', 'AnimatedSprite', 'tween'],
    description: 'Animate winning paylines and add visual effects using PixiJS Filters and Graphics.',
    concept: 'PixiJS filters are GPU shader programs applied to display objects. GlowFilter, BlurFilter, and ColorMatrixFilter transform the visual output post-render.',
    code: `import {
  Application, Graphics, Container, Sprite,
  ColorMatrixFilter, BlurFilter, Texture, Filter
} from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow'; // external package

// === Win Line Drawing ===
class WinLineDisplay {
  private graphics: Graphics;

  constructor(container: Container) {
    this.graphics = new Graphics();
    container.addChild(this.graphics);
  }

  drawPayline(points: {x: number; y: number}[], color: number = 0xFFD700): void {
    this.graphics.clear();
    this.graphics.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.graphics.lineTo(points[i].x, points[i].y);
    }

    this.graphics.stroke({ width: 3, color, alpha: 0.8 });
  }

  animateFlash(app: Application, duration = 1500): void {
    const startTime = Date.now();
    let visible = true;

    const flashTicker = (ticker: { deltaMS: number }) => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        app.ticker.remove(flashTicker as any);
        this.graphics.alpha = 1;
        return;
      }
      // Flash every 200ms
      if (Math.floor(elapsed / 200) % 2 === 0) {
        this.graphics.alpha = 1;
      } else {
        this.graphics.alpha = 0.3;
      }
    };
    app.ticker.add(flashTicker as any);
  }
}

// === Filters on winning symbols ===
function highlightWinningSymbol(sprite: Sprite): void {
  // Glow filter — requires @pixi/filter-glow
  const glowFilter = new GlowFilter({
    distance: 20,
    outerStrength: 2,
    innerStrength: 0,
    color: 0xFFD700,
    quality: 0.3,
  });

  // Color matrix filter — built into PixiJS
  const brighten = new ColorMatrixFilter();
  brighten.brightness(1.4, false); // 40% brighter

  sprite.filters = [glowFilter, brighten];
}

function removeHighlight(sprite: Sprite): void {
  sprite.filters = null; // Remove all filters
}

// === Coin burst particle effect (manual particles) ===
interface Particle {
  sprite: Sprite;
  vx: number;
  vy: number;
  gravity: number;
  life: number;
  maxLife: number;
}

class CoinBurst {
  private particles: Particle[] = [];
  private container: Container;
  private texture: Texture;

  constructor(container: Container, texture: Texture) {
    this.container = container;
    this.texture = texture;
  }

  emit(x: number, y: number, count = 15): void {
    for (let i = 0; i < count; i++) {
      const sprite = new Sprite(this.texture);
      sprite.anchor.set(0.5);
      sprite.x = x;
      sprite.y = y;
      sprite.width = sprite.height = 20;
      this.container.addChild(sprite);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 4;

      this.particles.push({
        sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // initial upward burst
        gravity: 0.3,
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    }
  }

  update(): void {
    this.particles = this.particles.filter(p => {
      p.vx *= 0.98; // air resistance
      p.vy += p.gravity;
      p.sprite.x += p.vx;
      p.sprite.y += p.vy;
      p.sprite.rotation += 0.1;
      p.life++;

      // Fade out near end of life
      p.sprite.alpha = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife) {
        p.sprite.destroy();
        return false; // Remove from array
      }
      return true;
    });
  }
}`,
    answer: `Filter performance notes:
1. Filters are GPU shader programs — they add a render pass per filter
2. Multiple filters are composed (all applied in one render pass when possible)
3. GlowFilter from @pixi/filter-glow is NOT built in — separate install needed
4. ColorMatrixFilter is built into PixiJS and is GPU-accelerated
5. Always remove filters (sprite.filters = null) after the win animation ends to save GPU`,
    keyPoints: [
      'Each unique filter combination creates a separate render texture',
      'GlowFilter: distance=spread, outerStrength=intensity, quality=0.1-1',
      'ColorMatrixFilter: brightness/saturation/contrast/hue all available',
      'Particle systems: update velocity, apply gravity, fade alpha by life ratio',
    ],
  },
]

export const SLOT_QUESTIONS: CodeQuestion[] = [
  {
    id: 'sl-1',
    title: 'RNG & RTP System',
    difficulty: 'Advanced',
    category: 'Slot Gaming',
    tags: ['RNG', 'RTP', 'provably fair', 'weighted random', 'Math.random'],
    description: 'Implement a weighted random symbol generator and explain RTP (Return to Player) calculations.',
    concept: 'Math.random() is not cryptographically secure. Real casino games use server-side RNG seeded with hardware entropy. Client-side RNG is only for display/demo purposes. RTP defines the statistical return percentage over millions of spins.',
    code: `// ===  Weighted Random (client-side demo only) ===
interface SymbolWeight {
  symbol: string;
  weight: number;  // Higher weight = more frequent
}

// Weights simulate a reel strip configuration
const REEL_STRIP: SymbolWeight[] = [
  { symbol: 'WILD',    weight: 1  },   // Very rare
  { symbol: 'SCATTER', weight: 2  },
  { symbol: '7',       weight: 3  },
  { symbol: 'BAR',     weight: 5  },
  { symbol: 'BELL',    weight: 8  },
  { symbol: 'CHERRY',  weight: 15 },
  { symbol: 'LEMON',   weight: 20 },
];
// Total weight = 54. WILD = 1/54 ≈ 1.85% probability

function weightedRandom(strip: SymbolWeight[]): string {
  const totalWeight = strip.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of strip) {
    random -= item.weight;
    if (random <= 0) return item.symbol;
  }
  return strip[strip.length - 1].symbol; // fallback
}

// === Spin the full grid ===
function generateSpinResult(
  reels: number,
  rows: number,
  strip: SymbolWeight[]
): string[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: reels }, () => weightedRandom(strip))
  );
}

// === Payline evaluation ===
interface Payline {
  id: number;
  positions: number[]; // row index per reel [row0, row1, row2, row3, row4]
}

// Standard 5-reel paylines
const PAYLINES: Payline[] = [
  { id: 1, positions: [1, 1, 1, 1, 1] },   // Middle horizontal
  { id: 2, positions: [0, 0, 0, 0, 0] },   // Top horizontal
  { id: 3, positions: [2, 2, 2, 2, 2] },   // Bottom horizontal
  { id: 4, positions: [0, 1, 2, 1, 0] },   // V shape
  { id: 5, positions: [2, 1, 0, 1, 2] },   // Inverted V
];

interface WinResult {
  paylineId: number;
  symbol: string;
  count: number;
  multiplier: number;
  winAmount: number;
}

// Payout table: symbol → { count → multiplier }
const PAYOUT_TABLE: Record<string, Record<number, number>> = {
  'WILD':    { 3: 50, 4: 200, 5: 1000 },
  'SCATTER': { 3: 10, 4: 50,  5: 200  },
  '7':       { 3: 20, 4: 80,  5: 400  },
  'BAR':     { 3: 8,  4: 30,  5: 150  },
  'BELL':    { 3: 5,  4: 20,  5: 80   },
  'CHERRY':  { 3: 3,  4: 12,  5: 50   },
  'LEMON':   { 3: 2,  4: 8,   5: 30   },
};

function evaluatePaylines(
  grid: string[][],  // grid[row][reel]
  paylines: Payline[],
  bet: number
): WinResult[] {
  const wins: WinResult[] = [];

  for (const payline of paylines) {
    // Get symbol sequence along this payline
    const sequence = payline.positions.map(
      (row, reelIndex) => grid[row][reelIndex]
    );

    // Count consecutive matching symbols from left
    const firstSymbol = sequence[0];
    let count = 1;
    for (let i = 1; i < sequence.length; i++) {
      if (sequence[i] === firstSymbol || sequence[i] === 'WILD') {
        count++;
      } else break;
    }

    // Check payout table
    if (count >= 3 && PAYOUT_TABLE[firstSymbol]?.[count]) {
      const multiplier = PAYOUT_TABLE[firstSymbol][count];
      wins.push({
        paylineId: payline.id,
        symbol: firstSymbol,
        count,
        multiplier,
        winAmount: bet * multiplier,
      });
    }
  }

  return wins;
}

// === RTP Simulation ===
function simulateRTP(spins: number, bet: number): number {
  let totalBet = 0;
  let totalWon = 0;

  for (let i = 0; i < spins; i++) {
    const grid = generateSpinResult(5, 3, REEL_STRIP);
    const wins = evaluatePaylines(grid, PAYLINES, bet);
    totalBet += bet;
    totalWon += wins.reduce((sum, w) => sum + w.winAmount, 0);
  }

  const rtp = (totalWon / totalBet) * 100;
  console.log(\`RTP over \${spins} spins: \${rtp.toFixed(2)}%\`);
  return rtp;
}`,
    answer: `RTP and RNG are fundamental to slot game development:
- RTP = (total won / total bet) × 100% — regulated by gaming authorities (usually 90-98%)
- Weighted reel strips are the primary mechanism for tuning RTP
- WILD substitution increases effective win rate — must factor into RTP math
- Real games use server-side RNG to prevent cheating — client only receives results
- Payout tables are strictly regulated and must match the published RTP`,
    keyPoints: [
      'Math.random() is NOT suitable for real money gambling (use server-side)',
      'Weighted random: cumulative probability via total weight division',
      'Payline evaluation: count consecutive matching symbols from left (wild substitution)',
      'RTP calculation requires millions of simulated spins to converge',
    ],
  },
  {
    id: 'sl-2',
    title: 'State Machine for Game Flow',
    difficulty: 'Advanced',
    category: 'Slot Gaming',
    tags: ['state machine', 'XState', 'game loop', 'async', 'transitions'],
    description: 'Design a finite state machine for slot game flow using a simple implementation or XState pattern.',
    concept: 'Slot games are perfect FSM candidates: they have discrete states (idle, spinning, evaluating, win, bonus) with defined transitions between them. FSMs prevent invalid state transitions at the type level.',
    code: `// === Simple FSM implementation (no library needed for interview) ===
type GameState = 'IDLE' | 'SPINNING' | 'STOPPING' | 'EVALUATING' | 'WIN_PRESENTATION' | 'BONUS' | 'ERROR';

type GameEvent =
  | 'SPIN'
  | 'REELS_STOPPED'
  | 'EVALUATION_DONE'
  | 'WIN_ANIM_DONE'
  | 'NO_WIN'
  | 'BONUS_TRIGGERED'
  | 'BONUS_DONE'
  | 'ERROR_OCCURRED'
  | 'RESET';

type Transition = {
  [K in GameEvent]?: GameState;
};

// Transition table — explicit allowed transitions per state
const TRANSITIONS: Record<GameState, Transition> = {
  IDLE:              { SPIN: 'SPINNING' },
  SPINNING:          { REELS_STOPPED: 'STOPPING', ERROR_OCCURRED: 'ERROR' },
  STOPPING:          { EVALUATION_DONE: 'EVALUATING' },
  EVALUATING:        { WIN_ANIM_DONE: 'WIN_PRESENTATION', NO_WIN: 'IDLE', BONUS_TRIGGERED: 'BONUS' },
  WIN_PRESENTATION:  { WIN_ANIM_DONE: 'IDLE' },
  BONUS:             { BONUS_DONE: 'IDLE', ERROR_OCCURRED: 'ERROR' },
  ERROR:             { RESET: 'IDLE' },
};

class SlotStateMachine {
  private current: GameState = 'IDLE';
  private listeners = new Map<GameState, (() => void)[]>();

  get state(): GameState {
    return this.current;
  }

  send(event: GameEvent): boolean {
    const transition = TRANSITIONS[this.current];
    const nextState = transition[event];

    if (!nextState) {
      console.warn(\`[FSM] Invalid event "\${event}" in state "\${this.current}"\`);
      return false; // Invalid transition silently ignored (or throw for strict mode)
    }

    console.log(\`[FSM] \${this.current} --[\${event}]--> \${nextState}\`);
    this.current = nextState;

    // Notify listeners for the new state
    this.listeners.get(nextState)?.forEach(fn => fn());
    return true;
  }

  onEnter(state: GameState, callback: () => void): () => void {
    if (!this.listeners.has(state)) this.listeners.set(state, []);
    this.listeners.get(state)!.push(callback);

    // Return unsubscribe function
    return () => {
      const list = this.listeners.get(state) ?? [];
      const idx = list.indexOf(callback);
      if (idx !== -1) list.splice(idx, 1);
    };
  }

  can(event: GameEvent): boolean {
    return event in (TRANSITIONS[this.current] ?? {});
  }
}

// === Usage ===
const machine = new SlotStateMachine();

// Subscribe to state entries
const unsubWin = machine.onEnter('WIN_PRESENTATION', () => {
  console.log('Play win animation!');
});

async function playSlot(): Promise<void> {
  if (!machine.can('SPIN')) return; // Guard

  machine.send('SPIN');
  // ... start reel animations ...

  await waitForReelsToStop(); // async
  machine.send('REELS_STOPPED');

  const result = evaluateGrid();
  machine.send('EVALUATION_DONE');

  if (result.totalWin > 0) {
    await playWinAnimation(result.totalWin);
    machine.send('WIN_ANIM_DONE');
  } else {
    machine.send('NO_WIN');
  }
}

async function waitForReelsToStop(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

function evaluateGrid() {
  return { totalWin: Math.random() > 0.6 ? 50 : 0 };
}

async function playWinAnimation(amount: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 1000));
}`,
    answer: `FSMs prevent the most common slot game bugs:
1. Double-spin prevention: SPINNING state doesn't accept SPIN event
2. Invalid transitions cause a console warning (or throw in strict mode) — not a crash
3. onEnter callbacks trigger animation/audio exactly once per state entry
4. machine.can(event) lets UI disable the spin button during animation
5. This is exactly the XState mental model — knowing the pattern impresses interviewers`,
    keyPoints: [
      'Transition table defines ALL valid state changes explicitly',
      'send() returns false for invalid transitions — no silent bugs',
      'can() method is used to enable/disable UI controls (spin button)',
      'onEnter subscriptions = clean separation of state logic from effects',
    ],
  },
]

export const PERFORMANCE_QUESTIONS: CodeQuestion[] = [
  {
    id: 'pf-1',
    title: 'Object Pooling in PixiJS',
    difficulty: 'Advanced',
    category: 'Performance',
    tags: ['object pool', 'memory', 'GC pressure', 'sprites', 'particles'],
    description: 'Implement a generic object pool to eliminate garbage collection pauses during slot animations.',
    concept: 'Creating and destroying objects causes GC pauses. At 60fps, each GC pause causes a visible frame drop. Object pools pre-allocate objects and recycle them instead of destroying them.',
    code: `// === Generic Object Pool ===
class ObjectPool<T> {
  private pool: T[] = [];
  private active = new Set<T>();
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize = 50
  ) {
    this.factory = factory;
    this.reset = reset;
    // Pre-warm the pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire(): T {
    const obj = this.pool.pop() ?? this.factory(); // Create only if empty
    this.active.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (!this.active.has(obj)) return; // Guard against double-release
    this.active.delete(obj);
    this.reset(obj);
    this.pool.push(obj);
  }

  releaseAll(): void {
    for (const obj of this.active) {
      this.reset(obj);
      this.pool.push(obj);
    }
    this.active.clear();
  }

  get activeCount(): number { return this.active.size; }
  get pooledCount(): number { return this.pool.length; }
}

// === PixiJS Sprite Pool ===
import { Sprite, Texture, Container } from 'pixi.js';

function createSpritePool(texture: Texture, container: Container): ObjectPool<Sprite> {
  return new ObjectPool<Sprite>(
    // Factory: create a new sprite
    () => {
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      container.addChild(sprite); // add to stage once
      return sprite;
    },
    // Reset: restore to default state
    (sprite) => {
      sprite.visible = false;
      sprite.alpha = 1;
      sprite.rotation = 0;
      sprite.scale.set(1);
      sprite.x = 0;
      sprite.y = 0;
      sprite.tint = 0xFFFFFF;
      sprite.filters = null;
    },
    100 // pre-allocate 100 sprites
  );
}

// === Usage: Coin particle burst ===
class CoinExplosion {
  private pool: ObjectPool<Sprite>;
  private activeCoins: Array<{ sprite: Sprite; vx: number; vy: number; life: number }> = [];

  constructor(texture: Texture, container: Container) {
    this.pool = createSpritePool(texture, container);
  }

  burst(x: number, y: number, count = 20): void {
    for (let i = 0; i < count; i++) {
      const sprite = this.pool.acquire();
      sprite.visible = true;
      sprite.x = x;
      sprite.y = y;

      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 5;

      this.activeCoins.push({
        sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        life: 60,
      });
    }
  }

  update(): void {
    this.activeCoins = this.activeCoins.filter(coin => {
      coin.vy += 0.2; // gravity
      coin.sprite.x += coin.vx;
      coin.sprite.y += coin.vy;
      coin.sprite.rotation += 0.1;
      coin.life--;
      coin.sprite.alpha = coin.life / 60;

      if (coin.life <= 0) {
        this.pool.release(coin.sprite); // Return to pool, NOT destroy
        return false;
      }
      return true;
    });
  }
}`,
    answer: `Object pooling is critical for 60fps slot games:
1. Sprite creation allocates GPU textures + JS heap — expensive at 60fps
2. Pooled sprites are just hidden + reset, not destroyed — no GC pressure
3. The factory/reset pattern separates creation from reuse cleanly
4. Guard against double-release with active Set — prevents state corruption
5. Pre-warm to expected peak usage at init (loading screen) not during gameplay`,
    keyPoints: [
      'pool.pop() is O(1) — much faster than new Sprite() + GPU allocation',
      'Reset function must clear ALL state: position, rotation, alpha, filters, tint',
      'active Set prevents double-release bugs',
      'Pre-warm pool during loading — never during active animation',
    ],
  },
]

export const LIVE_CODING: CodeQuestion[] = [
  {
    id: 'lc-1',
    title: 'Debounce & Throttle from Scratch',
    difficulty: 'Intermediate',
    category: 'Live Coding',
    tags: ['debounce', 'throttle', 'closures', 'setTimeout', 'performance'],
    description: 'Implement debounce and throttle without any libraries. Both are commonly asked in frontend interviews.',
    concept: 'Debounce: fires AFTER the last call, after a wait period (e.g., search input). Throttle: fires AT MOST once per interval (e.g., scroll handler, resize).',
    code: `// === DEBOUNCE ===
// Fires AFTER the last invocation + delay
// Use case: search autocomplete, window resize handler

function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    // Cancel the pending timer every time it's called
    if (timerId !== null) clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

// === THROTTLE ===
// Fires AT MOST once per interval
// Use case: scroll events, button spam prevention, game input

function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

// === Throttle with trailing call (ensures last event fires) ===
function throttleWithTrailing<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let trailingTimer: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const remaining = interval - (now - lastCall);

    if (remaining <= 0) {
      if (trailingTimer) { clearTimeout(trailingTimer); trailingTimer = null; }
      lastCall = now;
      fn(...args);
    } else {
      if (trailingTimer) clearTimeout(trailingTimer);
      trailingTimer = setTimeout(() => {
        lastCall = Date.now();
        trailingTimer = null;
        fn(...args);
      }, remaining);
    }
  };
}

// === Usage in slot game ===
// Prevent spam clicking the spin button
const debouncedSpin = debounce(() => {
  console.log('Spin!');
}, 300);

// Throttle chip stack animation updates during win
const throttledWinUpdate = throttle((amount: number) => {
  console.log('Win counter:', amount);
}, 50); // max 20 updates per second`,
    answer: `The key differences interviewers test:
1. Debounce = delay/reset timer on every call → fires once after activity stops
2. Throttle = rate limit → fires at most N times per second

Slot game uses: throttle the spin button to prevent double-tap, debounce config changes.

The TypeScript generic Parameters<T> preserves the exact argument types — not just any[].`,
    keyPoints: [
      'Debounce: cancel existing timer, start new one. Trailing edge fire.',
      'Throttle: check elapsed time. Leading edge fire.',
      'Parameters<T> preserves argument types in TypeScript',
      'ReturnType<typeof setTimeout> is NodeJS.Timeout vs number — use generic form',
    ],
  },
  {
    id: 'lc-2',
    title: 'Promise.all, Promise.race, Promise.allSettled',
    difficulty: 'Intermediate',
    category: 'Live Coding',
    tags: ['Promise', 'async/await', 'concurrency', 'error handling'],
    description: 'Implement simplified versions of Promise.all and Promise.allSettled and explain when to use each.',
    concept: 'These static Promise methods handle multiple concurrent async operations. Slot games use them to load assets in parallel, run animations concurrently, or race timeouts.',
    code: `// === Promise.all — fails fast on first rejection ===
// Use when ALL results are required and any failure = abort
async function loadAllAssets(paths: string[]): Promise<Blob[]> {
  // Fires all fetches simultaneously, waits for ALL to complete
  const blobs = await Promise.all(
    paths.map(path => fetch(path).then(r => r.blob()))
  );
  return blobs; // Only reaches here if ALL succeed
}

// === Promise.allSettled — never rejects, reports each result ===
// Use when you want ALL results regardless of failures
async function loadAssetsWithFallback(paths: string[]) {
  const results = await Promise.allSettled(
    paths.map(path => fetch(path).then(r => r.blob()))
  );

  const loaded: Blob[] = [];
  const failed: string[] = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      loaded.push(result.value);
    } else {
      failed.push(paths[i]);
      console.error('Failed to load:', paths[i], result.reason);
    }
  });

  return { loaded, failed };
}

// === Promise.race — use for timeouts ===
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(\`Timeout after \${ms}ms\`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Slot game spin with server timeout
async function spinWithTimeout(): Promise<SpinResultType> {
  const spinRequest = fetch('/api/spin').then(r => r.json() as Promise<SpinResultType>);
  return withTimeout(spinRequest, 5000); // 5 second timeout
}

// === Implement Promise.all from scratch ===
function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }

    const results: T[] = new Array(promises.length);
    let resolved = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value; // Preserve ORDER, not completion order
        resolved++;
        if (resolved === promises.length) resolve(results);
      }).catch(reject); // First rejection immediately rejects all
    });
  });
}

// === Concurrent animation sequence ===
async function playWinSequence(winAmount: number): Promise<void> {
  // Run these in PARALLEL
  await Promise.all([
    playWinSound(),
    animateCoinBurst(),
    animateWinCounter(winAmount),
  ]);
  // Only after ALL three complete...
  await showWinBanner(winAmount);
}

interface SpinResultType { win: number; grid: string[][] }

async function playWinSound(): Promise<void> { return new Promise(r => setTimeout(r, 1000)); }
async function animateCoinBurst(): Promise<void> { return new Promise(r => setTimeout(r, 1500)); }
async function animateWinCounter(amount: number): Promise<void> { return new Promise(r => setTimeout(r, 2000)); }
async function showWinBanner(amount: number): Promise<void> { return new Promise(r => setTimeout(r, 500)); }`,
    answer: `Promise methods cheat sheet:
- Promise.all([...]) → Parallel, fails on first rejection, returns ordered results array
- Promise.allSettled([...]) → Parallel, never rejects, returns {status, value|reason}[]  
- Promise.race([...]) → Returns first settled (fulfilled OR rejected) — use for timeouts
- Promise.any([...]) → Returns first FULFILLED, rejects only if ALL reject

Custom Promise.all gotcha: store results by INDEX not push order — maintains input ordering.`,
    keyPoints: [
      'Promise.all: short-circuits on first rejection — use for "all or nothing" loads',
      'Promise.allSettled: inspect each result individually — use for fault-tolerant loading',
      'Promise.race: use with a reject-after-timeout promise to add timeouts',
      'results[i] = value preserves order even when promises resolve out of order',
    ],
  },
  {
    id: 'lc-3',
    title: 'Deep Clone Without structuredClone',
    difficulty: 'Intermediate',
    category: 'Live Coding',
    tags: ['deep clone', 'recursion', 'circular reference', 'WeakMap'],
    description: 'Implement a deep clone function that handles arrays, objects, and circular references.',
    concept: 'JSON.parse(JSON.stringify(x)) is the naive approach — it fails on undefined, functions, Date, Map, Set, and circular references. A proper deep clone handles all cases.',
    code: `// === Naive approach (mention this but show why it fails) ===
// JSON.parse(JSON.stringify(obj)) fails for:
// - undefined values (dropped)
// - Functions (dropped)
// - Dates (converted to strings)
// - Map / Set (converted to empty objects)
// - Circular references (throws)
// - Symbol keys (dropped)

// === Proper deep clone with circular reference handling ===
function deepClone<T>(value: T, seen = new WeakMap()): T {
  // Primitives and null — return as-is
  if (value === null || typeof value !== 'object') return value;

  // Circular reference check
  if (seen.has(value as object)) {
    return seen.get(value as object);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  // Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    seen.set(value as object, clonedMap);
    value.forEach((v, k) => {
      clonedMap.set(deepClone(k, seen), deepClone(v, seen));
    });
    return clonedMap as unknown as T;
  }

  // Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    seen.set(value as object, clonedSet);
    value.forEach(v => clonedSet.add(deepClone(v, seen)));
    return clonedSet as unknown as T;
  }

  // Array
  if (Array.isArray(value)) {
    const clonedArr: unknown[] = [];
    seen.set(value as object, clonedArr); // Register BEFORE recursing
    value.forEach((item, i) => {
      clonedArr[i] = deepClone(item, seen);
    });
    return clonedArr as unknown as T;
  }

  // Plain object
  const clonedObj = Object.create(Object.getPrototypeOf(value));
  seen.set(value as object, clonedObj); // Register BEFORE recursing
  for (const key of Object.keys(value as object)) {
    clonedObj[key] = deepClone((value as Record<string, unknown>)[key], seen);
  }
  return clonedObj;
}

// === Test with circular reference ===
interface Config { name: string; self?: Config; data: number[] }
const config: Config = { name: 'slot-1', data: [1, 2, 3] };
config.self = config; // Circular reference

const cloned = deepClone(config);
console.log(cloned.name); // 'slot-1'
console.log(cloned.self === cloned); // true — circular preserved
console.log(cloned === config); // false — deep copy`,
    answer: `Interviewers specifically look for:
1. WeakMap for circular reference tracking (not Map — WeakMap doesn't prevent GC)
2. Register in WeakMap BEFORE recursing into children (critical order)
3. Handle Date, RegExp, Map, Set explicitly
4. Object.getPrototypeOf preserves class instances (not just plain objects)
5. Bonus: mention structuredClone is now built into modern browsers/Node 17+`,
    keyPoints: [
      'WeakMap seen map: register node BEFORE recursing to handle circular refs',
      'Array.isArray before object check — arrays are also objects',
      'Date: new Date(original.getTime()) — not new Date(original)',
      'structuredClone() is the modern browser API for this — mention it',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXTENDED PIXIJS QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const PIXIJS_EXTENDED_QUESTIONS: CodeQuestion[] = [
  {
    id: 'px-ext-1',
    title: 'What is the PixiJS Ticker and how does deltaTime work?',
    difficulty: 'Beginner',
    category: 'PixiJS',
    tags: ['ticker', 'deltaTime', 'game loop', 'animation'],
    description: 'Explain the Ticker class, how to add/remove update functions, and how deltaTime makes animations frame-rate independent.',
    concept: 'The Ticker is PixiJS\'s game loop — it calls registered functions every animation frame using requestAnimationFrame internally. deltaTime is a normalized value: 1.0 at 60fps, 2.0 at 30fps, 0.5 at 120fps. Multiplying speed by deltaTime ensures objects always move at the same real-world speed regardless of device FPS.',
    code: `import { Application, Sprite, Ticker } from 'pixi.js';

const app = new Application();
await app.init({ width: 800, height: 600 });

const sprite = new Sprite(myTexture);
sprite.anchor.set(0.5); // pivot at center
app.stage.addChild(sprite);

// === Method 1: app.ticker (shared app ticker) ===
app.ticker.add((ticker: Ticker) => {
  // ticker.deltaTime: 1.0 at 60fps, 2.0 at 30fps
  // ticker.deltaMS: actual milliseconds since last frame (e.g. 16.67ms at 60fps)
  // ticker.elapsedMS: total elapsed milliseconds since app start
  sprite.rotation += 0.02 * ticker.deltaTime; // Frame-rate independent rotation
  sprite.x += 2 * ticker.deltaTime;           // Frame-rate independent movement
});

// === Method 2: Standalone Ticker ===
const myTicker = new Ticker();
myTicker.add((ticker) => {
  console.log('FPS:', ticker.FPS); // current frames per second
});
myTicker.start();

// === Remove a listener (CRITICAL to prevent leaks) ===
const rotateHandler = (ticker: Ticker) => {
  sprite.rotation += 0.01 * ticker.deltaTime;
};
app.ticker.add(rotateHandler);
// Later when no longer needed:
app.ticker.remove(rotateHandler);

// === Add with priority (lower = runs first) ===
import { UPDATE_PRIORITY } from 'pixi.js';
app.ticker.add(handler, null, UPDATE_PRIORITY.HIGH); // runs early
app.ticker.add(handler, null, UPDATE_PRIORITY.LOW);  // runs late

// === One-shot ticker (runs once then auto-removes) ===
app.ticker.addOnce(() => {
  console.log('This runs exactly once on the next frame');
});

// === Max FPS cap ===
app.ticker.maxFPS = 60; // Cap at 60fps even on 144Hz monitors
app.ticker.minFPS = 10; // If frame takes >100ms, clamp deltaTime`,
    answer: `Key points to nail in an interview:
1. deltaTime normalizes speed across devices — always multiply movement/rotation by it
2. ticker.deltaMS is raw milliseconds — useful for time-based logic (e.g. "spin for 2 seconds")
3. Always remove listeners when objects are destroyed — memory leak risk
4. UPDATE_PRIORITY controls execution order within a frame
5. addOnce is cleaner than add + manual remove for one-time setup`,
    keyPoints: [
      'deltaTime = 1.0 at 60fps, 2.0 at 30fps — always multiply by it',
      'ticker.deltaMS = actual ms elapsed — use for time-based (not frame-based) logic',
      'ticker.add() returns the ticker — chainable',
      'Remove listeners: app.ticker.remove(handler) or ticker.destroy()',
    ],
  },
  {
    id: 'px-ext-2',
    title: 'Explain PixiJS Sprites, Textures, and Texture caching in depth',
    difficulty: 'Beginner',
    category: 'PixiJS',
    tags: ['Sprite', 'Texture', 'TextureSource', 'cache', 'anchor'],
    description: 'What is the difference between a Texture and a Sprite? How does texture caching work and why is it critical for performance?',
    concept: 'A Texture is a reference to image data on the GPU — it stores the source image and an optional cropping rectangle. A Sprite is a display object that renders a Texture. Multiple Sprites can share the same Texture object (one GPU upload, many draws). The Texture cache stores loaded textures by URL, preventing duplicate GPU uploads.',
    code: `import { Texture, Sprite, Assets, Rectangle } from 'pixi.js';

// === Texture vs Sprite ===
// Texture = GPU data (source image + optional crop region)
// Sprite = DisplayObject that draws a Texture at a position

// === Creating textures ===
const tex1 = await Assets.load('/symbol.png');     // Loads & caches
const tex2 = Texture.from('/symbol.png');           // From cache (if loaded)
const tex3 = Texture.WHITE;                         // Built-in 1x1 white texture
const tex4 = Texture.EMPTY;                         // Built-in empty texture

// === Sub-texture from atlas ===
const atlasTex = await Assets.load('/atlas.json'); // Spritesheet
// Textures are now accessible by name:
const sevenTex = Texture.from('seven.png');         // Named in atlas JSON

// === Manual sub-texture (frame within an image) ===
const fullTex = await Assets.load('/sprite-sheet.png');
const cropRegion = new Rectangle(0, 0, 128, 128);  // x, y, width, height
const subTex = new Texture({ source: fullTex.source, frame: cropRegion });

// === Sprite properties ===
const sprite = new Sprite(tex1);

// anchor: pivot point for position, rotation, scale (0-1 range)
sprite.anchor.set(0.5, 0.5); // center — best for rotation
sprite.anchor.set(0, 0);     // top-left (default)
sprite.anchor.set(0.5, 1);   // bottom-center (for standing characters)

// pivot: same as anchor but in pixels instead of 0-1 range
sprite.pivot.set(64, 64); // Same as anchor(0.5,0.5) for 128px sprite

// tint: color overlay (multiplied with texture color)
sprite.tint = 0xFFD700; // Gold overlay
sprite.tint = 0xFFFFFF; // No tint (default, full color)
sprite.tint = 0xFF0000; // Red overlay (win flash effect)

// alpha: 0 = invisible, 1 = fully opaque
sprite.alpha = 0.5;

// scale vs width/height
sprite.scale.set(2); // 2x size (non-destructive — keeps original texture)
sprite.width = 200;  // Sets scale based on original texture width
sprite.height = 200;

// === Multiple sprites sharing ONE texture (efficient!) ===
const sharedTexture = await Assets.load('/coin.png'); // ONE GPU upload
const coins: Sprite[] = [];
for (let i = 0; i < 100; i++) {
  const coin = new Sprite(sharedTexture); // All share same GPU texture
  coin.x = Math.random() * 800;
  coin.y = Math.random() * 600;
  coins.push(coin);
  app.stage.addChild(coin);
}
// 100 sprites, 1 GPU texture = very efficient

// === Texture destruction (prevent VRAM leaks) ===
sharedTexture.destroy(true);  // true = destroy the underlying source too
// After this, all sprites using it will show nothing
// Only destroy when NO sprites are using it`,
    answer: `Critical interview distinctions:
1. One Texture can be shared by unlimited Sprites — this is the key batching mechanism
2. anchor is 0-1 normalized; pivot is pixel-based — they do the same thing differently
3. tint uses bitwise color multiply — 0xFFFFFF = no change, 0xFF0000 = red overlay
4. texture.destroy(true) removes from GPU VRAM; false just removes the JS reference
5. Texture.from() accesses cache — Assets.load() also adds to cache + returns promise`,
    keyPoints: [
      'Texture = GPU image data; Sprite = visual object using that data',
      'Multiple Sprites sharing same Texture = 1 GPU upload, essential for batching',
      'anchor.set(0.5, 0.5) — center pivot makes rotation look correct',
      'Always destroy textures you no longer need: texture.destroy(true)',
    ],
  },
  {
    id: 'px-ext-3',
    title: 'How do PixiJS Filters work? Implement a win-flash glow effect.',
    difficulty: 'Intermediate',
    category: 'PixiJS',
    tags: ['filters', 'BlurFilter', 'ColorMatrixFilter', 'GlowFilter', 'shaders'],
    description: 'Explain the PixiJS filter pipeline, when filters break batching, and how to implement a symbol glow/flash effect for win presentations.',
    concept: 'Filters in PixiJS are WebGL fragment shaders that run on the GPU. They take a Container\'s rendered output as a texture and apply pixel-level effects. Each filter on a Container triggers an off-screen render pass — so 10 sprites with individual filters = 10 render passes. Applying ONE filter to a parent Container = 1 render pass for all children.',
    code: `import {
  Container, Sprite, BlurFilter, ColorMatrixFilter,
  AlphaFilter, Ticker
} from 'pixi.js';
// Note: GlowFilter requires @pixi/filter-glow package
// npm install @pixi/filter-glow
// import { GlowFilter } from '@pixi/filter-glow';

// === 1. BlurFilter — Gaussian blur ===
const blurFilter = new BlurFilter();
blurFilter.blur = 8;            // Blur strength (default: 8)
blurFilter.quality = 4;         // Passes (higher = smoother but slower)
blurFilter.repeatEdgePixels = true; // Avoid dark edges
sprite.filters = [blurFilter];

// === 2. ColorMatrixFilter — Color grading ===
const colorMatrix = new ColorMatrixFilter();

// Built-in presets:
colorMatrix.grayscale(1, false);   // Full grayscale
colorMatrix.brightness(1.5, false); // Brighten
colorMatrix.saturate(2, false);     // Boost saturation
colorMatrix.tint(0xFFD700, false);  // Tint gold
colorMatrix.reset();                // Reset to identity matrix

// === 3. AlphaFilter — alpha on entire Container ===
// Better than setting alpha on Container (avoids rendering artifacts)
const alphaFilter = new AlphaFilter(0.5);
container.filters = [alphaFilter];

// === Win Flash Effect — animate glow on winning symbols ===
class WinFlashEffect {
  private filter: ColorMatrixFilter;
  private elapsed = 0;
  private duration = 2000; // 2 seconds
  private ticker: Ticker;

  constructor(private symbols: Sprite[]) {
    this.filter = new ColorMatrixFilter();
    // Apply ONE filter to all winning sprites
    symbols.forEach(s => { s.filters = [this.filter]; });
    this.ticker = new Ticker();
    this.ticker.add(this.update);
    this.ticker.start();
  }

  private update = (ticker: Ticker): void => {
    this.elapsed += ticker.deltaMS;
    const progress = this.elapsed / this.duration;

    // Pulse: sine wave from 1.0 to 2.0 brightness
    const brightness = 1 + Math.sin(progress * Math.PI * 6) * 0.5;
    this.filter.reset();
    this.filter.brightness(brightness, false);

    if (this.elapsed >= this.duration) {
      this.cleanup();
    }
  };

  cleanup(): void {
    this.ticker.destroy();
    // Remove filters when done
    this.symbols.forEach(s => { s.filters = null; });
  }
}

// === PERFORMANCE TIP: Filters break batching ===
// BAD: Each sprite has its own filter → N render passes
sprites.forEach(s => { s.filters = [new BlurFilter()]; }); // N passes!

// GOOD: Put sprites in Container, filter the Container → 1 render pass
const container = new Container();
sprites.forEach(s => container.addChild(s));
container.filters = [new BlurFilter()]; // 1 pass for all children

// === Filter quality control ===
blurFilter.resolution = window.devicePixelRatio; // Match display resolution`,
    answer: `Filter interview talking points:
1. Filters = WebGL fragment shaders — they run on GPU but trigger extra render passes
2. Apply filters to Container, not individual sprites — N sprites, 1 pass vs N passes
3. filters = null removes all filters (don't set to [] — same performance cost as having a filter)
4. BlurFilter.quality controls number of passes — higher quality = more passes = slower
5. ColorMatrixFilter is a 4x5 matrix multiplication per pixel — very flexible for color effects
6. On mobile: minimize filter count — extra render passes tax the GPU significantly`,
    keyPoints: [
      'Filters break render batching — apply to Container not individual sprites',
      'Each filter = extra off-screen render pass',
      'filters = null (not []) to fully disable filter processing',
      'ColorMatrixFilter can do grayscale, brightness, saturation, hue all in one pass',
    ],
  },
  {
    id: 'px-ext-4',
    title: 'Explain Graphics API in PixiJS v8 — draw reel borders and paylines',
    difficulty: 'Intermediate',
    category: 'PixiJS',
    tags: ['Graphics', 'vector', 'v8 API', 'payline', 'mask'],
    description: 'Use the PixiJS Graphics class to draw reel frames, borders, and animated payline highlights. Covers the v8 API changes from v7.',
    concept: 'Graphics renders vector shapes directly to WebGL without a texture. In v8, the API was redesigned: fill()/stroke() are now separate calls after the shape method, unlike v7\'s beginFill()/endFill() wrapper pattern. Graphics objects are ideal for UI borders, masks, debug overlays, and dynamic shapes that change each frame.',
    code: `import { Graphics, Container, Application } from 'pixi.js';

// ============================================
// v7 API (OLD — you may see this in codebases)
// ============================================
const g_v7 = new Graphics();
g_v7.lineStyle(2, 0xFFD700, 1);   // stroke
g_v7.beginFill(0xFF0000, 0.5);    // fill with alpha
g_v7.drawRect(0, 0, 200, 100);
g_v7.drawCircle(100, 50, 30);
g_v7.drawRoundedRect(0, 0, 200, 100, 10);
g_v7.endFill();

// ============================================
// v8 API (NEW — use this)
// ============================================
const g = new Graphics();

// Rectangle
g.rect(10, 10, 200, 100);
g.fill({ color: 0xFF0000, alpha: 0.5 });
g.stroke({ color: 0xFFD700, width: 2, alpha: 1 });

// Rounded rectangle
g.roundRect(10, 10, 200, 100, 12); // last arg = corner radius
g.fill(0x1a1a2e);
g.stroke({ color: 0xFFD700, width: 2 });

// Circle
g.circle(100, 100, 50);
g.fill(0x00FF88);

// Polygon (arbitrary shape)
g.poly([0,0, 100,0, 150,50, 100,100, 0,100]);
g.fill(0xFF6600);

// Line
g.moveTo(0, 0);
g.lineTo(200, 100);
g.stroke({ color: 0xFFFFFF, width: 3 });

// === Clear and redraw (for animated graphics) ===
function drawPayline(g: Graphics, positions: {x: number, y: number}[]): void {
  g.clear(); // Reset all paths
  g.moveTo(positions[0].x, positions[0].y);
  for (let i = 1; i < positions.length; i++) {
    g.lineTo(positions[i].x, positions[i].y);
  }
  g.stroke({ color: 0xFFD700, width: 4, alpha: 0.9 });
}

// === Reel frame with glow border ===
function createReelFrame(width: number, height: number): Graphics {
  const frame = new Graphics();
  frame.roundRect(0, 0, width, height, 8);
  frame.fill({ color: 0x0d0f1a, alpha: 1 });       // Background
  frame.roundRect(0, 0, width, height, 8);
  frame.stroke({ color: 0xFFD700, width: 3, alpha: 0.8 }); // Gold border
  return frame;
}

// === Mask example — clip reel content to visible window ===
function createReelMask(width: number, height: number): Graphics {
  const mask = new Graphics();
  mask.rect(0, 0, width, height);
  mask.fill(0xFFFFFF); // Color doesn't matter — only shape matters for mask
  return mask;
}

const reelContainer = new Container();
const mask = createReelMask(160, 480); // 160px wide, 3 rows x 160px each
reelContainer.addChild(mask);
reelContainer.mask = mask; // Clips all children to this rectangle

// === Interactive Graphics (clickable) ===
const button = new Graphics();
button.roundRect(0, 0, 200, 60, 30);
button.fill(0xFFD700);
button.eventMode = 'static';
button.cursor = 'pointer';
button.on('pointerover', () => { button.tint = 0xFFA500; });
button.on('pointerout',  () => { button.tint = 0xFFFFFF; });`,
    answer: `v8 Graphics API changes to memorize:
1. v7: beginFill(color) → draw shapes → endFill() wraps everything
2. v8: draw shape → fill(color) → stroke(options) — each shape is independent
3. g.clear() removes all drawn paths and resets the object for redraw
4. Graphics used as mask: shape defines clip region — fill color is irrelevant
5. Graphics can have eventMode = 'static' for interactivity — useful for buttons
6. For complex static shapes: convert to RenderTexture for better performance`,
    keyPoints: [
      'v8: fill() and stroke() come AFTER the shape method, not before',
      'g.clear() is required before redrawing dynamic graphics each frame',
      'Mask = Graphics shape; fill color is irrelevant for masks',
      'Graphics breaks texture batching — use sparingly in hot render paths',
    ],
  },
  {
    id: 'px-ext-5',
    title: 'Text, BitmapText, and Typography in PixiJS — when to use each',
    difficulty: 'Beginner',
    category: 'PixiJS',
    tags: ['Text', 'BitmapText', 'TextStyle', 'typography', 'performance'],
    description: 'Compare Text vs BitmapText, when to use each, and how to implement a coin counter that animates from 0 to a win amount.',
    concept: 'Text renders using the Canvas2D API and uploads the result as a WebGL texture each time it changes — expensive for frequently updated text. BitmapText uses a pre-generated font atlas texture and renders like a Sprite — no re-upload on change, much faster. Use BitmapText for score displays, coin counters, win amounts. Use Text for static labels.',
    code: `import { Text, TextStyle, BitmapText, BitmapFont } from 'pixi.js';

// ============================================
// 1. Text — Rich styling, expensive on change
// ============================================
const style = new TextStyle({
  fontFamily: 'Arial, sans-serif',
  fontSize: 48,
  fontWeight: 'bold',
  fill: ['#FFD700', '#FFA500'],   // Gradient fill (array = gradient)
  stroke: { color: '#000000', width: 6 }, // Outline
  dropShadow: {
    color: '#000000',
    blur: 8,
    angle: Math.PI / 4, // 45 degrees
    distance: 6,
    alpha: 0.7,
  },
  wordWrap: true,
  wordWrapWidth: 400,
  align: 'center',
});

const label = new Text({ text: 'BIG WIN!', style });
label.anchor.set(0.5); // Center it
app.stage.addChild(label);

// Updating text = re-render + re-upload to GPU (expensive)
label.text = 'MEGA WIN!'; // Avoid in fast animation loops

// ============================================
// 2. BitmapText — Fast, ideal for counters
// ============================================
// First: install font (typically done at game startup)
BitmapFont.install({
  name: 'SlotFont',
  style: new TextStyle({
    fontFamily: 'Arial',
    fontSize: 64,
    fontWeight: 'bold',
    fill: 0xFFD700,
    stroke: { color: 0x000000, width: 8 },
  }),
  chars: BitmapFont.NUMERIC + '$.,+', // Only the chars we need
  resolution: window.devicePixelRatio,
});

const score = new BitmapText({
  text: '0',
  style: {
    fontFamily: 'SlotFont',
    fontSize: 64,
  },
});
score.anchor.set(0.5);

// Updating BitmapText = NO GPU re-upload (just repositions atlas quads)
// SAFE to update every frame in animation loops
score.text = '12345'; // Fast!

// ============================================
// 3. Coin counter animation (animates from current to target)
// ============================================
class CoinCounter {
  private text: BitmapText;
  private current = 0;
  private target = 0;
  private ticker: any;
  private onComplete?: () => void;

  constructor(stage: Container) {
    this.text = new BitmapText({ text: '0', style: { fontFamily: 'SlotFont', fontSize: 48 } });
    this.text.anchor.set(0.5);
    stage.addChild(this.text);
  }

  countTo(amount: number, duration: number, onComplete?: () => void): void {
    this.target = amount;
    this.onComplete = onComplete;
    const start = this.current;
    let elapsed = 0;

    const ticker = app.ticker.add((t: any) => {
      elapsed += t.deltaMS;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out — feels satisfying as counter slows down
      const eased = 1 - Math.pow(1 - progress, 3);
      this.current = Math.round(start + (amount - start) * eased);
      this.text.text = this.current.toLocaleString(); // "1,234"

      if (progress >= 1) {
        app.ticker.remove(ticker.fn ?? ticker);
        onComplete?.();
      }
    });
  }
}`,
    answer: `Text vs BitmapText decision matrix:
1. Static labels (game title, "SPIN" button) → Text (renders once, never changes)
2. Score/balance/win counter → BitmapText (changes frequently, no re-upload)
3. Debug overlays → Text (convenient, don't care about performance)
4. 60fps scrolling text → BitmapText (updates every frame without GPU cost)
5. BitmapFont.install chars: only include needed characters to minimize atlas size
6. The coin counter easing pattern (1-(1-t)^3) is a cubic ease-out — feels natural`,
    keyPoints: [
      'Text = Canvas2D render + GPU upload on every text change — avoid in game loops',
      'BitmapText = rearranges pre-uploaded atlas quads — zero GPU cost on change',
      'BitmapFont.NUMERIC = "0123456789" — minimal atlas for score displays',
      'Coin counter with ease-out cubic (1-(1-t)^3) pattern is a standard interview question',
    ],
  },
  {
    id: 'px-ext-6',
    title: 'Build a Particle Effect system in PixiJS for coin burst wins',
    difficulty: 'Advanced',
    category: 'PixiJS',
    tags: ['particles', 'object pool', 'animation', 'performance', 'win effect'],
    description: 'Implement a performant coin burst particle effect using an object pool pattern to avoid garbage collection spikes.',
    concept: 'Particle systems update hundreds of objects every frame. Naive implementation creates/destroys objects during animation, triggering GC pauses. The object pool pattern pre-allocates all particles at startup, reuses them by resetting properties rather than creating new ones, and eliminates GC pressure during animations — critical for 60fps gameplay.',
    code: `import { Container, Sprite, Texture, Ticker } from 'pixi.js';

interface Particle {
  sprite: Sprite;
  vx: number;  // velocity x
  vy: number;  // velocity y
  gravity: number;
  life: number;     // remaining life (0-1)
  maxLife: number;  // starting life in ms
  active: boolean;
}

class CoinBurst {
  private pool: Particle[] = [];
  private active: Particle[] = [];
  private container: Container;
  private texture: Texture;
  private ticker: Ticker;
  private poolSize = 100;

  constructor(parentContainer: Container, coinTexture: Texture) {
    this.container = new Container();
    parentContainer.addChild(this.container);
    this.texture = coinTexture;

    // === PRE-ALLOCATE ALL PARTICLES AT STARTUP ===
    // Never create new objects during the animation loop
    for (let i = 0; i < this.poolSize; i++) {
      const sprite = new Sprite(coinTexture);
      sprite.anchor.set(0.5);
      sprite.scale.set(0.5);
      sprite.visible = false; // Hidden until activated
      this.container.addChild(sprite);

      this.pool.push({
        sprite,
        vx: 0, vy: 0,
        gravity: 0,
        life: 0, maxLife: 0,
        active: false,
      });
    }

    this.ticker = new Ticker();
    this.ticker.add(this.update);
  }

  // === Acquire from pool (O(1) — no allocation) ===
  private acquire(): Particle | null {
    // Find first inactive particle
    for (const p of this.pool) {
      if (!p.active) return p;
    }
    return null; // Pool exhausted — drop the particle
  }

  // === Return to pool (O(1) — no deallocation) ===
  private release(particle: Particle): void {
    particle.active = false;
    particle.sprite.visible = false;
  }

  // === Emit particles at position ===
  emit(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const p = this.acquire();
      if (!p) break; // Pool empty — OK, just show fewer particles

      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 5; // Upward bias
      p.gravity = 0.3;
      p.maxLife = p.life = 800 + Math.random() * 400; // 0.8s–1.2s
      p.sprite.x = x;
      p.sprite.y = y;
      p.sprite.rotation = Math.random() * Math.PI * 2;
      p.sprite.alpha = 1;
      p.sprite.scale.set(0.3 + Math.random() * 0.4);
      p.sprite.visible = true;
      p.active = true;
    }

    if (!this.ticker.started) this.ticker.start();
  }

  private update = (ticker: Ticker): void => {
    let anyActive = false;

    for (const p of this.pool) {
      if (!p.active) continue;
      anyActive = true;

      p.life -= ticker.deltaMS;
      p.vy += p.gravity * ticker.deltaTime; // Apply gravity each frame
      p.sprite.x += p.vx * ticker.deltaTime;
      p.sprite.y += p.vy * ticker.deltaTime;
      p.sprite.rotation += 0.05 * ticker.deltaTime;
      p.sprite.alpha = Math.max(0, p.life / p.maxLife); // Fade out

      if (p.life <= 0) this.release(p);
    }

    if (!anyActive) this.ticker.stop(); // Stop loop when no active particles
  };

  destroy(): void {
    this.ticker.destroy();
    this.container.destroy({ children: true });
  }
}

// Usage:
const burst = new CoinBurst(app.stage, coinTexture);
burst.emit(400, 300, 50); // 50 coins burst from center`,
    answer: `Object pool interview key points:
1. Pre-allocate at startup, NEVER allocate inside the animation loop
2. acquire() finds inactive particle — O(N) scan is fine for small pools (<200)
3. release() just sets active=false and hides sprite — no deallocation
4. Stop the ticker when no active particles — saves CPU when idle
5. Pool exhaustion is acceptable — just emit fewer particles gracefully
6. For 200+ particles consider ParticleContainer (PixiJS built-in, much faster than Container)`,
    keyPoints: [
      'Object pool = pre-allocate + reuse — eliminates GC during animation',
      'acquire() finds free particle; release() marks it inactive — no new/delete',
      'Stop ticker when pool is empty to save CPU cycles',
      'PixiJS ParticleContainer is even faster for large particle counts (100+)',
    ],
  },
  {
    id: 'px-ext-7',
    title: 'AnimatedSprite — implement symbol spin and landing animation',
    difficulty: 'Intermediate',
    category: 'PixiJS',
    tags: ['AnimatedSprite', 'spritesheet', 'animation', 'frames'],
    description: 'Use AnimatedSprite to play frame-based animations for symbols — spin effect, landing bounce, and win glow loop.',
    concept: 'AnimatedSprite is a Sprite that cycles through an array of Textures. It handles frame timing internally and can play once, loop, or stop on a specific frame. In slot games, it\'s used for: symbol landing animations (bounce/pop), bonus symbol animations (animated wilds), win symbol loops (glowing/spinning symbols), and loading animations.',
    code: `import { AnimatedSprite, Spritesheet, Assets, Texture } from 'pixi.js';

// Load spritesheet (symbol animation frames)
const sheet: Spritesheet = await Assets.load('/coin-spin.json');

// === 1. Create AnimatedSprite from spritesheet frames ===
// coin-spin.json has frames: coin_00.png, coin_01.png ... coin_11.png
await sheet.parse(); // Parse frame data
const frames: Texture[] = Object.values(sheet.textures);

const animSprite = new AnimatedSprite(frames);
animSprite.anchor.set(0.5);
animSprite.animationSpeed = 0.5;  // 0.5 = plays at half speed (30fps at 60fps ticker)
                                    // 1.0 = one frame per game loop tick
                                    // 0.25 = very slow
animSprite.loop = true;
animSprite.play();
app.stage.addChild(animSprite);

// === 2. AnimatedSprite callbacks ===
animSprite.onComplete = () => {
  console.log('Animation finished (non-looping only)');
};
animSprite.onFrameChange = (currentFrame: number) => {
  console.log('Frame changed to:', currentFrame);
};
animSprite.onLoop = () => {
  console.log('Animation looped');
};

// === 3. Control playback ===
animSprite.play();               // Start/resume
animSprite.stop();               // Pause on current frame
animSprite.gotoAndPlay(3);       // Jump to frame 3 and play
animSprite.gotoAndStop(0);       // Jump to frame 0 and stop
animSprite.currentFrame;         // Get current frame index
animSprite.totalFrames;          // Total number of frames

// === 4. Landing Bounce — play once on reel stop ===
function playLandingAnimation(symbol: AnimatedSprite): Promise<void> {
  return new Promise(resolve => {
    symbol.loop = false;
    symbol.animationSpeed = 0.8;
    symbol.gotoAndPlay(0);
    symbol.onComplete = () => {
      symbol.loop = true;     // Resume idle loop after landing
      symbol.gotoAndPlay(0);
      resolve();
    };
  });
}

// === 5. Spritesheet JSON format (what the file looks like) ===
/*
{
  "frames": {
    "coin_00.png": { "frame": {"x":0,"y":0,"w":128,"h":128} },
    "coin_01.png": { "frame": {"x":128,"y":0,"w":128,"h":128} },
    ...
  },
  "meta": {
    "image": "coin-spin.png",
    "size": {"w":1024,"h":512},
    "animations": {
      "coin": ["coin_00.png","coin_01.png","coin_02.png","coin_03.png"]
    }
  }
}
*/

// Access named animations:
const coinFrames = sheet.animations['coin']; // Texture[]
const coinAnim = new AnimatedSprite(coinFrames);`,
    answer: `AnimatedSprite interview points:
1. animationSpeed is relative to ticker delta — 1.0 = one new frame per game tick (60fps = 60fps animation)
2. For a sprite sheet animation at 12fps: animationSpeed = 12/60 = 0.2
3. onComplete only fires when loop=false
4. gotoAndStop(0) on creation = first frame shown statically until play() called
5. sheet.animations gives named animation arrays from the "animations" block in JSON
6. For symbol landing: play once (loop=false), onComplete resume idle loop`,
    keyPoints: [
      'animationSpeed = 1.0 means one new frame per ticker tick (at 60fps = 60fps animation)',
      'onComplete only fires when loop = false',
      'sheet.animations["name"] gives Texture[] for named animation sequences',
      'gotoAndStop(0) to show static first frame before animation starts',
    ],
  },
  {
    id: 'px-ext-8',
    title: 'How do you integrate PixiJS with React using hooks?',
    difficulty: 'Intermediate',
    category: 'PixiJS',
    tags: ['React', 'useRef', 'useEffect', 'integration', 'cleanup'],
    description: 'Implement the correct pattern for mounting a PixiJS Application inside a React component using refs and proper cleanup.',
    concept: 'PixiJS manages its own DOM (a <canvas> element) and render loop outside React\'s control. The integration pattern: useRef holds the PixiJS Application instance (no re-renders), useEffect handles async init and cleanup, and the canvas is appended to a ref\'d div. Critical: React 18 StrictMode runs effects twice in development — handle double-init gracefully.',
    code: `import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

// ============================================
// Pattern 1: Basic React + PixiJS hook
// ============================================
function usePixiApp(config: { width: number; height: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Guard against React 18 StrictMode double-invoke
    if (appRef.current) return;

    const app = new Application();
    let mounted = true;

    app.init({
      width: config.width,
      height: config.height,
      background: '#0d0f1a',
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true, // Adjusts CSS size to match resolution
    }).then(() => {
      if (!mounted) { app.destroy(true); return; }
      appRef.current = app;
      containerRef.current?.appendChild(app.canvas);
    });

    // Cleanup: runs when component unmounts
    return () => {
      mounted = false;
      appRef.current?.destroy(true, { children: true, texture: true });
      appRef.current = null;
    };
  }, []); // Empty deps: run once on mount

  return { containerRef, appRef };
}

// ============================================
// Pattern 2: Full slot game component
// ============================================
interface SlotGameProps {
  onWin: (amount: number) => void;
  balance: number;
}

function SlotGame({ onWin, balance }: SlotGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const gameRef = useRef<SlotGameController | null>(null);

  // Initialize PixiJS once on mount
  useEffect(() => {
    let mounted = true;
    const app = new Application();

    app.init({ width: 1024, height: 576, background: '#0a0a1a' }).then(() => {
      if (!mounted) { app.destroy(true); return; }
      appRef.current = app;
      containerRef.current?.appendChild(app.canvas);

      // Initialize game controller
      gameRef.current = new SlotGameController(app);
      gameRef.current.on('win', onWin); // Forward events to React
    });

    return () => {
      mounted = false;
      gameRef.current?.destroy();
      gameRef.current = null;
      appRef.current?.destroy(true);
      appRef.current = null;
    };
  }, []);

  // React props → PixiJS: sync balance changes without re-mounting
  useEffect(() => {
    gameRef.current?.setBalance(balance);
  }, [balance]);

  // React events → PixiJS game
  const handleSpin = () => {
    gameRef.current?.spin();
  };

  return (
    <div className="relative">
      {/* PixiJS canvas lives here */}
      <div ref={containerRef} className="w-full" />
      {/* React UI overlay on top of canvas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button onClick={handleSpin}>SPIN</button>
      </div>
    </div>
  );
}

// ============================================
// Pattern 3: Responsive resize handling
// ============================================
function usePixiResize(appRef: React.RefObject<Application | null>) {
  useEffect(() => {
    const handleResize = () => {
      const app = appRef.current;
      if (!app) return;
      const { innerWidth: w, innerHeight: h } = window;
      app.renderer.resize(w, h);
      // Reposition game elements based on new size
    };

    // Debounced — don't resize on every pixel during drag
    let timeout: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debounced);
    return () => {
      window.removeEventListener('resize', debounced);
      clearTimeout(timeout);
    };
  }, [appRef]);
}`,
    answer: `React + PixiJS integration critical points:
1. useRef for app instance — NOT useState (useState causes re-render = destroys and remounts PixiJS)
2. React 18 StrictMode runs effects twice in development — guard with mounted flag
3. Return cleanup function from useEffect that calls app.destroy(true)
4. Never access DOM in render body — only in useEffect/event handlers
5. For two-way communication: PixiJS → React via callback props; React → PixiJS via useEffect watching prop changes
6. autoDensity: true + resolution: devicePixelRatio = sharp rendering on Retina displays`,
    keyPoints: [
      'useRef for Application instance — never useState (triggers re-render = destroy/remount)',
      'React 18 StrictMode double-invoke: guard with mounted boolean in async init',
      'Cleanup: app.destroy(true) removes canvas from DOM + frees GPU resources',
      'Two-way bridge: PixiJS→React via callbacks, React→PixiJS via useEffect on prop changes',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXTENDED SLOT GAMING QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const SLOT_EXTENDED_QUESTIONS: CodeQuestion[] = [
  {
    id: 'sl-ext-1',
    title: 'How does a real slot game RNG and payline evaluation work?',
    difficulty: 'Advanced',
    category: 'Slot Gaming',
    tags: ['RNG', 'payline', 'RTP', 'math', 'evaluation'],
    description: 'Implement a full payline evaluator for a 5x3 grid with wildcard support, scatter detection, and payout calculation.',
    concept: 'A slot machine\'s math model defines: reel strips (symbol distribution = probability), paytable (symbol combination → multiplier), paylines (position patterns), and RTP target. The server sends final reel positions, the client animates to those positions. Payline evaluation checks each defined pattern against the landed grid.',
    code: `// Complete payline evaluation system
type Symbol = 'SEVEN' | 'BAR' | 'CHERRY' | 'BELL' | 'WILD' | 'SCATTER';
type Grid = Symbol[][]; // grid[col][row] — 5 columns x 3 rows

// Payline definitions — positions [col][row] for each of 5 columns
const PAYLINES: [number, number][][] = [
  [[0,1],[1,1],[2,1],[3,1],[4,1]], // Line 1: Middle row
  [[0,0],[1,0],[2,0],[3,0],[4,0]], // Line 2: Top row
  [[0,2],[1,2],[2,2],[3,2],[4,2]], // Line 3: Bottom row
  [[0,0],[1,1],[2,2],[3,1],[4,0]], // Line 4: V shape
  [[0,2],[1,1],[2,0],[3,1],[4,2]], // Line 5: Inverted V
  // ... up to 243 ways in modern slots
];

// Paytable: symbol → [2match, 3match, 4match, 5match] multipliers
const PAYTABLE: Record<Symbol, number[]> = {
  SEVEN:   [0, 50, 200, 1000],
  BAR:     [0, 20,  80,  400],
  CHERRY:  [0, 10,  40,  200],
  BELL:    [0,  5,  20,  100],
  WILD:    [0,  0,   0,    0], // Wild pays via substitution only
  SCATTER: [0, 10,  50,  200], // Pays any position (not on paylines)
};

interface WinResult {
  lineIndex: number;
  symbol: Symbol;
  count: number;
  multiplier: number;
  positions: [number, number][];
  isScatter?: boolean;
}

function evaluatePaylines(grid: Grid, betPerLine: number): WinResult[] {
  const results: WinResult[] = [];

  // === Payline evaluation ===
  for (let l = 0; l < PAYLINES.length; l++) {
    const line = PAYLINES[l];
    const firstSymbol = grid[line[0][0]][line[0][1]];

    // Wilds substitute for the first non-wild symbol
    const effectiveSymbol: Symbol = firstSymbol === 'WILD'
      ? (grid[line[1][0]][line[1][1]] === 'WILD'
          ? (grid[line[2][0]][line[2][1]] === 'WILD'
              ? 'SEVEN' // All wilds = highest symbol
              : grid[line[2][0]][line[2][1]])
          : grid[line[1][0]][line[1][1]])
      : firstSymbol;

    if (effectiveSymbol === 'SCATTER') continue; // Scatter handled separately

    let count = 0;
    const positions: [number, number][] = [];

    for (const [col, row] of line) {
      const sym = grid[col][row];
      if (sym === effectiveSymbol || sym === 'WILD') {
        count++;
        positions.push([col, row]);
      } else break; // Consecutive from left — break on mismatch
    }

    if (count >= 3) {
      const multiplier = PAYTABLE[effectiveSymbol][count - 2] ?? 0;
      if (multiplier > 0) {
        results.push({ lineIndex: l, symbol: effectiveSymbol, count, multiplier, positions });
      }
    }
  }

  // === Scatter evaluation (counts anywhere on grid) ===
  let scatterCount = 0;
  const scatterPositions: [number, number][] = [];
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      if (grid[col][row] === 'SCATTER') {
        scatterCount++;
        scatterPositions.push([col, row]);
      }
    }
  }
  if (scatterCount >= 3) {
    const multiplier = PAYTABLE.SCATTER[scatterCount - 2] ?? 0;
    results.push({
      lineIndex: -1,
      symbol: 'SCATTER',
      count: scatterCount,
      multiplier: multiplier,
      positions: scatterPositions,
      isScatter: true,
    });
  }

  return results;
}

// Calculate total win
function calculateTotalWin(results: WinResult[], betPerLine: number): number {
  return results.reduce((total, result) => {
    return total + (result.isScatter
      ? result.multiplier * (betPerLine * PAYLINES.length) // Scatter pays total bet
      : result.multiplier * betPerLine                     // Line wins pay bet per line
    );
  }, 0);
}`,
    answer: `Payline evaluation implementation details:
1. Grid is [col][row] — 5 columns, 3 rows — NOT [row][col] — common confusion
2. Wild substitution: find first non-wild symbol on the line as "effective symbol"
3. Count consecutive matching symbols from LEFT — break on first non-match
4. Scatter pays anywhere — loop the entire grid, not paylines
5. Multiplier index: count-2 (3 matches = index 1, 4 matches = index 2, 5 = index 3)
6. In real games: server sends result, client only evaluates to know WHAT TO ANIMATE`,
    keyPoints: [
      'Grid is [column][row], not [row][column] — get this right in interviews',
      'Wild substitution: resolve effective symbol from first non-wild on the line',
      'Scatter counts total occurrences on grid, not consecutive on payline',
      'Client evaluates for animation purposes only — server is authoritative for payout',
    ],
  },
  {
    id: 'sl-ext-2',
    title: 'Build a Win Presentation orchestrator with cascading animations',
    difficulty: 'Advanced',
    category: 'Slot Gaming',
    tags: ['animation', 'async', 'Promise', 'orchestration', 'win presentation'],
    description: 'Implement a Win Presentation that shows each winning line sequentially, dims non-winning symbols, plays audio, and shows the total win counter.',
    concept: 'Win presentation is one of the most complex frontend tasks in slot gaming. It involves orchestrating multiple parallel and sequential animations: dimming, highlighting, line drawing, audio, and counter updates. A clean async/await pattern with Promises wrapping PixiJS Ticker animations is the professional approach.',
    code: `import { Container, Sprite, Graphics, ColorMatrixFilter, Ticker } from 'pixi.js';

interface WinLine { positions: [number,number][]; symbol: string; multiplier: number; }

class WinPresenter {
  private symbols: Sprite[][];   // [col][row]
  private paylineGraphics: Graphics;
  private dimFilter: ColorMatrixFilter;
  private isPresenting = false;

  constructor(
    symbols: Sprite[][],
    container: Container,
    private audio: SlotAudioManager,
    private coinCounter: CoinCounter,
  ) {
    this.symbols = symbols;
    this.paylineGraphics = new Graphics();
    container.addChild(this.paylineGraphics);
    this.dimFilter = new ColorMatrixFilter();
    this.dimFilter.brightness(0.3, false); // 30% brightness for dim effect
  }

  async presentWins(wins: WinLine[], betPerLine: number): Promise<void> {
    if (this.isPresenting) return;
    this.isPresenting = true;

    const totalWin = wins.reduce((s, w) => s + w.multiplier * betPerLine, 0);

    // Play each win line sequentially, then loop
    for (let cycle = 0; cycle < 3; cycle++) { // 3 presentation cycles
      for (const win of wins) {
        await this.presentSingleWin(win);
        await sleep(600); // Pause between lines
      }
    }

    // Animate total win counter
    await this.coinCounter.countTo(totalWin, 1500);
    this.cleanup();
    this.isPresenting = false;
  }

  private async presentSingleWin(win: WinLine): Promise<void> {
    // Step 1: Dim all symbols
    this.dimAllSymbols();

    // Step 2: Highlight winning symbols (run in parallel with line draw)
    await Promise.all([
      this.highlightSymbols(win.positions),
      this.drawPayline(win.positions),
      this.audio.play('line-win'),
    ]);

    await sleep(800); // Hold the highlight
  }

  private dimAllSymbols(): void {
    this.symbols.flat().forEach(sprite => {
      sprite.filters = [this.dimFilter];
    });
  }

  private async highlightSymbols(positions: [number,number][]): Promise<void> {
    // Remove dim from winning symbols and add glow
    const winSprites = positions.map(([col, row]) => this.symbols[col][row]);
    winSprites.forEach(sprite => {
      sprite.filters = null; // Remove dim
      // Add pulse animation
    });

    // Animate scale pulse
    return animateScale(winSprites, 1.0, 1.2, 0.3, 200); // 0→1.2x in 200ms
  }

  private async drawPayline(positions: [number,number][]): Promise<void> {
    const SYMBOL_W = 160, SYMBOL_H = 160;
    this.paylineGraphics.clear();

    // Animate line drawing (reveal over 300ms)
    return new Promise(resolve => {
      let progress = 0;
      const total = positions.length - 1;
      const ticker = new Ticker();
      ticker.add((t) => {
        progress = Math.min(progress + t.deltaMS / 300, 1);
        this.paylineGraphics.clear();

        const drawUpTo = Math.floor(progress * total);
        for (let i = 0; i < drawUpTo; i++) {
          const [c1, r1] = positions[i];
          const [c2, r2] = positions[i + 1];
          this.paylineGraphics.moveTo(c1 * SYMBOL_W + SYMBOL_W/2, r1 * SYMBOL_H + SYMBOL_H/2);
          this.paylineGraphics.lineTo(c2 * SYMBOL_W + SYMBOL_W/2, r2 * SYMBOL_H + SYMBOL_H/2);
          this.paylineGraphics.stroke({ color: 0xFFD700, width: 4, alpha: 0.9 });
        }

        if (progress >= 1) { ticker.destroy(); resolve(); }
      });
      ticker.start();
    });
  }

  private cleanup(): void {
    this.paylineGraphics.clear();
    this.symbols.flat().forEach(s => { s.filters = null; });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}`,
    answer: `Win presentation architecture points:
1. Sequential vs parallel: lines shown sequentially, but dimming + highlighting + audio can be Promise.all'd
2. dimFilter applied to container of all symbols, then removed from winning ones (1 filter on container = 1 render pass)
3. Never use setTimeout chains — Promise-based async/await is cleaner and cancellable
4. The 3-cycle loop is standard: show all lines 3x, then total win screen
5. Big Win threshold check: if totalWin > 10x bet → Big Win screen → if > 50x → Mega Win`,
    keyPoints: [
      'Promise.all() for parallel: dimming + highlighting + audio simultaneously',
      'Sequential for-of loop for win lines — each line awaited before next',
      'Apply dim filter to parent Container, not individual sprites (1 pass, not N)',
      'Wrap Ticker animations in Promises for clean async orchestration',
    ],
  },
  {
    id: 'sl-ext-3',
    title: 'Implement a Free Spins bonus round with multiplier accumulation',
    difficulty: 'Advanced',
    category: 'Slot Gaming',
    tags: ['free spins', 'bonus', 'multiplier', 'state machine', 'UI'],
    description: 'Design and implement a Free Spins bonus mode that tracks remaining spins, accumulates a multiplier, and transitions back to base game.',
    concept: 'Free Spins is a separate game mode (state) triggered by 3+ scatters. It has its own spin counter, potentially different reel strips, a multiplier that can increase with each scatter landing, and a retrigger mechanic. From a frontend perspective, it requires a mode switch (different UI, different animations, different audio), and careful state management.',
    code: `// Free Spins State Machine + Manager
interface FreeSpinaState {
  active: boolean;
  totalSpins: number;
  remainingSpins: number;
  multiplier: number;
  totalWin: number;
  isRetriggered: boolean;
}

type FreeSpinsEvent =
  | { type: 'TRIGGER'; totalSpins: number }
  | { type: 'SPIN_COMPLETE'; win: number; scattersLanded: number }
  | { type: 'RETRIGGER'; additionalSpins: number }
  | { type: 'END' };

class FreeSpinsManager {
  private state: FreeSpinaState = {
    active: false,
    totalSpins: 0,
    remainingSpins: 0,
    multiplier: 1,
    totalWin: 0,
    isRetriggered: false,
  };

  private listeners = new Map<string, Set<Function>>();

  // Trigger free spins (called when server sends trigger result)
  trigger(totalSpins: number): void {
    this.state = {
      active: true,
      totalSpins,
      remainingSpins: totalSpins,
      multiplier: 1,
      totalWin: 0,
      isRetriggered: false,
    };
    this.emit('start', this.state);
    this.showTransitionAnimation().then(() => {
      this.emit('ready', this.state);
    });
  }

  // Called after each free spin completes
  onSpinComplete(win: number, scattersLanded: number): void {
    this.state.totalWin += win;
    this.state.remainingSpins--;

    // Scatter landing during free spins increases multiplier
    if (scattersLanded > 0) {
      this.state.multiplier += scattersLanded;
      this.emit('multiplier-increase', this.state.multiplier);
    }

    this.emit('spin-complete', {
      win,
      remaining: this.state.remainingSpins,
      multiplier: this.state.multiplier,
    });

    // Retrigger: 3+ scatters during free spins adds more spins
    if (scattersLanded >= 3) {
      const additional = 10; // 3 scatters = +10 free spins
      this.state.totalSpins += additional;
      this.state.remainingSpins += additional;
      this.state.isRetriggered = true;
      this.emit('retrigger', { additional, total: this.state.totalSpins });
    }

    if (this.state.remainingSpins <= 0) {
      this.end();
    }
  }

  private async end(): Promise<void> {
    await this.showTotalWinScreen(this.state.totalWin, this.state.multiplier);
    this.state.active = false;
    this.emit('end', { totalWin: this.state.totalWin });
  }

  private async showTransitionAnimation(): Promise<void> {
    // Animate: base game fades out → free spins UI fades in
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async showTotalWinScreen(win: number, mult: number): Promise<void> {
    // Show: "FREE SPINS COMPLETE — X12 MULTIPLIER — TOTAL WIN: 1,234"
    return new Promise(resolve => setTimeout(resolve, 3000));
  }

  on(event: string, handler: Function): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  }

  private emit(event: string, data?: unknown): void {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }

  getState(): Readonly<FreeSpinaState> { return { ...this.state }; }
  isActive(): boolean { return this.state.active; }
}

// React integration
function useFreeSpins() {
  const [fsState, setFsState] = useState<FreeSpinaState | null>(null);
  const managerRef = useRef(new FreeSpinsManager());

  useEffect(() => {
    const manager = managerRef.current;
    const unsub1 = manager.on('start', setFsState);
    const unsub2 = manager.on('spin-complete', () => setFsState(manager.getState()));
    const unsub3 = manager.on('end', () => setFsState(null));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  return { fsState, manager: managerRef.current };
}`,
    answer: `Free spins implementation key design decisions:
1. Free spins is a separate state in the FSM — not a modifier of base state
2. Multiplier accumulates via scatter landing during free spins (not just at start)
3. Retrigger adds more spins — don't reset multiplier on retrigger
4. Client shows transition animation; server uses different reel strips for free spins
5. Total win display: win × multiplier shown at end, coin counter animates up
6. 'active' flag prevents double-triggering while already in free spins`,
    keyPoints: [
      'Free spins = separate FSM state, not a base game modifier',
      'Multiplier increments per scatter landed DURING free spins',
      'Retrigger adds spins but does NOT reset the accumulated multiplier',
      'Server sends special free-spin results using different reel strip math',
    ],
  },
  {
    id: 'sl-ext-4',
    title: 'Implement Hold & Win / Bonus Buy mechanics',
    difficulty: 'Expert',
    category: 'Slot Gaming',
    tags: ['hold & win', 'respin', 'bonus buy', 'game modes'],
    description: 'Design a Hold & Win respin mechanic where landed coin symbols hold in place and trigger additional respins, with a prize collection system.',
    concept: 'Hold & Win is a popular bonus mechanic: when special symbols (coins, gems) land, they "hold" in their positions and award additional respins. Any new special symbols that land during respins also hold and reset the respin counter. The round ends when respins = 0 or the grid is filled. Bonus Buy lets players pay a premium to directly enter this mode.',
    code: `// Hold & Win Mechanic
interface HoldPosition {
  col: number;
  row: number;
  value: number; // Prize value of this coin
}

interface HoldAndWinState {
  heldPositions: Map<string, HoldPosition>; // key: "col,row"
  respinsRemaining: number;
  maxRespins: number;
  totalPrize: number;
  jackpots: { mini: number; minor: number; major: number; grand: number };
}

class HoldAndWinGame {
  private state: HoldAndWinState = {
    heldPositions: new Map(),
    respinsRemaining: 3,  // Always starts at 3
    maxRespins: 3,
    totalPrize: 0,
    jackpots: { mini: 50, minor: 250, major: 1000, grand: 10000 },
  };

  private GRID_SIZE = 15; // 5x3 = 15 positions total
  private onStateChange?: (state: HoldAndWinState) => void;

  // Trigger from base game (server sends trigger result)
  trigger(initialCoins: HoldPosition[]): void {
    this.state.heldPositions.clear();
    this.state.respinsRemaining = this.state.maxRespins;
    this.state.totalPrize = 0;

    initialCoins.forEach(coin => {
      const key = \`\${coin.col},\${coin.row}\`;
      this.state.heldPositions.set(key, coin);
      this.state.totalPrize += coin.value;
    });

    this.onStateChange?.(this.state);
  }

  // Called after each respin with new coin positions from server
  onRespinComplete(newCoins: HoldPosition[]): void {
    const hadNewCoins = newCoins.length > 0;

    newCoins.forEach(coin => {
      const key = \`\${coin.col},\${coin.row}\`;
      if (!this.state.heldPositions.has(key)) {
        this.state.heldPositions.set(key, coin);
        this.state.totalPrize += coin.value;
      }
    });

    if (hadNewCoins) {
      // Reset respin counter on any new coin
      this.state.respinsRemaining = this.state.maxRespins;
    } else {
      this.state.respinsRemaining--;
    }

    // Check for full grid (jackpot condition)
    if (this.state.heldPositions.size === this.GRID_SIZE) {
      this.state.totalPrize += this.state.jackpots.grand; // Grand jackpot!
      this.end('grand-jackpot');
      return;
    }

    if (this.state.respinsRemaining <= 0) {
      this.end('normal');
    } else {
      this.onStateChange?.(this.state);
    }
  }

  // Bonus Buy: skip base game, directly enter Hold & Win
  // Cost = current bet × 100 (standard multiplier, varies by game)
  bonusBuy(betAmount: number): number {
    const cost = betAmount * 100;
    // UI asks server: "trigger Hold & Win with betAmount, charge cost"
    // Server responds with trigger result
    return cost;
  }

  private end(type: 'normal' | 'grand-jackpot'): void {
    // Final prize = sum of all coin values + any jackpots
    const finalPrize = this.state.totalPrize;
    // Trigger win presentation, then return to base game
  }
}

// React Hook for Hold & Win UI
function useHoldAndWin() {
  const [state, setState] = useState<{
    isActive: boolean;
    heldPositions: HoldPosition[];
    respinsRemaining: number;
    totalPrize: number;
  }>({ isActive: false, heldPositions: [], respinsRemaining: 3, totalPrize: 0 });

  // Grid overlay showing held coins
  function renderHoldGrid(cols: number, rows: number) {
    return Array.from({ length: cols }, (_, col) =>
      Array.from({ length: rows }, (_, row) => {
        const pos = state.heldPositions.find(p => p.col === col && p.row === row);
        return (
          <div key={\`\${col}-\${row}\`}
            className={\`held-cell \${pos ? 'has-coin' : ''}\`}
          >
            {pos && <span className="coin-value">{pos.value}</span>}
          </div>
        );
      })
    );
  }

  return { state, renderHoldGrid };
}`,
    answer: `Hold & Win key mechanics:
1. Respin counter ALWAYS resets to 3 when ANY new coin lands (not just on first land)
2. Full grid fill = Grand Jackpot regardless of respin count
3. Coins never move — they hold their exact position for the entire round
4. Bonus Buy typically costs 80-100x bet — client sends special request to server
5. The server generates results for each respin using different RTP math than base game
6. Client must lock non-held reel positions and only spin free ones`,
    keyPoints: [
      'Respin counter resets to 3 on ANY new coin landing — not just once',
      'Full 15-position grid = Grand Jackpot (extra multiplier added)',
      'Held positions are immovable — only free cells participate in respins',
      'Bonus Buy = special server request, not client-side shortcut',
    ],
  },
  {
    id: 'sl-ext-5',
    title: 'How do you handle network failure during a spin?',
    difficulty: 'Expert',
    category: 'Slot Gaming',
    tags: ['error handling', 'network', 'recovery', 'spin result', 'round ID'],
    description: 'Design a fault-tolerant spin flow that handles network disconnections mid-spin, prevents double-charging, and recovers correctly.',
    concept: 'In regulated gambling, a spin that is "lost" in the network is a critical issue — the player was charged but got no result. The solution uses idempotent round IDs: the server assigns a roundId before deducting balance, which the client stores persistently. On reconnect, the client sends the unresolved roundId and the server returns the same result (not a new spin).',
    code: `// Fault-tolerant spin flow
interface SpinRequest {
  roundId: string;    // Client-generated UUID — idempotency key
  betAmount: number;
  betLines: number;
}

interface SpinResult {
  roundId: string;
  grid: string[][];
  wins: WinLine[];
  totalWin: number;
  newBalance: number;
  freeSpinsAwarded?: number;
}

class FaultTolerantSpinController {
  // Store pending round ID in sessionStorage (survives refresh, not tab close)
  private readonly PENDING_KEY = 'pending_round_id';

  async spin(betAmount: number): Promise<SpinResult> {
    // Step 1: Check for unresolved round from previous session
    const existingRoundId = sessionStorage.getItem(this.PENDING_KEY);
    if (existingRoundId) {
      return this.recoverRound(existingRoundId);
    }

    // Step 2: Generate idempotency key
    const roundId = crypto.randomUUID();

    // Step 3: Persist BEFORE sending request
    sessionStorage.setItem(this.PENDING_KEY, roundId);

    try {
      // Step 4: Send spin request (server deducts balance + returns result)
      const result = await this.sendSpinRequest({ roundId, betAmount, betLines: 20 });

      // Step 5: Clear pending round on success
      sessionStorage.removeItem(this.PENDING_KEY);
      return result;

    } catch (error) {
      // Network error — round ID remains in storage
      // Next spin attempt will call recoverRound() first
      if (error instanceof NetworkError) {
        // Show "Connection lost — attempting to reconnect" UI
        return this.waitForReconnectAndRecover(roundId);
      }
      // Non-network error (server error) — clear and report
      sessionStorage.removeItem(this.PENDING_KEY);
      throw error;
    }
  }

  // Server returns SAME result for same roundId (idempotent)
  private async recoverRound(roundId: string): Promise<SpinResult> {
    console.log('Recovering round:', roundId);
    try {
      const result = await this.fetchRoundResult(roundId);
      sessionStorage.removeItem(this.PENDING_KEY);
      // Animate the result (user sees the spin result they missed)
      return result;
    } catch {
      // Round not found — was never processed, safe to clear
      sessionStorage.removeItem(this.PENDING_KEY);
      throw new Error('Round recovery failed — please contact support');
    }
  }

  private async waitForReconnectAndRecover(roundId: string): Promise<SpinResult> {
    // Poll for connection every 2 seconds
    return new Promise(resolve => {
      const interval = setInterval(async () => {
        try {
          const result = await this.recoverRound(roundId);
          clearInterval(interval);
          resolve(result);
        } catch {
          // Still disconnected — keep waiting
          console.log('Still trying to recover round...');
        }
      }, 2000);
    });
  }

  private async sendSpinRequest(req: SpinRequest): Promise<SpinResult> {
    const res = await fetch('/api/spin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(\`Spin failed: \${res.status}\`);
    return res.json();
  }

  private async fetchRoundResult(roundId: string): Promise<SpinResult> {
    const res = await fetch(\`/api/round/\${roundId}\`);
    if (!res.ok) throw new Error('Round not found');
    return res.json();
  }
}`,
    answer: `Network fault tolerance in gambling — regulatory requirement:
1. roundId must be generated by client and stored BEFORE the request is sent
2. Server must be idempotent on roundId — same roundId = same result (no double charge)
3. sessionStorage (not localStorage): survives page refresh but not tab close — user awareness
4. Recovery: on app start, always check for pending roundId before allowing new spin
5. If server returns "round not found": either it was never processed (safe to new spin) or already resolved
6. This pattern is required by gambling regulations in most jurisdictions`,
    keyPoints: [
      'Generate roundId client-side, persist BEFORE sending — enables idempotent recovery',
      'Server must return same result for same roundId — never charge twice',
      'sessionStorage over localStorage — clears when tab closes (user knows)',
      'Check for pending roundId on every app load before allowing new spins',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// WEBSOCKET QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const WEBSOCKET_QUESTIONS: CodeQuestion[] = [
  {
    id: 'ws-1',
    title: 'Implement a production WebSocket client with auto-reconnect and heartbeat',
    difficulty: 'Advanced',
    category: 'Performance',
    tags: ['WebSocket', 'reconnect', 'heartbeat', 'exponential backoff', 'real-time'],
    description: 'Build a robust WebSocket client class that handles connection drops, implements exponential backoff reconnection, sends ping/pong heartbeats, and provides a clean subscription API.',
    concept: 'Raw WebSocket is unreliable in production: connections drop silently, mobile networks suspend apps, proxies kill idle connections. A production-grade client needs: auto-reconnect with exponential backoff (prevent server flood), heartbeat to detect silent disconnections, message queuing for offline periods, and an event emitter API for components to subscribe to specific message types.',
    code: `// Production WebSocket Client
type WSMessage = { type: string; payload: unknown };
type MessageHandler<T = unknown> = (payload: T) => void;

interface WSOptions {
  url: string;
  protocols?: string[];
  heartbeatInterval?: number; // ms between ping messages
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
}

class GameWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private messageQueue: WSMessage[] = []; // Queue messages while disconnected
  private handlers = new Map<string, Set<MessageHandler>>();
  private intentionalClose = false;
  private readonly MAX_QUEUE = 50;

  constructor(private options: WSOptions) {}

  connect(): void {
    this.intentionalClose = false;
    this.createConnection();
  }

  private createConnection(): void {
    try {
      this.ws = new WebSocket(this.options.url, this.options.protocols);
      this.ws.onopen    = this.handleOpen;
      this.ws.onclose   = this.handleClose;
      this.ws.onerror   = this.handleError;
      this.ws.onmessage = this.handleMessage;
    } catch (err) {
      console.error('[WS] Failed to create connection:', err);
      this.scheduleReconnect();
    }
  }

  private handleOpen = (): void => {
    console.log('[WS] Connected');
    this.reconnectAttempts = 0;
    this.clearReconnectTimer();
    this.startHeartbeat();
    this.options.onConnect?.();

    // Flush queued messages
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()!;
      this.sendImmediate(msg);
    }
  };

  private handleClose = (event: CloseEvent): void => {
    console.log(\`[WS] Closed: \${event.code} \${event.reason}\`);
    this.stopHeartbeat();
    this.options.onDisconnect?.(event.reason);
    if (!this.intentionalClose) {
      this.scheduleReconnect();
    }
  };

  private handleError = (event: Event): void => {
    console.error('[WS] Error:', event);
    // handleClose will fire after error — reconnect handled there
  };

  private handleMessage = (event: MessageEvent): void => {
    // Reset pong timeout — server is alive
    this.clearPongTimer();

    let msg: WSMessage;
    try {
      msg = JSON.parse(event.data as string);
    } catch {
      console.warn('[WS] Non-JSON message:', event.data);
      return;
    }

    // Handle heartbeat pong
    if (msg.type === 'pong') return;

    // Dispatch to registered handlers
    this.handlers.get(msg.type)?.forEach(handler => {
      try { handler(msg.payload); }
      catch (err) { console.error('[WS] Handler error:', err); }
    });

    // Also dispatch to wildcard handlers
    this.handlers.get('*')?.forEach(handler => handler(msg));
  };

  // === Heartbeat — detect silent disconnections ===
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) return;
      this.ws.send(JSON.stringify({ type: 'ping' }));

      // If no pong in 5s, assume dead connection
      this.pongTimer = setTimeout(() => {
        console.warn('[WS] Pong timeout — forcing reconnect');
        this.ws?.close(4000, 'Heartbeat timeout');
      }, 5000);
    }, this.options.heartbeatInterval ?? 30000);
  }

  private stopHeartbeat(): void {
    clearInterval(this.heartbeatTimer!);
    this.heartbeatTimer = null;
    this.clearPongTimer();
  }

  private clearPongTimer(): void {
    clearTimeout(this.pongTimer!);
    this.pongTimer = null;
  }

  // === Exponential backoff reconnect ===
  private scheduleReconnect(): void {
    const max = this.options.maxReconnectAttempts ?? 10;
    if (this.reconnectAttempts >= max) {
      console.error('[WS] Max reconnect attempts reached');
      this.emit('connection-failed', null);
      return;
    }
    // 500ms, 1s, 2s, 4s, 8s, 16s, 32s, 60s cap
    const delay = Math.min(500 * Math.pow(2, this.reconnectAttempts), 60000);
    const jitter = Math.random() * 500; // Prevent thundering herd
    this.reconnectAttempts++;
    console.log(\`[WS] Reconnecting in \${delay}ms (attempt \${this.reconnectAttempts})\`);
    this.reconnectTimer = setTimeout(() => this.createConnection(), delay + jitter);
  }

  private clearReconnectTimer(): void {
    clearTimeout(this.reconnectTimer!);
    this.reconnectTimer = null;
  }

  // === Public API ===
  send(msg: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendImmediate(msg);
    } else {
      // Queue for when connection restores
      if (this.messageQueue.length < this.MAX_QUEUE) {
        this.messageQueue.push(msg);
      }
    }
  }

  private sendImmediate(msg: WSMessage): void {
    this.ws!.send(JSON.stringify(msg));
  }

  on<T = unknown>(type: string, handler: MessageHandler<T>): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler as MessageHandler);
    return () => this.handlers.get(type)?.delete(handler as MessageHandler);
  }

  private emit(type: string, payload: unknown): void {
    this.handlers.get(type)?.forEach(h => h(payload));
  }

  disconnect(): void {
    this.intentionalClose = true;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    this.ws?.close(1000, 'Client disconnect');
    this.ws = null;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}`,
    answer: `WebSocket production patterns:
1. Exponential backoff: 500ms→1s→2s→4s ... capped at 60s — prevents server flood on mass reconnect
2. Jitter (+random 0-500ms) prevents thundering herd when many clients reconnect simultaneously
3. Heartbeat detects silent disconnects (proxy timeouts, network drops without TCP RST)
4. Pong timeout: if server doesn't respond to ping in 5s, force-close and reconnect
5. Message queue: buffer sends during disconnect, flush on reconnect (up to MAX_QUEUE limit)
6. intentionalClose flag: distinguishes user-initiated close from network drop`,
    keyPoints: [
      'Exponential backoff with jitter prevents thundering herd on server restart',
      'Heartbeat (ping/pong) detects silent drops — proxies kill idle connections at 30-60s',
      'Message queue allows sending while temporarily disconnected',
      'intentionalClose prevents reconnect on deliberate ws.close()',
    ],
  },
  {
    id: 'ws-2',
    title: 'Integrate WebSocket with React using custom hooks and SWR/Zustand',
    difficulty: 'Intermediate',
    category: 'Performance',
    tags: ['React', 'hooks', 'WebSocket', 'useWebSocket', 'real-time state'],
    description: 'Build a useWebSocket React hook that provides real-time slot game events (balance updates, jackpot notifications, live wins feed) to components.',
    concept: 'React components need a clean interface to WebSocket data. The pattern is: one singleton WebSocket client at the app level, a custom hook that subscribes to specific message types and converts them into React state, and cleanup on unmount. Never create a new WebSocket connection per component — share one connection across the entire app.',
    code: `// React WebSocket integration patterns
import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';

// ============================================
// 1. Context: One WS connection for the whole app
// ============================================
const WSContext = createContext<GameWebSocketClient | null>(null);

function WSProvider({ children, url }: { children: React.ReactNode; url: string }) {
  const clientRef = useRef<GameWebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new GameWebSocketClient({
      url,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
    });
    client.connect();
    clientRef.current = client;

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, [url]);

  return (
    <WSContext.Provider value={clientRef.current}>
      {children}
    </WSContext.Provider>
  );
}

// ============================================
// 2. useWSMessage — subscribe to specific message type
// ============================================
function useWSMessage<T>(messageType: string): T | null {
  const client = useContext(WSContext);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!client) return;
    // Returns unsubscribe function — used as cleanup
    return client.on<T>(messageType, setData);
  }, [client, messageType]);

  return data;
}

// ============================================
// 3. useBalance — real-time balance updates
// ============================================
function useBalance(initialBalance: number) {
  const balanceUpdate = useWSMessage<{ balance: number; delta: number }>('balance_update');
  const [balance, setBalance] = useState(initialBalance);

  useEffect(() => {
    if (balanceUpdate) {
      setBalance(balanceUpdate.balance);
    }
  }, [balanceUpdate]);

  return balance;
}

// ============================================
// 4. useJackpotFeed — live jackpot ticker
// ============================================
interface JackpotEvent {
  winnerId: string;
  amount: number;
  jackpotType: 'mini' | 'minor' | 'major' | 'grand';
  timestamp: number;
}

function useJackpotFeed(maxItems = 5) {
  const [events, setEvents] = useState<JackpotEvent[]>([]);
  const newEvent = useWSMessage<JackpotEvent>('jackpot_win');

  useEffect(() => {
    if (!newEvent) return;
    setEvents(prev => [newEvent, ...prev].slice(0, maxItems)); // Keep last N
  }, [newEvent, maxItems]);

  return events;
}

// ============================================
// 5. useSpin — send spin request via WebSocket
// ============================================
function useSpin() {
  const client = useContext(WSContext);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!client) return;
    return client.on<SpinResult>('spin_result', (result) => {
      setSpinResult(result);
      setIsSpinning(false);
    });
  }, [client]);

  const spin = useCallback((betAmount: number) => {
    if (!client?.isConnected || isSpinning) return;
    const roundId = crypto.randomUUID();
    sessionStorage.setItem('pending_round_id', roundId);
    setIsSpinning(true);
    client.send({ type: 'spin', payload: { roundId, betAmount } });
  }, [client, isSpinning]);

  return { spin, spinResult, isSpinning };
}

// ============================================
// 6. Connection status indicator component
// ============================================
function ConnectionStatus() {
  const client = useContext(WSContext);
  const [status, setStatus] = useState<'connected'|'disconnected'|'reconnecting'>('disconnected');

  useEffect(() => {
    if (!client) return;
    const unsub1 = client.on('connection-restored', () => setStatus('connected'));
    const unsub2 = client.on('connection-lost', () => setStatus('reconnecting'));
    const unsub3 = client.on('connection-failed', () => setStatus('disconnected'));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [client]);

  const colors = { connected: 'text-green-400', disconnected: 'text-red-400', reconnecting: 'text-yellow-400' };

  return (
    <div className={\`flex items-center gap-1 text-xs \${colors[status]}\`}>
      <span className="relative flex size-2">
        <span className={status === 'connected' ? 'animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75' : ''} />
        <span className="relative inline-flex rounded-full size-2 bg-current" />
      </span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}`,
    answer: `React WebSocket architecture rules:
1. ONE WebSocket connection per app via Context — never create per-component
2. Custom hooks abstract the subscription logic — components just call useBalance()
3. Cleanup: always return the unsubscribe function from on() inside useEffect cleanup
4. Balance updates via WS: don't rely on spin HTTP response for balance — use dedicated WS event
5. Message queue in hook: useRef for latest values, useState only for render-triggering data
6. Never send WebSocket messages from render — only from event handlers or useEffect`,
    keyPoints: [
      'Single WS connection in Context — share across all components, never per-component',
      'Custom hook returns unsubscribe function as useEffect cleanup',
      'Balance/jackpot updates push from server — client never polls',
      'isSpinning flag prevents double-spin — check before sending',
    ],
  },
  {
    id: 'ws-3',
    title: 'WebSocket vs HTTP polling vs SSE — when to use each in slot gaming',
    difficulty: 'Intermediate',
    category: 'Performance',
    tags: ['WebSocket', 'SSE', 'polling', 'architecture', 'comparison'],
    description: 'Compare the three real-time communication patterns and explain which is appropriate for different slot game features.',
    concept: 'WebSocket, Server-Sent Events (SSE), and HTTP polling are three different real-time patterns with different trade-offs. WebSocket is full-duplex (bidirectional) over a single TCP connection. SSE is server-to-client only (unidirectional) over HTTP. Polling is repeated HTTP requests. Each is optimal for different slot game needs.',
    code: `// ============================================
// 1. WebSocket — Full duplex, bidirectional
// ============================================
// USE FOR: spin requests+results, bet changes, player actions
// The client SENDS and RECEIVES over same connection

const ws = new WebSocket('wss://game.casino.com/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'spin', payload: { bet: 1, lines: 20 } }));
};
ws.onmessage = (e) => {
  const { type, payload } = JSON.parse(e.data);
  if (type === 'spin_result') animateReels(payload);
};

// Lifecycle:
// 1. TCP handshake → HTTP upgrade handshake (101 Switching Protocols)
// 2. Both sides can send at any time
// 3. Low overhead after handshake — no HTTP headers per message
// 4. Single long-lived TCP connection

// ============================================
// 2. Server-Sent Events (SSE) — Server→Client only
// ============================================
// USE FOR: live jackpot feed, player activity feed, announcements
// Server PUSHES, client cannot SEND back (use separate HTTP for sends)

const eventSource = new EventSource('/api/jackpot-feed');

// Built-in reconnect! SSE auto-reconnects using Last-Event-ID header
eventSource.addEventListener('jackpot_win', (e) => {
  const data = JSON.parse(e.data);
  showJackpotNotification(data);
});

eventSource.addEventListener('player_joined', (e) => {
  updatePlayerCount(JSON.parse(e.data).count);
});

eventSource.onerror = () => {
  // SSE auto-reconnects after error — no manual handling needed!
  console.log('SSE error — will reconnect automatically');
};

// Server response format (text/event-stream):
// id: 12345
// event: jackpot_win
// data: {"winner":"player_123","amount":50000}
// (blank line separates events)

// Cleanup
eventSource.close();

// ============================================
// 3. HTTP Long Polling — Compatible everywhere
// ============================================
// USE FOR: legacy environments, simple notifications
// Client holds open request, server responds when data available

async function longPoll(): Promise<void> {
  while (true) {
    try {
      const res = await fetch('/api/poll?since=' + lastEventId, {
        signal: AbortSignal.timeout(30000), // 30s timeout
      });
      if (!res.ok) { await sleep(1000); continue; }

      const events = await res.json();
      events.forEach(processEvent);
      if (events.length > 0) {
        lastEventId = events[events.length - 1].id;
      }
    } catch {
      await sleep(2000); // Backoff on error
    }
  }
}

// ============================================
// Decision Matrix for Slot Game Features
// ============================================
const PATTERN_GUIDE = {
  'Spin request + result':    'WebSocket (bidirectional, low latency)',
  'Balance update':           'WebSocket (server pushes after spin)',
  'Live jackpot feed':        'SSE (server-to-client, auto-reconnect)',
  'Player activity ticker':   'SSE (one-direction broadcast)',
  'Game announcements':       'SSE (broadcast from server)',
  'Bonus trigger':            'WebSocket (server must confirm client state)',
  'Chat messages':            'WebSocket (bidirectional)',
  'Game history':             'REST API (request-response, cacheable)',
  'Static paytable':          'REST API with cache (never changes)',
};`,
    answer: `Pattern selection rules:
1. WebSocket: use when CLIENT must SEND data (spin, bet change, chat) AND receive responses
2. SSE: use for server-pushed broadcasts where client doesn't send (jackpot feed, announcements)
3. SSE advantage: built-in reconnect with Last-Event-ID, works over HTTP/2, simpler than WS
4. Polling: only for legacy proxies that block WebSocket or SSE (rare in 2024)
5. Most slot games use WebSocket for the game loop + SSE for social/broadcast features
6. WS handshake cost is amortized — single HTTP upgrade, then bare TCP frames (2-byte overhead vs 800-byte HTTP headers)`,
    keyPoints: [
      'WebSocket = bidirectional — use when client needs to SEND (spin, bet, chat)',
      'SSE = server-to-client only, auto-reconnects via Last-Event-ID header',
      'SSE works over HTTP/2 multiplexing — no extra connection needed',
      'For slot game: WS for game actions, SSE for jackpot/social broadcasts',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXTENDED PERFORMANCE QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const PERFORMANCE_EXTENDED_QUESTIONS: CodeQuestion[] = [
  {
    id: 'pf-ext-1',
    title: 'What is object pooling and implement it for PixiJS Sprites',
    difficulty: 'Intermediate',
    category: 'Performance',
    tags: ['object pool', 'GC', 'memory', 'PixiJS', 'performance'],
    description: 'Implement a generic typed object pool for PixiJS Sprites that eliminates garbage collection pauses during high-frequency animations.',
    concept: 'JavaScript GC pauses execution to reclaim memory from discarded objects. At 60fps you have 16.67ms per frame — a GC pause of even 5ms drops a frame. Object pooling pre-allocates objects, reuses them via acquire()/release(), and prevents allocations in hot code paths. Critical for coin burst effects, flying symbols, particle systems, and number pop-ups.',
    code: `// Generic typed Object Pool
class ObjectPool<T> {
  private pool: T[] = [];
  private active = new Set<T>();
  private readonly factory: () => T;
  private readonly reset: (obj: T) => void;
  private readonly maxSize: number;

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number,
    maxSize = initialSize * 3,
  ) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
    // Pre-warm the pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire(): T {
    let obj = this.pool.pop(); // O(1) from array end
    if (!obj) {
      if (this.active.size < this.maxSize) {
        obj = this.factory(); // Grow pool if needed
      } else {
        throw new Error('ObjectPool exhausted');
      }
    }
    this.active.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (!this.active.has(obj)) return; // Guard double-release
    this.active.delete(obj);
    this.reset(obj);          // Clear state for reuse
    this.pool.push(obj);      // Return to available pool
  }

  releaseAll(): void {
    this.active.forEach(obj => {
      this.reset(obj);
      this.pool.push(obj);
    });
    this.active.clear();
  }

  get activeCount(): number { return this.active.size; }
  get availableCount(): number { return this.pool.length; }
}

// ============================================
// PixiJS Sprite Pool — for flying symbols/coins
// ============================================
import { Sprite, Texture, Container } from 'pixi.js';

function createSpritePool(texture: Texture, parent: Container, size: number) {
  return new ObjectPool<Sprite>(
    // Factory: create a new sprite
    () => {
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.visible = false;
      parent.addChild(sprite); // Add to stage once — never remove
      return sprite;
    },
    // Reset: clear all state when returned to pool
    (sprite) => {
      sprite.visible = false;
      sprite.alpha = 1;
      sprite.scale.set(1);
      sprite.rotation = 0;
      sprite.x = -1000; // Off-screen
      sprite.y = -1000;
      sprite.tint = 0xFFFFFF;
      sprite.filters = null;
    },
    size,
  );
}

// Usage in coin burst animation:
const coinPool = createSpritePool(coinTexture, app.stage, 50);

function shootCoin(fromX: number, fromY: number, toX: number, toY: number): void {
  const coin = coinPool.acquire();
  coin.visible = true;
  coin.x = fromX;
  coin.y = fromY;

  // Animate
  const startTime = Date.now();
  const duration = 800;
  const ticker = app.ticker.add((t) => {
    const progress = Math.min((Date.now() - startTime) / duration, 1);
    const eased = progress < 0.5 ? 2*progress*progress : 1-Math.pow(-2*progress+2,2)/2;
    coin.x = fromX + (toX - fromX) * eased;
    coin.y = fromY + (toY - fromY) * eased;
    coin.rotation += 0.1 * t.deltaTime;
    coin.alpha = progress > 0.8 ? (1 - progress) / 0.2 : 1; // Fade at end

    if (progress >= 1) {
      app.ticker.remove(ticker);
      coinPool.release(coin); // Return to pool — no GC!
    }
  });
}`,
    answer: `Object pool implementation details:
1. pool.pop() is O(1) — much faster than pool.shift() which is O(N)
2. Pre-warm at startup — initial allocation during loading, not gameplay
3. Reset function MUST clear all state — invisible, off-screen, reset transforms
4. Guard against double-release: active Set check prevents bugs
5. Add sprites to stage once (in factory) — never add/remove during gameplay (expensive DOM op)
6. maxSize prevents unbounded growth if pool is miscalibrated`,
    keyPoints: [
      'pool.pop() = O(1); never use shift() = O(N) in hot paths',
      'Pre-allocate at load time, never inside animation loops',
      'Sprites added to stage once in factory — pool reuses via visibility toggle',
      'Guard double-release with active Set — common bug in complex animations',
    ],
  },
  {
    id: 'pf-ext-2',
    title: 'Implement a RenderTexture cache for expensive PixiJS composites',
    difficulty: 'Advanced',
    category: 'Performance',
    tags: ['RenderTexture', 'caching', 'GPU', 'optimization', 'compositing'],
    description: 'Use PixiJS RenderTexture to pre-render complex static containers into a single GPU texture, reducing draw calls from 50+ to 1.',
    concept: 'A complex slot background might have 50+ Graphics/Sprites for decorative elements. If it never changes, re-compositing all 50 objects every frame is wasteful. RenderTexture lets you render a Container once into a GPU texture, then display that texture as a single Sprite. This collapses 50 draw calls into 1 and removes 50 objects from the scene graph.',
    code: `import { Application, RenderTexture, Sprite, Container } from 'pixi.js';

// ============================================
// RenderTexture Cache System
// ============================================
class RenderTextureCache {
  private cache = new Map<string, RenderTexture>();

  constructor(private app: Application) {}

  // Render a Container to a texture and cache it
  createFromContainer(key: string, container: Container): Sprite {
    // Destroy existing if re-caching
    this.invalidate(key);

    // Get the bounds of the container
    const bounds = container.getBounds();
    const renderTexture = RenderTexture.create({
      width: bounds.width,
      height: bounds.height,
      resolution: window.devicePixelRatio,
    });

    // Temporarily move container to origin for rendering
    const origX = container.x;
    const origY = container.y;
    container.x = -bounds.x;
    container.y = -bounds.y;

    // Render container into the texture (one-time GPU operation)
    this.app.renderer.render({ container, target: renderTexture });

    // Restore position
    container.x = origX;
    container.y = origY;

    this.cache.set(key, renderTexture);

    // Return a Sprite using the baked texture
    const sprite = new Sprite(renderTexture);
    sprite.x = bounds.x;
    sprite.y = bounds.y;
    return sprite;
  }

  invalidate(key: string): void {
    this.cache.get(key)?.destroy(true);
    this.cache.delete(key);
  }

  destroyAll(): void {
    this.cache.forEach(rt => rt.destroy(true));
    this.cache.clear();
  }
}

// ============================================
// Practical Example: Slot Background
// ============================================
async function buildSlotBackground(app: Application): Promise<Sprite> {
  const cache = new RenderTextureCache(app);

  // Build complex background Container (one-time cost)
  const bgContainer = new Container();

  // Many decorative elements
  for (let i = 0; i < 30; i++) {
    const gem = new Sprite(await Assets.load('gem.png'));
    gem.x = Math.random() * 1024;
    gem.y = Math.random() * 576;
    gem.tint = [0xFFD700, 0xFF6B35, 0x7B2FBE][i % 3];
    bgContainer.addChild(gem);
  }

  // Create frame border with Graphics
  const border = new Graphics();
  border.roundRect(50, 50, 924, 476, 20);
  border.stroke({ color: 0xFFD700, width: 4 });
  bgContainer.addChild(border);

  // Bake to RenderTexture — collapses 31 draw calls to 1
  const bgSprite = cache.createFromContainer('slot-background', bgContainer);

  // Original container no longer needed — destroy it
  bgContainer.destroy({ children: true });

  return bgSprite; // Add this single Sprite to stage
}

// ============================================
// Dynamic RenderTexture — for symbol highlight frames
// ============================================
class SymbolHighlightCache {
  private glowTexture: RenderTexture;

  constructor(app: Application) {
    // Pre-render the glow frame once
    const glowContainer = new Container();
    const g = new Graphics();
    g.roundRect(0, 0, 160, 160, 12);
    g.stroke({ color: 0xFFD700, width: 6, alpha: 1 });
    g.roundRect(3, 3, 154, 154, 10);
    g.stroke({ color: 0xFFF0A0, width: 2, alpha: 0.5 });
    glowContainer.addChild(g);

    this.glowTexture = RenderTexture.create({ width: 160, height: 160 });
    app.renderer.render({ container: glowContainer, target: this.glowTexture });
    glowContainer.destroy({ children: true });
  }

  // Create a glow overlay Sprite (costs nothing — reuses same texture)
  createGlowOverlay(): Sprite {
    return new Sprite(this.glowTexture); // Multiple sprites, 1 texture — batched!
  }

  destroy(): void {
    this.glowTexture.destroy(true);
  }
}`,
    answer: `RenderTexture optimization strategy:
1. Identify static or rarely-changing composite containers in the scene
2. Measure: how many draw calls does it contribute? Is it > 5? Consider caching
3. renderer.render({ container, target: renderTexture }) renders synchronously to GPU
4. After baking: destroy the original container — don't keep both in memory
5. Multiple Sprites sharing one RenderTexture = still 1 GPU texture bind
6. Invalidate + re-bake if the source changes (e.g. theme switch, level up)`,
    keyPoints: [
      'RenderTexture collapses N draw calls from a Container into 1 Sprite draw',
      'Bake static backgrounds, decorations, UI panels — anything that rarely changes',
      'Destroy the original Container after baking — free the CPU-side objects',
      'Multiple Sprites reusing one RenderTexture = still batched (1 GPU bind)',
    ],
  },
]
