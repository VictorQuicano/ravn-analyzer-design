import { ArrowDown, Minus, TrendingDown, TrendingUp } from "lucide-react"

import type {
  FinancialComparisonSection as FinancialComparisonData,
  FinancialYear,
} from "../../../../product/sections/proposals/types"

interface FinancialComparisonProps {
  data: FinancialComparisonData
  proposalId: string
  onEditFinancialYear?: (
    proposalId: string,
    year: number,
    field: "currentSpend" | "ravnInvestment",
    value: number,
  ) => void
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

export function FinancialComparison({
  data,
  proposalId,
  onEditFinancialYear,
}: FinancialComparisonProps) {
  const max = Math.max(
    ...data.years.flatMap((y) => [y.currentSpend, y.ravnInvestment]),
  )

  return (
    <div className="space-y-8">
      <KpiStrip data={data} />

      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="border-border flex items-baseline justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Year-by-year comparison
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Current SaaS spend vs. Ravn alternative across the engagement.
            </p>
          </div>
          <Legend
            baselineLabel={data.summary.baselineLabel}
            alternativeLabel={data.summary.alternativeLabel}
          />
        </div>

        <BarChart years={data.years} max={max} />

        <CompactTable
          years={data.years}
          proposalId={proposalId}
          onEdit={onEditFinancialYear}
        />
      </div>

      <p className="text-muted-foreground border-l-2 border-stone-300 pl-3 text-xs leading-relaxed dark:border-stone-700">
        {data.notes}
      </p>
    </div>
  )
}

function KpiStrip({ data }: { data: FinancialComparisonData }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiTile
        label="Total saved · 5yr"
        value={fmtUsd(data.summary.totalSaved5yr, true)}
        accent="lime"
        icon={<TrendingDown className="h-3.5 w-3.5" />}
        suffix="against do-nothing"
      />
      <KpiTile
        label="Payback"
        value={`${data.summary.paybackMonths}`}
        accent="stone"
        suffix="months"
      />
      <KpiTile
        label="5-yr ROI"
        value={`${data.summary.fiveYearRoiPct}%`}
        accent="lime"
        icon={<TrendingUp className="h-3.5 w-3.5" />}
      />
      <KpiTile
        label="Avg annual savings"
        value={fmtUsd(data.summary.annualizedSavings, true)}
        accent="stone"
      />
    </div>
  )
}

function KpiTile({
  label,
  value,
  accent,
  icon,
  suffix,
}: {
  label: string
  value: string
  accent: "lime" | "stone"
  icon?: React.ReactNode
  suffix?: string
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border p-4",
        accent === "lime"
          ? "border-lime-200 bg-lime-50/60 dark:border-lime-900/60 dark:bg-lime-950/40"
          : "bg-card",
      ].join(" ")}
    >
      <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
        {icon}
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-muted-foreground text-[11px]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function Legend({
  baselineLabel,
  alternativeLabel,
}: {
  baselineLabel: string
  alternativeLabel: string
}) {
  return (
    <div className="flex items-center gap-3 text-[11px]">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-stone-700 dark:bg-stone-300" />
        <span className="text-muted-foreground">{baselineLabel}</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-lime-500" />
        <span className="text-muted-foreground">{alternativeLabel}</span>
      </span>
    </div>
  )
}

function BarChart({
  years,
  max,
}: {
  years: FinancialYear[]
  max: number
}) {
  return (
    <div className="px-5 py-6">
      <div className="grid grid-cols-5 gap-3 sm:gap-5">
        {years.map((y) => {
          const baselinePct = (y.currentSpend / max) * 100
          const altPct = (y.ravnInvestment / max) * 100
          const savingsPct = Math.round(
            (y.savings / y.currentSpend) * 100,
          )
          return (
            <div key={y.year} className="flex flex-col items-center gap-2">
              <div className="relative flex h-44 w-full items-end justify-center gap-1.5 sm:gap-2">
                <Bar
                  pct={baselinePct}
                  amount={y.currentSpend}
                  tone="baseline"
                />
                <Bar
                  pct={altPct}
                  amount={y.ravnInvestment}
                  tone="alternative"
                />
              </div>
              <div className="text-center">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-700 dark:text-stone-300">
                  {y.label}
                </div>
                <div className="text-muted-foreground mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] tabular-nums">
                  <ArrowDown className="h-2.5 w-2.5 text-lime-600 dark:text-lime-400" />
                  {savingsPct}% saved
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Bar({
  pct,
  amount,
  tone,
}: {
  pct: number
  amount: number
  tone: "baseline" | "alternative"
}) {
  const isAlt = tone === "alternative"
  return (
    <div className="group relative flex h-full flex-1 flex-col items-center justify-end">
      <span
        className={[
          "block w-full rounded-t-sm transition-all",
          isAlt
            ? "bg-lime-500 group-hover:bg-lime-600"
            : "bg-stone-700 group-hover:bg-stone-900 dark:bg-stone-300 dark:group-hover:bg-stone-100",
        ].join(" ")}
        style={{ height: `${pct}%` }}
      />
      <span
        className={[
          "absolute -top-5 whitespace-nowrap font-mono text-[9px] tabular-nums",
          isAlt
            ? "text-lime-700 dark:text-lime-300"
            : "text-stone-700 dark:text-stone-300",
        ].join(" ")}
      >
        ${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M
      </span>
    </div>
  )
}

function CompactTable({
  years,
  proposalId,
  onEdit,
}: {
  years: FinancialYear[]
  proposalId: string
  onEdit?: (
    proposalId: string,
    year: number,
    field: "currentSpend" | "ravnInvestment",
    value: number,
  ) => void
}) {
  return (
    <div className="border-border overflow-x-auto border-t">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground text-[11px] uppercase tracking-wide">
          <tr>
            <th className="px-5 py-2.5 text-left font-medium">Year</th>
            <th className="px-3 py-2.5 text-right font-medium">
              Current SaaS
            </th>
            <th className="px-3 py-2.5 text-right font-medium">
              Ravn alt.
            </th>
            <th className="px-3 py-2.5 text-right font-medium">
              Annual savings
            </th>
            <th className="px-5 py-2.5 text-right font-medium">
              Cumulative
            </th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {years.map((y) => (
            <tr
              key={y.year}
              className="hover:bg-muted/30 group transition-colors"
            >
              <td className="px-5 py-2.5 text-[13px] font-medium">
                {y.label}
              </td>
              <td className="px-3 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() =>
                    onEdit?.(
                      proposalId,
                      y.year,
                      "currentSpend",
                      y.currentSpend,
                    )
                  }
                  className="font-mono tabular-nums hover:text-stone-900 dark:hover:text-stone-50"
                >
                  {fmtUsd(y.currentSpend)}
                </button>
              </td>
              <td className="px-3 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() =>
                    onEdit?.(
                      proposalId,
                      y.year,
                      "ravnInvestment",
                      y.ravnInvestment,
                    )
                  }
                  className="font-mono tabular-nums hover:text-stone-900 dark:hover:text-stone-50"
                >
                  {fmtUsd(y.ravnInvestment)}
                </button>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span className="text-lime-700 font-mono font-medium tabular-nums dark:text-lime-400">
                  {fmtUsd(y.savings)}
                </span>
              </td>
              <td className="px-5 py-2.5 text-right">
                <span className="font-mono font-semibold tabular-nums">
                  {fmtUsd(y.cumulativeSavings)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Tiny helper kept here to avoid a sub-file for one icon use.
export function MinusIcon() {
  return <Minus className="h-3 w-3" />
}
