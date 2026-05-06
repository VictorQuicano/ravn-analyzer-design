import {
  BarChart3,
  CheckCircle2,
  Circle,
  CircleDot,
  FileText,
  Layers,
  type LucideIcon,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react"

import type {
  ProposalSectionKey,
  ProposalSectionState,
  ProposalSections,
} from "../../../../product/sections/proposals/types"

interface SectionNavigatorProps {
  sections: ProposalSections
  activeKey: ProposalSectionKey
  onSelect?: (key: ProposalSectionKey) => void
}

const ITEMS: Array<{
  key: ProposalSectionKey
  label: string
  icon: LucideIcon
  hint: string
}> = [
  { key: "cover", label: "Cover", icon: FileText, hint: "01" },
  {
    key: "executiveSummary",
    label: "Executive Summary",
    icon: ScrollText,
    hint: "02",
  },
  {
    key: "currentState",
    label: "Current State",
    icon: Layers,
    hint: "03",
  },
  {
    key: "ravnAlternative",
    label: "Ravn Alternative",
    icon: Sparkles,
    hint: "04",
  },
  {
    key: "financialComparison",
    label: "Financial Comparison",
    icon: BarChart3,
    hint: "05",
  },
  {
    key: "riskMitigation",
    label: "Risk Mitigation",
    icon: ShieldCheck,
    hint: "06",
  },
  {
    key: "engagementOptions",
    label: "Engagement Options",
    icon: Target,
    hint: "07",
  },
]

function StateDot({ state }: { state: ProposalSectionState }) {
  if (state === "complete")
    return (
      <CheckCircle2
        className="h-3.5 w-3.5 shrink-0 text-lime-600 dark:text-lime-400"
        strokeWidth={2.5}
      />
    )
  if (state === "in_progress")
    return (
      <CircleDot
        className="h-3.5 w-3.5 shrink-0 text-amber-500"
        strokeWidth={2.5}
      />
    )
  return (
    <Circle
      className="h-3.5 w-3.5 shrink-0 text-stone-300 dark:text-stone-600"
      strokeWidth={2}
    />
  )
}

export function SectionNavigator({
  sections,
  activeKey,
  onSelect,
}: SectionNavigatorProps) {
  const completeCount = ITEMS.filter(
    (i) => sections[i.key].state === "complete",
  ).length

  return (
    <nav
      aria-label="Proposal sections"
      className="bg-sidebar border-sidebar-border flex w-full shrink-0 flex-col border-r lg:h-full lg:w-60"
    >
      <div className="border-sidebar-border hidden flex-col gap-1 border-b px-4 py-4 lg:flex">
        <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.14em]">
          Proposal
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-sidebar-foreground text-sm font-semibold">
            Builder
          </span>
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {completeCount}/{ITEMS.length}
          </span>
        </div>
        <div className="bg-muted relative mt-1 h-1 w-full overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-lime-500 transition-all"
            style={{
              width: `${(completeCount / ITEMS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Mobile: horizontal scroll strip */}
      <ul className="flex gap-1 overflow-x-auto px-3 py-2 lg:hidden">
        {ITEMS.map((item) => {
          const section = sections[item.key]
          const isActive = item.key === activeKey
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onSelect?.(item.key)}
                className={[
                  "flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs",
                  isActive
                    ? "border-lime-500 bg-lime-50 font-medium text-stone-900 dark:bg-lime-950/40 dark:text-stone-50"
                    : "border-border bg-card text-muted-foreground",
                ].join(" ")}
              >
                <StateDot state={section.state} />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Desktop list */}
      <ul className="hidden flex-1 flex-col gap-px overflow-y-auto px-2 py-3 lg:flex">
        {ITEMS.map((item) => {
          const section = sections[item.key]
          const isActive = item.key === activeKey
          const Icon = item.icon
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onSelect?.(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-lime-500" />
                )}
                <span
                  className={[
                    "text-muted-foreground/80 font-mono text-[10px] tabular-nums",
                    isActive ? "text-lime-600 dark:text-lime-400" : "",
                  ].join(" ")}
                >
                  {item.hint}
                </span>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate font-medium">
                  {item.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground/70 hidden font-mono text-[10px] tabular-nums xl:inline">
                    {section.wordCount}w
                  </span>
                  <StateDot state={section.state} />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
