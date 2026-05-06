import { useState } from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  Boxes,
  Cog,
  Database,
  Flag,
  GitBranch,
  Layers,
  Repeat,
  Sparkles,
  Webhook,
  Wrench,
} from "lucide-react"

import type {
  BuildScope,
  BuildScopeFeature,
  BuildScopeIntegration,
  FeatureComplexity,
  IntegrationDirection,
  IntegrationStyle,
  RipOpportunity,
  TimelinePhaseKind,
} from "../../../../product/sections/opportunities-and-build-scoping/types"

interface BuildScopeStackProps {
  scope: BuildScope
  opportunity: RipOpportunity
  onGenerate?: () => void
}

const COMPLEXITY_CLASS: Record<FeatureComplexity, string> = {
  trivial:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
  standard:
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  complex:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  hard: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
}

const COMPLEXITY_LABEL: Record<FeatureComplexity, string> = {
  trivial: "Trivial",
  standard: "Standard",
  complex: "Complex",
  hard: "Hard",
}

const INTEGRATION_STYLE_LABEL: Record<IntegrationStyle, string> = {
  rest: "REST API",
  oauth: "OAuth",
  webhook: "Webhook",
  sdk: "SDK",
  graphql: "GraphQL",
}

const PHASE_LABEL: Record<TimelinePhaseKind, string> = {
  discovery: "Discovery",
  build: "Build",
  hardening: "Hardening",
  launch: "Launch",
}

const PHASE_BAR: Record<TimelinePhaseKind, string> = {
  discovery: "bg-stone-300 dark:bg-stone-600",
  build: "bg-lime-400 dark:bg-lime-600",
  hardening: "bg-amber-400 dark:bg-amber-600",
  launch: "bg-violet-400 dark:bg-violet-600",
}

const PHASE_TEXT: Record<TimelinePhaseKind, string> = {
  discovery: "text-stone-700 dark:text-stone-200",
  build: "text-lime-900 dark:text-lime-100",
  hardening: "text-amber-900 dark:text-amber-100",
  launch: "text-violet-900 dark:text-violet-100",
}

export function BuildScopeStack({
  scope,
  opportunity,
  onGenerate,
}: BuildScopeStackProps) {
  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
            Build scope
          </h3>
          <span className="text-muted-foreground text-[11px]">
            ai-generated replacement plan
          </span>
        </div>
        <span className="text-muted-foreground/80 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider">
          <Sparkles className="h-3 w-3" />
          v1 · {scope.totalWeeks} weeks
        </span>
      </header>

      {/* Narrative */}
      <div className="border-border/60 border-b px-5 py-5">
        <SectionEyebrow icon={<Wrench className="h-3 w-3" />} label="Narrative" />
        <p className="text-foreground/90 mt-2 max-w-3xl text-[14px] italic leading-relaxed">
          {scope.narrative}
        </p>
      </div>

      {/* Feature list */}
      <FeatureSection features={scope.features} />

      {/* Integrations */}
      <IntegrationsSection integrations={scope.integrations} />

      {/* Tech stack */}
      <TechStackSection stack={scope.techStack} />

      {/* Team & duration */}
      <TeamSection team={scope.team} totalWeeks={scope.totalWeeks} />

      {/* Cost range */}
      <CostRangeSection
        costRange={scope.costRange}
        annualSpend={opportunity.annualSpend}
      />

      {/* Timeline */}
      <TimelineSection
        phases={scope.phases}
        milestones={scope.milestones}
        totalWeeks={scope.totalWeeks}
      />

      {onGenerate && (
        <div className="border-border/60 border-t px-5 py-3">
          <button
            type="button"
            onClick={onGenerate}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[11px]"
          >
            <Repeat className="h-3 w-3" />
            Regenerate the full scope from latest survey data
          </button>
        </div>
      )}
    </section>
  )
}

// =============================================================================
// Sub-sections
// =============================================================================

