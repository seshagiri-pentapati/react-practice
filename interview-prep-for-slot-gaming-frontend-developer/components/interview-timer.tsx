'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOTAL_SECONDS = 90 * 60

export function InterviewTimer() {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) { setRunning(false); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const reset = useCallback(() => {
    setRunning(false)
    setSeconds(TOTAL_SECONDS)
  }, [])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const elapsed = TOTAL_SECONDS - seconds
  const progress = (elapsed / TOTAL_SECONDS) * 100

  const urgency = seconds < 900 ? 'critical' : seconds < 1800 ? 'warning' : 'normal'

  return (
    <div className={cn(
      'p-4 rounded-lg border transition-colors',
      urgency === 'critical' ? 'bg-red-500/10 border-red-500/30' :
      urgency === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
      'bg-primary/5 border-primary/15'
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Clock className={cn(
            'size-3.5',
            urgency === 'critical' ? 'text-red-400' :
            urgency === 'warning' ? 'text-amber-400' :
            'text-primary'
          )} />
          <span className={cn(
            'text-xs font-semibold uppercase tracking-wide',
            urgency === 'critical' ? 'text-red-400' :
            urgency === 'warning' ? 'text-amber-400' :
            'text-primary'
          )}>
            {urgency === 'critical' ? 'Hurry Up!' : urgency === 'warning' ? 'Halfway' : 'Timer'}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setRunning(r => !r)}
            className="size-6 rounded flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label={running ? 'Pause' : 'Start'}
          >
            {running ? <Pause className="size-3" /> : <Play className="size-3" />}
          </button>
          <button
            onClick={reset}
            className="size-6 rounded flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Reset"
          >
            <RotateCcw className="size-3" />
          </button>
        </div>
      </div>

      <div className={cn(
        'font-mono text-3xl font-bold tabular-nums tracking-tight mb-2',
        urgency === 'critical' ? 'text-red-400' :
        urgency === 'warning' ? 'text-amber-400' :
        'text-foreground'
      )}>
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            urgency === 'critical' ? 'bg-red-500' :
            urgency === 'warning' ? 'bg-amber-500' :
            'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground font-mono">0:00</span>
        <span className="text-[10px] text-muted-foreground font-mono">90:00</span>
      </div>
    </div>
  )
}
