'use client'

import { useState } from 'react'
import { SectionWrapper, ConceptCard, InfoGrid, QuestionList } from './section-wrapper'
import { QuestionCard } from '@/components/question-card'
import { CodeBlock } from '@/components/code-block'
import { WEBSOCKET_QUESTIONS } from '@/lib/interview-data'

// ─── CODE EXAMPLES ─────────────────────────────────────────────────────────────

const WS_BASICS_CODE = `// WebSocket Fundamentals — Lifecycle and Events
// WebSocket = persistent, full-duplex, low-latency TCP connection over HTTP upgrade

// ─── Connecting ───────────────────────────────────────────────────────────────
const ws = new WebSocket('wss://api.casinogame.com/game');
// wss:// = secure (TLS) — always use wss in production (ws:// is unencrypted)
// Protocol upgrade: browser sends HTTP request with Upgrade: websocket header
// Server responds 101 Switching Protocols — connection is now WebSocket

// ─── Lifecycle events ─────────────────────────────────────────────────────────
ws.onopen = (event) => {
  console.log('Connected — readyState:', ws.readyState); // 1 = OPEN
  // Send initial auth/handshake immediately on open
  ws.send(JSON.stringify({ type: 'auth', token: getUserToken() }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data as string);
  handleMessage(data); // Route by message type
};

ws.onerror = (event) => {
  // NOTE: error event gives NO useful information — only that an error occurred
  // Check onclose for the actual reason code
  console.error('WebSocket error event fired');
};

ws.onclose = (event) => {
  // event.code: 1000 = normal, 1001 = going away, 1006 = abnormal (no close frame)
  // event.reason: server-supplied string (may be empty)
  // event.wasClean: whether close handshake completed properly
  console.log(\`Closed: code=\${event.code} reason=\${event.reason} clean=\${event.wasClean}\`);

  if (event.code !== 1000) {
    scheduleReconnect(); // Only reconnect on abnormal closure
  }
};

// ─── readyState values ────────────────────────────────────────────────────────
ws.readyState === WebSocket.CONNECTING // 0 — connecting
ws.readyState === WebSocket.OPEN       // 1 — ready to send/receive
ws.readyState === WebSocket.CLOSING    // 2 — close handshake in progress
ws.readyState === WebSocket.CLOSED     // 3 — connection closed

// ─── Sending messages ─────────────────────────────────────────────────────────
// Only send when OPEN — check first
function safeSend(data: object): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    console.warn('Cannot send — WebSocket not open:', ws.readyState);
  }
}

// ─── Binary data (for high-frequency game state) ─────────────────────────────
ws.binaryType = 'arraybuffer'; // 'arraybuffer' | 'blob' (default)
// Binary messages are faster than JSON for frequent updates (no string parsing)
ws.onmessage = (event) => {
  if (event.data instanceof ArrayBuffer) {
    const view = new DataView(event.data);
    const messageType = view.getUint8(0);
    const payload = new Uint8Array(event.data, 1);
    // ... parse binary protocol
  }
};

// ─── Closing properly ─────────────────────────────────────────────────────────
ws.close(1000, 'User logged out'); // code, reason — initiates graceful close`