function SectionEyebrow({
  icon,
  label,
  trailing,
}: {
  icon: React.ReactNode
  label: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground/80 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]">
        {icon}
        {label}
      </span>
      {trailing}
    </div>
  )
}

function FeatureSection({ features }: { features: BuildScopeFeature[] }) {
  const counts = features.reduce(
    (acc, f) => {
      acc[f.complexity] += 1
      return acc
    },
    { trivial: 0, standard: 0, complex: 0, hard: 0 } as Record<
      FeatureComplexity,
      number
    >
  )

  return (
    <div className="border-border/60 border-b px-5 py-5">
      <SectionEyebrow
        icon={<Layers className="h-3 w-3" />}
        label="Feature list"
        trailing={
          <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
            {features.length} features
          </span>
        }
      />
      <ul className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {features.map((f) => (
          <li
            key={f.id}
            className="border-border/60 bg-background/40 group/feat flex items-start gap-3 rounded-md border p-2.5"
          >
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ring-1 ring-inset ${COMPLEXITY_CLASS[f.complexity]}`}
            >
              {COMPLEXITY_LABEL[f.complexity]}
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-[13px] font-medium leading-tight">
                {f.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11.5px] leading-snug">
                {f.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-border/40 mt-3 flex flex-wrap items-center gap-2 border-t pt-2.5 text-[10.5px]">
        {(["hard", "complex", "standard", "trivial"] as FeatureComplexity[]).map(
          (c) => (
            <span
              key={c}
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono uppercase tracking-wider ring-1 ring-inset ${COMPLEXITY_CLASS[c]}`}
            >
              <span className="tabular-nums">{counts[c]}</span>
              {COMPLEXITY_LABEL[c]}
            </span>
          )
        )}
      </div>
    </div>
  )
}

