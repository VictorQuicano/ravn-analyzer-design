import { useEffect, useMemo, useRef, useState } from "react"
import {
  Building2,
  Calendar,
  Check,
  Filter,
  KanbanSquare,
  Plus,
  Search,
  X,
  XCircle,
} from "lucide-react"

import type {
  HeatTier,
  Owner,
  PipelineDashboardProps,
  PipelineFilters,
} from "../../../../product/sections/pipeline-dashboard/types"
import { KanbanBoard } from "./KanbanBoard"
import { ProjectRow } from "./ProjectRow"
import { RenewalTimeline } from "./RenewalTimeline"
import { stageLabel, STAGE_ORDER } from "./StageBadge"
import { StatCard } from "./StatCard"

const NOW_FALLBACK = new Date("2026-05-06T12:00:00Z").getTime()
const HEAT_ORDER: HeatTier[] = ["hot", "warm", "lukewarm", "cold"]
const HEAT_LABEL: Record<HeatTier, string> = {
  hot: "Hot",
  warm: "Warm",
  lukewarm: "Lukewarm",
  cold: "Cold",
}

export function PipelineDashboard({
  stats,
  owners,
  projects,
  opportunities,
  renewals,
  view: viewProp,
  onViewChange,
  onOpenProject,
  onCreateProject,
  onMoveOpportunity,
  onProjectAction,
  onOpenRenewal,
  onSearchChange,
  onFiltersChange,
}: PipelineDashboardProps) {
  const [internalView, setInternalView] = useState<"kanban" | "renewals">(
    viewProp ?? "kanban"
  )
  const view = viewProp ?? internalView
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<PipelineFilters>({})
  const [now, setNow] = useState<number>(() => Date.now() || NOW_FALLBACK)

  useEffect(() => {
    setNow(Date.now() || NOW_FALLBACK)
  }, [])

  const ownersById = useMemo(
    () => Object.fromEntries(owners.map((o) => [o.id, o])) as Record<string, Owner>,
    [owners]
  )

  const industries = useMemo(
    () => Array.from(new Set(projects.map((p) => p.industry))).sort(),
    [projects]
  )

  const setView = (v: "kanban" | "renewals") => {
    setInternalView(v)
    onViewChange?.(v)
  }

  const updateFilters = (next: PipelineFilters) => {
    setFilters(next)
    onFiltersChange?.(next)
  }

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter((p) => {
      if (q && !p.company.toLowerCase().includes(q)) return false
      if (filters.ownerIds?.length && !filters.ownerIds.includes(p.ownerId))
        return false
      if (filters.stages?.length && !filters.stages.includes(p.stage))
        return false
      if (filters.heatTiers?.length && !filters.heatTiers.includes(p.heat))
        return false
      if (
        filters.industries?.length &&
        !filters.industries.includes(p.industry)
      )
        return false
      return true
    })
  }, [projects, search, filters])

  const filteredOpportunities = useMemo(() => {
    const allowedProjectIds = new Set(filteredProjects.map((p) => p.id))
    return opportunities.filter((o) => allowedProjectIds.has(o.projectId))
  }, [opportunities, filteredProjects])

  const filteredRenewals = useMemo(() => {
    const allowedProjectIds = new Set(filteredProjects.map((p) => p.id))
    return renewals.filter((r) => allowedProjectIds.has(r.projectId))
  }, [renewals, filteredProjects])

  const totalEngagementValue = filteredOpportunities.reduce(
    (sum, o) => sum + o.engagementValue,
    0
  )

  return (
    <div className="bg-background animate-fade-in flex h-full min-h-0 flex-col">
      {/* Top action strip — mirrors useTopNav-injected actions in the live shell */}
      <DashboardTopActions
        owners={owners}
        industries={industries}
        filters={filters}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          onSearchChange?.(v)
        }}
        onFiltersChange={updateFilters}
        onCreate={onCreateProject}
        projectCount={filteredProjects.length}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Hero — page title + stat grid */}
        <section className="border-border border-b px-4 pb-6 pt-5 sm:px-6 sm:pt-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                Pipeline
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {filteredProjects.length} active{" "}
                {filteredProjects.length === 1 ? "prospect" : "prospects"} ·{" "}
                <span className="font-mono tabular-nums">
                  {fmtUsd(totalEngagementValue)}
                </span>{" "}
                engagement value in flight
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.id} stat={s} />
            ))}
          </div>
        </section>

        {/* Prospect list */}
        <section className="border-border border-b">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-3 pt-5 sm:px-6">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-sm font-semibold uppercase tracking-wider">
                Prospects
              </h2>
              <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
                {filteredProjects.length}
              </span>
            </div>
            <div className="text-muted-foreground hidden items-center gap-1 text-[11px] md:flex">
              <span>sorted by</span>
              <span className="text-foreground font-medium">last activity</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-border bg-muted/30 border-b">
                  <Th className="px-4 sm:px-5">Company</Th>
                  <Th className="hidden md:table-cell">Owner</Th>
                  <Th className="hidden lg:table-cell">Stage</Th>
                  <Th className="hidden sm:table-cell">Heat</Th>
                  <Th className="hidden text-right md:table-cell">
                    Annual spend
                  </Th>
                  <Th className="hidden lg:table-cell">Rip</Th>
                  <Th className="hidden lg:table-cell">Next renewal</Th>
                  <Th className="hidden xl:table-cell">Last activity</Th>
                  <Th className="w-8" srOnly>
                    Actions
                  </Th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center">
                      <p className="text-muted-foreground text-sm">
                        No prospects match your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => (
                    <ProjectRow
                      key={p.id}
                      project={p}
                      owner={ownersById[p.ownerId]}
                      now={now}
                      onOpen={onOpenProject}
                      onAction={onProjectAction}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lower workspace: Kanban / Renewals tabs */}
        <section className="flex flex-col">
          <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 pb-3 pt-5 sm:px-6">
            <div className="flex items-center gap-1">
              <h2 className="text-foreground mr-2 text-sm font-semibold uppercase tracking-wider">
                Workspace
              </h2>
              <ViewTab
                active={view === "kanban"}
                onClick={() => setView("kanban")}
                icon={<KanbanSquare className="h-3.5 w-3.5" />}
                label="Kanban"
                count={filteredOpportunities.length}
              />
              <ViewTab
                active={view === "renewals"}
                onClick={() => setView("renewals")}
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Renewals"
                count={
                  filteredRenewals.filter((r) => r.daysUntil <= 90).length
                }
              />
            </div>
            <div className="text-muted-foreground hidden items-center gap-3 text-[11px] md:flex">
              {view === "kanban" ? (
                <>
                  <Legend dot="bg-stone-400" label="Identified" />
                  <Legend dot="bg-amber-500" label="Proposal" />
                  <Legend dot="bg-sky-500" label="Sent" />
                  <Legend dot="bg-violet-500" label="Viewed" />
                  <Legend dot="bg-lime-500" label="Meeting" />
                </>
              ) : (
                <>
                  <Legend dot="bg-rose-500" label="Overdue" />
                  <Legend dot="bg-amber-500" label="0–30d" />
                  <Legend dot="bg-sky-500" label="31–60d" />
                  <Legend dot="bg-lime-500" label="61–90d" />
                </>
              )}
            </div>
          </div>

          <div className="min-h-[420px] py-4">
            {view === "kanban" ? (
              <KanbanBoard
                opportunities={filteredOpportunities}
                ownersById={ownersById}
                onMove={onMoveOpportunity}
              />
            ) : (
              <RenewalTimeline
                renewals={filteredRenewals}
                ownersById={ownersById}
                onOpenRenewal={onOpenRenewal}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

// =============================================================================
// Top action strip — what useTopNav would render in the live shell
// =============================================================================
function DashboardTopActions({
  owners,
  industries,
  filters,
  search,
  onSearchChange,
  onFiltersChange,
  onCreate,
  projectCount,
}: {
  owners: Owner[]
  industries: string[]
  filters: PipelineFilters
  search: string
  onSearchChange: (v: string) => void
  onFiltersChange: (next: PipelineFilters) => void
  onCreate?: () => void
  projectCount: number
}) {
  const [searchExpanded, setSearchExpanded] = useState(search.length > 0)
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

  const activeFilterCount =
    (filters.ownerIds?.length ?? 0) +
    (filters.stages?.length ?? 0) +
    (filters.heatTiers?.length ?? 0) +
    (filters.industries?.length ?? 0)

  const handleExpand = () => {
    setSearchExpanded(true)
    setTimeout(() => searchRef.current?.focus(), 0)
  }

  const handleSearchBlur = () => {
    if (!search) setSearchExpanded(false)
  }

  return (
    <div className="bg-background border-border sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="text-foreground truncate text-sm font-medium">
          Pipeline dashboard
        </span>
        <span className="text-muted-foreground hidden font-mono text-[11px] tabular-nums sm:inline">
          · {projectCount} prospects
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* NavbarSearch */}
        <div
          className={`relative flex h-9 items-center transition-all duration-200 ease-out ${
            searchExpanded ? "w-44 sm:w-64" : "w-9"
          }`}
        >
          {searchExpanded ? (
            <>
              <Search className="text-muted-foreground/60 pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={handleSearchBlur}
                placeholder="Search prospects…"
                className="bg-muted/60 placeholder:text-muted-foreground/50 text-foreground focus-visible:bg-muted focus-visible:ring-foreground/10 h-9 w-full rounded-md border-none pl-9 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2"
              />
              {search && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onSearchChange("")
                    searchRef.current?.focus()
                  }}
                  className="text-muted-foreground/60 hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 transition-colors"
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
              aria-label="Search prospects"
            >
              <Search className="text-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </button>
          )}
        </div>

        {/* NavbarFilterButton */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="bg-muted/60 hover:bg-muted text-foreground relative flex h-9 w-9 items-center justify-center rounded-md transition-colors"
            aria-label="Filter prospects"
            aria-expanded={filterOpen}
          >
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 font-mono text-[10px] font-medium text-lime-300 dark:bg-stone-100 dark:text-stone-900">
                {activeFilterCount}
              </span>
            )}
          </button>
          {filterOpen && (
            <FilterPanel
              owners={owners}
              industries={industries}
              filters={filters}
              onChange={onFiltersChange}
              onClose={() => setFilterOpen(false)}
            />
          )}
        </div>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Primary create button */}
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-stone-900 px-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New prospect</span>
        </button>
      </div>
    </div>
  )
}