const WS_REACT_HOOK_CODE = `// Production WebSocket Hook — useWebSocket
// Handles: reconnection, exponential backoff, message queuing, cleanup

import { useEffect, useRef, useCallback, useState } from 'react';

type MessageHandler = (data: unknown) => void;
type ConnectionStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'reconnecting';

interface UseWebSocketOptions {
  url: string;
  onMessage: MessageHandler;
  maxRetries?: number;
  baseDelay?: number;  // ms (doubled on each retry)
}

export function useWebSocket({ url, onMessage, maxRetries = 10, baseDelay = 500 }: UseWebSocketOptions) {
  const wsRef        = useRef<WebSocket | null>(null);
  const retriesRef   = useRef(0);
  const mountedRef   = useRef(true);
  const queueRef     = useRef<string[]>([]);          // Messages buffered while disconnected
  const onMessageRef = useRef(onMessage);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  // Keep onMessage ref fresh — prevents stale closure in event handler
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    setStatus(retriesRef.current > 0 ? 'reconnecting' : 'connecting');

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) { ws.close(); return; }
      retriesRef.current = 0;
      setStatus('open');

      // Flush message queue (messages sent while disconnected)
      while (queueRef.current.length > 0) {
        ws.send(queueRef.current.shift()!);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        onMessageRef.current(data);
      } catch (e) {
        console.error('[WS] Failed to parse message:', e);
      }
    };

    ws.onerror = () => { /* details are in onclose */ };

    ws.onclose = (event) => {
      setStatus('closed');
      if (!mountedRef.current || event.code === 1000) return; // Normal close

      retriesRef.current++;
      if (retriesRef.current > maxRetries) {
        console.error('[WS] Max retries reached — giving up');
        return;
      }

      // Exponential backoff with jitter: 500ms, 1s, 2s, 4s … capped at 30s
      const delay = Math.min(baseDelay * Math.pow(2, retriesRef.current - 1), 30_000)
                  + Math.random() * 500; // ← jitter prevents thundering herd
      console.log(\`[WS] Reconnecting in \${delay.toFixed(0)}ms (attempt \${retriesRef.current})\`);
      setTimeout(connect, delay);
    };
  }, [url, maxRetries, baseDelay]);

  // Connect on mount
  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      wsRef.current?.close(1000, 'Component unmounted');
    };
  }, [connect]);

  // send: queues message if not connected
  const send = useCallback((data: object) => {
    const str = JSON.stringify(data);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(str);
    } else {
      queueRef.current.push(str); // Will be sent when reconnected
      if (queueRef.current.length > 100) {
        queueRef.current.shift(); // Cap queue size
      }
    }
  }, []);

  return { send, status };
}`

const WS_HEARTBEAT_CODE = `// Heartbeat / Keep-Alive — Preventing Silent Disconnects
// Problem: Firewalls, load balancers, and mobile networks silently drop TCP
// connections that appear idle. WebSocket won't know it's dead until send() fails.
// Solution: Ping-pong heartbeat to detect stale connections.

class WebSocketWithHeartbeat {
  private ws: WebSocket;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly PING_INTERVAL = 30_000;  // 30 seconds
  private readonly PONG_TIMEOUT  = 5_000;   // If no pong in 5s → dead connection

  constructor(url: string, private onMessage: (d: unknown) => void) {
    this.ws = new WebSocket(url);
    this.ws.onopen    = this.handleOpen;
    this.ws.onclose   = this.handleClose;
    this.ws.onmessage = this.handleMessage;
  }

  private handleOpen = (): void => {
    this.startHeartbeat();
  };

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState !== WebSocket.OPEN) return;

      // Send ping
      this.ws.send(JSON.stringify({ type: 'ping', ts: Date.now() }));

      // Start pong timeout — if no pong arrives, close and reconnect
      this.pongTimeout = setTimeout(() => {
        console.warn('[WS] Pong timeout — closing dead connection');
        this.ws.close(4000, 'Pong timeout'); // 4000-4999 = app-defined codes
      }, this.PONG_TIMEOUT);
    }, this.PING_INTERVAL);
  }

  private handleMessage = (event: MessageEvent): void => {
    const msg = JSON.parse(event.data as string);

    if (msg.type === 'pong') {
      // Clear pong timeout — connection is alive
      clearTimeout(this.pongTimeout!);
      this.pongTimeout = null;
      return; // Don't pass pong to application layer
    }

    this.onMessage(msg);
  };

  private handleClose = (): void => {
    clearInterval(this.heartbeatTimer!);
    clearTimeout(this.pongTimeout!);
    this.heartbeatTimer = null;
    this.pongTimeout = null;
  };

  send(data: object): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  destroy(): void {
    this.handleClose();
    this.ws.close(1000, 'Destroyed');
  }
}

// ─── Why exponential backoff + jitter matters ─────────────────────────────────
// If a server crashes and 10,000 clients all reconnect at the same exact time
// (fixed interval) → "thundering herd" → server crashes immediately on restart
//
// Jitter randomises reconnect times across the client population → server
// load ramps up gradually instead of spiking → much more resilient system`

