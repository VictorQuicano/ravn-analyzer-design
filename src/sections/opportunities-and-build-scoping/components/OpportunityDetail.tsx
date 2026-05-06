import { useEffect, useMemo, useRef, useState } from "react"
import {
  Building2,
  Check,
  Filter,
  PanelLeft,
  Plus,
  Search,
  Target,
  X,
  XCircle,
} from "lucide-react"

import type {
  OpportunityDetailProps,
  RipTier,
} from "../../../../product/sections/opportunities-and-build-scoping/types"
import { BuildScopeEmpty, BuildScopeStack } from "./BuildScopeStack"
import { FactorBreakdown } from "./FactorBreakdown"
import { OpportunityListRail } from "./OpportunityListRail"
import { RedundancyPanel } from "./RedundancyPanel"
import { RipScoreHero } from "./RipScoreHero"

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

export function OpportunityDetail({
  opportunities,
  activeOpportunityId,
  onSelectOpportunity,
  onOpportunityAction,
  onTierFilterChange,
  onSearchChange,
  onAddToProposal,
  onRegenerateScope,
  onGenerateScope,
}: OpportunityDetailProps) {
  const sorted = useMemo(
    () => [...opportunities].sort((a, b) => b.ripScore - a.ripScore),
    [opportunities]
  )
  const fallbackId = sorted[0]?.id ?? ""
  const [internalActiveId, setInternalActiveId] = useState<string>(
    activeOpportunityId ?? fallbackId
  )

  useEffect(() => {
    if (activeOpportunityId) setInternalActiveId(activeOpportunityId)
  }, [activeOpportunityId])

  const activeId = activeOpportunityId ?? internalActiveId
  const active = sorted.find((o) => o.id === activeId) ?? sorted[0]

  const handleSelect = (id: string) => {
    setInternalActiveId(id)
    onSelectOpportunity?.(id)
  }

  const [railOpen, setRailOpen] = useState(false)

  return (
    <div className="bg-background animate-fade-in flex h-full min-h-0 flex-col">
      <DetailTopActions
        active={active}
        onAddToProposal={() => active && onAddToProposal?.(active.id)}
        onTierFilterChange={onTierFilterChange}
        onSearchChange={onSearchChange}
        onOpenRail={() => setRailOpen(true)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop rail */}
        <div className="hidden h-full lg:flex">
          <OpportunityListRail
            opportunities={sorted}
            activeId={activeId}
            onSelect={handleSelect}
            onAction={(id, action) => onOpportunityAction?.(id, action)}
          />
        </div>

        {/* Mobile rail sheet */}
        {railOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              aria-label="Close rail"
              className="bg-foreground/30 flex-1 backdrop-blur-sm"
              onClick={() => setRailOpen(false)}
            />
            <div className="bg-background h-full w-80 max-w-[85vw] shadow-xl">
              <div className="border-border flex h-12 items-center justify-between border-b px-3">
                <span className="text-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Opportunities
                </span>
                <button
                  type="button"
                  onClick={() => setRailOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="h-[calc(100%-3rem)] overflow-hidden">
                <OpportunityListRail
                  opportunities={sorted}
                  activeId={activeId}
                  onSelect={(id) => {
                    handleSelect(id)
                    setRailOpen(false)
                  }}
                  onAction={(id, action) =>
                    onOpportunityAction?.(id, action)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Detail pane */}
        <main className="flex-1 overflow-y-auto">
          {active ? (
            <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
              <BreadcrumbStrip
                appName={active.app}
                vendor={active.vendor}
                category={active.category}
              />
              <RipScoreHero
                opportunity={active}
                onRegenerate={() => onRegenerateScope?.(active.id)}
              />

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                <div className="xl:col-span-3">
                  <FactorBreakdown
                    factors={active.factors}
                    ripScore={active.ripScore}
                  />
                </div>
                <div className="xl:col-span-2">
                  <RedundancyPanel redundancy={active.redundancy} />
                </div>
              </div>

              {active.buildScope ? (
                <BuildScopeStack
                  scope={active.buildScope}
                  opportunity={active}
                  onGenerate={() => onRegenerateScope?.(active.id)}
                />
              ) : (
                <BuildScopeEmpty
                  onGenerate={() => onGenerateScope?.(active.id)}
                />
              )}
            </div>
          ) : (
            <EmptyDetail />
          )}
        </main>
      </div>
    </div>
  )
}

function BreadcrumbStrip({
  appName,
  vendor,
  category,
}: {
  appName: string
  vendor: string
  category: string
}) {
  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-[11px]">
      <span className="text-foreground/80 inline-flex items-center gap-1.5 font-medium">
        <Target className="h-3.5 w-3.5" />
        {appName}
      </span>
      <span className="text-muted-foreground/40">/</span>
      <span>{vendor}</span>
      <span className="text-muted-foreground/40">/</span>
      <span className="bg-muted text-foreground/80 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
        {category}
      </span>
    </div>
  )
}

function EmptyDetail() {
  return (
    <div className="flex h-full items-center justify-center px-6 py-10">
      <div className="bg-card flex max-w-sm flex-col items-center gap-2 rounded-lg border p-6 text-center">
        <Target className="text-muted-foreground/60 h-6 w-6" />
        <p className="text-foreground text-sm font-medium">
          No opportunities scored yet
        </p>
        <p className="text-muted-foreground text-[11.5px]">
          Run the Tool Intake & Usage surveys for this project's SaaS apps to
          generate Rip Scores.
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// Top action strip — what useTopNav would render in the live shell
// =============================================================================

function DetailTopActions({
  active,
  onAddToProposal,
  onTierFilterChange,
  onSearchChange,
  onOpenRail,
}: {
  active?: OpportunityDetailProps["opportunities"][number]
  onAddToProposal: () => void
  onTierFilterChange?: (tiers: RipTier[]) => void
  onSearchChange?: (query: string) => void
  onOpenRail: () => void
}) {
  const [search, setSearch] = useState("")
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [tiers, setTiers] = useState<RipTier[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [filterOpen])

  const handleExpand = () => {
    setSearchExpanded(true)
    setTimeout(() => searchRef.current?.focus(), 0)
  }
  const handleSearchBlur = () => {
    if (!search) setSearchExpanded(false)
  }

  const toggleTier = (t: RipTier) => {
    setTiers((prev) => {
      const next = prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
      onTierFilterChange?.(next)
      return next
    })
  }

  return (
    <div className="bg-background border-border sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenRail}
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md lg:hidden"
          aria-label="Open opportunities list"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <Building2 className="text-muted-foreground hidden h-4 w-4 shrink-0 lg:block" />
        <span className="text-foreground truncate text-sm font-medium">
          Opportunities
        </span>
        {active && (
          <>
            <span className="text-muted-foreground/40 hidden sm:inline">/</span>
            <span className="text-muted-foreground hidden truncate text-[12.5px] sm:inline">
              {active.app}
            </span>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Search */}
        <div
          className={`relative flex h-9 items-center transition-all duration-200 ease-out ${
            searchExpanded ? "w-44 sm:w-60" : "w-9"
          }`}
        >
          {searchExpanded ? (
            <>
              <Search className="text-muted-foreground/60 pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  onSearchChange?.(e.target.value)
                }}
                onBlur={handleSearchBlur}
                placeholder="Search opportunities…"
                className="bg-muted/60 placeholder:text-muted-foreground/50 text-foreground focus-visible:bg-muted focus-visible:ring-foreground/10 h-9 w-full rounded-md border-none pl-9 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2"
              />
              {search && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSearch("")
                    onSearchChange?.("")
                    searchRef.current?.focus()
                  }}
                  className="text-muted-foreground/60 hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleExpand}
              className="bg-muted/60 hover:bg-muted absolute inset-0 cursor-pointer rounded-md transition-colors"
              aria-label="Search opportunities"
            >
              <Search className="text-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </button>
          )}
        </div>

        {/* Tier filter */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="bg-muted/60 hover:bg-muted text-foreground relative flex h-9 w-9 items-center justify-center rounded-md transition-colors"
            aria-label="Filter by tier"
            aria-expanded={filterOpen}
          >
            <Filter className="h-4 w-4" />
            {tiers.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 font-mono text-[10px] font-medium text-lime-300 dark:bg-stone-100 dark:text-stone-900">
                {tiers.length}
              </span>
            )}
          </button>
          {filterOpen && (
            <div className="bg-popover border-border absolute right-0 top-full z-30 mt-2 w-56 rounded-lg border p-3 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-foreground text-[11px] font-semibold uppercase tracking-wider">
                  Filter by tier
                </span>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {TIER_ORDER.map((t) => {
                  const selected = tiers.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTier(t)}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition-colors ${
                        selected
                          ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                      <span className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[t]}`} />
                      {TIER_LABEL[t]}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Add to proposal */}
        <button
          type="button"
          onClick={onAddToProposal}
          disabled={!active}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-stone-900 px-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add to proposal</span>
        </button>
      </div>
    </div>
  )
}
