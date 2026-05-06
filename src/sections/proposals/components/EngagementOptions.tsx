import { Check, Sparkles, Star } from "lucide-react"

import type {
  EngagementOption,
  EngagementOptionsSection,
} from "../../../../product/sections/proposals/types"

interface EngagementOptionsProps {
  data: EngagementOptionsSection
  proposalId: string
  onRecommend?: (proposalId: string, optionId: string) => void
}

function fmtUsd(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000)
      return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
    return `$${amount}`
  }
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

export function EngagementOptions({
  data,
  proposalId,
  onRecommend,
}: EngagementOptionsProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground max-w-prose text-base leading-relaxed">
        {data.intro}
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {data.options.map((opt) => (
          <OptionCard
            key={opt.id}
            option={opt}
            onRecommend={() => onRecommend?.(proposalId, opt.id)}
          />
        ))}
      </div>
    </div>
  )
}

function OptionCard({
  option,
  onRecommend,
}: {
  option: EngagementOption
  onRecommend: () => void
}) {
  const isRecommended = option.recommended
  return (
    <article
      className={[
        "relative flex flex-col rounded-xl border p-5 transition-shadow",
        isRecommended
          ? "border-lime-500 bg-lime-50/40 shadow-lg shadow-lime-100/50 dark:bg-lime-950/40 dark:shadow-none"
          : "bg-card hover:shadow-sm",
      ].join(" ")}
    >
      {isRecommended && (
        <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-lime-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-900 ring-2 ring-lime-50 dark:ring-stone-900">
          <Sparkles className="h-3 w-3" /> Recommended
        </span>
      )}

      <header className="mb-3">
        <h4 className="text-lg font-semibold tracking-tight">
          {option.name}
        </h4>
        <p className="text-muted-foreground mt-1 text-xs">
          {option.bestFor}
        </p>
      </header>

      <div className="border-border mb-4 border-y py-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
            {fmtUsd(option.totalValue, true)}
          </span>
          <span className="text-muted-foreground text-xs">
            {option.monthlyPrice > 0
              ? `total · ${fmtUsd(option.monthlyPrice, true)}/mo managed`
              : "fixed"}
          </span>
        </div>
        <span className="text-muted-foreground mt-1 block text-[11px] uppercase tracking-wide">
          {option.durationLabel}
        </span>
      </div>

      <ul className="mb-5 flex-1 space-y-2 text-sm">
        {option.scope.map((line, i) => (
          <li key={i} className="flex gap-2.5">
            <Check
              className={[
                "mt-0.5 h-4 w-4 shrink-0",
                isRecommended
                  ? "text-lime-600 dark:text-lime-400"
                  : "text-stone-500 dark:text-stone-400",
              ].join(" ")}
              strokeWidth={2.5}
            />
            <span className="leading-snug text-stone-700 dark:text-stone-200">
              {line}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onRecommend}
        className={[
          "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
          isRecommended
            ? "border-lime-500 bg-lime-500 text-stone-900 hover:bg-lime-400"
            : "border-border bg-background hover:bg-muted",
        ].join(" ")}
      >
        <Star
          className={[
            "h-3.5 w-3.5",
            isRecommended ? "fill-stone-900 text-stone-900" : "",
          ].join(" ")}
        />
        {isRecommended ? "Recommended" : "Mark as recommended"}
      </button>
    </article>
  )
}