const WS_MESSAGE_PROTOCOL_CODE = `// WebSocket Message Protocol — Type-Safe Routing
// In a real slot game, many different event types flow over one WebSocket connection

// ─── Server → Client message types ───────────────────────────────────────────
type ServerMessage =
  | { type: 'spin_result';    roundId: string; reelStops: number[]; wins: WinResult[]; newBalance: number }
  | { type: 'bonus_trigger';  roundId: string; freeSpins: number; multiplier: number }
  | { type: 'jackpot_won';    amount: number; winnerId: string }
  | { type: 'balance_update'; balance: number }
  | { type: 'error';          code: string; message: string; recoverable: boolean }
  | { type: 'pong';           serverTime: number }
  | { type: 'session_expired' }

// ─── Client → Server message types ───────────────────────────────────────────
type ClientMessage =
  | { type: 'spin';      roundId: string; bet: number; lines: number }
  | { type: 'collect';   roundId: string }  // Collect win and return to base game
  | { type: 'ping';      ts: number }
  | { type: 'auth';      token: string; sessionId: string }
  | { type: 'set_bet';   amount: number }

// ─── Message router ───────────────────────────────────────────────────────────
class GameMessageRouter {
  private handlers = new Map<string, ((msg: ServerMessage) => void)[]>();

  on<T extends ServerMessage['type']>(
    type: T,
    handler: (msg: Extract<ServerMessage, { type: T }>) => void
  ): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    const h = handler as (msg: ServerMessage) => void;
    this.handlers.get(type)!.push(h);
    return () => {
      const arr = this.handlers.get(type)!;
      arr.splice(arr.indexOf(h), 1);
    };
  }

  dispatch(message: ServerMessage): void {
    this.handlers.get(message.type)?.forEach(h => h(message));
  }
}

// ─── Usage in game controller ─────────────────────────────────────────────────
const router = new GameMessageRouter();

// Each system subscribes to only its relevant messages
const unsubSpinResult = router.on('spin_result', (msg) => {
  // msg is typed as { type: 'spin_result'; roundId: string; ... }
  gameController.handleSpinResult(msg);
});

const unsubJackpot = router.on('jackpot_won', (msg) => {
  jackpotOverlay.show(msg.amount, msg.winnerId);
});

const unsubError = router.on('error', (msg) => {
  if (!msg.recoverable) {
    gameController.enterErrorState(msg.code, msg.message);
  }
});

// In WebSocket onmessage:
ws.onmessage = (event) => {
  const msg: ServerMessage = JSON.parse(event.data);
  router.dispatch(msg); // Type-safe dispatch to all subscribers
};

// Cleanup:
unsubSpinResult();
unsubJackpot();
unsubError();`

