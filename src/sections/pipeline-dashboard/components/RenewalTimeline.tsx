import { AlertTriangle, ArrowRight, CalendarClock } from "lucide-react"

import type {
  Owner,
  PipelineRenewal,
} from "../../../../product/sections/pipeline-dashboard/types"

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

function fmtFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function fmtShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

interface Band {
  id: string
  label: string
  description: string
  predicate: (r: PipelineRenewal) => boolean
  accent: string
  ring: string
  text: string
}

const BANDS: Band[] = [
  {
    id: "overdue",
    label: "Overdue",
    description: "Past renewal date — recover or release",
    predicate: (r) => r.daysUntil < 0,
    accent: "bg-rose-500",
    ring: "ring-rose-200 dark:ring-rose-900/60",
    text: "text-rose-600 dark:text-rose-300",
  },
  {
    id: "30",
    label: "0–30 days",
    description: "Critical window — Slack alert fired",
    predicate: (r) => r.daysUntil >= 0 && r.daysUntil <= 30,
    accent: "bg-amber-500",
    ring: "ring-amber-200 dark:ring-amber-900/60",
    text: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "60",
    label: "31–60 days",
    description: "Reach out & schedule discovery",
    predicate: (r) => r.daysUntil > 30 && r.daysUntil <= 60,
    accent: "bg-sky-500",
    ring: "ring-sky-200 dark:ring-sky-900/60",
    text: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "90",
    label: "61–90 days",
    description: "Warming — start data capture",
    predicate: (r) => r.daysUntil > 60 && r.daysUntil <= 90,
    accent: "bg-lime-500",
    ring: "ring-lime-300 dark:ring-lime-900/60",
    text: "text-lime-700 dark:text-lime-300",
  },
]

interface RenewalTimelineProps {
  renewals: PipelineRenewal[]
  ownersById: Record<string, Owner>
  onOpenRenewal?: (id: string) => void
}

export function RenewalTimeline({
  renewals,
  ownersById,
  onOpenRenewal,
}: RenewalTimelineProps) {
  const totalValue = renewals
    .filter((r) => r.daysUntil <= 90)
    .reduce((sum, r) => sum + r.annualValue, 0)

  return (
    <div className="flex h-full min-h-0 flex-col px-4 pb-4 sm:px-6">
      <div className="border-border mb-4 flex flex-wrap items-end justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-muted-foreground h-4 w-4" />
          <span className="text-foreground text-sm font-semibold">
            Renewal calendar
          </span>
          <span className="text-muted-foreground hidden text-xs sm:inline">
            · contracts ending in the next 90 days, plus overdue
          </span>
        </div>
        <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
          {fmtUsd(totalValue)} at stake
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 xl:grid-cols-4">
        {BANDS.map((band) => {
          const items = renewals
            .filter(band.predicate)
            .sort((a, b) => a.daysUntil - b.daysUntil)
          const subtotal = items.reduce((sum, r) => sum + r.annualValue, 0)
          return (
            <div
              key={band.id}
              className={`bg-card flex min-h-[240px] flex-col overflow-hidden rounded-lg border ${band.ring} ring-1 ring-inset`}
            >
              <header className="flex items-start justify-between gap-2 px-3 pb-2 pt-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${band.accent}`} />
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${band.text}`}
                    >
                      {band.label}
                    </span>
                    <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
                      {items.length}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    {band.description}
                  </span>
                </div>
                <span className="text-foreground/80 shrink-0 font-mono text-[11px] tabular-nums">
                  {items.length > 0 ? fmtUsd(subtotal) : "—"}
                </span>
              </header>

              <div className="flex flex-1 flex-col gap-1.5 px-2 pb-3">
                {items.length === 0 ? (
                  <div className="border-border/70 text-muted-foreground/70 m-2 flex flex-1 items-center justify-center rounded-md border border-dashed py-6 text-center text-[11px]">
                    No renewals in this window
                  </div>
                ) : (
                  items.map((r) => {
                    const owner = ownersById[r.ownerId]
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onOpenRenewal?.(r.id)}
                        className="bg-background hover:border-foreground/20 group flex flex-col gap-1 rounded-md border px-2.5 py-2 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-foreground truncate text-sm font-medium">
                            {r.company}
                          </span>
                          <span className="text-muted-foreground shrink-0 font-mono text-[11px] tabular-nums group-hover:opacity-100">
                            {fmtUsd(r.annualValue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground truncate text-[11px]">
                            {r.saasApp}
                          </span>
                          {owner && (
                            <span
                              title={owner.name}
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 font-mono text-[9px] font-semibold text-lime-300 dark:bg-stone-100 dark:text-stone-900"
                            >
                              {owner.initials}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[10px] tabular-nums ${
                              r.daysUntil < 0
                                ? "text-rose-600 dark:text-rose-300"
                                : r.daysUntil <= 30
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {r.daysUntil < 0 && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {fmtShortDate(r.renewalDate)} ·{" "}
                            {r.daysUntil < 0
                              ? `${Math.abs(r.daysUntil)}d overdue`
                              : `in ${r.daysUntil}d`}
                          </span>
                          <ArrowRight className="text-muted-foreground/40 group-hover:text-foreground h-3 w-3 transition-colors" />
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              {items.length > 0 && (
                <footer className="border-border bg-muted/30 text-muted-foreground border-t px-3 py-1.5 font-mono text-[10px] tabular-nums">
                  next: {fmtFullDate(items[0].renewalDate)}
                </footer>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
