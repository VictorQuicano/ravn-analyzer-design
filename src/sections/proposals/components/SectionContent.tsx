import { ArrowDownRight, ArrowUpRight, Minus, Quote } from "lucide-react"

import type {
  CurrentStateSection,
  ExecutiveSummary,
  ProposalSectionKey,
  ProposalSections,
  RavnAlternativeSection,
  RiskMitigationSection,
} from "../../../../product/sections/proposals/types"
import { EngagementOptions } from "./EngagementOptions"
import { FinancialComparison } from "./FinancialComparison"

interface SectionContentProps {
  sections: ProposalSections
  activeKey: ProposalSectionKey
  proposalId: string
  prospectCompany: string
  prospectLogoMark: string
  onRecommendOption?: (proposalId: string, optionId: string) => void
  onEditFinancialYear?: (
    proposalId: string,
    year: number,
    field: "currentSpend" | "ravnInvestment",
    value: number,
  ) => void
}

const SECTION_LABEL: Record<ProposalSectionKey, { label: string; n: string }> =
  {
    cover: { label: "Cover", n: "01" },
    executiveSummary: { label: "Executive Summary", n: "02" },
    currentState: { label: "Current State", n: "03" },
    ravnAlternative: { label: "Ravn Alternative", n: "04" },
    financialComparison: { label: "Financial Comparison", n: "05" },
    riskMitigation: { label: "Risk Mitigation", n: "06" },
    engagementOptions: { label: "Engagement Options", n: "07" },
  }

export function SectionContent({
  sections,
  activeKey,
  proposalId,
  prospectCompany,
  prospectLogoMark,
  onRecommendOption,
  onEditFinancialYear,
}: SectionContentProps) {
  const meta = SECTION_LABEL[activeKey]
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 lg:px-10 lg:py-14">
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-xs tabular-nums text-lime-600 dark:text-lime-400">
          {meta.n}
        </span>
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
          {meta.label}
        </span>
      </div>

      {activeKey === "cover" && (
        <CoverContent
          data={sections.cover}
          prospectCompany={prospectCompany}
          prospectLogoMark={prospectLogoMark}
        />
      )}

      {activeKey === "executiveSummary" && (
        <ExecutiveSummaryContent data={sections.executiveSummary} />
      )}

      {activeKey === "currentState" && (
        <CurrentStateContent data={sections.currentState} />
      )}

      {activeKey === "ravnAlternative" && (
        <RavnAlternativeContent data={sections.ravnAlternative} />
      )}

      {activeKey === "financialComparison" && (
        <FinancialComparison
          data={sections.financialComparison}
          proposalId={proposalId}
          onEditFinancialYear={onEditFinancialYear}
        />
      )}

      {activeKey === "riskMitigation" && (
        <RiskMitigationContent data={sections.riskMitigation} />
      )}

      {activeKey === "engagementOptions" && (
        <EngagementOptions
          data={sections.engagementOptions}
          proposalId={proposalId}
          onRecommend={onRecommendOption}
        />
      )}
    </div>
  )
}

// =============================================================================
// Cover
// =============================================================================
function CoverContent({
  data,
  prospectCompany,
  prospectLogoMark,
}: {
  data: ProposalSections["cover"]
  prospectCompany: string
  prospectLogoMark: string
}) {
  return (
    <article className="relative isolate overflow-hidden rounded-2xl border bg-gradient-to-br from-stone-50 via-white to-lime-50/40 p-10 dark:from-stone-900 dark:via-stone-900 dark:to-lime-950/40">
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_30%_20%,rgba(132,204,22,0.18),transparent_60%)]" />

      <header className="relative mb-12 flex items-center justify-between">
        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.2em]">
          Strategic Proposal
        </span>
        <span className="font-mono text-[11px] tabular-nums text-stone-500 dark:text-stone-400">
          {data.proposalDate}
        </span>
      </header>

      <div className="relative mb-10 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-stone-900 font-mono text-lg font-bold text-lime-300 shadow-lg dark:bg-stone-100 dark:text-stone-900">
          {prospectLogoMark}
        </span>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wide">
            Prepared for
          </span>
          <span className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            {prospectCompany}
          </span>
        </div>
      </div>

      <h1 className="relative mb-6 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
        {data.tagline}
      </h1>

      <div className="relative grid grid-cols-1 gap-6 border-t border-stone-200 pt-6 sm:grid-cols-2 dark:border-stone-800">
        <FieldBlock label="Prepared for" value={data.preparedFor} />
        <FieldBlock label="Prepared by" value={data.preparedBy} />
      </div>
    </article>
  )
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
        {value}
      </div>
    </div>
  )
}