const WS_FAULT_TOLERANCE_CODE = `// Fault-Tolerant Spin — Round Recovery on Network Failure
// Problem: Player clicks SPIN, money is deducted, network dies before response.
// Without recovery: player loses stake with no result shown.
// Solution: idempotency key (roundId) stored BEFORE the network call.

interface PendingRound {
  roundId: string;
  bet: number;
  timestamp: number;
}

class FaultTolerantSpinClient {
  private pendingKey = 'slot_pending_round';

  async spin(bet: number): Promise<SpinResult> {
    // 1. Generate idempotency key
    const roundId = crypto.randomUUID();

    // 2. PERSIST before the network call (so we can recover after crash)
    const pending: PendingRound = { roundId, bet, timestamp: Date.now() };
    sessionStorage.setItem(this.pendingKey, JSON.stringify(pending));

    try {
      // 3. Attempt spin
      const result = await this.sendSpinRequest(roundId, bet);

      // 4. Clear pending on success
      sessionStorage.removeItem(this.pendingKey);
      return result;
    } catch (error) {
      // 5. Network failure — result unknown
      return this.recoverRound(roundId);
    }
  }

  private async recoverRound(roundId: string): Promise<SpinResult> {
    // Query server with same roundId — server returns cached result if it processed it,
    // or cancels and refunds if it didn't
    let retries = 0;
    while (retries < 5) {
      try {
        const result = await this.sendRecoveryRequest(roundId);
        sessionStorage.removeItem(this.pendingKey);
        return result;
      } catch {
        await delay(1000 * Math.pow(2, retries++)); // Backoff
      }
    }
    throw new Error('ROUND_RECOVERY_FAILED');
  }

  // ─── Call on page/app load — handle crash during previous spin ────────────
  async checkForUnfinishedRound(): Promise<void> {
    const raw = sessionStorage.getItem(this.pendingKey);
    if (!raw) return;

    const pending: PendingRound = JSON.parse(raw);

    // If pending round is too old (>5 min), server will have voided it
    if (Date.now() - pending.timestamp > 5 * 60 * 1000) {
      sessionStorage.removeItem(this.pendingKey);
      showUserMessage('Previous spin was cancelled due to connection issue.');
      return;
    }

    // Recover the round
    showUserMessage('Recovering your previous spin...');
    const result = await this.recoverRound(pending.roundId);
    await gameController.displayResult(result);
  }

  private async sendSpinRequest(roundId: string, bet: number): Promise<SpinResult> {
    return this.wsClient.sendAndWait({ type: 'spin', roundId, bet, lines: 20 }, 'spin_result');
  }

  private async sendRecoveryRequest(roundId: string): Promise<SpinResult> {
    return this.wsClient.sendAndWait({ type: 'recover', roundId }, 'spin_result');
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}`

const WS_VS_HTTP_CODE = `// WebSocket vs HTTP Polling vs SSE — Know the tradeoffs

// ─── WebSocket (FULL DUPLEX, PERSISTENT) ──────────────────────────────────────
// Use when: low-latency bidirectional communication needed
// Slot games: spin request/response, live jackpot updates, free spin triggers
// Connection: persists for entire game session
// Overhead: ~2-6 bytes per frame (vs 200-800 bytes HTTP headers on each request)
// Latency: 5-30ms (single round-trip) vs 100-500ms HTTP
// Server cost: one TCP connection per connected player (expensive at scale)

const ws = new WebSocket('wss://game.example.com/ws');
ws.send(JSON.stringify({ type: 'spin', bet: 1.00 })); // ~0-5ms from server receipt

// ─── HTTP Polling (SHORT POLL) ────────────────────────────────────────────────
// Use when: infrequent updates, simple infrastructure
// Problem: wastes bandwidth (requests even when no new data)
// Latency: average delay = pollInterval / 2

setInterval(async () => {
  const res = await fetch('/api/game/state');
  const data = await res.json();
  if (data.hasNewResult) handleResult(data.result);
}, 2000); // Poll every 2 seconds — 500ms average delay, lots of empty responses

// ─── Server-Sent Events (SSE) — ONE-WAY server → client ─────────────────────
// Use when: server needs to push events, client doesn't need to send back
// Built on HTTP/2, automatic reconnection, text-only (no binary)
// Good for: jackpot feeds, live game activity, news tickers

const evtSource = new EventSource('/api/game/events');
evtSource.addEventListener('jackpot', (event) => {
  const data = JSON.parse(event.data);
  showJackpotAlert(data.amount);
});
// To stop: evtSource.close()

// ─── Decision Matrix ──────────────────────────────────────────────────────────
// WEBSOCKET:  need to SEND from client? YES → use WebSocket
// SSE:        only SERVER pushes, client doesn't send? → use SSE
// HTTP:       infrequent, simple, cacheable? → use HTTP REST

// In a slot game you need BOTH directions (client sends spin, server sends result)
// → WebSocket is the correct choice for the game loop
// A separate SSE or WebSocket might handle jackpot broadcasts across all players`

