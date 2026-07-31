'use client'

import { useState } from 'react'
import { SectionWrapper, ConceptCard, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { SLOT_QUESTIONS, SLOT_EXTENDED_QUESTIONS } from '@/lib/interview-data'

const STATE_MACHINE_CODE = `// Slot Game State Machine — XState-style without the library
type SpinStatus = 'idle' | 'anticipation' | 'spinning' | 'stopping' | 'evaluating' | 'win_presentation' | 'lose' | 'bonus';

interface GameFSM {
  status: SpinStatus;
  transitions: Partial<Record<SpinStatus, SpinStatus[]>>;
}

const TRANSITIONS: Partial<Record<SpinStatus, SpinStatus[]>> = {
  idle:             ['anticipation'],
  anticipation:     ['spinning'],
  spinning:         ['stopping'],
  stopping:         ['evaluating'],
  evaluating:       ['win_presentation', 'lose', 'bonus'],
  win_presentation: ['idle'],
  lose:             ['idle'],
  bonus:            ['idle'],
};

class SlotGameFSM {
  private status: SpinStatus = 'idle';
  private listeners = new Map<SpinStatus, Set<() => void>>();

  canTransition(to: SpinStatus): boolean {
    return TRANSITIONS[this.status]?.includes(to) ?? false;
  }

  transition(to: SpinStatus): void {
    if (!this.canTransition(to)) {
      throw new Error(\`Invalid transition: \${this.status} → \${to}\`);
    }
    this.status = to;
    this.listeners.get(to)?.forEach(fn => fn());
  }

  on(status: SpinStatus, handler: () => void): () => void {
    if (!this.listeners.has(status)) this.listeners.set(status, new Set());
    this.listeners.get(status)!.add(handler);
    return () => this.listeners.get(status)?.delete(handler); // unsubscribe
  }

  getStatus(): SpinStatus { return this.status; }
}

// Usage
const fsm = new SlotGameFSM();
const unsubWin = fsm.on('win_presentation', () => {
  playWinSound();
  showWinAmount();
});

async function runSpin() {
  fsm.transition('anticipation'); // Shows reel suspense
  await delay(500);
  fsm.transition('spinning');     // Reels start moving
  await delay(2000);
  fsm.transition('stopping');     // Reels decelerate
  await delay(800);
  fsm.transition('evaluating');   // Check paylines

  const win = evaluatePaylines();
  if (win.total > 0) {
    fsm.transition('win_presentation');
  } else {
    fsm.transition('lose');
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
`

const REEL_ARCHITECTURE_CODE = `// Complete Reel Architecture — Production Pattern
import { Container, Sprite, Graphics, Texture, Ticker, Application } from 'pixi.js';

interface ReelConfig {
  reelIndex: number;
  symbolHeight: number;
  symbolWidth: number;
  visibleRows: number;
  symbols: string[];           // Full reel strip sequence
  textures: Record<string, Texture>;
}

class Reel {
  readonly container: Container;
  private innerContainer: Container; // scrolls vertically
  private sprites: Sprite[] = [];
  private position = 0;
  private speed = 0;
  private spinning = false;
  private stopTarget: number | null = null;
  private onStopResolve: (() => void) | null = null;
  private config: ReelConfig;

  get stripHeight(): number {
    return this.config.symbols.length * this.config.symbolHeight;
  }

  constructor(config: ReelConfig, app: Application) {
    this.config = config;

    // Outer container: clips to visible window
    this.container = new Container();
    const mask = new Graphics();
    mask.rect(0, 0, config.symbolWidth, config.symbolHeight * config.visibleRows);
    mask.fill(0xffffff);
    this.container.addChild(mask);
    this.container.mask = mask;

    // Inner container: scrolls
    this.innerContainer = new Container();
    this.container.addChild(this.innerContainer);

    // Pre-create sprites for visible rows + buffer
    const totalSprites = config.visibleRows + 2;
    for (let i = 0; i < totalSprites; i++) {
      const symbolName = config.symbols[i % config.symbols.length];
      const sprite = new Sprite(config.textures[symbolName] ?? Texture.WHITE);
      sprite.width = config.symbolWidth;
      sprite.height = config.symbolHeight;
      sprite.y = i * config.symbolHeight;
      this.sprites.push(sprite);
      this.innerContainer.addChild(sprite);
    }

    app.ticker.add(this.update, this);
  }

  startSpin(): void {
    this.spinning = true;
    this.speed = 40; // px per frame at 60fps
    this.stopTarget = null;
  }

  stopAt(targetSymbolIndex: number): Promise<void> {
    // Calculate exact pixel position for this symbol to land in center row
    const centerRow = Math.floor(this.config.visibleRows / 2);
    const targetPos = (targetSymbolIndex * this.config.symbolHeight)
      - (centerRow * this.config.symbolHeight);

    // Snap to nearest occurrence AFTER current position
    const fullStrips = Math.ceil(this.position / this.stripHeight) + 2;
    this.stopTarget = targetPos + fullStrips * this.stripHeight;

    return new Promise(resolve => {
      this.onStopResolve = resolve;
    });
  }

  private update = (ticker: Ticker): void => {
    if (!this.spinning) return;

    // Ease out when approaching target
    if (this.stopTarget !== null) {
      const remaining = this.stopTarget - this.position;
      if (remaining <= 0) {
        this.position = this.stopTarget % this.stripHeight;
        this.spinning = false;
        this.speed = 0;
        this.updateSpritePositions();
        this.onStopResolve?.();
        this.onStopResolve = null;
        return;
      }
      // Decelerate in last 3 symbols
      const slowZone = this.config.symbolHeight * 3;
      if (remaining < slowZone) {
        this.speed = Math.max(4, (remaining / slowZone) * 40);
      }
    }

    this.position = (this.position + this.speed * ticker.deltaTime) % this.stripHeight;
    this.updateSpritePositions();
  };

  private updateSpritePositions(): void {
    this.sprites.forEach((sprite, i) => {
      const rawY = i * this.config.symbolHeight - this.position;
      const wrapped = ((rawY % this.stripHeight) + this.stripHeight) % this.stripHeight;
      sprite.y = wrapped - this.config.symbolHeight;

      // Update texture based on current position
      const symbolIdx = Math.floor(
        ((this.position + (i + 1) * this.config.symbolHeight) / this.config.symbolHeight)
        % this.config.symbols.length
      );
      const name = this.config.symbols[Math.abs(symbolIdx) % this.config.symbols.length];
      sprite.texture = this.config.textures[name] ?? Texture.WHITE;
    });
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
`

const AUDIO_CODE = `// Audio Management in Slot Games — Web Audio API
class SlotAudioManager {
  private context: AudioContext;
  private sounds = new Map<string, AudioBuffer>();
  private musicGain: GainNode;
  private sfxGain: GainNode;
  private currentMusic: AudioBufferSourceNode | null = null;

  constructor() {
    this.context = new AudioContext();

    // Separate gain nodes for music vs SFX (independent volume control)
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.musicGain.connect(this.context.destination);
    this.sfxGain.connect(this.context.destination);
    this.musicGain.gain.value = 0.4;  // music at 40% volume
    this.sfxGain.gain.value = 0.8;    // sfx at 80% volume
  }

  async load(name: string, url: string): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
  }

  play(name: string, { loop = false, gainNode = this.sfxGain } = {}): AudioBufferSourceNode {
    // IMPORTANT: AudioContext may be suspended until user gesture (autoplay policy)
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const buffer = this.sounds.get(name);
    if (!buffer) throw new Error(\`Sound not loaded: \${name}\`);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(gainNode);
    source.start();
    return source;
  }

  playMusic(name: string): void {
    this.currentMusic?.stop();
    this.currentMusic = this.play(name, { loop: true, gainNode: this.musicGain });
  }

  setMusicVolume(vol: number): void { this.musicGain.gain.value = vol; }
  setSFXVolume(vol: number): void { this.sfxGain.gain.value = vol; }
  mute(): void { this.context.suspend(); }
  unmute(): void { this.context.resume(); }
}
`

const SPIN_FLOW_CODE = `// Full Spin Flow — Client to Server and Back
// This is the COMPLETE lifecycle of one spin in a real slot game

async function executeSpin(bet: number): Promise<void> {
  const fsm = getGameFSM();

  // 1. Guard: prevent double-spin
  if (fsm.status !== 'idle') return;

  // 2. Deduct balance optimistically in UI (server is authoritative)
  updateUIBalance(currentBalance - bet);

  // 3. Transition: idle → anticipation (plays reel "about to spin" effect)
  fsm.transition('anticipation');
  await delay(300);

  // 4. Start reel animations
  fsm.transition('spinning');
  reels.forEach(reel => reel.startSpin());

  // 5. Generate idempotency key + persist BEFORE network call
  const roundId = crypto.randomUUID();
  sessionStorage.setItem('pending_roundId', roundId);

  // 6. Send spin request to server
  let result: SpinResult;
  try {
    result = await api.spin({ roundId, bet, lines: 20 });
    sessionStorage.removeItem('pending_roundId'); // Clear on success
  } catch (e) {
    // Network error — keep spinning visually, attempt recovery
    result = await recoverRound(roundId);
  }

  // 7. Stagger reel stops (200ms apart) with server result positions
  fsm.transition('stopping');
  for (let i = 0; i < reels.length; i++) {
    await delay(i === 0 ? 0 : 200); // First reel immediately, rest stagger
    await reels[i].stopAt(result.reelStops[i]);
  }

  // 8. Evaluate wins
  fsm.transition('evaluating');
  const wins = evaluatePaylines(result.grid);

  // 9. Branch: win, lose, or bonus
  if (result.freeSpinsAwarded) {
    fsm.transition('bonus');
    await playFreeSpinsTransition(result.freeSpinsAwarded);
  } else if (wins.total > 0) {
    fsm.transition('win_presentation');
    await winPresenter.present(wins, bet);
  } else {
    fsm.transition('lose');
    await delay(300); // Brief pause on loss before allowing next spin
  }

  // 10. Update authoritative balance from server response
  updateUIBalance(result.newBalance);
  fsm.transition('idle');
}`

const PAYLINE_EVAL_CODE = `// Payline Evaluator — 5×3 grid with Wild substitution
type Symbol = 'SEVEN' | 'BAR' | 'CHERRY' | 'BELL' | 'WILD' | 'SCATTER';
type Grid = Symbol[][]; // grid[col][row] — 5 columns, 3 rows

// 20 payline definitions — each is [col, row] for all 5 reels
const PAYLINES: [number, number][][] = [
  [[0,1],[1,1],[2,1],[3,1],[4,1]], // Line 1 — Middle row
  [[0,0],[1,0],[2,0],[3,0],[4,0]], // Line 2 — Top row
  [[0,2],[1,2],[2,2],[3,2],[4,2]], // Line 3 — Bottom row
  [[0,0],[1,1],[2,2],[3,1],[4,0]], // Line 4 — V shape
  [[0,2],[1,1],[2,0],[3,1],[4,2]], // Line 5 — Inverted V
  // ... up to 20 lines
];

// Multipliers: [2-match, 3-match, 4-match, 5-match]
const PAYTABLE: Record<string, number[]> = {
  SEVEN:   [0, 50, 200, 1000],
  BAR:     [0, 20,  80,  400],
  CHERRY:  [0, 10,  40,  200],
  BELL:    [0,  5,  20,  100],
  SCATTER: [0, 10,  50,  200], // pays anywhere
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

  for (let l = 0; l < PAYLINES.length; l++) {
    const line = PAYLINES[l];

    // Resolve "effective symbol" — first non-WILD symbol on this line
    let effectiveSymbol: Symbol | null = null;
    for (const [col, row] of line) {
      const sym = grid[col][row];
      if (sym !== 'WILD' && sym !== 'SCATTER') { effectiveSymbol = sym; break; }
    }
    if (!effectiveSymbol) effectiveSymbol = 'SEVEN'; // All wilds → best symbol

    let count = 0;
    const positions: [number, number][] = [];
    for (const [col, row] of line) {
      const sym = grid[col][row];
      if (sym === effectiveSymbol || sym === 'WILD') {
        count++; positions.push([col, row]);
      } else break; // Must be consecutive from left
    }

    if (count >= 3) {
      const mult = PAYTABLE[effectiveSymbol]?.[count - 2] ?? 0;
      if (mult > 0) results.push({ lineIndex: l, symbol: effectiveSymbol, count, multiplier: mult, positions });
    }
  }

  // Scatter: count total occurrences anywhere on grid
  const scatterPos: [number, number][] = [];
  for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) {
    if (grid[c][r] === 'SCATTER') scatterPos.push([c, r]);
  }
  if (scatterPos.length >= 3) {
    const mult = PAYTABLE.SCATTER[scatterPos.length - 2] ?? 0;
    results.push({ lineIndex: -1, symbol: 'SCATTER', count: scatterPos.length,
      multiplier: mult, positions: scatterPos, isScatter: true });
  }
  return results;
}`

const WIN_PRESENTER_CODE = `// Win Presentation Orchestrator
class WinPresenter {
  private dimFilter = new ColorMatrixFilter();
  private paylineG = new Graphics();

  constructor(
    private symbols: Sprite[][],   // [col][row]
    container: Container,
    private audio: SlotAudioManager,
    private coinCounter: CoinCounter,
  ) {
    this.dimFilter.brightness(0.3, false);
    container.addChild(this.paylineG);
  }

  async present(wins: WinResult[], betPerLine: number): Promise<void> {
    const total = wins.reduce((s, w) =>
      s + w.multiplier * (w.isScatter ? betPerLine * 20 : betPerLine), 0);

    // Check win tier for special presentation
    const multiplier = total / (betPerLine * 20);
    if (multiplier >= 50) await this.showBigWinScreen('MEGA WIN', total);
    else if (multiplier >= 25) await this.showBigWinScreen('BIG WIN', total);

    // Cycle through each winning line 3 times
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const win of wins) {
        await this.presentLine(win);
        await sleep(500);
      }
    }

    await this.coinCounter.countTo(total, 1200);
    this.cleanup();
  }

  private async presentLine(win: WinResult): Promise<void> {
    // 1. Dim everything
    this.symbols.flat().forEach(s => { s.filters = [this.dimFilter]; });
    // 2. Un-dim winners + parallel: draw line + play sound
    const winners = win.positions.map(([c, r]) => this.symbols[c][r]);
    winners.forEach(s => { s.filters = null; });
    await Promise.all([
      this.animatePayline(win.positions),
      this.audio.play('line-win'),
    ]);
    await sleep(700);
  }

  private animatePayline(positions: [number, number][]): Promise<void> {
    const W = 160, H = 160;
    return new Promise(resolve => {
      let elapsed = 0;
      const ticker = new Ticker();
      ticker.add((t) => {
        elapsed += t.deltaMS;
        const progress = Math.min(elapsed / 350, 1);
        const drawTo = Math.floor(progress * (positions.length - 1));
        this.paylineG.clear();
        for (let i = 0; i < drawTo; i++) {
          const [c1,r1] = positions[i], [c2,r2] = positions[i+1];
          this.paylineG.moveTo(c1*W+W/2, r1*H+H/2);
          this.paylineG.lineTo(c2*W+W/2, r2*H+H/2);
          this.paylineG.stroke({ color: 0xFFD700, width: 5, alpha: 0.9 });
        }
        if (progress >= 1) { ticker.destroy(); resolve(); }
      });
      ticker.start();
    });
  }

  private async showBigWinScreen(label: string, amount: number): Promise<void> {
    // Full-screen overlay, particle burst, coin counter → return to base
    await sleep(3000);
  }

  private cleanup(): void {
    this.paylineG.clear();
    this.symbols.flat().forEach(s => { s.filters = null; });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}`

export function SlotSection() {
  const [showAll, setShowAll] = useState(false)
  const allQuestions = [...SLOT_QUESTIONS, ...SLOT_EXTENDED_QUESTIONS]
  const visible = showAll ? allQuestions : allQuestions.slice(0, 5)

  return (
    <SectionWrapper
      badge="Slot Gaming"
      title="Slot Game Development Scenarios"
      subtitle="Real-world slot gaming implementation — RNG, paylines, state machines, reel architecture, win presentation, free spins, Hold & Win, network fault tolerance, and bonus features. Everything a gaming company interviewer will ask."
    >
      {/* Architecture overview */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="text-sm font-semibold text-primary mb-3">Slot Game Architecture — The 4 Layers</h3>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { layer: '1. Server Layer', items: ['Certified hardware RNG', 'RTP enforcement', 'Regulatory audit logs', 'Round ID + idempotency'], color: 'border-red-500/30 bg-red-500/5' },
            { layer: '2. Logic Layer (TS)', items: ['State machine (FSM)', 'Payline evaluator', 'Free spins manager', 'Fault-tolerant spin flow'], color: 'border-amber-500/30 bg-amber-500/5' },
            { layer: '3. Game Layer (PixiJS)', items: ['Reel animation + masking', 'Symbol sprites + animations', 'Particle effects', 'Win presentation'], color: 'border-primary/30 bg-primary/5' },
            { layer: '4. UI Layer (React)', items: ['Balance, Bet, Spin btn', 'Win overlay + counter', 'Settings + paytable', 'WebSocket connection'], color: 'border-emerald-500/30 bg-emerald-500/5' },
          ].map(col => (
            <div key={col.layer} className={`rounded-lg border p-3 ${col.color}`}>
              <p className="text-xs font-semibold text-foreground mb-2">{col.layer}</p>
              <ul className="space-y-1">
                {col.items.map(item => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-primary mt-0.5 flex-shrink-0">›</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key terminology */}
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard title="Essential Slot Terminology" accent>
          <ul className="space-y-1 text-[11px]">
            <li><strong className="text-foreground">RTP (Return To Player):</strong> % of total wagered money returned to players long-term. Legal minimum 96% in most jurisdictions.</li>
            <li><strong className="text-foreground">Volatility / Variance:</strong> Low = frequent small wins. High = rare large wins. Affects player experience.</li>
            <li><strong className="text-foreground">Reel Strip:</strong> Virtual sequence of symbols on one reel. Symbol frequency in strip = probability of landing.</li>
            <li><strong className="text-foreground">Payline:</strong> A specific pattern of positions across all reels. Wins only on active paylines.</li>
            <li><strong className="text-foreground">Wild:</strong> Substitutes for any paying symbol. Does NOT substitute for Scatter.</li>
            <li><strong className="text-foreground">Scatter:</strong> Pays based on total count anywhere on grid — ignores paylines.</li>
            <li><strong className="text-foreground">Anticipation:</strong> Reels 1-3 stop quickly, reel 4 spins slowly → builds tension before potential win.</li>
            <li><strong className="text-foreground">Hold & Win:</strong> Bonus where landing special symbols triggers respins, holding landed symbols.</li>
          </ul>
        </ConceptCard>

        <ConceptCard title="Why Server Controls RNG — Critical Concept">
          <p><strong className="text-foreground">Client-side RNG is illegal</strong> in regulated gambling markets. Math.random() is not cryptographically secure and is predictable.</p>
          <p><strong className="text-foreground">Real flow:</strong> Player clicks SPIN → client sends request to server with roundId → server uses certified hardware RNG → server calculates result (reel stops, wins, new balance) → server responds → client animates to those exact positions.</p>
          <p><strong className="text-foreground">Client role:</strong> Display only. The client receives positions to animate to. It does NOT decide the outcome — it just presents it compellingly.</p>
          <p><strong className="text-foreground">Provably Fair:</strong> Some crypto casinos commit to a seed hash before spin, reveal seed after. Players can verify SHA256(seed) matches committed hash.</p>
        </ConceptCard>

        <ConceptCard title="FSM State Transitions">
          <div className="font-mono text-[10px] space-y-0.5">
            <p><span className="text-primary">idle</span> → <span className="text-amber-400">anticipation</span> (user clicks spin)</p>
            <p className="ml-3">↓</p>
            <p><span className="text-amber-400">anticipation</span> → <span className="text-orange-400">spinning</span> (reels start moving)</p>
            <p className="ml-3">↓</p>
            <p><span className="text-orange-400">spinning</span> → <span className="text-red-400">stopping</span> (server result received)</p>
            <p className="ml-3">↓</p>
            <p><span className="text-red-400">stopping</span> → <span className="text-emerald-400">evaluating</span> (all reels stopped)</p>
            <p className="ml-3">↓ ↓ ↓</p>
            <p><span className="text-emerald-400">win_presentation</span> | <span className="text-muted-foreground">lose</span> | <span className="text-primary">bonus</span></p>
            <p className="ml-3">↓</p>
            <p><span className="text-primary">idle</span> (next spin allowed)</p>
          </div>
        </ConceptCard>

        <ConceptCard title="Win Tiers & Big Win Thresholds">
          <ul className="space-y-1 text-[11px]">
            <li><strong className="text-foreground">Normal win:</strong> &lt; 5× total bet → show line wins, animate counter</li>
            <li><strong className="text-foreground">Big Win:</strong> 10-24× total bet → special screen, coin burst, loud audio</li>
            <li><strong className="text-foreground">Mega Win:</strong> 25-49× → bigger screen, more particles, dramatic music</li>
            <li><strong className="text-foreground">Epic Win:</strong> 50-99× → full takeover, lightning effects, jackpot jingle</li>
            <li><strong className="text-foreground">Jackpot:</strong> 100×+ → full-screen cinematic, server notification to all players</li>
          </ul>
          <p className="mt-2">Exact thresholds vary per game — always stored server-side in the game config, not hardcoded client-side.</p>
        </ConceptCard>
      </div>

      {/* Code examples */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">State Machine — The Heart of Slot Logic</h3>
          <p className="text-xs text-muted-foreground mb-2">The FSM prevents invalid transitions (e.g. spinning while already spinning) and drives the entire game flow via state-triggered handlers.</p>
          <CodeBlock code={STATE_MACHINE_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Complete Spin Flow — Client to Server</h3>
          <p className="text-xs text-muted-foreground mb-2">The full lifecycle: anticipation animation, server request, staggered reel stops, payline evaluation, and win/lose/bonus branching.</p>
          <CodeBlock code={SPIN_FLOW_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Payline Evaluator — 5×3 Grid with Wilds & Scatters</h3>
          <p className="text-xs text-muted-foreground mb-2">Evaluates all defined paylines, resolves Wild substitution, counts Scatters globally, and returns structured win results for the presentation layer.</p>
          <CodeBlock code={PAYLINE_EVAL_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Win Presentation Orchestrator</h3>
          <p className="text-xs text-muted-foreground mb-2">Sequences the win: dim non-winners, highlight winners, draw paylines, play audio, cycle through lines, animate coin counter, detect Big Win tier.</p>
          <CodeBlock code={WIN_PRESENTER_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Reel Architecture — Production Class</h3>
          <p className="text-xs text-muted-foreground mb-2">The Reel class manages scrolling sprite positions, wrapping with modulo, ease-out deceleration on stop, and mask-based clipping to the visible window.</p>
          <CodeBlock code={REEL_ARCHITECTURE_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Audio Manager — Web Audio API</h3>
          <p className="text-xs text-muted-foreground mb-2">Web Audio API gives sample-accurate playback, separate gain nodes for music/SFX, and handles browser autoplay policy (context suspended until user gesture).</p>
          <CodeBlock code={AUDIO_CODE} />
        </div>
      </div>

      {/* Q&A */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">
          Interview Questions — {allQuestions.length} Questions
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Covers full spin flow, payline evaluation, RNG security, free spins, Hold &amp; Win, network fault tolerance, and win presentation orchestration.
        </p>
        <QuestionList>
          {visible.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </QuestionList>
        {!showAll && allQuestions.length > 5 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors mt-3"
          >
            Show {allQuestions.length - 5} more questions
          </button>
        )}
      </div>
    </SectionWrapper>
  )
}
