'use client'

import { useState } from 'react'
import { SectionWrapper, ConceptCard, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { SlotDemo } from '@/components/slot-demo'
import { PIXIJS_QUESTIONS, PIXIJS_EXTENDED_QUESTIONS } from '@/lib/interview-data'
import { Badge } from '@/components/ui/badge'

// ─── ALL CODE STRINGS ─────────────────────────────────────────────────────────

const APP_INIT_CODE = `// PixiJS Application Setup — v8 (async init)
import { Application } from 'pixi.js';

const app = new Application();

// app.init() is ASYNC in v8 (v7 was synchronous in constructor)
await app.init({
  width: 1280,
  height: 720,
  background: '#0d0f1a',       // Background color (hex string or 0x number)
  antialias: true,              // Smooth edges — small GPU cost
  resolution: window.devicePixelRatio, // 1 on desktop, 2 on Retina
  autoDensity: true,            // Scale canvas CSS size to match resolution
  powerPreference: 'high-performance', // GPU selection hint for laptops
  // prefer: 'webgl',           // Force WebGL (default) or 'canvas' for fallback
});

// Mount canvas to DOM
document.getElementById('game-container')!.appendChild(app.canvas);
// In v7 it was: app.view (HTMLCanvasElement)
// In v8 it is:  app.canvas (HTMLCanvasElement)

// Access the stage (root Container — add everything here)
app.stage;        // The root Container
app.renderer;     // The WebGL renderer
app.ticker;       // The game loop ticker
app.screen;       // { width, height } of the renderer

// Resize the renderer
app.renderer.resize(newWidth, newHeight);

// Destroy everything (use on component unmount in React)
app.destroy(true, { children: true, texture: true, textureSource: true });`

const SCENE_GRAPH_CODE = `// PixiJS Scene Graph — Container hierarchy
import { Application, Container, Sprite, Graphics, Text, Texture } from 'pixi.js';

// app.stage is the ROOT Container — everything must descend from it
//
//  app.stage (root)
//  ├── backgroundLayer
//  ├── gameLayer
//  │   ├── reelsContainer
//  │   │   ├── reel[0] (Container)
//  │   │   │   ├── symbol[0] (Sprite)
//  │   │   │   ├── symbol[1] (Sprite)
//  │   │   │   └── symbol[2] (Sprite)
//  │   │   └── reel[1] (Container) ...
//  │   └── winOverlay (Container)
//  ├── effectsLayer  (particles, win lines)
//  └── uiLayer       (always on top — balance, buttons)

const backgroundLayer = new Container();
const gameLayer = new Container();
const effectsLayer = new Container();
const uiLayer = new Container();

// addChild ORDER = render order (later = drawn on top)
app.stage.addChild(backgroundLayer);
app.stage.addChild(gameLayer);
app.stage.addChild(effectsLayer);
app.stage.addChild(uiLayer);

// === Transformations cascade down the hierarchy ===
gameLayer.x = 100;           // All children shift right by 100
gameLayer.alpha = 0.5;       // All children become 50% transparent
gameLayer.scale.set(0.9);    // All children scale to 90%

// === Container properties ===
const container = new Container();
container.x = 200;           // Position (top-left is 0,0)
container.y = 150;
container.pivot.set(0.5);    // Rotation/scale pivot point (in pixels)
container.rotation = Math.PI / 4; // 45 degree rotation
container.visible = false;   // Hides but keeps in memory (faster than destroy)
container.alpha = 0;         // 0 = invisible, 1 = opaque (still in render tree!)
container.sortableChildren = true; // Allow z-index sorting via child.zIndex

// === Finding children ===
container.name = 'reels';
const found = app.stage.getChildByName('reels'); // Recursive name search

// === Coordinate conversion ===
const localPos = container.toLocal({ x: 500, y: 300 }); // global → local
const globalPos = container.toGlobal({ x: 0, y: 0 });   // local → global
const bounds = container.getBounds(); // Bounding box in world space`

const SPRITE_CODE = `// Sprites — The most common display object
import { Sprite, Texture, Assets, Rectangle } from 'pixi.js';

// === Loading and creating textures ===
const texture = await Assets.load('/images/seven.png');
const sprite = new Sprite(texture);

// === anchor — pivot in 0-1 normalized space ===
// (0, 0) = top-left (default)   (0.5, 0.5) = center   (1, 1) = bottom-right
sprite.anchor.set(0.5);      // Center — use this for most game sprites
sprite.anchor.set(0, 0);     // Top-left default
sprite.anchor.set(0.5, 1);   // Bottom-center (walking characters)

// === Position, Size, Scale ===
sprite.x = 400;
sprite.y = 300;
sprite.width = 128;           // Sets scale.x so rendered width = 128
sprite.height = 128;          // Sets scale.y so rendered height = 128
sprite.scale.set(2);          // 2x size — more precise than width/height
sprite.scale.x = 1.5;         // Stretch horizontally only
sprite.scale.y = -1;          // Flip vertically

// === Appearance ===
sprite.tint = 0xFFD700;       // Gold overlay (multiplied with texture)
sprite.tint = 0xFFFFFF;       // No tint — default
sprite.alpha = 0.5;           // Semi-transparent
sprite.rotation = Math.PI;    // 180 degree rotation (radians)
sprite.blendMode = 'add';     // Additive blending (glowing effect)

// === Visibility ===
sprite.visible = false;       // Hide — still in render tree
sprite.renderable = false;    // Skip rendering entirely (more efficient than visible=false for permanent hides)

// === Sub-texture (frame within atlas) ===
const frame = new Rectangle(0, 0, 128, 128); // x,y,w,h within the atlas image
const subTex = new Texture({ source: atlasTexture.source, frame });
const subSprite = new Sprite(subTex);

// === InteractiveSprite pattern ===
sprite.eventMode = 'static';  // Enable interaction (v8 — replaces interactive = true)
sprite.cursor = 'pointer';
sprite.hitArea = new Rectangle(0, 0, 128, 128); // Custom hit area

sprite.on('pointerdown', () => console.log('clicked'));
sprite.on('pointerover', () => { sprite.tint = 0xFFA500; });
sprite.on('pointerout',  () => { sprite.tint = 0xFFFFFF; });`

const TICKER_CODE = `// Ticker — PixiJS Game Loop
import { Ticker, UPDATE_PRIORITY } from 'pixi.js';

// === deltaTime (CRITICAL to understand) ===
// At 60fps: ticker.deltaTime = 1.0  (16.67ms per frame)
// At 30fps: ticker.deltaTime = 2.0  (33.33ms per frame)
// At 120fps: ticker.deltaTime = 0.5  (8.33ms per frame)
// ALWAYS multiply speed by deltaTime for frame-rate independence

app.ticker.add((ticker) => {
  const dt = ticker.deltaTime;   // Normalized (1.0 = 60fps baseline)
  const ms = ticker.deltaMS;     // Actual milliseconds since last frame
  const fps = ticker.FPS;        // Current frames per second
  const total = ticker.elapsedMS; // Total ms since app start

  // Frame-rate INDEPENDENT movement (correct)
  sprite.x += 3 * dt;           // Always moves at "3 units per 60fps-frame" speed
  sprite.rotation += 0.05 * dt;

  // Frame-rate DEPENDENT movement (WRONG — avoid)
  sprite.x += 3;                // Moves 2x faster at 120fps, 0.5x at 30fps
});

// === Priority (lower = runs earlier) ===
app.ticker.add(handler, null, UPDATE_PRIORITY.INTERACTION); // -50 — interaction
app.ticker.add(handler, null, UPDATE_PRIORITY.HIGH);        // 25 — physics/AI
app.ticker.add(handler, null, UPDATE_PRIORITY.NORMAL);      // 0 — default game logic
app.ticker.add(handler, null, UPDATE_PRIORITY.LOW);         // -25 — cameras
app.ticker.add(handler, null, UPDATE_PRIORITY.UTILITY);     // -50 — stats/debug

// === Time-based animation (use deltaMS not deltaTime) ===
let elapsed = 0;
app.ticker.add((ticker) => {
  elapsed += ticker.deltaMS;
  const progress = Math.min(elapsed / 2000, 1); // 2-second animation
  sprite.x = startX + (endX - startX) * progress;
  if (progress >= 1) app.ticker.remove(/* self */);
});

// === addOnce — runs exactly one frame then auto-removes ===
app.ticker.addOnce(() => {
  // First frame after some event — setup initial state
});

// === Stop/Start (pausing) ===
app.ticker.stop();  // Pause entire game loop
app.ticker.start(); // Resume

// === Max FPS cap ===
app.ticker.maxFPS = 60; // Cap — prevents >60fps even on 144Hz monitors`

const GRAPHICS_CODE = `// Graphics API — v8 (IMPORTANT: v7 vs v8 difference)
import { Graphics } from 'pixi.js';

const g = new Graphics();

// ============ v8 API ============
// Shape methods followed by fill() / stroke()
// Each shape is independent — NO begin/end wrapping

// Rectangle
g.rect(x, y, width, height);
g.fill({ color: 0xFF0000, alpha: 0.5 });
g.stroke({ color: 0xFFD700, width: 3 });

// Rounded rectangle
g.roundRect(10, 10, 200, 80, 12); // last = corner radius
g.fill(0x1a1a2e);
g.stroke({ color: 0x888888, width: 1 });

// Circle and Ellipse
g.circle(cx, cy, radius);
g.fill(0x00FF88);
g.ellipse(cx, cy, radiusX, radiusY);
g.fill(0xFF6600);

// Line / Path
g.moveTo(0, 0);
g.lineTo(400, 0);
g.lineTo(400, 300);
g.stroke({ color: 0xFFFFFF, width: 2 });

// Polygon
g.poly([0,0, 50,0, 75,50, 50,100, 0,100, -25,50]);
g.fill(0x4488FF);
g.stroke({ color: 0x88BBFF, width: 1 });

// Arc / Pie slice
g.arc(cx, cy, radius, startAngle, endAngle);
g.fill(0xFF4444);

// ============ Clear & Redraw (animated graphics) ============
app.ticker.add(() => {
  g.clear(); // MUST call before redrawing
  const angle = Date.now() * 0.001;
  g.moveTo(100, 100);
  g.lineTo(100 + Math.cos(angle) * 50, 100 + Math.sin(angle) * 50);
  g.stroke({ color: 0xFFD700, width: 3 });
});

// ============ v7 API (OLD — you may see in existing code) ============
const g7 = new Graphics();
g7.lineStyle(2, 0xFFD700, 1);  // Must be before shape
g7.beginFill(0xFF0000, 0.5);   // Must be before shape
g7.drawRect(0, 0, 200, 100);
g7.drawCircle(100, 50, 30);
g7.endFill();                   // Must close fill`

const FILTERS_CODE = `// PixiJS Filters — GPU post-processing effects
import { BlurFilter, ColorMatrixFilter, AlphaFilter } from 'pixi.js';
// npm install @pixi/filter-glow @pixi/filter-outline @pixi/filter-drop-shadow

// === CRITICAL: Filters trigger extra render passes ===
// Each filter on each object = one off-screen render pass
// Apply to CONTAINER, not individual sprites!

// BAD: 10 sprites with 10 filters = 10 render passes
sprites.forEach(s => { s.filters = [new BlurFilter()]; });

// GOOD: 10 sprites in 1 container with 1 filter = 1 render pass
const container = new Container();
sprites.forEach(s => container.addChild(s));
container.filters = [new BlurFilter()]; // 1 pass for all children

// === BlurFilter ===
const blur = new BlurFilter();
blur.blur = 10;          // Strength (default 8)
blur.quality = 4;        // Blur passes — higher = smoother but slower
blur.repeatEdgePixels = false; // true = no dark edges
sprite.filters = [blur];

// === ColorMatrixFilter — per-pixel color transforms ===
const cm = new ColorMatrixFilter();
cm.grayscale(1, false);    // Full grayscale (false = don't multiply previous)
cm.brightness(1.5, false); // Brighten (>1 = brighter)
cm.saturate(2, false);     // Boost saturation
cm.contrast(1.5, false);   // Increase contrast
cm.hue(90, false);         // Rotate hue 90 degrees
cm.night(0.5, false);      // Night vision effect
cm.reset();                // Identity matrix — no effect

// === Win Symbol Flash Effect ===
function createWinFlash(symbols: Sprite[]): () => void {
  const filter = new ColorMatrixFilter();
  symbols.forEach(s => { s.filters = [filter]; });

  let t = 0;
  const handler = (ticker: any) => {
    t += ticker.deltaMS * 0.005;
    // Pulse brightness 1.0 ↔ 2.0
    filter.reset();
    filter.brightness(1.0 + Math.sin(t * 6) * 0.5, false);
  };
  app.ticker.add(handler);

  return () => {
    app.ticker.remove(handler);
    symbols.forEach(s => { s.filters = null; }); // null = no filters (not [])
  };
}

// === Remove filters correctly ===
sprite.filters = null;  // Correct — removes filter system entirely
sprite.filters = [];    // WRONG — empty array still activates filter system overhead`

const TEXT_CODE = `// Text vs BitmapText — choose correctly
import { Text, TextStyle, BitmapText, BitmapFont } from 'pixi.js';

// ============================================
// Text — Rich styling, re-renders on change
// ============================================
// Good for: static labels, game title, "SPIN" button text
// Bad for: score displays, counters, anything updated frequently

const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'bold',
  fill: ['#FFD700', '#FF8C00'], // Gradient: array of colors
  stroke: { color: '#000000', width: 6 },
  dropShadow: { color: '#000', blur: 8, angle: Math.PI/4, distance: 5, alpha: 0.7 },
  letterSpacing: 2,
  wordWrap: true,
  wordWrapWidth: 400,
});

const winLabel = new Text({ text: 'WIN!', style });
winLabel.anchor.set(0.5);

// Updating text = Canvas2D re-render + GPU texture re-upload (expensive!)
winLabel.text = 'BIG WIN!'; // Avoid in animation loops

// ============================================
// BitmapText — Fast updates, no re-upload
// ============================================
// Good for: balance display, bet amount, win counter, spin counter
// Updates = just repositions atlas quads on GPU — ZERO re-upload cost

// Install font ONCE at game startup
BitmapFont.install({
  name: 'GameFont',
  style: new TextStyle({
    fontFamily: 'Arial',
    fontSize: 64,
    fontWeight: 'bold',
    fill: 0xFFD700,
    stroke: { color: 0x000000, width: 8 },
  }),
  // Only include characters you use (smaller texture atlas)
  chars: BitmapFont.NUMERIC + '.,$ ',
});

const balance = new BitmapText({
  text: '1,000.00',
  style: { fontFamily: 'GameFont', fontSize: 48 },
});
balance.anchor.set(0.5);

// Updating BitmapText = NO GPU cost (just recalculates quad positions)
balance.text = '1,234.56'; // Safe in animation loops!

// ============================================
// Animated coin counter
// ============================================
function animateCoinCounter(
  display: BitmapText,
  from: number,
  to: number,
  durationMs: number,
): Promise<void> {
  return new Promise(resolve => {
    let elapsed = 0;
    const handler = (ticker: any) => {
      elapsed += ticker.deltaMS;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3); // Cubic ease-out
      const current = Math.round(from + (to - from) * eased);
      display.text = current.toLocaleString(); // "1,234"
      if (t >= 1) { app.ticker.remove(handler); resolve(); }
    };
    app.ticker.add(handler);
  });
}`

const PIXI_REACT_CODE = `// React + PixiJS Integration (correct pattern)
import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

// === Rule 1: useRef for Application — NOT useState ===
// useState triggers re-renders → destroys and remounts PixiJS every render
// useRef is stable across renders — never causes re-renders

function SlotCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;
    // Guard: appRef.current check handles React 18 StrictMode double-invoke

    let mounted = true;
    const app = new Application();

    app.init({
      width: 1024,
      height: 576,
      background: '#0a0a1a',
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    }).then(() => {
      if (!mounted) { app.destroy(true); return; } // Component unmounted during async init
      appRef.current = app;
      containerRef.current?.appendChild(app.canvas);
      initGame(app); // Start game logic
    });

    return () => {
      mounted = false;
      // Cleanup: remove canvas, stop ticker, free GPU memory
      appRef.current?.destroy(true, { children: true, texture: true });
      appRef.current = null;
    };
  }, []); // Empty deps = run once on mount

  // === Rule 2: Sync React props → PixiJS via separate useEffect ===
  // Don't put prop-derived logic in the init effect
  useEffect(() => {
    appRef.current?.ticker.speed = isPaused ? 0 : 1;
  }, [isPaused]);

  return (
    // Position: relative so UI overlay works with absolute positioning
    <div className="relative w-full aspect-video">
      <div ref={containerRef} className="w-full h-full" />
      {/* React UI overlaid on top of PixiJS canvas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <SpinButton />
      </div>
    </div>
  );
}

// === Rule 3: Communicate PixiJS → React via callbacks ===
function initGame(app: Application) {
  // Register a callback from game to React
  // NOT: React state inside PixiJS code (circular dependency)
}

// === Rule 4: Two-way bridge pattern ===
interface GameBridge {
  onWin: (amount: number) => void;    // PixiJS → React
  onBalance: (amount: number) => void;
  spin: () => void;                    // React → PixiJS
  setBet: (amount: number) => void;
}

// Pass bridge into game controller, not direct React setState refs`

const ANIMATED_SPRITE_CODE = `// AnimatedSprite — Frame-based animations
import { AnimatedSprite, Assets, Spritesheet, Texture } from 'pixi.js';

// Load spritesheet (contains multiple animation frames)
const sheet: Spritesheet = await Assets.load('/coin-spin.json');
await sheet.parse(); // Parse frame data into Textures

// === Create from spritesheet animations block ===
// JSON must have "animations" key:
// { "animations": { "coin": ["coin_00.png", "coin_01.png", ...] } }
const coinFrames: Texture[] = sheet.animations['coin'];
const coin = new AnimatedSprite(coinFrames);
coin.anchor.set(0.5);

// === animationSpeed explained ===
// animationSpeed = frames to advance per game tick
// At 60fps game loop:
//   animationSpeed = 1.0 → 60 frames/sec animation
//   animationSpeed = 0.5 → 30 frames/sec animation
//   animationSpeed = 12/60 = 0.2 → 12 frames/sec animation (natural for coin flip)

coin.animationSpeed = 0.2; // 12fps animation
coin.loop = true;
coin.play();

// === One-shot animation (play once, stop) ===
function playLanding(symbol: AnimatedSprite): Promise<void> {
  return new Promise(resolve => {
    symbol.loop = false;
    symbol.animationSpeed = 0.5;
    symbol.gotoAndPlay(0);
    symbol.onComplete = () => {
      symbol.gotoAndStop(0); // Return to rest frame
      resolve();
    };
  });
}

// === Playback control ===
coin.play();               // Start from current frame
coin.stop();               // Pause on current frame
coin.gotoAndPlay(3);       // Jump to frame 3 and play
coin.gotoAndStop(0);       // Jump to frame 0 and stop (show static)
console.log(coin.currentFrame); // 0-based index
console.log(coin.totalFrames);  // Total frame count

// === Callbacks ===
coin.onComplete = () => console.log('Finished (loop=false only)');
coin.onLoop = () => console.log('Looped');
coin.onFrameChange = (frame) => {
  if (frame === 6) playSoundEffect('coin-tick');
};`

const REEL_TICKER_CODE = `// Slot Reel Animation using Ticker + Mask
import { Container, Sprite, Graphics, Texture, Ticker } from 'pixi.js';

class SlotReel {
  readonly container: Container;      // Outer — clipped by mask
  private innerContainer: Container;  // Inner — scrolls vertically
  private sprites: Sprite[] = [];
  private position = 0;               // Current scroll position in pixels
  private speed = 0;                  // Current scroll speed px/tick
  private spinning = false;
  private stopTarget: number | null = null;
  private stopResolve: (() => void) | null = null;

  private readonly SYMBOL_HEIGHT = 160;
  private readonly VISIBLE_ROWS = 3;
  private readonly stripLength: number;

  constructor(
    private symbols: string[],       // Reel strip (symbol names)
    private textures: Record<string, Texture>,
    private reelIndex: number,
  ) {
    this.stripLength = symbols.length * this.SYMBOL_HEIGHT;

    // Outer: clips to visible window via mask
    this.container = new Container();
    const mask = new Graphics();
    mask.rect(0, 0, 160, this.SYMBOL_HEIGHT * this.VISIBLE_ROWS);
    mask.fill(0xFFFFFF);
    this.container.addChild(mask);
    this.container.mask = mask;

    // Inner: contains all symbol sprites, scrolls up
    this.innerContainer = new Container();
    this.container.addChild(this.innerContainer);

    // Pre-create sprites for visible rows + 2 buffer rows
    const spriteCount = this.VISIBLE_ROWS + 2;
    for (let i = 0; i < spriteCount; i++) {
      const sym = symbols[i % symbols.length];
      const sprite = new Sprite(textures[sym] ?? Texture.WHITE);
      sprite.width = sprite.height = this.SYMBOL_HEIGHT;
      sprite.y = i * this.SYMBOL_HEIGHT;
      this.sprites.push(sprite);
      this.innerContainer.addChild(sprite);
    }
  }

  startSpin(): void {
    this.spinning = true;
    this.speed = 30 + this.reelIndex * 5; // Each reel slightly faster
    this.stopTarget = null;
  }

  stopAt(symbolIndex: number): Promise<void> {
    // Calculate target pixel position: symbol should land on center row
    const centerOffset = Math.floor(this.VISIBLE_ROWS / 2) * this.SYMBOL_HEIGHT;
    const targetInStrip = (symbolIndex * this.SYMBOL_HEIGHT) - centerOffset;

    // Ensure stop is always FORWARD from current position
    const fullStrips = Math.ceil(this.position / this.stripLength) + 2;
    this.stopTarget = targetInStrip + fullStrips * this.stripLength;

    return new Promise(r => { this.stopResolve = r; });
  }

  update = (ticker: Ticker): void => {
    if (!this.spinning) return;

    if (this.stopTarget !== null) {
      const remaining = this.stopTarget - this.position;

      if (remaining <= 0) {
        // Snap to exact position
        this.position = this.stopTarget % this.stripLength;
        this.spinning = false;
        this.speed = 0;
        this.updateSpritePositions();
        this.stopResolve?.();
        this.stopResolve = null;
        return;
      }

      // Decelerate in last 3 symbols (ease-out effect)
      const slowZone = this.SYMBOL_HEIGHT * 3;
      if (remaining < slowZone) {
        this.speed = Math.max(2, (remaining / slowZone) * 30);
      }
    }

    this.position = (this.position + this.speed * ticker.deltaTime) % this.stripLength;
    this.updateSpritePositions();
  };

  private updateSpritePositions(): void {
    for (let i = 0; i < this.sprites.length; i++) {
      // Wrap sprite position within strip using modulo
      const rawY = i * this.SYMBOL_HEIGHT - this.position;
      const wrappedY = ((rawY % this.stripLength) + this.stripLength) % this.stripLength;
      this.sprites[i].y = wrappedY - this.SYMBOL_HEIGHT;

      // Update which symbol texture to show based on position
      const symIdx = Math.floor(
        ((this.position + i * this.SYMBOL_HEIGHT) / this.SYMBOL_HEIGHT)
        % this.symbols.length
      );
      const name = this.symbols[Math.abs(symIdx) % this.symbols.length];
      this.sprites[i].texture = this.textures[name] ?? Texture.WHITE;
    }
  }
}`

// ─── CONCEPT DATA ─────────────────────────────────────────────────────────────

const THEORY_CARDS = [
  {
    title: 'What is PixiJS exactly?',
    accent: true,
    content: [
      'PixiJS is a 2D WebGL rendering engine for the browser. It provides a scene graph (tree of displayable objects) rendered with hardware-accelerated WebGL, with an automatic Canvas2D fallback for environments without WebGL.',
      'It does NOT handle physics, 3D, audio, or networking — it only handles 2D rendering. For slot games, you pair it with your own game logic and Web Audio API.',
      'Key strengths: extremely fast sprite rendering (10,000+ sprites at 60fps), pixel-perfect 2D graphics, rich filter/shader system, and a mature spritesheet/asset pipeline.',
    ],
  },
  {
    title: 'WebGL Rendering Pipeline (simplified)',
    content: [
      'When you add a Sprite to the stage: 1) PixiJS queues it in a batch, 2) at frame end, the Ticker calls renderer.render(stage), 3) the renderer walks the scene graph, 4) sprites sharing the same texture are grouped into one draw call, 5) vertex data is uploaded to GPU, 6) GPU fragment shader samples the texture and writes pixels to the framebuffer.',
      'One draw call = one GPU command. The GPU is fastest when you minimize draw calls. Sprite batching (same texture = 1 draw call) is PixiJS\'s core optimization.',
    ],
  },
  {
    title: 'Display Object Transform Tree',
    content: [
      'Every DisplayObject has a local Transform: position (x,y), scale (x,y), rotation (radians), skew (x,y), and pivot (x,y). When rendering, PixiJS computes the world transform by multiplying all ancestor transforms.',
      'Example: if gameLayer is at x=100 and a child Sprite is at x=50, the Sprite renders at world x=150. This cascading is computed every frame via matrix multiplication.',
      'Changing a Container\'s position/scale/rotation instantly affects all its children visually — this is the power of the scene graph.',
    ],
  },
  {
    title: 'Texture Sources and GPU Memory',
    content: [
      'A Texture has a TextureSource (the actual GPU texture object). Many Textures can reference different regions of the same TextureSource (spritesheet). This is how 20 different symbol Textures all come from ONE GPU texture upload.',
      'VRAM usage: a 2048×2048 RGBA texture = 16MB of GPU VRAM. Mobile devices may have only 1-2GB total VRAM. Always track your texture budget, especially in scenes that load multiple large atlases.',
      'Destroying: texture.destroy(true) frees the GPU TextureSource. texture.destroy(false) only removes the Texture JS object but keeps the GPU memory (for shared sources).',
    ],
  },
  {
    title: 'Masking vs Clipping vs Stencil',
    content: [
      'container.mask = graphicsShape — anything outside the mask shape is invisible. The mask shape defines the visible region. Shape fill color is irrelevant.',
      'Internally, PixiJS uses WebGL stencil buffer for masks with Graphics shapes, and alpha mask for Sprite masks. Stencil masks are cheaper on GPU.',
      'In slot games: the reel window mask clips the spinning symbols to the 3-row visible area. Without a mask, symbols would be visible above and below the reel frame.',
    ],
  },
  {
    title: 'Event System — Federated Events (v8)',
    content: [
      'PixiJS v8 uses a Federated Event System modeled after DOM events. Events bubble up the scene graph like DOM events, with capture and bubble phases.',
      'eventMode options: "none" = no interaction, "passive" = children only, "static" = full interaction on static objects (most common), "dynamic" = recalculates hit area every frame (moving objects).',
      'The FederatedPointerEvent has: global (world coordinates), client (canvas coordinates), button (0=left, 1=middle, 2=right), pressure, pointerId (multi-touch).',
    ],
  },
]

const V7_V8_DIFFS = [
  { label: 'App initialization', v7: 'new Application({ width, height })', v8: 'new Application(); await app.init({ ... })' },
  { label: 'Canvas element', v7: 'app.view', v8: 'app.canvas' },
  { label: 'Asset loading', v7: 'PIXI.Loader.shared.add().load()', v8: 'Assets.load() / Assets.loadBundle()' },
  { label: 'Interactivity', v7: 'sprite.interactive = true; sprite.buttonMode = true', v8: 'sprite.eventMode = "static"; sprite.cursor = "pointer"' },
  { label: 'Graphics fill', v7: 'g.beginFill(0xff0000); g.drawRect(...); g.endFill()', v8: 'g.rect(...); g.fill(0xff0000)' },
  { label: 'Render call', v7: 'app.renderer.render(stage)', v8: 'app.renderer.render({ container: stage })' },
  { label: 'cacheAsBitmap', v7: 'container.cacheAsBitmap = true', v8: 'container.cacheAsTexture = true' },
  { label: 'Destroy options', v7: 'sprite.destroy({ children, texture, baseTexture })', v8: 'sprite.destroy({ children, texture, textureSource })' },
]

const DISPLAY_HIERARCHY = [
  { name: 'DisplayObject (abstract base)', indent: 0, desc: 'Base class. Has transform (x,y,scale,rotation), alpha, visible, parent.' },
  { name: 'Container extends DisplayObject', indent: 0, desc: 'Can have children. addChild(), removeChild(), getChildAt(). Inherits transforms cascade to children.' },
  { name: '  Sprite extends Container', indent: 1, desc: 'Renders a Texture. Has anchor, tint, blendMode. Most common display object in slot games.' },
  { name: '  Graphics extends Container', indent: 1, desc: 'Draws vector shapes (rect, circle, line, polygon). Good for masks, borders, UI elements.' },
  { name: '  Text extends Sprite', indent: 1, desc: 'Renders text using Canvas2D → GPU texture. Re-uploads on text change. Use for static labels.' },
  { name: '  BitmapText extends Container', indent: 1, desc: 'Renders text from pre-baked font atlas. No re-upload on change. Use for counters/scores.' },
  { name: '  AnimatedSprite extends Sprite', indent: 1, desc: 'Cycles through an array of Textures. Has animationSpeed, loop, play(), stop(). Use for symbol animations.' },
  { name: '  TilingSprite extends Sprite', indent: 1, desc: 'Tiles a texture across a large area. Efficient for repeating backgrounds.' },
  { name: '  NineSlicePlane', indent: 1, desc: 'Scales a texture by stretching only the center, preserving corners. Good for UI panels and buttons.' },
]

type CodeTab = 'init' | 'scene' | 'sprite' | 'ticker' | 'graphics' | 'filters' | 'text' | 'animated' | 'react' | 'reel'
const CODE_TABS: { id: CodeTab; label: string }[] = [
  { id: 'init',     label: 'App Init' },
  { id: 'scene',    label: 'Scene Graph' },
  { id: 'sprite',   label: 'Sprites' },
  { id: 'ticker',   label: 'Ticker' },
  { id: 'graphics', label: 'Graphics' },
  { id: 'filters',  label: 'Filters' },
  { id: 'text',     label: 'Text' },
  { id: 'animated', label: 'AnimatedSprite' },
  { id: 'react',    label: 'React Integration' },
  { id: 'reel',     label: 'Reel Animation' },
]

const CODE_MAP: Record<CodeTab, string> = {
  init: APP_INIT_CODE,
  scene: SCENE_GRAPH_CODE,
  sprite: SPRITE_CODE,
  ticker: TICKER_CODE,
  graphics: GRAPHICS_CODE,
  filters: FILTERS_CODE,
  text: TEXT_CODE,
  animated: ANIMATED_SPRITE_CODE,
  react: PIXI_REACT_CODE,
  reel: REEL_TICKER_CODE,
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function PixiSection() {
  const [activeCode, setActiveCode] = useState<CodeTab>('init')
  const [showAll, setShowAll] = useState(false)
  const allQuestions = [...PIXIJS_QUESTIONS, ...PIXIJS_EXTENDED_QUESTIONS]
  const visibleQuestions = showAll ? allQuestions : allQuestions.slice(0, 5)

  return (
    <SectionWrapper
      badge="PixiJS"
      title="PixiJS Complete Guide"
      subtitle="Full PixiJS coverage from zero — what it is, how WebGL rendering works, every display object type, the event system, filters, animations, and full React integration. Every concept explained with depth."
    >
      {/* What is PixiJS? */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2">
          Core Theory — What PixiJS Is and How It Works
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {THEORY_CARDS.map(card => (
            <ConceptCard key={card.title} title={card.title} accent={card.accent}>
              {card.content.map((p, i) => <p key={i}>{p}</p>)}
            </ConceptCard>
          ))}
        </div>
      </section>

      {/* Display Object Hierarchy */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2">
          Display Object Class Hierarchy
        </h3>
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          {DISPLAY_HIERARCHY.map(item => (
            <div key={item.name} className={`flex gap-3 ${item.indent === 1 ? 'ml-4' : ''}`}>
              <code className="text-primary text-xs font-mono whitespace-nowrap shrink-0">{item.name}</code>
              <span className="text-xs text-muted-foreground leading-relaxed">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* v7 vs v8 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2">
          v7 vs v8 — Breaking Changes Cheatsheet
        </h3>
        <div className="grid md:grid-cols-2 gap-2">
          {V7_V8_DIFFS.map(row => (
            <div key={row.label} className="rounded-lg border border-border bg-card p-3 text-xs space-y-1">
              <p className="font-semibold text-foreground">{row.label}</p>
              <p className="text-muted-foreground">
                <span className="text-red-400 font-mono">v7: </span>
                <code className="text-foreground/70">{row.v7}</code>
              </p>
              <p className="text-muted-foreground">
                <span className="text-primary font-mono">v8: </span>
                <code className="text-primary">{row.v8}</code>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Examples with tabs */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2">
          Code Examples — All Topics
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {CODE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCode(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                activeCode === tab.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CodeBlock code={CODE_MAP[activeCode]} />
      </section>

      {/* Interactive demo */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2">
          Interactive Slot Demo — Concepts in Action
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This demo replicates the core PixiJS slot game flow: reel strips, symbol weighting,
          payline evaluation, and win detection — all concepts you must understand for the interview.
        </p>
        <SlotDemo />
      </section>

      {/* Questions */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2">
          Interview Questions — {allQuestions.length} Questions
        </h3>
        <QuestionList>
          {visibleQuestions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </QuestionList>
        {!showAll && allQuestions.length > 5 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Show {allQuestions.length - 5} more questions
          </button>
        )}
      </section>
    </SectionWrapper>
  )
}
