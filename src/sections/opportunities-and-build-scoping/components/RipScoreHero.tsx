import { CalendarClock, RefreshCw, ShieldAlert, Wallet } from "lucide-react"

import type {
  RipOpportunity,
  RipTier,
} from "../../../../product/sections/opportunities-and-build-scoping/types"

const TIER_LABEL: Record<RipTier, string> = {
  hot: "Hot",
  warm: "Warm",
  lukewarm: "Lukewarm",
  cold: "Cold",
}

const TIER_PILL: Record<RipTier, string> = {
  hot: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  warm: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  lukewarm:
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  cold: "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
}

const TIER_TRACK: Record<RipTier, string> = {
  hot: "stroke-rose-500",
  warm: "stroke-amber-500",
  lukewarm: "stroke-sky-500",
  cold: "stroke-stone-400 dark:stroke-stone-500",
}

interface RipScoreHeroProps {
  opportunity: RipOpportunity
  onRegenerate?: () => void
}

export function RipScoreHero({ opportunity, onRegenerate }: RipScoreHeroProps) {
  const renewalOverdue = opportunity.daysToRenewal < 0
  const renewalUrgent = opportunity.daysToRenewal <= 90 && !renewalOverdue
  const renewalLabel = renewalOverdue
    ? `${Math.abs(opportunity.daysToRenewal)} days overdue`
    : opportunity.daysToRenewal === 0
      ? "renews today"
      : `${opportunity.daysToRenewal} days to renewal`

  return (
    <section className="bg-card relative overflow-hidden rounded-lg border">
      {/* Decorative grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Tier color edge */}
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[3px] ${
          opportunity.tier === "hot"
            ? "bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600"
            : opportunity.tier === "warm"
              ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
              : opportunity.tier === "lukewarm"
                ? "bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600"
                : "bg-gradient-to-r from-stone-300 via-stone-400 to-stone-500 dark:from-stone-600 dark:via-stone-700 dark:to-stone-800"
        }`}
      />

      <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-stretch lg:gap-10">
        {/* Left: score + ring gauge + headline */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset ${TIER_PILL[opportunity.tier]}`}
            >
              {TIER_LABEL[opportunity.tier]}
            </span>
            <span className="text-muted-foreground bg-muted inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] tabular-nums">
              Confidence {opportunity.confidence}%
            </span>
            <span className="text-muted-foreground/80 inline-flex items-center gap-1 text-[11px]">
              {opportunity.category}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <ScoreGauge score={opportunity.ripScore} tier={opportunity.tier} />
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground/80 font-mono text-[10px] uppercase tracking-[0.18em]">
                Rip Score
              </span>
              <span className="text-foreground font-mono text-[64px] font-semibold leading-none tabular-nums tracking-tight sm:text-[80px]">
                {opportunity.ripScore}
                <span className="text-muted-foreground/40 ml-1 text-2xl">
                  / 100
                </span>
              </span>
              <p className="text-foreground mt-2 max-w-md text-sm leading-snug">
                {opportunity.headline}
              </p>
            </div>
          </div>

          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 w-fit items-center gap-1.5 rounded-md border border-transparent px-2.5 text-[11px] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate from latest survey data
            </button>
          )}
        </div>

        {/* Right: at-a-glance stats */}
        <div className="border-border/60 flex flex-1 flex-col gap-3 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <HeroStat
              icon={<Wallet className="h-3.5 w-3.5" />}
              label="Annual spend"
              value={fmtUsd(opportunity.annualSpend)}
              tone="neutral"
              sublabel={`${opportunity.seats} seats`}
            />
            <HeroStat
              icon={<ShieldAlert className="h-3.5 w-3.5" />}
              label="Annual waste"
              value={`−${fmtUsd(opportunity.annualWaste)}`}
              tone="rose"
              sublabel={`${pct(
                opportunity.annualWaste / opportunity.annualSpend
              )} of spend`}
            />
            <HeroStat
              icon={<CalendarClock className="h-3.5 w-3.5" />}
              label="Next renewal"
              value={renewalLabel}
              tone={
                renewalOverdue ? "rose" : renewalUrgent ? "amber" : "neutral"
              }
              sublabel={fmtDate(opportunity.renewalDate)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ScoreGauge({ score, tier }: { score: number; tier: RipTier }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference

  return (
    <div className="relative shrink-0">
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx="48"
          cy="48"
          r={radius}
          strokeWidth="6"
          fill="none"
          className="stroke-stone-200 dark:stroke-stone-800"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          className={TIER_TRACK[tier]}
        />
      </svg>
      <span
        className="text-muted-foreground absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em]"
        aria-hidden
      >
        rip
      </span>
    </div>
  )
}

function HeroStat({
  icon,
  label,
  value,
  sublabel,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sublabel?: string
  tone: "neutral" | "rose" | "amber"
}) {
  const valueClass =
    tone === "rose"
      ? "text-rose-600 dark:text-rose-400"
      : tone === "amber"
        ? "text-amber-600 dark:text-amber-400"
        : "text-foreground"

  return (
    <div className="border-border/60 bg-background/40 rounded-md border p-3">
      <div className="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
        {icon}
        {label}
      </div>
      <div
        className={`mt-1.5 font-mono text-base font-semibold tabular-nums ${valueClass}`}
      >
        {value}
      </div>
      {sublabel && (
        <div className="text-muted-foreground/80 mt-0.5 text-[11px]">
          {sublabel}
        </div>
      )}
    </div>
  )
}

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