function FilterPanel({
  owners,
  industries,
  filters,
  onChange,
  onClose,
}: {
  owners: Owner[]
  industries: string[]
  filters: PipelineFilters
  onChange: (next: PipelineFilters) => void
  onClose: () => void
}) {
  const toggle = <T extends string>(
    arr: T[] | undefined,
    value: T
  ): T[] | undefined => {
    const next = arr ?? []
    if (next.includes(value)) {
      const result = next.filter((v) => v !== value)
      return result.length ? result : undefined
    }
    return [...next, value]
  }

  const clearAll = () => onChange({})

  const hasAny =
    (filters.ownerIds?.length ?? 0) +
      (filters.stages?.length ?? 0) +
      (filters.heatTiers?.length ?? 0) +
      (filters.industries?.length ?? 0) >
    0

  return (
    <div className="bg-popover border-border absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border p-3 shadow-lg sm:w-80">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-foreground text-xs font-semibold uppercase tracking-wider">
          Filter pipeline
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <FilterGroup label="Stage">
        <div className="flex flex-wrap gap-1">
          {STAGE_ORDER.map((stage) => {
            const selected = filters.stages?.includes(stage) ?? false
            return (
              <FilterChip
                key={stage}
                selected={selected}
                onClick={() =>
                  onChange({ ...filters, stages: toggle(filters.stages, stage) })
                }
              >
                {stageLabel(stage)}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Heat tier">
        <div className="flex flex-wrap gap-1">
          {HEAT_ORDER.map((heat) => {
            const selected = filters.heatTiers?.includes(heat) ?? false
            return (
              <FilterChip
                key={heat}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    heatTiers: toggle(filters.heatTiers, heat),
                  })
                }
              >
                {HEAT_LABEL[heat]}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Owner">
        <div className="flex flex-wrap gap-1">
          {owners.map((o) => {
            const selected = filters.ownerIds?.includes(o.id) ?? false
            return (
              <FilterChip
                key={o.id}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    ownerIds: toggle(filters.ownerIds, o.id),
                  })
                }
              >
                <span className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 font-mono text-[8px] font-semibold text-lime-300 dark:bg-stone-100 dark:text-stone-900">
                  {o.initials}
                </span>
                {o.name.split(" ")[0]}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Industry">
        <div className="flex flex-wrap gap-1">
          {industries.map((industry) => {
            const selected = filters.industries?.includes(industry) ?? false
            return (
              <FilterChip
                key={industry}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    industries: toggle(filters.industries, industry),
                  })
                }
              >
                {industry}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      {hasAny && (
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:bg-muted hover:text-foreground mt-2 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md text-xs"
        >
          <X className="h-3 w-3" /> Clear all filters
        </button>
      )}
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border-border border-t py-2 first:border-t-0 first:pt-1">
      <span className="text-muted-foreground mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </span>
      {children}
    </div>
  )
}

function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition-colors ${
        selected
          ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      {selected && <Check className="h-3 w-3" />}
      {children}
    </button>
  )
}

function ViewTab({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors ${
        active
          ? "bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      <span
        className={`rounded-full px-1.5 font-mono text-[10px] tabular-nums ${
          active
            ? "bg-stone-700 text-stone-100 dark:bg-stone-200 dark:text-stone-700"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  )
}

function Th({
  children,
  className = "",
  srOnly = false,
}: {
  children: React.ReactNode
  className?: string
  srOnly?: boolean
}) {
  return (
    <th
      scope="col"
      className={`text-muted-foreground px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${className}`}
    >
      {srOnly ? <span className="sr-only">{children}</span> : children}
    </th>
  )
}

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000_000)
    return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}
