'use client'

import { CodeBlock } from '@/components/code-block'

const PIXI_CONCEPTS = [
  {
    title: 'PixiJS Architecture Overview',
    content: `PixiJS is a 2D rendering engine that uses WebGL for hardware-accelerated graphics, with a Canvas2D fallback. Understanding its architecture is critical for slot game development.`,
    code: `// Core PixiJS Object Hierarchy:
//
// Application
//   ├── Renderer (WebGL or Canvas)
//   ├── Stage (root Container)
//   │     ├── Container (groups of objects)
//   │     │     ├── Sprite (textured rectangle)
//   │     │     ├── Graphics (vector shapes)
//   │     │     ├── Text / BitmapText
//   │     │     └── AnimatedSprite
//   │     └── ... more children
//   └── Ticker (game loop)

// PixiJS v8 vs v7 KEY DIFFERENCES:
// v7: new Application({ width, height })  — sync
// v8: new Application() + await app.init({ ... })  — ASYNC

// v7: app.view  (HTMLCanvasElement)
// v8: app.canvas  (same thing, renamed)

// v7: sprite.interactive = true; sprite.buttonMode = true;
// v8: sprite.eventMode = 'static'; sprite.cursor = 'pointer';

// v7: PIXI.utils.TextureCache  
// v8: Assets.cache  (new Assets API)

// v7: Loader (deprecated)
// v8: Assets.load() — promise-based, built-in caching`,
  },
  {
    title: 'Display Object Properties (All Objects)',
    content: `Every display object in PixiJS inherits these core properties. Memorize these — you will use them constantly in slot game development.`,
    code: `import { Sprite, Container, Texture } from 'pixi.js';

const sprite = new Sprite(Texture.WHITE);

// === Position ===
sprite.x = 100;          // horizontal position
sprite.y = 200;          // vertical position
sprite.position.set(100, 200); // shorthand

// === Dimensions ===
sprite.width = 120;
sprite.height = 120;
sprite.scale.x = 1.5;   // scale X axis
sprite.scale.y = 1.5;   // scale Y axis
sprite.scale.set(1.5);  // uniform scale shorthand

// === Rotation (in RADIANS) ===
sprite.rotation = Math.PI / 4;  // 45 degrees
// Tip: degrees to radians = degrees * (Math.PI / 180)

// === Anchor (pivot point for rotation/scale) ===
sprite.anchor.set(0);    // top-left (default)
sprite.anchor.set(0.5);  // center  (most useful for slots)
sprite.anchor.set(1);    // bottom-right

// === Visibility & Alpha ===
sprite.visible = false;     // hides + skips rendering
sprite.alpha = 0.5;         // 0 = invisible, 1 = opaque

// === Tint (color overlay) ===
sprite.tint = 0xFF0000;     // Red tint
sprite.tint = 0xFFFFFF;     // No tint (default white = no effect)

// === Z-ordering ===
container.addChild(sprite);         // Added on top
container.addChildAt(sprite, 0);    // Added at specific index (0 = bottom)
container.setChildIndex(sprite, 3); // Move to index 3

// === Filters (GPU post-processing) ===
import { BlurFilter, ColorMatrixFilter } from 'pixi.js';
sprite.filters = [new BlurFilter(4)];
sprite.filters = null; // Remove all filters (IMPORTANT for performance)`,
  },
  {
    title: 'Ticker — The Game Loop',
    content: `The Ticker drives all animation in PixiJS. It fires a callback each animation frame (targeting 60fps). deltaTime is frame-rate independent movement.`,
    code: `import { Application, Ticker } from 'pixi.js';

const app = new Application();
await app.init({ width: 800, height: 600 });

// === Add to the shared ticker ===
app.ticker.add((ticker: Ticker) => {
  // ticker.deltaTime:  time since last frame NORMALIZED to 60fps
  //   At 60fps: deltaTime = 1.0
  //   At 30fps: deltaTime = 2.0  (double movement to keep same speed)
  //   At 120fps: deltaTime = 0.5
  
  // ticker.deltaMS: raw milliseconds since last frame
  // ticker.FPS: current frames per second (rounded)
  // ticker.elapsedMS: total ms since ticker started

  // Always multiply movement by deltaTime for FPS-independence
  sprite.x += 2 * ticker.deltaTime;  // 2 pixels per frame at 60fps
  sprite.rotation += 0.01 * ticker.deltaTime;
});

// === Remove listener (CRITICAL — prevent memory leak) ===
const handler = (ticker: Ticker) => { /* ... */ };
app.ticker.add(handler);
app.ticker.remove(handler); // Must remove with same reference

// === One-time execution ===
app.ticker.addOnce(() => {
  console.log('Runs only once, next frame');
});

// === Pause/Resume ===
app.ticker.stop();   // Pause entire game loop
app.ticker.start();  // Resume

// === Manual tick control ===
app.ticker.autoStart = false;
app.ticker.stop();
// Only renders when you call:
app.ticker.update();  // Manual frame advance

// === FPS cap ===
app.ticker.maxFPS = 60;  // Cap at 60fps (useful for battery savings)`,
  },
]

export function PixiConcepts() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="text-sm font-semibold text-primary mb-1">PixiJS Version Note</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Most companies use <strong className="text-foreground">PixiJS v7 or v8</strong>. Key v8 changes: async{' '}
          <code className="text-primary font-mono text-[11px]">app.init()</code>,{' '}
          <code className="text-primary font-mono text-[11px]">app.canvas</code> (renamed from{' '}
          <code className="text-primary font-mono text-[11px]">app.view</code>), and the new{' '}
          <code className="text-primary font-mono text-[11px]">Assets</code> API replacing{' '}
          <code className="text-primary font-mono text-[11px]">Loader</code>. Ask your interviewer which version they use.
        </p>
      </div>

      {PIXI_CONCEPTS.map((concept, i) => (
        <div key={i} className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">{concept.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{concept.content}</p>
          </div>
          <CodeBlock code={concept.code} />
        </div>
      ))}
    </div>
  )
}
