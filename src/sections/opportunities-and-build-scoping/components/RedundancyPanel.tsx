import { Layers, Sparkles } from "lucide-react"

import type {
  RedundancyGroup,
} from "../../../../product/sections/opportunities-and-build-scoping/types"

interface RedundancyPanelProps {
  redundancy: RedundancyGroup[]
}

export function RedundancyPanel({ redundancy }: RedundancyPanelProps) {
  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
            Redundancy
          </h3>
          <span className="text-muted-foreground text-[11px]">
            overlapping tools in this project
          </span>
        </div>
        <span className="text-muted-foreground/60 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider">
          <Layers className="h-3 w-3" />
          category taxonomy
        </span>
      </header>

      {redundancy.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 px-5 py-10 text-center">
          <Sparkles className="text-muted-foreground/40 h-5 w-5" />
          <p className="text-foreground text-sm font-medium">
            No overlapping tools detected
          </p>
          <p className="text-muted-foreground text-[11.5px]">
            This SaaS sits alone in its category for the active project.
          </p>
        </div>
      ) : (
        <div className="divide-border/60 divide-y">
          {redundancy.map((group, i) => (
            <RedundancyGroupCard key={`${group.category}-${i}`} group={group} />
          ))}
        </div>
      )}
    </section>
  )
}

function RedundancyGroupCard({ group }: { group: RedundancyGroup }) {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h4 className="text-foreground text-sm font-semibold">
            {group.category}
          </h4>
          <span className="text-muted-foreground/80 text-[11px]">
            {group.siblings.length} apps
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground/80 text-[10px] uppercase tracking-wider">
            redundant spend
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-rose-600 dark:text-rose-400">
            {fmtUsd(group.redundantSpend)}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground mt-1 text-[11.5px] leading-snug">
        {group.summary}
      </p>

      <ul className="mt-3 space-y-1.5">
        {group.siblings.map((sib, i) => {
          const total = group.siblings.reduce(
            (s, x) => s + x.annualSpend,
            0
          )
          const pct =
            total > 0 ? Math.round((sib.annualSpend / total) * 100) : 0
          return (
            <li
              key={`${sib.app}-${i}`}
              className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-md border px-3 py-2 ${
                sib.isFocus
                  ? "border-lime-300 ring-2 ring-inset ring-lime-200 dark:border-lime-900/60 dark:ring-lime-900/40"
                  : "border-border/60 bg-background/40"
              }`}
            >
              {/* Width bar */}
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 ${
                  sib.isFocus
                    ? "bg-lime-100/70 dark:bg-lime-900/30"
                    : "bg-muted/60"
                }`}
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex min-w-0 items-center gap-2">
                {sib.isFocus && (
                  <span className="rounded-sm bg-lime-500 px-1 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-stone-950">
                    Focus
                  </span>
                )}
                <span
                  className={`truncate text-sm ${
                    sib.isFocus
                      ? "text-foreground font-semibold"
                      : "text-foreground/90"
                  }`}
                >
                  {sib.app}
                </span>
              </div>
              <span className="relative shrink-0 font-mono text-[12px] tabular-nums text-foreground">
                {fmtUsd(sib.annualSpend)}
                <span className="text-muted-foreground/70 ml-1.5 text-[10px]">
                  {pct}%
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}