function IntegrationsSection({
  integrations,
}: {
  integrations: BuildScopeIntegration[]
}) {
  return (
    <div className="border-border/60 border-b px-5 py-5">
      <SectionEyebrow
        icon={<Webhook className="h-3 w-3" />}
        label="Integrations"
      />
      {integrations.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-[11.5px]">
          No external integrations required.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((i) => (
            <li
              key={i.id}
              className="border-border/60 bg-background/40 flex items-center justify-between gap-2 rounded-md border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-medium">
                  {i.name}
                </p>
                <p className="text-muted-foreground/80 mt-0.5 font-mono text-[10px] uppercase tracking-wider">
                  via {INTEGRATION_STYLE_LABEL[i.style]}
                </p>
              </div>
              <DirectionGlyph direction={i.direction} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DirectionGlyph({ direction }: { direction: IntegrationDirection }) {
  const className =
    "text-muted-foreground/70 group-hover/feat:text-foreground h-3.5 w-3.5"
  if (direction === "in")
    return (
      <span
        className="text-muted-foreground/70 inline-flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-wider"
        title="Inbound only"
      >
        <ArrowDownToLine className={className} />
        in
      </span>
    )
  if (direction === "out")
    return (
      <span
        className="text-muted-foreground/70 inline-flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-wider"
        title="Outbound only"
      >
        <ArrowUpFromLine className={className} />
        out
      </span>
    )
  return (
    <span
      className="text-muted-foreground/70 inline-flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-wider"
      title="Two-way"
    >
      <ArrowUpRight className={className} />
      both
    </span>
  )
}

function TechStackSection({
  stack,
}: {
  stack: BuildScopeStackProps["scope"]["techStack"]
}) {
  const lanes: { key: keyof typeof stack; label: string; icon: React.ReactNode }[] =
    [
      { key: "frontend", label: "Frontend", icon: <Boxes className="h-3 w-3" /> },
      { key: "backend", label: "Backend", icon: <Cog className="h-3 w-3" /> },
      { key: "data", label: "Data", icon: <Database className="h-3 w-3" /> },
      { key: "infra", label: "Infra", icon: <GitBranch className="h-3 w-3" /> },
    ]

  return (
    <div className="border-border/60 border-b px-5 py-5">
      <SectionEyebrow
        icon={<Boxes className="h-3 w-3" />}
        label="Tech stack"
      />
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {lanes.map((lane) => (
          <div
            key={lane.key}
            className="border-border/60 bg-background/40 rounded-md border p-3"
          >
            <div className="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
              {lane.icon}
              {lane.label}
            </div>
            <ul className="mt-2 space-y-1">
              {stack[lane.key].map((item, i) => (
                <li
                  key={`${lane.key}-${i}`}
                  className="text-foreground/90 font-mono text-[11.5px]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamSection({
  team,
  totalWeeks,
}: {
  team: BuildScopeStackProps["scope"]["team"]
  totalWeeks: number
}) {
  const totalFTEWeeks = team.reduce((s, t) => s + t.count * t.weeks, 0)
  const totalCost = team.reduce((s, t) => s + t.cost, 0)

  return (
    <div className="border-border/60 border-b px-5 py-5">
      <SectionEyebrow
        icon={<Sparkles className="h-3 w-3" />}
        label="Team & duration"
        trailing={
          <span className="text-muted-foreground/80 hidden font-mono text-[10px] tabular-nums sm:inline">
            engagement window {totalWeeks}w
          </span>
        }
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            <tr className="border-border/60 border-b">
              <Th className="pl-1">Role</Th>
              <Th className="text-right">Count</Th>
              <Th className="text-right">Weeks</Th>
              <Th className="text-right pr-1">Cost</Th>
            </tr>
          </thead>
          <tbody className="divide-border/40 divide-y">
            {team.map((row, i) => (
              <tr key={`${row.role}-${i}`} className="hover:bg-muted/40">
                <td className="text-foreground py-2 pl-1 text-sm">
                  {row.role}
                </td>
                <td className="text-foreground py-2 text-right font-mono text-sm tabular-nums">
                  {row.count}
                </td>
                <td className="text-foreground py-2 text-right font-mono text-sm tabular-nums">
                  {row.weeks}w
                </td>
                <td className="text-foreground py-2 pr-1 text-right font-mono text-sm tabular-nums">
                  {fmtUsd(row.cost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-border border-t">
              <td className="text-muted-foreground py-2 pl-1 text-[11px] uppercase tracking-wider">
                Team total
              </td>
              <td className="py-2"></td>
              <td className="text-foreground py-2 text-right font-mono text-[12px] tabular-nums">
                {totalFTEWeeks} FTE-w
              </td>
              <td className="text-foreground py-2 pr-1 text-right font-mono text-sm font-semibold tabular-nums">
                {fmtUsd(totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function CostRangeSection({
  costRange,
  annualSpend,
}: {
  costRange: BuildScopeStackProps["scope"]["costRange"]
  annualSpend: number
}) {
  const [compare, setCompare] = useState(false)
  const max = Math.max(costRange.high, annualSpend)
  const padded = max * 1.05

  const lowPct = (costRange.low / padded) * 100
  const likelyPct = (costRange.likely / padded) * 100
  const highPct = (costRange.high / padded) * 100
  const spendPct = (annualSpend / padded) * 100

  return (
    <div className="border-border/60 border-b px-5 py-5">
      <SectionEyebrow
        icon={<Wrench className="h-3 w-3" />}
        label="Cost range"
        trailing={
          <button
            type="button"
            onClick={() => setCompare((v) => !v)}
            className={`text-[10.5px] inline-flex h-6 items-center gap-1 rounded-md border px-2 font-mono uppercase tracking-wider transition-colors ${
              compare
                ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
            aria-pressed={compare}
          >
            <Repeat className="h-3 w-3" />
            vs annual spend
          </button>
        }
      />

      <div className="mt-4 grid grid-cols-3 gap-3">
        <CostPill label="Low" value={costRange.low} tone="muted" />
        <CostPill label="Likely" value={costRange.likely} tone="primary" />
        <CostPill label="High" value={costRange.high} tone="muted" />
      </div>

      {/* Range bar */}
      <div className="mt-5">
        <div className="bg-muted/60 relative h-3 w-full rounded-full">
          {/* Range bar from low to high */}
          <span
            aria-hidden
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-lime-300 via-lime-500 to-lime-600 dark:from-lime-700 dark:via-lime-500 dark:to-lime-400"
            style={{
              left: `${lowPct}%`,
              width: `${highPct - lowPct}%`,
            }}
          />
          {/* Likely marker */}
          <span
            aria-hidden
            className="absolute -top-0.5 h-4 w-1 -translate-x-1/2 rounded-full bg-stone-900 dark:bg-stone-100"
            style={{ left: `${likelyPct}%` }}
          />
          {/* Annual spend marker (compare on) */}
          {compare && (
            <span
              aria-hidden
              className="absolute -top-1.5 h-6 w-[3px] -translate-x-1/2 rounded-full bg-rose-500"
              style={{ left: `${spendPct}%` }}
              title={`Current annual spend: ${fmtUsd(annualSpend)}`}
            />
          )}
        </div>

        {/* Axis labels */}
        <div className="text-muted-foreground/80 mt-1.5 flex items-center justify-between font-mono text-[9.5px] tabular-nums">
          <span>$0</span>
          <span>{fmtUsd(padded * 0.5)}</span>
          <span>{fmtUsd(padded)}</span>
        </div>

        {compare && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-foreground font-medium">
              Annual contract spend{" "}
              <span className="font-mono tabular-nums">
                {fmtUsd(annualSpend)}
              </span>
            </span>
            <span className="text-muted-foreground">
              · {(annualSpend / costRange.likely).toFixed(2)}× the likely build
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

function CostPill({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "muted" | "primary"
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-md border p-3 ${
        tone === "primary"
          ? "border-lime-300 bg-lime-50 dark:border-lime-900/60 dark:bg-lime-950/30"
          : "border-border/60 bg-background/40"
      }`}
    >
      <span className="text-muted-foreground text-[10px] uppercase tracking-[0.14em]">
        {label}
      </span>
      <span className="text-foreground font-mono text-xl font-semibold tabular-nums">
        {fmtUsd(value)}
      </span>
    </div>
  )
}

function TimelineSection({
  phases,
  milestones,
  totalWeeks,
}: {
  phases: BuildScopeStackProps["scope"]["phases"]
  milestones: BuildScopeStackProps["scope"]["milestones"]
  totalWeeks: number
}) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1)

  return (
    <div className="px-5 py-5">
      <SectionEyebrow
        icon={<Flag className="h-3 w-3" />}
        label="Timeline"
        trailing={
          <span className="text-muted-foreground/80 font-mono text-[10px] tabular-nums">
            W1 → W{totalWeeks}
          </span>
        }
      />

      {/* Desktop horizontal timeline */}
      <div className="mt-4 hidden lg:block">
        {/* Phase bars */}
        <div className="space-y-2">
          {phases.map((phase) => {
            const startPct = ((phase.startWeek - 1) / totalWeeks) * 100
            const widthPct =
              ((phase.endWeek - phase.startWeek + 1) / totalWeeks) * 100

            return (
              <div key={phase.id} className="flex items-center gap-2">
                <div
                  className={`shrink-0 inline-flex h-5 items-center gap-1.5 rounded px-1.5 text-[10.5px] font-medium ${PHASE_TEXT[phase.kind]}`}
                >
                  <span
                    aria-hidden
                    className={`h-2 w-2 rounded-sm ${PHASE_BAR[phase.kind]}`}
                  />
                  {PHASE_LABEL[phase.kind]}
                </div>
                <div className="bg-muted/40 relative h-5 flex-1 rounded">
                  <div
                    className={`absolute inset-y-0 rounded ${PHASE_BAR[phase.kind]} flex items-center justify-center text-[10px] font-medium ${PHASE_TEXT[phase.kind]}`}
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                    }}
                    title={phase.label}
                  >
                    <span className="truncate px-1.5">
                      W{phase.startWeek}–W{phase.endWeek}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Week ticks */}
        <div className="bg-border/40 relative mt-3 h-px w-full">
          {weeks.map((w) => (
            <span
              key={w}
              aria-hidden
              className="bg-border absolute -top-1 h-2 w-px"
              style={{ left: `${((w - 1) / totalWeeks) * 100}%` }}
            />
          ))}
        </div>

        {/* Week labels — show every other for compactness */}
        <div className="text-muted-foreground/80 relative mt-1 h-4 w-full font-mono text-[9.5px] tabular-nums">
          {weeks
            .filter((w) => w === 1 || w === totalWeeks || w % 4 === 0)
            .map((w) => (
              <span
                key={w}
                className="absolute -translate-x-1/2"
                style={{ left: `${((w - 1) / totalWeeks) * 100}%` }}
              >
                W{w}
              </span>
            ))}
        </div>

        {/* Milestones */}
        <div className="border-border/60 relative mt-3 flex h-12 w-full border-t pt-2">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="absolute flex -translate-x-1/2 flex-col items-center gap-0.5"
              style={{ left: `${((m.week - 1) / totalWeeks) * 100}%` }}
            >
              <span
                aria-hidden
                className="bg-violet-500 ring-violet-200 dark:ring-violet-900/60 inline-flex h-3 w-3 items-center justify-center rounded-full ring-2"
              />
              <span className="text-foreground whitespace-nowrap text-[10.5px] font-medium">
                {m.label}
              </span>
              <span className="text-muted-foreground/80 font-mono text-[9.5px] tabular-nums">
                W{m.week}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile vertical fallback */}
      <div className="mt-4 space-y-2 lg:hidden">
        {phases.map((p) => (
          <div
            key={p.id}
            className="border-border/60 flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-sm ${PHASE_BAR[p.kind]}`}
              />
              <div>
                <p className="text-foreground text-sm font-medium">{p.label}</p>
                <p className="text-muted-foreground text-[11px]">
                  {PHASE_LABEL[p.kind]}
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              W{p.startWeek}–W{p.endWeek}
            </span>
          </div>
        ))}
        <div className="border-border/40 mt-3 border-t pt-2">
          <p className="text-muted-foreground/80 mb-2 font-mono text-[10px] uppercase tracking-wider">
            Milestones
          </p>
          <ul className="space-y-1.5">
            {milestones.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-foreground inline-flex items-center gap-2 text-sm">
                  <span className="bg-violet-500 inline-block h-1.5 w-1.5 rounded-full" />
                  {m.label}
                </span>
                <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                  W{m.week}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      scope="col"
      className={`text-muted-foreground py-2 text-left text-[10px] font-semibold uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  )
}

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

// =============================================================================
// Empty state
// =============================================================================

export function BuildScopeEmpty({ onGenerate }: { onGenerate?: () => void }) {
  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
            Build scope
          </h3>
          <span className="text-muted-foreground text-[11px]">
            no scope generated yet
          </span>
        </div>
      </header>
      <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <Sparkles className="text-lime-500 h-6 w-6" />
        <p className="text-foreground max-w-sm text-sm">
          Generate an AI build scope from this opportunity's survey signals,
          contract data, and category siblings.
        </p>
        <p className="text-muted-foreground max-w-sm text-[11.5px]">
          Output: narrative, complexity-tagged feature list, integrations, tech
          stack, team, cost range, and a week-by-week timeline.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-stone-900 px-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <Sparkles className="h-4 w-4" />
          Generate build scope
        </button>
      </div>
    </section>
  )
}