export function WebSocketSection() {
  const [showAll, setShowAll] = useState(false)
  const allQuestions = WEBSOCKET_QUESTIONS
  const visible = showAll ? allQuestions : allQuestions.slice(0, 5)

  return (
    <SectionWrapper
      badge="WebSockets"
      title="WebSockets & Real-Time Communication"
      subtitle="Everything about WebSocket connections in a slot game context — lifecycle, React hooks, reconnection strategies, heartbeats, message protocols, fault-tolerant spin flows, and when to choose WebSocket vs SSE vs HTTP."
    >
      {/* Why WebSockets in slots */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="text-sm font-semibold text-primary mb-3">Why Slot Games Need WebSockets</h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Low Latency</p>
            <p>A spin result must reach the client in &lt;50ms. HTTP polling has 100-500ms delay. WebSocket: 5-30ms. Players feel the difference in real-time reel feedback.</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Server Push</p>
            <p>Server needs to push events the client didn&apos;t ask for: jackpot wins by other players, free spin triggers mid-session, session expiry warnings, promotional overlays.</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Persistent Session</p>
            <p>The WebSocket persists for the entire game session (30-60 min). Server tracks game state per connection — no re-authentication on each spin request.</p>
          </div>
        </div>
      </div>

      <InfoGrid items={[
        { label: 'Protocol', value: 'wss://', accent: true },
        { label: 'HTTP Upgrade', value: '101' },
        { label: 'Frame overhead', value: '2–6 bytes', accent: true },
        { label: 'vs HTTP headers', value: '~800 bytes' },
        { label: 'Latency target', value: '<50ms' },
        { label: 'Backoff cap', value: '30 seconds' },
      ]} />

      {/* Core concept cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard title="Connection Lifecycle — 4 States" accent>
          <div className="font-mono text-[11px] space-y-1">
            <p><span className="text-amber-400">CONNECTING (0):</span> HTTP upgrade handshake in progress. Cannot send yet.</p>
            <p><span className="text-emerald-400">OPEN (1):</span> Connected and ready. send() works here.</p>
            <p><span className="text-orange-400">CLOSING (2):</span> Close handshake sent. Waiting for server ack.</p>
            <p><span className="text-muted-foreground">CLOSED (3):</span> Connection terminated. Create new WebSocket to reconnect.</p>
          </div>
          <p className="mt-2">Always check <code className="font-mono text-primary">ws.readyState === WebSocket.OPEN</code> before calling <code className="font-mono text-primary">ws.send()</code>. Sending on a CLOSING/CLOSED socket throws an error.</p>
        </ConceptCard>

        <ConceptCard title="Exponential Backoff + Jitter">
          <p>When a server restarts after a crash, thousands of clients reconnect simultaneously. If all retry at fixed intervals, the server gets hit with a huge spike the instant it comes back — it may crash again immediately.</p>
          <p><strong className="text-foreground">Solution:</strong> delay = <code className="font-mono text-primary">min(base × 2^attempt, 30s) + random(0, 500ms)</code>. The jitter randomises reconnect times across clients, spreading load evenly as the server recovers.</p>
        </ConceptCard>

        <ConceptCard title="Heartbeat — Why You Need It">
          <p>Firewalls and NAT routers silently close TCP connections that appear idle (usually after 30-60 seconds). Neither side gets a close event — the connection appears open but is actually dead.</p>
          <p><strong className="text-foreground">Heartbeat pattern:</strong> Client sends ping every 25-30s. Server replies with pong. If no pong in 5 seconds, treat as dead → close and reconnect with backoff.</p>
        </ConceptCard>

        <ConceptCard title="Idempotency Keys — Preventing Double Spins">
          <p>A spin request is sent, the server processes it and deducts the bet, then the network dies before the response arrives. Without recovery, the player lost their stake with no result.</p>
          <p><strong className="text-foreground">Fix:</strong> Generate a <code className="font-mono text-primary">roundId = crypto.randomUUID()</code>, store it in sessionStorage <em>before</em> sending. On failure, send the same roundId again — server either returns the cached result or refunds if it never processed it.</p>
        </ConceptCard>

        <ConceptCard title="Message Queuing While Disconnected">
          <p>The player changes bet amount during a brief reconnect. Without a queue, that message is silently dropped and the bet stays wrong.</p>
          <p><strong className="text-foreground">Fix:</strong> Buffer outgoing messages in an array when the socket is not OPEN. On reconnect, flush the queue before resuming normal operation. Cap queue size (e.g. 100 msgs) to prevent memory growth during long outages.</p>
        </ConceptCard>

        <ConceptCard title="WebSocket vs SSE vs HTTP Polling">
          <ul className="space-y-1 text-[11px]">
            <li><strong className="text-foreground">WebSocket:</strong> Bidirectional. Use when client AND server both send data. Slot game loop.</li>
            <li><strong className="text-foreground">SSE (Server-Sent Events):</strong> Server → client only. HTTP-based, auto-reconnect. Use for jackpot broadcasts.</li>
            <li><strong className="text-foreground">HTTP polling:</strong> Client → server repeatedly. Wastes bandwidth. Only for very infrequent updates (&gt;10s interval).</li>
            <li><strong className="text-foreground">Long polling:</strong> Server holds request open until data is ready. Better than polling, but complex. SSE is simpler for server-push.</li>
          </ul>
        </ConceptCard>
      </div>

      {/* Code examples */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">WebSocket Fundamentals — Lifecycle & Events</h3>
          <p className="text-xs text-muted-foreground mb-2">The raw WebSocket API: connection, all four events, readyState, binary messages, and correct close codes.</p>
          <CodeBlock code={WS_BASICS_CODE} />
        </div>

        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Production React Hook — useWebSocket</h3>
          <p className="text-xs text-muted-foreground mb-2">A production-grade hook with exponential backoff reconnection, jitter, message queuing, React 18 StrictMode guard, and clean unmount teardown.</p>
          <CodeBlock code={WS_REACT_HOOK_CODE} />
        </div>

        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Heartbeat / Keep-Alive — Detecting Dead Connections</h3>
          <p className="text-xs text-muted-foreground mb-2">Ping every 30 seconds, wait 5 seconds for pong, close and reconnect if silent — prevents the "zombie connection" problem from firewall drops.</p>
          <CodeBlock code={WS_HEARTBEAT_CODE} />
        </div>

        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Type-Safe Message Protocol & Router</h3>
          <p className="text-xs text-muted-foreground mb-2">Discriminated union types for all message shapes, a publish-subscribe router with automatic unsubscription, fully typed handler parameters.</p>
          <CodeBlock code={WS_MESSAGE_PROTOCOL_CODE} />
        </div>

        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Fault-Tolerant Spin — Idempotency & Recovery</h3>
          <p className="text-xs text-muted-foreground mb-2">roundId persisted before the network call, automatic recovery on failure, page-load check for crashes during previous spins, and exponential retry.</p>
          <CodeBlock code={WS_FAULT_TOLERANCE_CODE} />
        </div>

        <div>
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">WebSocket vs SSE vs HTTP Polling — Trade-offs</h3>
          <p className="text-xs text-muted-foreground mb-2">When to use each transport: WebSocket for the game loop (bidirectional), SSE for broadcast events (jackpots), HTTP for infrequent or cacheable data.</p>
          <CodeBlock code={WS_VS_HTTP_CODE} />
        </div>
      </div>

      {/* Q&A */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">
          Interview Questions — {allQuestions.length} Questions
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Covers WebSocket lifecycle, reconnection strategies, heartbeats, message protocols, fault tolerance, and transport comparisons.
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
