import { useEffect, useMemo, useRef, useState } from "react"
import {
  Building2,
  Check,
  ChevronDown,
  Filter,
  Plus,
  Search,
  Sparkles,
  X,
  XCircle,
} from "lucide-react"

import type {
  AiExtractionStatus,
  ContractStatus,
  PortfolioFilters,
  PortfolioSort,
  SaasAction,
  SaasApplication,
  SaasCategory,
  SaasPortfolioProps,
} from "../../../../product/sections/prospects-and-saas-portfolio/types"
import { IntakeMethodCard } from "./IntakeMethodCard"
import { SaasCard } from "./SaasCard"
import { StatCard } from "./StatCard"

const CATEGORY_LABEL: Record<SaasCategory, string> = {
  productivity: "Productivity",
  sales: "Sales",
  marketing: "Marketing",
  support: "Support",
  finance: "Finance",
  dev: "Dev",
  data: "Data",
  design: "Design",
  hr: "HR",
  security: "Security",
  other: "Other",
}

const CATEGORY_ORDER: SaasCategory[] = [
  "productivity",
  "sales",
  "marketing",
  "support",
  "finance",
  "dev",
  "data",
  "design",
  "hr",
  "security",
  "other",
]

const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  active: "Active",
  renewing: "Renewing",
  expired: "Expired",
  draft: "Draft",
  "not-in-use": "Not in use",
}

const CONTRACT_STATUS_ORDER: ContractStatus[] = [
  "active",
  "renewing",
  "expired",
  "draft",
  "not-in-use",
]

const EXTRACTION_LABEL: Record<AiExtractionStatus, string> = {
  pending: "Pending",
  extracting: "Extracting",
  "ready-for-review": "Ready",
  confirmed: "Confirmed",
  manual: "Manual",
  failed: "Failed",
  "not-started": "No contract",
}

const EXTRACTION_ORDER: AiExtractionStatus[] = [
  "ready-for-review",
  "extracting",
  "confirmed",
  "manual",
  "failed",
  "pending",
  "not-started",
]

const SORT_LABEL: Record<PortfolioSort, string> = {
  "spend-desc": "Spend (high → low)",
  "renewal-asc": "Soonest renewal",
  "utilization-asc": "Lowest utilization",
  "added-desc": "Recently added",
}

const SORT_ORDER: PortfolioSort[] = [
  "spend-desc",
  "renewal-asc",
  "utilization-asc",
  "added-desc",
]

