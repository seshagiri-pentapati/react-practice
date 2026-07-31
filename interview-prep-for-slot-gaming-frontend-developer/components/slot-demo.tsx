'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

const SYMBOLS = ['7️⃣', '🔔', '🍒', '🍋', '⭐', '💎', '🎰', '🃏']
const PAYOUTS: Record<string, number> = {
  '7️⃣': 100, '💎': 50, '🎰': 30, '🃏': 25,
  '⭐': 15, '🔔': 10, '🍒': 5, '🍋': 3,
}

type SpinState = 'idle' | 'spinning' | 'result'

function getWeightedSymbol(): string {
  const weights = [1, 2, 3, 3, 4, 5, 6, 8]
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < SYMBOLS.length; i++) {
    r -= weights[i]
    if (r <= 0) return SYMBOLS[i]
  }
  return SYMBOLS[SYMBOLS.length - 1]
}

export function SlotDemo() {
  const [reels, setReels] = useState<string[][]>([
    ['🍒', '🔔', '7️⃣'],
    ['🍋', '⭐', '🍒'],
    ['🔔', '7️⃣', '🍋'],
    ['⭐', '🍒', '💎'],
    ['7️⃣', '🍋', '🔔'],
  ])
  const [spinState, setSpinState] = useState<SpinState>('idle')
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(10)
  const [lastWin, setLastWin] = useState(0)
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false, false, false])
  const [winMessage, setWinMessage] = useState('')

  const spin = useCallback(async () => {
    if (spinState !== 'idle' || balance < bet) return

    setSpinState('spinning')
    setBalance(b => b - bet)
    setLastWin(0)
    setWinMessage('')

    // Generate results first
    const results: string[][] = reels.map(() =>
      Array.from({ length: 3 }, () => getWeightedSymbol())
    )

    // Stagger reel stops
    for (let reelIdx = 0; reelIdx < 5; reelIdx++) {
      setSpinning(prev => {
        const next = [...prev]
        next[reelIdx] = true
        return next
      })

      await new Promise(r => setTimeout(r, 150))

      // Stop this reel
      await new Promise(r => setTimeout(r, 400 + reelIdx * 200))
      setSpinning(prev => {
        const next = [...prev]
        next[reelIdx] = false
        return next
      })
      setReels(prev => {
        const next = [...prev]
        next[reelIdx] = results[reelIdx]
        return next
      })
    }

    // Evaluate middle row (row index 1)
    const middleRow = results.map(reel => reel[1])
    const firstSym = middleRow[0]
    let matchCount = 1
    for (let i = 1; i < middleRow.length; i++) {
      if (middleRow[i] === firstSym) matchCount++
      else break
    }

    let win = 0
    let msg = ''
    if (matchCount >= 3) {
      const multiplier = PAYOUTS[firstSym] ?? 2
      win = bet * multiplier * (matchCount - 2)
      msg = matchCount === 5 ? `JACKPOT! ${firstSym} x5` : `WIN! ${firstSym} x${matchCount}`
    }

    if (win > 0) {
      setBalance(b => b + win)
      setLastWin(win)
      setWinMessage(msg)
    }

    setSpinState('result')
    setTimeout(() => setSpinState('idle'), 1000)
  }, [spinState, balance, bet, reels])

  const isWinningRow = spinState === 'result' && lastWin > 0

  return (
    <div className="rounded-xl border border-border bg-card p-5 max-w-lg mx-auto">
      <div className="text-center mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Interactive Demo</p>
        <h3 className="text-base font-bold text-foreground">5-Reel Slot Simulation</h3>
        <p className="text-xs text-muted-foreground mt-1">CSS-based demo showing the concepts PixiJS would render on WebGL</p>
      </div>

      {/* Reels */}
      <div className="flex gap-2 justify-center mb-4">
        {reels.map((reel, reelIdx) => (
          <div
            key={reelIdx}
            className="flex flex-col gap-1 w-14 overflow-hidden rounded-lg border border-border bg-background"
          >
            {reel.map((symbol, rowIdx) => (
              <div
                key={rowIdx}
                className={cn(
                  'h-12 flex items-center justify-center text-2xl transition-all duration-100',
                  spinning[reelIdx] && 'animate-bounce',
                  rowIdx === 1 && isWinningRow && 'bg-primary/20 scale-110'
                )}
              >
                {spinning[reelIdx] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : symbol}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Payline indicator */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="flex-1 h-px bg-primary/40"></div>
        <span className="text-xs text-primary font-mono">— PAYLINE —</span>
        <div className="flex-1 h-px bg-primary/40"></div>
      </div>

      {/* Win message */}
      <div className={cn(
        'text-center h-7 mb-3 transition-all duration-300',
        winMessage ? 'opacity-100' : 'opacity-0'
      )}>
        <span className="text-sm font-bold text-primary gold-glow-text">{winMessage}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Balance', value: `$${balance}`, highlight: false },
          { label: 'Bet', value: `$${bet}`, highlight: false },
          { label: 'Last Win', value: `$${lastWin}`, highlight: lastWin > 0 },
        ].map(stat => (
          <div key={stat.label} className={cn(
            'rounded-lg p-2 text-center border',
            stat.highlight ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border'
          )}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={cn('text-sm font-bold', stat.highlight ? 'text-primary' : 'text-foreground')}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bet controls */}
      <div className="flex gap-2 mb-3 justify-center">
        {[1, 5, 10, 25, 50].map(amount => (
          <button
            key={amount}
            onClick={() => setBet(amount)}
            className={cn(
              'px-2.5 py-1 rounded text-xs font-mono border transition-all',
              bet === amount
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            )}
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinState !== 'idle' || balance < bet}
        className={cn(
          'w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-200 border',
          spinState === 'idle' && balance >= bet
            ? 'bg-primary text-primary-foreground border-primary hover:brightness-110 active:scale-95 gold-glow'
            : 'bg-muted/50 text-muted-foreground border-border cursor-not-allowed opacity-60'
        )}
      >
        {spinState === 'spinning' ? 'SPINNING...' : spinState === 'result' ? 'COMPLETE' : 'SPIN'}
      </button>
    </div>
  )
}
