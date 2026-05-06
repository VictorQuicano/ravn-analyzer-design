import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ClipboardList,
  Filter,
  Plus,
  Search,
  UserCircle2,
  Users,
  X,
  XCircle,
} from "lucide-react"

import type {
  Respondent,
  ResponsesView,
  ResponseStatus,
  Reviewer,
  SurveyFilters,
  SurveysDashboardProps,
  SurveyType,
} from "../../../../product/sections/surveys-and-interviews/types"
import { ResponsesTable } from "./ResponsesTable"
import { StandoutQuotesPanel } from "./StandoutQuotesPanel"
import { StatusPill, SURVEY_ORDER, surveyLabel } from "./SurveyBadge"
import { SurveyTypeCard } from "./SurveyTypeCard"
import { TranscriptsTable } from "./TranscriptsTable"

const NOW_FALLBACK = new Date("2026-05-06T14:00:00Z").getTime()

const STATUS_OPTIONS: ResponseStatus[] = [
  "in-progress",
  "submitted",
  "overdue",
  "not-started",
]

export function SurveysDashboard({
  projectName,
  surveyTypes,
  reviewers,
  respondents,
  responses,
  quotes,
  transcripts,
  view: viewProp,
  onViewChange,
  onOpenSendSheet,
  onCopyPublicLink,
  onTogglePublicLink,
  onOpenResponse,
  onResponseAction,
  onOpenQuote,
  onUnpinQuote,
  onOpenTranscript,
  onUploadTranscript,
  onCreateInvite,
  onSearchChange,
  onFiltersChange,
}: SurveysDashboardProps) {
  const [internalView, setInternalView] = useState<ResponsesView>(
    viewProp ?? "all"
  )
  const view = viewProp ?? internalView
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<SurveyFilters>({})
  const [now, setNow] = useState<number>(() => Date.now() || NOW_FALLBACK)

  useEffect(() => {
    setNow(Date.now() || NOW_FALLBACK)
  }, [])

  const respondentsById = useMemo(
    () =>
      Object.fromEntries(respondents.map((r) => [r.id, r])) as Record<
        string,
        Respondent
      >,
    [respondents]
  )
  const reviewersById = useMemo(
    () =>
      Object.fromEntries(reviewers.map((r) => [r.id, r])) as Record<
        string,
        Reviewer
      >,
    [reviewers]
  )

  const roles = useMemo(
    () => Array.from(new Set(respondents.map((r) => r.role))).sort(),
    [respondents]
  )

  const setView = (v: ResponsesView) => {
    setInternalView(v)
    onViewChange?.(v)
  }

  const updateFilters = (next: SurveyFilters) => {
    setFilters(next)
    onFiltersChange?.(next)
  }

  const filteredResponses = useMemo(() => {
    const q = search.trim().toLowerCase()
    return responses.filter((r) => {
      const respondent = respondentsById[r.respondentId]
      if (q) {
        const haystack = [
          respondent?.name ?? "",
          respondent?.email ?? "",
          respondent?.role ?? "",
          r.lastActivityLabel,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (
        filters.surveyTypes?.length &&
        !filters.surveyTypes.includes(r.surveyType)
      )
        return false
      if (filters.statuses?.length && !filters.statuses.includes(r.status))
        return false
      if (
        filters.roles?.length &&
        !filters.roles.includes(respondent?.role ?? "")
      )
        return false
      return true
    })
  }, [responses, respondentsById, search, filters])

  const sortedResponses = useMemo(() => {
    const sorted = [...filteredResponses]
    if (view === "by-respondent") {
      sorted.sort((a, b) => {
        const an = respondentsById[a.respondentId]?.name ?? ""
        const bn = respondentsById[b.respondentId]?.name ?? ""
        if (an !== bn) return an.localeCompare(bn)
        return SURVEY_ORDER.indexOf(a.surveyType) -
          SURVEY_ORDER.indexOf(b.surveyType)
      })
    } else if (view === "by-survey") {
      sorted.sort((a, b) => {
        const t = SURVEY_ORDER.indexOf(a.surveyType) -
          SURVEY_ORDER.indexOf(b.surveyType)
        if (t !== 0) return t
        return (
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
        )
      })
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
      )
    }
    return sorted
  }, [filteredResponses, view, respondentsById])

  const totalCompleted = surveyTypes.reduce(
    (sum, s) => sum + s.completedCount,
    0
  )
  const totalInvited = surveyTypes.reduce((sum, s) => sum + s.responseCount, 0)
  const overallCompletion = totalInvited
    ? Math.round((totalCompleted / totalInvited) * 100)
    : 0

  return (
    <div className="bg-background animate-fade-in flex h-full min-h-0 flex-col">
      <DashboardTopActions
        roles={roles}
        filters={filters}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          onSearchChange?.(v)
        }}
        onFiltersChange={updateFilters}
        onCreate={onCreateInvite}
        responseCount={filteredResponses.length}
        projectName={projectName}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Hero — page title + survey-type cards */}
        <section className="border-border border-b px-4 pb-6 pt-5 sm:px-6 sm:pt-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                Surveys
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                <span className="text-foreground font-medium">
                  {projectName}
                </span>{" "}
                ·{" "}
                <span className="font-mono tabular-nums">
                  {totalCompleted}
                </span>{" "}
                of{" "}
                <span className="font-mono tabular-nums">{totalInvited}</span>{" "}
                respondents complete{" "}
                <span className="text-muted-foreground/70">
                  ({overallCompletion}%)
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
            {surveyTypes.map((s) => (
              <SurveyTypeCard
                key={s.id}
                summary={s}
                now={now}
                onSend={() => onOpenSendSheet?.(s.id)}
                onCopyPublicLink={() => onCopyPublicLink?.(s.id)}
                onTogglePublicLink={(active) =>
                  onTogglePublicLink?.(s.id, active)
                }
              />
            ))}
          </div>
        </section>

        {/* Two-column layout: Responses table (left) + Standout quotes (right) */}
        <section className="grid grid-cols-1 gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Responses table column */}
          <div className="border-border flex flex-col xl:border-r">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-3 pt-5 sm:px-6">
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-sm font-semibold uppercase tracking-wider">
                  Responses
                </h2>
                <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
                  {filteredResponses.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ViewTab
                  active={view === "all"}
                  onClick={() => setView("all")}
                  icon={<ClipboardList className="h-3.5 w-3.5" />}
                  label="All"
                  count={filteredResponses.length}
                />
                <ViewTab
                  active={view === "by-respondent"}
                  onClick={() => setView("by-respondent")}
                  icon={<UserCircle2 className="h-3.5 w-3.5" />}
                  label="Respondent"
                  count={
                    new Set(filteredResponses.map((r) => r.respondentId)).size
                  }
                />
                <ViewTab
                  active={view === "by-survey"}
                  onClick={() => setView("by-survey")}
                  icon={<Users className="h-3.5 w-3.5" />}
                  label="Survey"
                  count={
                    new Set(filteredResponses.map((r) => r.surveyType)).size
                  }
                />
              </div>
            </div>

            {/* Status legend strip */}
            <div className="text-muted-foreground hidden flex-wrap items-center gap-3 px-4 pb-2 text-[11px] sm:flex sm:px-6">
              <Legend dot="bg-sky-500" label="In progress" />
              <Legend dot="bg-lime-500" label="Submitted" />
              <Legend dot="bg-rose-500" label="Overdue" />
              <Legend dot="bg-stone-400" label="Not started" />
              <span className="text-muted-foreground/50 ml-auto hidden md:inline">
                magic-link respondents auto-resume across devices
              </span>
            </div>

            <ResponsesTable
              responses={sortedResponses}
              respondentsById={respondentsById}
              now={now}
              onOpenResponse={onOpenResponse}
              onResponseAction={onResponseAction}
            />
          </div>

          {/* Standout quotes column */}
          <div className="border-border bg-muted/20 flex flex-col gap-3 border-t px-4 py-4 sm:px-6 xl:border-t-0 xl:bg-transparent xl:py-5">
            <StandoutQuotesPanel
              quotes={quotes}
              respondentsById={respondentsById}
              reviewersById={reviewersById}
              now={now}
              onOpenQuote={onOpenQuote}
              onUnpinQuote={onUnpinQuote}
            />
          </div>
        </section>

        {/* Transcripts */}
        <section className="border-border border-t px-4 py-5 sm:px-6 sm:py-6">
          <TranscriptsTable
            transcripts={transcripts}
            respondentsById={respondentsById}
            now={now}
            onOpenTranscript={onOpenTranscript}
            onUploadTranscript={onUploadTranscript}
          />
        </section>
      </div>
    </div>
  )
}

