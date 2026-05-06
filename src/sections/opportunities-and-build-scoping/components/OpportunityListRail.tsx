import { useEffect, useRef, useState } from "react"
import {
  Copy,
  MoreVertical,
  PinOff,
  RefreshCw,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react"

import type {
  RipOpportunity,
  RipTier,
} from "../../../../product/sections/opportunities-and-build-scoping/types"

const TIER_ORDER: RipTier[] = ["hot", "warm", "lukewarm", "cold"]

const TIER_LABEL: Record<RipTier, string> = {
  hot: "Hot",
  warm: "Warm",
  lukewarm: "Lukewarm",
  cold: "Cold",
}

const TIER_DOT: Record<RipTier, string> = {
  hot: "bg-rose-500",
  warm: "bg-amber-500",
  lukewarm: "bg-sky-500",
  cold: "bg-stone-400 dark:bg-stone-500",
}

const TIER_BAR: Record<RipTier, string> = {
  hot: "bg-gradient-to-b from-rose-400 to-rose-600",
  warm: "bg-gradient-to-b from-amber-400 to-amber-600",
  lukewarm: "bg-gradient-to-b from-sky-400 to-sky-600",
  cold: "bg-gradient-to-b from-stone-300 to-stone-500 dark:from-stone-600 dark:to-stone-700",
}

const TIER_RING: Record<RipTier, string> = {
  hot: "ring-rose-300/70 dark:ring-rose-900/60",
  warm: "ring-amber-300/70 dark:ring-amber-900/60",
  lukewarm: "ring-sky-300/70 dark:ring-sky-900/60",
  cold: "ring-stone-300 dark:ring-stone-700",
}

interface OpportunityListRailProps {
  opportunities: RipOpportunity[]
  activeId: string
  onSelect: (id: string) => void
  onAction: (
    id: string,
    action:
      | "pin-to-proposal"
      | "not-pursuing"
      | "regenerate-scope"
      | "copy-share-link"
  ) => void
}

export function OpportunityListRail({
  opportunities,
  activeId,
  onSelect,
  onAction,
}: OpportunityListRailProps) {
  const [search, setSearch] = useState("")
  const [tiers, setTiers] = useState<RipTier[]>([])

  const filtered = opportunities.filter((o) => {
    if (tiers.length && !tiers.includes(o.tier)) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      o.app.toLowerCase().includes(q) ||
      o.vendor.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q)
    )
  })

  const totalSpend = filtered.reduce((s, o) => s + o.annualSpend, 0)
  const totalWaste = filtered.reduce((s, o) => s + o.annualWaste, 0)

  const toggleTier = (t: RipTier) => {
    setTiers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  return (
    <aside className="border-border bg-card/30 flex h-full min-h-0 w-full flex-col border-r lg:w-80">
      {/* Header */}
      <div className="border-border bg-background/80 sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
              Opportunities
            </h2>
            <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
              {filtered.length}
            </span>
          </div>
          <span className="text-muted-foreground hidden font-mono text-[10px] tabular-nums sm:inline">
            Σ {fmtUsd(totalSpend)}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground/60 pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities…"
            className="bg-muted/60 placeholder:text-muted-foreground/50 text-foreground focus-visible:bg-muted focus-visible:ring-foreground/10 h-8 w-full rounded-md border-none pl-8 pr-7 text-xs focus-visible:outline-none focus-visible:ring-2"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-muted-foreground/60 hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tier filter chips */}
        <div className="flex flex-wrap gap-1">
          {TIER_ORDER.map((t) => {
            const active = tiers.includes(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTier(t)}
                className={`inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  active
                    ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
                aria-pressed={active}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[t]}`} />
                {TIER_LABEL[t]}
              </button>
            )
          })}
        </div>

        {/* Aggregate footer */}
        <div className="border-border/50 flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
            Annual waste
          </span>
          <span className="font-mono text-[11px] font-semibold tabular-nums text-rose-600 dark:text-rose-400">
            {fmtUsd(totalWaste)}
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-muted-foreground text-xs">
              No opportunities match.
            </p>
          </div>
        ) : (
          <ul className="divide-border/60 divide-y">
            {filtered.map((o) => (
              <OpportunityRailRow
                key={o.id}
                opportunity={o}
                active={o.id === activeId}
                onSelect={() => onSelect(o.id)}
                onAction={(action) => onAction(o.id, action)}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

function OpportunityRailRow({
  opportunity,
  active,
  onSelect,
  onAction,
}: {
  opportunity: RipOpportunity
  active: boolean
  onSelect: () => void
  onAction: (
    action:
      | "pin-to-proposal"
      | "not-pursuing"
      | "regenerate-scope"
      | "copy-share-link"
  ) => void
}) {
  const renewalLabel =
    opportunity.daysToRenewal < 0
      ? `${Math.abs(opportunity.daysToRenewal)}d overdue`
      : opportunity.daysToRenewal === 0
        ? "today"
        : `${opportunity.daysToRenewal}d to renewal`

  const renewalUrgent = opportunity.daysToRenewal <= 60
  const renewalOverdue = opportunity.daysToRenewal < 0

  return (
    <li className="group/row relative">
      {/* Tier color edge */}
      <span
        aria-hidden
        className={`absolute left-0 top-2 h-[calc(100%-1rem)] w-[3px] rounded-r-full ${TIER_BAR[opportunity.tier]} ${
          active ? "opacity-100" : "opacity-0 group-hover/row:opacity-60"
        }`}
      />
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors ${
          active ? "bg-muted/70" : "hover:bg-muted/40"
        }`}
        aria-current={active ? "true" : undefined}
      >
        {/* Top line: app + score */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-semibold">
              {opportunity.app}
            </p>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
              {opportunity.vendor} · {opportunity.category}
            </p>
          </div>
          <div
            className={`shrink-0 rounded-md px-1.5 py-0.5 ring-1 ring-inset ${TIER_RING[opportunity.tier]}`}
          >
            <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {opportunity.ripScore}
            </span>
          </div>
        </div>

        {/* Bottom line: spend + renewal */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
            {fmtUsd(opportunity.annualSpend)}
            <span className="text-muted-foreground/60 mx-0.5">/</span>
            <span className="text-rose-600 dark:text-rose-400">
              −{fmtUsd(opportunity.annualWaste)}
            </span>
          </span>
          <span
            className={`font-mono text-[10px] tabular-nums ${
              renewalOverdue
                ? "text-rose-600 dark:text-rose-400"
                : renewalUrgent
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            }`}
          >
            {renewalLabel}
          </span>
        </div>
      </button>

      <RowMenu onAction={onAction} active={active} />
    </li>
  )
}

function RowMenu({
  onAction,
  active,
}: {
  active: boolean
  onAction: (
    action:
      | "pin-to-proposal"
      | "not-pursuing"
      | "regenerate-scope"
      | "copy-share-link"
  ) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="absolute right-2 top-2.5" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={`text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-6 w-6 items-center justify-center rounded transition-opacity data-[state=open]:opacity-100 ${
          open || active ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
        }`}
        aria-label="Actions"
        data-state={open ? "open" : "closed"}
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="bg-popover border-border absolute right-0 top-full z-30 mt-1 w-44 rounded-md border p-1 shadow-lg">
          <MenuButton
            icon={<Sparkles className="h-3 w-3" />}
            label="Pin to proposal"
            onClick={() => {
              onAction("pin-to-proposal")
              setOpen(false)
            }}
          />
          <MenuButton
            icon={<RefreshCw className="h-3 w-3" />}
            label="Regenerate scope"
            onClick={() => {
              onAction("regenerate-scope")
              setOpen(false)
            }}
          />
          <MenuButton
            icon={<Copy className="h-3 w-3" />}
            label="Copy share link"
            onClick={() => {
              onAction("copy-share-link")
              setOpen(false)
            }}
          />
          <div className="bg-border my-1 h-px" />
          <MenuButton
            icon={<PinOff className="h-3 w-3" />}
            label="Mark not pursuing"
            danger
            onClick={() => {
              onAction("not-pursuing")
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function MenuButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors ${
        danger
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}
