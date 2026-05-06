import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import type { PipelineStat } from "../../../../product/sections/pipeline-dashboard/types"

function formatStat(stat: PipelineStat): string {
  if (stat.format === "currency") {
    if (stat.value >= 1_000_000_000)
      return `$${(stat.value / 1_000_000_000).toFixed(2)}B`
    if (stat.value >= 1_000_000)
      return `$${(stat.value / 1_000_000).toFixed(stat.value >= 10_000_000 ? 1 : 2)}M`
    if (stat.value >= 1_000) return `$${(stat.value / 1_000).toFixed(0)}K`
    return `$${stat.value}`
  }
  if (stat.format === "percent") return `${stat.value.toFixed(1)}%`
  return stat.value.toLocaleString("en-US")
}

function sparklinePath(values: number[], width: number, height: number): string {
  if (values.length < 2) return ""
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  return values
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / span) * height
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")
}

export function StatCard({ stat }: { stat: PipelineStat }) {
  const positive = stat.delta >= 0
  const path = sparklinePath(stat.sparkline, 100, 32)
  const areaPath = `${path} L100,32 L0,32 Z`

  return (
    <div className="group bg-card relative flex flex-col gap-3 overflow-hidden rounded-lg border p-4 transition-shadow hover:shadow-sm sm:p-5">
      {/* Subtle corner index — gives the card a chart-tile feel */}
      <span
        aria-hidden
        className="text-muted-foreground/40 absolute right-3 top-3 font-mono text-[10px] tracking-[0.18em]"
      >
        {stat.id.toUpperCase().slice(0, 3)}
      </span>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.14em]">
          {stat.label}
        </span>
        <span className="text-foreground font-mono text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
          {formatStat(stat)}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums ring-1 ring-inset ${
              positive
                ? "bg-lime-50 text-lime-800 ring-lime-200 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60"
                : "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60"
            }`}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {stat.delta.toFixed(1)}%
          </span>
          <span className="text-muted-foreground truncate text-[11px]">
            {stat.sublabel}
          </span>
        </div>

        <svg
          viewBox="0 0 100 32"
          preserveAspectRatio="none"
          className="h-9 w-24 shrink-0 opacity-90"
          aria-hidden
        >
          <defs>
            <linearGradient id={`spark-${stat.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor={positive ? "rgb(132 204 22)" : "rgb(244 63 94)"}
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor={positive ? "rgb(132 204 22)" : "rgb(244 63 94)"}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#spark-${stat.id})`} />
          <path
            d={path}
            stroke={positive ? "rgb(101 163 13)" : "rgb(225 29 72)"}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
