import { useState } from "react"
import { ChevronDown, Info } from "lucide-react"

import type {
  RipFactor,
} from "../../../../product/sections/opportunities-and-build-scoping/types"

interface FactorBreakdownProps {
  factors: RipFactor[]
  ripScore: number
}

export function FactorBreakdown({ factors, ripScore }: FactorBreakdownProps) {
  const weightedSum = factors.reduce((s, f) => s + f.subScore * f.weight, 0)

  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
            Factor breakdown
          </h3>
          <span className="text-muted-foreground text-[11px]">
            six weighted inputs
          </span>
        </div>
        <div className="flex items-baseline gap-2 font-mono text-[11px] tabular-nums">
          <span className="text-muted-foreground">Σ =</span>
          <span className="text-foreground font-semibold">
            {weightedSum.toFixed(1)}
          </span>
          <span className="text-muted-foreground/60">
            ≈ {Math.round(weightedSum)}
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-foreground font-semibold">{ripScore}</span>
        </div>
      </header>

      <ul className="divide-border/60 divide-y">
        {factors.map((f) => (
          <FactorRow key={f.id} factor={f} />
        ))}
      </ul>
    </section>
  )
}

function FactorRow({ factor }: { factor: RipFactor }) {
  const [open, setOpen] = useState(false)
  const widthPct = Math.max(2, Math.min(100, factor.subScore))
  const contribution = factor.subScore * factor.weight
  const intensity =
    factor.subScore >= 80
      ? "intense"
      : factor.subScore >= 60
        ? "warm"
        : factor.subScore >= 40
          ? "mid"
          : "cool"

  const barClass =
    intensity === "intense"
      ? "bg-gradient-to-r from-lime-500 via-lime-500 to-lime-600"
      : intensity === "warm"
        ? "bg-gradient-to-r from-lime-400 to-lime-500"
        : intensity === "mid"
          ? "bg-gradient-to-r from-amber-400 to-amber-500"
          : "bg-gradient-to-r from-stone-300 to-stone-400 dark:from-stone-600 dark:to-stone-700"

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-muted/40 group/factor flex w-full flex-col gap-2 px-5 py-3 text-left transition-colors"
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              {factor.label}
            </span>
            <span className="text-muted-foreground bg-muted inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
              × {factor.weight.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/80 hidden font-mono text-[10px] tabular-nums sm:inline">
              {contribution.toFixed(1)} pts
            </span>
            <span className="text-foreground font-mono text-base font-semibold tabular-nums">
              {factor.subScore}
            </span>
            <ChevronDown
              className={`text-muted-foreground/60 h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {/* Bar */}
        <div className="bg-muted/60 relative h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${barClass} transition-all`}
            style={{ width: `${widthPct}%` }}
          />
          {/* Tick marks at 25/50/75 */}
          {[25, 50, 75].map((tick) => (
            <span
              key={tick}
              aria-hidden
              className="bg-border/80 absolute top-0 h-full w-px"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>

        <p className="text-muted-foreground text-[11.5px] leading-snug">
          {factor.evidence}
        </p>
      </button>

      {open && factor.inputs.length > 0 && (
        <div className="bg-muted/30 border-border/40 border-t px-5 py-3">
          <div className="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
            <Info className="h-3 w-3" />
            Inputs
          </div>
          <ul className="mt-1.5 space-y-1">
            {factor.inputs.map((input, i) => (
              <li
                key={i}
                className="text-foreground/80 flex items-start gap-2 text-[11.5px] leading-snug"
              >
                <span
                  aria-hidden
                  className="bg-muted-foreground/40 mt-1.5 h-1 w-1 shrink-0 rounded-full"
                />
                <span className="font-mono tabular-nums">{input}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