export function SaasPortfolio({
  project,
  stats,
  apps,
  extractionQueue,
  brandedIntakeUrl,
  onAddSaas,
  onImportCsv,
  onSendIntakeLink,
  onCopyIntakeUrl,
  onOpenSaas,
  onUploadContract,
  onRequestContract,
  onToggleFeatures,
  onDuplicateSaas,
  onArchiveSaas,
  onSaasAction,
  onFiltersChange,
  onSearchChange,
  onSortChange,
  onReviewExtractions,
}: SaasPortfolioProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<PortfolioFilters>({})
  const [sort, setSort] = useState<PortfolioSort>("spend-desc")

  const departments = useMemo(() => {
    const set = new Set<string>()
    apps.forEach((a) => a.departments.forEach((d) => set.add(d)))
    return Array.from(set).sort()
  }, [apps])

  const updateFilters = (next: PortfolioFilters) => {
    setFilters(next)
    onFiltersChange?.(next)
  }

  const updateSort = (next: PortfolioSort) => {
    setSort(next)
    onSortChange?.(next)
  }

  const visibleApps = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = apps.filter((a) => {
      if (q) {
        const blob = `${a.name} ${a.vendorName} ${a.departments.join(" ")}`.toLowerCase()
        if (!blob.includes(q)) return false
      }
      if (filters.categories?.length && !filters.categories.includes(a.category))
        return false
      if (
        filters.contractStatuses?.length &&
        !filters.contractStatuses.includes(a.contractStatus)
      )
        return false
      if (
        filters.extractionStatuses?.length &&
        !filters.extractionStatuses.includes(a.aiExtraction)
      )
        return false
      if (
        filters.departments?.length &&
        !a.departments.some((d) => filters.departments?.includes(d))
      )
        return false
      return true
    })

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "spend-desc":
          return b.contract.annualCost - a.contract.annualCost
        case "renewal-asc":
          return a.contract.daysUntilRenewal - b.contract.daysUntilRenewal
        case "utilization-asc":
          return a.utilization - b.utilization
        case "added-desc":
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })
  }, [apps, filters, search, sort])

  const queueReviewCount = extractionQueue.filter(
    (q) => q.status === "ready-for-review"
  ).length
  const queueFailedCount = extractionQueue.filter((q) => q.status === "failed").length
  const queueExtractingCount = extractionQueue.filter(
    (q) => q.status === "extracting"
  ).length

  const handleAction = (saasId: string, action: SaasAction) => {
    switch (action) {
      case "open":
        onOpenSaas?.(saasId)
        break
      case "upload-contract":
        onUploadContract?.(saasId)
        break
      case "request-contract":
        onRequestContract?.(saasId)
        break
      case "toggle-features":
        onToggleFeatures?.(saasId)
        break
      case "duplicate":
        onDuplicateSaas?.(saasId)
        break
      case "archive":
        onArchiveSaas?.(saasId)
        break
    }
    onSaasAction?.(saasId, action)
  }

  const compactIntake = apps.length > 0
  const hasActiveFilters =
    (filters.categories?.length ?? 0) +
      (filters.contractStatuses?.length ?? 0) +
      (filters.extractionStatuses?.length ?? 0) +
      (filters.departments?.length ?? 0) >
    0
  const hasNoMatches = apps.length > 0 && visibleApps.length === 0

  return (
    <div className="bg-background animate-fade-in flex h-full min-h-0 flex-col">
      <PortfolioTopActions
        project={project}
        appCount={apps.length}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          onSearchChange?.(v)
        }}
        filters={filters}
        onFiltersChange={updateFilters}
        departments={departments}
        onAddSaas={onAddSaas}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Project context strip */}
        <section className="border-border border-b px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 font-mono text-sm font-bold text-stone-700 dark:from-stone-700 dark:to-stone-800 dark:text-stone-300">
                {project.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="text-foreground truncate text-xl font-semibold tracking-tight sm:text-2xl">
                  {project.company}
                </h1>
                <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span>{project.industry}</span>
                  <span aria-hidden>·</span>
                  <IntakeSourcePill source={project.intakeSource} />
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 font-mono text-[8px] font-semibold text-lime-300 dark:bg-stone-100 dark:text-stone-900">
                      {project.ownerInitials}
                    </span>
                    {project.ownerName}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.id} stat={s} />
            ))}
          </div>
        </section>

        {/* Intake methods */}
        <section className="border-border border-b px-4 py-5 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-sm font-semibold uppercase tracking-wider">
                Capture
              </h2>
              <span className="text-muted-foreground hidden text-[11px] sm:inline">
                {compactIntake
                  ? "Add more apps via any of these channels"
                  : "Pick how you'll capture this prospect's portfolio"}
              </span>
            </div>
          </div>
          {compactIntake ? (
            <div className="flex flex-wrap items-center gap-2">
              <IntakeMethodCard
                kind="branded-form"
                url={brandedIntakeUrl}
                onSend={onSendIntakeLink}
                onCopy={onCopyIntakeUrl}
                compact
              />
              <IntakeMethodCard
                kind="csv-import"
                onImport={onImportCsv}
                compact
              />
              <IntakeMethodCard kind="manual" onAdd={onAddSaas} compact />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <IntakeMethodCard
                kind="branded-form"
                url={brandedIntakeUrl}
                onSend={onSendIntakeLink}
                onCopy={onCopyIntakeUrl}
              />
              <IntakeMethodCard kind="csv-import" onImport={onImportCsv} />
              <IntakeMethodCard kind="manual" onAdd={onAddSaas} />
            </div>
          )}
        </section>

        {/* AI extraction queue strip */}
        {extractionQueue.length > 0 && (
          <section className="border-border border-b px-4 py-3 sm:px-6">
            <div className="bg-amber-50/60 ring-amber-200 flex flex-wrap items-center justify-between gap-2 rounded-md px-3 py-2 ring-1 ring-inset dark:bg-amber-950/30 dark:ring-amber-900/60">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-amber-900 dark:text-amber-300 inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/60">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div className="text-amber-900 dark:text-amber-200 flex flex-col leading-tight">
                  <span className="text-xs font-semibold">
                    AI extraction queue
                  </span>
                  <span className="font-mono text-[10px] tabular-nums opacity-80">
                    {queueReviewCount > 0 && (
                      <span>{queueReviewCount} ready for review</span>
                    )}
                    {queueReviewCount > 0 && queueExtractingCount > 0 && " · "}
                    {queueExtractingCount > 0 && (
                      <span>{queueExtractingCount} extracting</span>
                    )}
                    {(queueReviewCount > 0 || queueExtractingCount > 0) &&
                      queueFailedCount > 0 &&
                      " · "}
                    {queueFailedCount > 0 && (
                      <span className="text-rose-700 dark:text-rose-400">
                        {queueFailedCount} failed
                      </span>
                    )}
                  </span>
                </div>
              </div>
              {queueReviewCount > 0 && (
                <button
                  type="button"
                  onClick={onReviewExtractions}
                  className="inline-flex h-7 items-center gap-1 rounded-md bg-amber-600 px-2.5 text-[11px] font-medium text-amber-50 hover:bg-amber-700 dark:bg-amber-500 dark:text-amber-50 dark:hover:bg-amber-400"
                >
                  Review {queueReviewCount} extractions
                </button>
              )}
            </div>
          </section>
        )}

        {/* SaaS card grid */}
        <section className="px-4 py-5 sm:px-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-sm font-semibold uppercase tracking-wider">
                SaaS portfolio
              </h2>
              <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
                {visibleApps.length}
                {visibleApps.length !== apps.length && ` / ${apps.length}`}
              </span>
            </div>
            <SortMenu sort={sort} onChange={updateSort} />
          </div>

          {apps.length === 0 ? (
            <EmptyState onAdd={onAddSaas} onImport={onImportCsv} />
          ) : hasNoMatches ? (
            <NoMatchesState onClear={() => updateFilters({})} />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visibleApps.map((app) => (
                <SaasCard
                  key={app.id}
                  app={app}
                  onOpen={() => handleAction(app.id, "open")}
                  onAction={(action) => handleAction(app.id, action)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer hint */}
        {apps.length > 0 && (
          <section className="border-border border-t px-4 py-4 sm:px-6">
            <p className="text-muted-foreground text-[11px]">
              Showing {visibleApps.length} of {apps.length}{" "}
              {apps.length === 1 ? "app" : "apps"}
              {hasActiveFilters && " — filtered"}. Click any card to open the
              contract & financial form, or use the row menu for fast actions.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// IntakeSourcePill — small label for branded vs rep-guided
// =============================================================================
function IntakeSourcePill({ source }: { source: "branded-form" | "rep-guided" }) {
  if (source === "branded-form") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-800 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60">
        Branded form
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-1.5 py-0.5 text-[10px] font-medium text-lime-900 ring-1 ring-inset ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60">
      Rep-guided
    </span>
  )
}

// =============================================================================
// Top actions strip — what useTopNav would render in the live shell
// =============================================================================
function PortfolioTopActions({
  project,
  appCount,
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  departments,
  onAddSaas,
}: {
  project: SaasPortfolioProps["project"]
  appCount: number
  search: string
  onSearchChange: (v: string) => void
  filters: PortfolioFilters
  onFiltersChange: (next: PortfolioFilters) => void
  departments: string[]
  onAddSaas?: () => void
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
    (filters.categories?.length ?? 0) +
    (filters.contractStatuses?.length ?? 0) +
    (filters.extractionStatuses?.length ?? 0) +
    (filters.departments?.length ?? 0)

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
        <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
          Pipeline /
        </span>
        <span className="text-foreground truncate text-sm font-medium">
          {project.company}
        </span>
        <span className="text-muted-foreground hidden font-mono text-[11px] tabular-nums sm:inline">
          · {appCount} apps
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
                placeholder="Search apps…"
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
              aria-label="Search apps"
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
            aria-label="Filter SaaS apps"
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
              filters={filters}
              onChange={onFiltersChange}
              onClose={() => setFilterOpen(false)}
              departments={departments}
            />
          )}
        </div>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Primary create button */}
        <button
          type="button"
          onClick={onAddSaas}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-stone-900 px-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add SaaS</span>
        </button>
      </div>
    </div>
  )
}

function FilterPanel({
  filters,
  onChange,
  onClose,
  departments,
}: {
  filters: PortfolioFilters
  onChange: (next: PortfolioFilters) => void
  onClose: () => void
  departments: string[]
}) {
  const toggle = <T extends string>(arr: T[] | undefined, value: T): T[] | undefined => {
    const next = arr ?? []
    if (next.includes(value)) {
      const result = next.filter((v) => v !== value)
      return result.length ? result : undefined
    }
    return [...next, value]
  }

  const hasAny =
    (filters.categories?.length ?? 0) +
      (filters.contractStatuses?.length ?? 0) +
      (filters.extractionStatuses?.length ?? 0) +
      (filters.departments?.length ?? 0) >
    0

  return (
    <div className="bg-popover border-border absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border p-3 shadow-lg sm:w-80">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-foreground text-xs font-semibold uppercase tracking-wider">
          Filter portfolio
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close filter panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <FilterGroup label="Category">
        <div className="flex flex-wrap gap-1">
          {CATEGORY_ORDER.map((cat) => {
            const selected = filters.categories?.includes(cat) ?? false
            return (
              <FilterChip
                key={cat}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    categories: toggle(filters.categories, cat),
                  })
                }
              >
                {CATEGORY_LABEL[cat]}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Contract status">
        <div className="flex flex-wrap gap-1">
          {CONTRACT_STATUS_ORDER.map((status) => {
            const selected = filters.contractStatuses?.includes(status) ?? false
            return (
              <FilterChip
                key={status}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    contractStatuses: toggle(filters.contractStatuses, status),
                  })
                }
              >
                {CONTRACT_STATUS_LABEL[status]}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="AI extraction">
        <div className="flex flex-wrap gap-1">
          {EXTRACTION_ORDER.map((status) => {
            const selected = filters.extractionStatuses?.includes(status) ?? false
            return (
              <FilterChip
                key={status}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    extractionStatuses: toggle(
                      filters.extractionStatuses,
                      status
                    ),
                  })
                }
              >
                {EXTRACTION_LABEL[status]}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      {departments.length > 0 && (
        <FilterGroup label="Department">
          <div className="flex flex-wrap gap-1">
            {departments.map((dept) => {
              const selected = filters.departments?.includes(dept) ?? false
              return (
                <FilterChip
                  key={dept}
                  selected={selected}
                  onClick={() =>
                    onChange({
                      ...filters,
                      departments: toggle(filters.departments, dept),
                    })
                  }
                >
                  {dept}
                </FilterChip>
              )
            })}
          </div>
        </FilterGroup>
      )}

      {hasAny && (
        <button
          type="button"
          onClick={() => onChange({})}
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

function SortMenu({
  sort,
  onChange,
}: {
  sort: PortfolioSort
  onChange: (sort: PortfolioSort) => void
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
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors"
        aria-expanded={open}
      >
        <span>Sort: </span>
        <span className="text-foreground">{SORT_LABEL[sort]}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="bg-popover border-border absolute right-0 top-full z-20 mt-1 w-56 rounded-md border py-1 shadow-lg">
          {SORT_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs ${
                s === sort ? "bg-muted text-foreground" : "hover:bg-muted"
              }`}
            >
              {SORT_LABEL[s]}
              {s === sort && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({
  onAdd,
  onImport,
}: {
  onAdd?: () => void
  onImport?: () => void
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
        <Sparkles className="text-muted-foreground h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-foreground text-sm font-semibold">
          Capture this prospect&apos;s SaaS footprint
        </h3>
        <p className="text-muted-foreground max-w-md text-[12px]">
          Every SaaS captured fuels a Rip Score. Send the branded intake form,
          drop a CSV from procurement, or add apps one at a time — the catalog
          will pre-populate features, costs, and renewal dates.
        </p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-stone-900 px-3 text-xs font-medium text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Add first SaaS
        </button>
        <button
          type="button"
          onClick={onImport}
          className="border-border bg-card hover:bg-muted text-foreground inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium"
        >
          Import CSV instead
        </button>
      </div>
    </div>
  )
}

function NoMatchesState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center">
      <p className="text-foreground text-sm font-medium">
        No SaaS apps match these filters
      </p>
      <p className="text-muted-foreground max-w-sm text-[12px]">
        Try clearing the filters, or broaden the search to see more of the
        portfolio.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="border-border bg-card hover:bg-muted text-foreground mt-2 inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium"
      >
        <X className="h-3 w-3" />
        Clear filters
      </button>
    </div>
  )
}
