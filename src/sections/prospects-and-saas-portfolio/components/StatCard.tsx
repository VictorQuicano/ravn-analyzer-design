import type { PortfolioStat } from "../../../../product/sections/prospects-and-saas-portfolio/types"

function formatValue(stat: PortfolioStat): string {
  if (stat.format === "currency") {
    if (stat.value >= 1_000_000_000)
      return `$${(stat.value / 1_000_000_000).toFixed(2)}B`
    if (stat.value >= 1_000_000)
      return `$${(stat.value / 1_000_000).toFixed(stat.value >= 10_000_000 ? 1 : 2)}M`
    if (stat.value >= 1_000)
      return `$${(stat.value / 1_000).toFixed(stat.value >= 100_000 ? 0 : 1)}K`
    return `$${stat.value}`
  }
  if (stat.format === "percent") return `${Math.round(stat.value * 100)}%`
  if (stat.format === "duration-days") {
    if (stat.value < 0) return `${Math.abs(stat.value)}d ago`
    return `${stat.value}d`
  }
  return stat.value.toLocaleString("en-US")
}

export function StatCard({ stat }: { stat: PortfolioStat }) {
  return (
    <div className="bg-card relative flex flex-col gap-1.5 overflow-hidden rounded-lg border p-3.5 sm:p-4">
      <span
        aria-hidden
        className="text-muted-foreground/40 absolute right-3 top-3 font-mono text-[9px] tracking-[0.18em]"
      >
        {stat.id.slice(0, 3).toUpperCase()}
      </span>
      <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.14em]">
        {stat.label}
      </span>
      <span className="text-foreground font-mono text-2xl font-semibold tabular-nums tracking-tight">
        {formatValue(stat)}
      </span>
      <span className="text-muted-foreground truncate text-[11px]">
        {stat.sublabel}
      </span>
    </div>
  )
}