// =============================================================================
// Executive Summary
// =============================================================================
function ExecutiveSummaryContent({ data }: { data: ExecutiveSummary }) {
  return (
    <article className="space-y-8">
      <h2 className="text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
        {data.headline}
      </h2>
      <p className="text-muted-foreground border-l-2 border-lime-500 pl-4 text-lg leading-relaxed sm:text-xl">
        {data.subheadline}
      </p>

      <ol className="space-y-5">
        {data.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex gap-4 border-t border-stone-200 pt-5 dark:border-stone-800"
          >
            <span className="mt-1 font-mono text-xs tabular-nums text-stone-500 dark:text-stone-400">
              0{i + 1}
            </span>
            <p className="flex-1 text-base leading-relaxed text-stone-700 dark:text-stone-200">
              {bullet}
            </p>
          </li>
        ))}
      </ol>
    </article>
  )
}

// =============================================================================
// Current State
// =============================================================================
function CurrentStateContent({ data }: { data: CurrentStateSection }) {
  return (
    <article className="space-y-8">
      <p className="max-w-prose text-base leading-relaxed text-stone-700 dark:text-stone-200">
        {data.narrative}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.points.map((p) => {
          const TrendIcon =
            p.trend === "up"
              ? ArrowUpRight
              : p.trend === "down"
                ? ArrowDownRight
                : Minus
          const trendColor =
            p.trend === "up"
              ? "text-rose-500"
              : p.trend === "down"
                ? "text-lime-600 dark:text-lime-400"
                : "text-stone-400"
          return (
            <div
              key={p.metric}
              className="bg-card relative overflow-hidden rounded-lg border p-4"
            >
              <div className="text-muted-foreground flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span>{p.metric}</span>
                <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
              </div>
              <div className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight">
                {p.value}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                {p.detail}
              </div>
            </div>
          )
        })}
      </div>

      {data.redundancyCallouts.length > 0 && (
        <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-lg border border-amber-200 p-5 dark:border-amber-900/60">
          <div className="text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
            <Quote className="h-3.5 w-3.5" />
            Redundancy callouts
          </div>
          <ul className="space-y-2">
            {data.redundancyCallouts.map((c, i) => (
              <li
                key={i}
                className="text-amber-900 dark:text-amber-100 flex gap-2 text-sm leading-snug"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

// =============================================================================
// Ravn Alternative
// =============================================================================
const COMPLEXITY_TONE: Record<
  "low" | "medium" | "high",
  string
> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
}

function RavnAlternativeContent({ data }: { data: RavnAlternativeSection }) {
  return (
    <article className="space-y-8">
      <p className="max-w-prose text-base leading-relaxed text-stone-700 dark:text-stone-200">
        {data.narrative}
      </p>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-700 dark:text-stone-300">
          Feature scope
        </h3>
        <div className="border-border divide-border bg-card divide-y rounded-lg border">
          {data.features.map((f) => (
            <div
              key={f.name}
              className="flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold">
                    {f.name}
                  </h4>
                  <span
                    className={[
                      "inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      COMPLEXITY_TONE[f.complexity],
                    ].join(" ")}
                  >
                    {f.complexity}
                  </span>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="bg-card rounded-lg border p-4">
          <h3 className="text-muted-foreground mb-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
            Tech stack
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {data.techStack.map((tech) => (
              <li
                key={tech}
                className="border-border rounded-md border px-2 py-1 font-mono text-[11px] text-stone-700 dark:text-stone-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card rounded-lg border p-4">
          <h3 className="text-muted-foreground mb-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
            Team &amp; timeline
          </h3>
          <p className="text-sm">{data.team}</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight">
            {data.timelineWeeks}
            <span className="text-muted-foreground ml-1 text-xs font-normal">
              weeks
            </span>
          </p>
        </section>
      </div>
    </article>
  )
}

// =============================================================================
// Risk Mitigation
// =============================================================================
const SEVERITY_TONE: Record<"low" | "medium" | "high", string> = {
  low: "border-emerald-300 bg-emerald-50/60 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  medium:
    "border-amber-300 bg-amber-50/60 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  high: "border-rose-300 bg-rose-50/60 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
}

function RiskMitigationContent({ data }: { data: RiskMitigationSection }) {
  return (
    <article className="space-y-8">
      <p className="max-w-prose text-base leading-relaxed text-stone-700 dark:text-stone-200">
        {data.intro}
      </p>

      <ol className="space-y-3">
        {data.risks.map((r, i) => (
          <li
            key={i}
            className="bg-card rounded-lg border p-5 transition-shadow hover:shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h4 className="text-base font-semibold leading-snug">
                {r.title}
              </h4>
              <span
                className={[
                  "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                  SEVERITY_TONE[r.severity],
                ].join(" ")}
              >
                {r.severity}
              </span>
            </div>
            <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
              {r.description}
            </p>
            <div className="border-l-2 border-lime-500 pl-3">
              <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.14em]">
                Mitigation
              </span>
              <p className="mt-0.5 text-sm leading-snug text-stone-700 dark:text-stone-200">
                {r.mitigation}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