// =============================================================================
// Top action strip — what useTopNav would render in the live shell
// =============================================================================
function DashboardTopActions({
  roles,
  filters,
  search,
  onSearchChange,
  onFiltersChange,
  onCreate,
  responseCount,
  projectName,
}: {
  roles: string[]
  filters: SurveyFilters
  search: string
  onSearchChange: (v: string) => void
  onFiltersChange: (next: SurveyFilters) => void
  onCreate?: () => void
  responseCount: number
  projectName: string
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
    (filters.surveyTypes?.length ?? 0) +
    (filters.statuses?.length ?? 0) +
    (filters.roles?.length ?? 0)

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
        <ClipboardList className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="text-foreground truncate text-sm font-medium">
          {projectName}
        </span>
        <span className="text-muted-foreground/60 hidden sm:inline">/</span>
        <span className="text-muted-foreground hidden truncate text-sm sm:inline">
          Surveys
        </span>
        <span className="text-muted-foreground hidden font-mono text-[11px] tabular-nums sm:inline">
          · {responseCount} responses
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
                placeholder="Search responses…"
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
              aria-label="Search responses"
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
            aria-label="Filter responses"
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
              roles={roles}
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
          <span className="hidden sm:inline">New invite</span>
        </button>
      </div>
    </div>
  )
}

function FilterPanel({
  roles,
  filters,
  onChange,
  onClose,
}: {
  roles: string[]
  filters: SurveyFilters
  onChange: (next: SurveyFilters) => void
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
    (filters.surveyTypes?.length ?? 0) +
      (filters.statuses?.length ?? 0) +
      (filters.roles?.length ?? 0) >
    0

  return (
    <div className="bg-popover border-border absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border p-3 shadow-lg sm:w-80">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-foreground text-xs font-semibold uppercase tracking-wider">
          Filter responses
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <FilterGroup label="Survey type">
        <div className="flex flex-wrap gap-1">
          {SURVEY_ORDER.map((surveyType: SurveyType) => {
            const selected = filters.surveyTypes?.includes(surveyType) ?? false
            return (
              <FilterChip
                key={surveyType}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    surveyTypes: toggle(filters.surveyTypes, surveyType),
                  })
                }
              >
                {surveyLabel(surveyType)}
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Status">
        <div className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((status) => {
            const selected = filters.statuses?.includes(status) ?? false
            return (
              <FilterChip
                key={status}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    statuses: toggle(filters.statuses, status),
                  })
                }
              >
                <StatusPill status={status} size="sm" />
              </FilterChip>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Role">
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => {
            const selected = filters.roles?.includes(role) ?? false
            return (
              <FilterChip
                key={role}
                selected={selected}
                onClick={() =>
                  onChange({
                    ...filters,
                    roles: toggle(filters.roles, role),
                  })
                }
              >
                {role}
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
