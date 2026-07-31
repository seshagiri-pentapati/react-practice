'use client'

import { useState } from 'react'
import { SectionWrapper, ConceptCard, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { PERFORMANCE_QUESTIONS, PERFORMANCE_EXTENDED_QUESTIONS } from '@/lib/interview-data'

const BATCH_RENDER_CODE = `// PixiJS Batch Rendering & Draw Call Optimization
// The key to 60fps with hundreds of symbols

// === PROBLEM: Each unique texture = one draw call ===
// 50 symbols with 50 different textures = 50 draw calls = slow

// === SOLUTION 1: Spritesheet / Texture Atlas ===
// ALL symbols in one texture = 1 draw call for the entire reel grid
import { Assets, Sprite, Spritesheet } from 'pixi.js';

// Load one atlas that contains ALL symbols
const sheet: Spritesheet = await Assets.load('/symbols-atlas.json');
// Now all symbol sprites share the same GPU texture → automatic batching

// === SOLUTION 2: Measure draw calls ===
// In PixiJS DevTools (Chrome extension), check:
// - drawCalls: should be as low as possible
// - totalSprites: all sprites regardless of batching

// === SOLUTION 3: Avoid breaking batch ===
// These BREAK the render batch (force a draw call flush):
// 1. Different texture between sprites  ← use spritesheet
// 2. Filters on individual sprites      ← apply to Container, not each sprite
// 3. Different blend modes             ← keep consistent in batched layers
// 4. Masks                             ← creates a new render pass

// === SOLUTION 4: Container cacheAsBitmap ===
// For static UI that rarely changes: cache as single texture
import { Container } from 'pixi.js';

const uiPanel = new Container();
// ... add lots of Text, Graphics, Sprites ...
// @ts-ignore — v7 API, v8 uses cacheAsTexture
uiPanel.cacheAsBitmap = true;  // v7
// v8: uiPanel.cacheAsTexture = true;
// Now the entire panel renders in 1 draw call
// MUST set to false before changing children
`

const MEMORY_LEAK_CODE = `// Memory Leak Prevention — Critical for long-running slot games
import { Application, Sprite, Texture, Container } from 'pixi.js';

class MemoryLeakDemo {
  private app: Application;
  private container = new Container();

  // === LEAK 1: Ticker listener not removed ===
  private tickerHandler = (ticker: any) => { /* ... */ };

  addTickerHandler(): void {
    this.app.ticker.add(this.tickerHandler);
    // BUG: If this function is called multiple times, handlers stack up
    // FIX: Always remove before adding, or use addOnce for one-shot
  }

  removeTickerHandler(): void {
    this.app.ticker.remove(this.tickerHandler); // ALWAYS do this in cleanup
  }

  // === LEAK 2: Event listeners on destroyed sprites ===
  createInteractiveSprite(texture: Texture): Sprite {
    const sprite = new Sprite(texture);
    sprite.eventMode = 'static';
    sprite.on('pointerdown', this.onSpriteClick);
    return sprite;
    // BUG: When sprite is removed from stage, listener still holds reference
    // FIX: sprite.off('pointerdown', this.onSpriteClick) before destroying
  }

  private onSpriteClick = (): void => { /* ... */ };

  destroySprite(sprite: Sprite): void {
    sprite.removeAllListeners(); // ALWAYS before destroy
    sprite.destroy();
  }

  // === LEAK 3: Not destroying textures ===
  async loadAndForget(): Promise<void> {
    const texture = await Texture.from('/symbol.png');
    const sprite = new Sprite(texture);
    this.container.addChild(sprite);
    // Later, removing without cleanup:
    // BUG: this.container.removeChild(sprite) — texture still in GPU memory
    // FIX:
    this.container.removeChild(sprite);
    sprite.destroy();
    texture.destroy(true); // true = also destroy base texture (GPU memory)
  }

  // === CORRECT cleanup pattern for a game round ===
  cleanupRound(): void {
    // 1. Remove ticker listeners first
    this.removeTickerHandler();

    // 2. Remove all event listeners from interactive sprites
    this.container.children.forEach(child => {
      child.removeAllListeners();
    });

    // 3. Destroy container with all children and textures
    this.container.destroy({
      children: true,    // recursively destroy all children
      texture: false,    // keep textures (they're in the sprite sheet — shared)
      textureSource: false,
    });
  }
}
`

const RAF_CODE = `// Performance: requestAnimationFrame vs setInterval vs Ticker
// Understanding when to use each

// === Ticker (PREFERRED for PixiJS game objects) ===
import { Application } from 'pixi.js';

const app = new Application();
app.ticker.add((ticker) => {
  // Runs every animation frame (60fps)
  // ticker.deltaTime = normalized delta (1 at 60fps, 2 at 30fps)
  sprite.x += 2 * ticker.deltaTime; // Always consistent speed
});

// === requestAnimationFrame (for non-PixiJS animations) ===
let rafId: number;

function animate(timestamp: number): void {
  // timestamp in milliseconds
  sprite.x += 2;
  rafId = requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
// Cleanup:
cancelAnimationFrame(rafId);

// === NEVER use setInterval for game loops ===
// setInterval is NOT synced to display refresh rate
// Can cause: over-renders, skipped frames, inconsistent delta
// setInterval(animate, 1000/60) → BAD for games

// === Performance profiling PixiJS ===
// 1. Add stats display:
import Stats from 'stats.js'; // npm install stats.js

const stats = new Stats();
stats.showPanel(0); // 0=fps, 1=ms/frame, 2=memory
document.body.appendChild(stats.dom);

app.ticker.add(() => {
  stats.begin();
  // your game update
  stats.end();
});

// 2. Monitor: FPS should stay >= 60
// 3. Memory: Watch for steady growth = leak
// 4. Use Chrome DevTools Performance tab for deep profiling
`

const REACT_PERF_CODE = `// React + PixiJS Performance Patterns

// === Pattern 1: Virtualize long lists (many paylines) ===
// Don't render 243 payline rows — only render visible ones
import { FixedSizeList } from 'react-window';

function PaylineList({ lines }: { lines: WinLine[] }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={lines.length}
      itemSize={40}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          Payline {lines[index].id}: {lines[index].amount}
        </div>
      )}
    </FixedSizeList>
  );
}

// === Pattern 2: Avoid renders during PixiJS animations ===
// Keep balance/win updates in refs during animation, sync to state after
import { useRef, useState, useEffect } from 'react';

function SlotGame() {
  const [displayBalance, setDisplayBalance] = useState(1000);
  const pendingBalanceRef = useRef(1000);

  function onSpinComplete(win: number): void {
    // Don't setState during animation — causes React re-render mid-frame
    pendingBalanceRef.current += win;
  }

  function onAnimationComplete(): void {
    // Sync to React state AFTER all animations finish
    setDisplayBalance(pendingBalanceRef.current);
  }

  return <div>Balance: {displayBalance}</div>;
}

// === Pattern 3: Debounce resize handler ===
import { useEffect, useRef } from 'react';

function useResizeObserver(callback: (w: number, h: number) => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(window.innerWidth, window.innerHeight);
      }, 100); // 100ms debounce — don't resize PixiJS every pixel
    };

    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      clearTimeout(timerRef.current);
    };
  }, [callback]);
}
`

export function PerformanceSection() {
  const [showAll, setShowAll] = useState(false)
  const allQuestions = [...PERFORMANCE_QUESTIONS, ...PERFORMANCE_EXTENDED_QUESTIONS]
  const visible = showAll ? allQuestions : allQuestions.slice(0, 5)

  return (
    <SectionWrapper
      badge="Performance"
      title="Performance & Optimization"
      subtitle="60fps game performance requires eliminating GPU draw calls, preventing memory leaks, managing object lifecycles, and knowing when React re-renders hurt. Essential knowledge for any gaming frontend role."
    >
      {/* Performance checklist */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Performance Checklist — 60fps Slot Game</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { category: 'GPU / Draw Calls', items: ['Spritesheet for all symbols (1 texture bind)', 'Avoid mid-scene blend mode changes', 'Cache static UI with cacheAsTexture', 'Minimize filter count per frame'] },
            { category: 'Memory / GC', items: ['Object pools for particles & effects', 'Destroy textures when scene changes', 'Remove ticker listeners on cleanup', 'Remove event listeners before destroy'] },
            { category: 'JavaScript', items: ['Use deltaTime for frame-rate independence', 'Pre-allocate arrays — avoid mid-animation push()', 'Typed arrays (Float32Array) for particle data', 'Web Workers for heavy computation (payline eval)'] },
            { category: 'React Layer', items: ['useRef for PixiJS instance (no re-render)', 'Batch state updates after animation ends', 'React.memo for static slot UI components', 'Virtualize long lists (paylines, history)'] },
          ].map(cat => (
            <div key={cat.category} className="rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-primary mb-2">{cat.category}</p>
              <ul className="space-y-1">
                {cat.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Concepts */}
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard title="What is a Draw Call?" accent>
          <p>A draw call is one command sent to the GPU to render geometry. Each draw call has CPU overhead.</p>
          <p>PixiJS batches sprites that share the same texture into <strong className="text-foreground">one draw call</strong>. A spritesheet with all 12 symbols = 1 draw call for the entire 5x3 reel grid.</p>
          <p>Target: &lt;50 draw calls per frame for smooth performance.</p>
        </ConceptCard>

        <ConceptCard title="Garbage Collection Impact">
          <p>JavaScript GC runs unpredictably and <strong className="text-foreground">pauses all JS execution</strong> — including your game loop.</p>
          <p>At 60fps you have 16ms per frame. A GC pause of even 8ms causes a visible stutter.</p>
          <p>Fix: Pre-allocate objects at game start, reuse via pools, avoid creating objects in hot paths (update loops).</p>
        </ConceptCard>

        <ConceptCard title="WebGL Memory Budget">
          <p>GPU memory (VRAM) is separate from JavaScript heap. Textures live in VRAM.</p>
          <p>A 2048x2048 RGBA texture uses 16MB of VRAM. On mobile devices with 1GB VRAM, this adds up quickly.</p>
          <p>Always call <code className="font-mono text-primary">texture.destroy(true)</code> when switching game scenes.</p>
        </ConceptCard>

        <ConceptCard title="Delta Time — Critical Concept">
          <p>Frame rates vary: 30fps, 60fps, 120fps, variable on battery. Without delta time, animations run at different speeds on different hardware.</p>
          <p><code className="font-mono text-primary">speed * ticker.deltaTime</code> normalizes movement to 60fps equivalent regardless of actual FPS.</p>
          <p>30fps: deltaTime=2.0 (double movement per frame). 120fps: deltaTime=0.5.</p>
        </ConceptCard>
      </div>

      {/* Code examples */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">Batch Rendering & Draw Call Optimization</h3>
          <CodeBlock code={BATCH_RENDER_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">Memory Leak Prevention</h3>
          <CodeBlock code={MEMORY_LEAK_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">requestAnimationFrame vs Ticker vs setInterval</h3>
          <CodeBlock code={RAF_CODE} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-wide mb-2">React + PixiJS Performance Patterns</h3>
          <CodeBlock code={REACT_PERF_CODE} />
        </div>
      </div>

      {/* Q&A */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">
          Interview Questions — {allQuestions.length} Questions
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Covers draw calls, GC pauses, object pooling, delta time, VRAM budgets, React/PixiJS interaction patterns, and profiling.
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
