// =============================================================================
// UI Data Shapes — what the Pipeline Dashboard components expect to receive
// =============================================================================

export type PipelineStage =
  | "identified"
  | "proposal-generated"
  | "sent"
  | "viewed"
  | "meeting-scheduled"

export type HeatTier = "hot" | "warm" | "lukewarm" | "cold"

export type StatFormat = "number" | "currency" | "percent"

export type DashboardView = "kanban" | "renewals"

export interface Owner {
  id: string
  name: string
  email: string
  initials: string
}

export interface PipelineStat {
  id: string
  label: string
  /** Numeric value for the headline metric. Format using `format`. */
  value: number
  format: StatFormat
  sublabel: string
  /** Signed delta vs. previous 30 days, in percent. */
  delta: number
  deltaLabel: string
  /** ~12 numeric data points for an inline sparkline. */
  sparkline: number[]
}

export interface PipelineProject {
  id: string
  company: string
  industry: string
  ownerId: string
  stage: PipelineStage
  heat: HeatTier
  /** USD amount of total SaaS spend captured for this project. */
  annualSpend: number
  /** Blended Rip score 0–100. */
  ripScore: number
  /** ISO date of next contract renewal across this project's apps. */
  nextRenewalDate: string
  /** Name of the SaaS app whose renewal is coming up next. */
  nextRenewalApp: string
  /** ISO timestamp of last activity. */
  lastActivityAt: string
  lastActivityLabel: string
}

export interface PipelineOpportunity {
  id: string
  projectId: string
  company: string
  ownerId: string
  saasApp: string
  stage: PipelineStage
  /** USD engagement value if this opportunity converts. */
  engagementValue: number
  ripScore: number
  daysInStage: number
  tier: HeatTier
}

export interface PipelineRenewal {
  id: string
  projectId: string
  company: string
  saasApp: string
  ownerId: string
  /** USD annual value of the contract about to renew. */
  annualValue: number
  /** ISO date of the renewal. */
  renewalDate: string
  /** Negative when the renewal date is in the past. */
  daysUntil: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface PipelineDashboardProps {
  /** The four headline KPI cards across the top of the dashboard. */
  stats: PipelineStat[]
  /** Internal Ravn users available for the owner filter and avatar lookup. */
  owners: Owner[]
  /** Every project currently in the pipeline. */
  projects: PipelineProject[]
  /** Every Rip Opportunity in flight. Grouped into kanban columns by stage. */
  opportunities: PipelineOpportunity[]
  /** Upcoming SaaS contract renewals, sorted by `daysUntil` ascending. */
  renewals: PipelineRenewal[]
  /** Currently selected lower-workspace view. */
  view?: DashboardView
  /** Called when the user toggles between the kanban and renewals view. */
  onViewChange?: (view: DashboardView) => void
  /** Called when the user clicks a project row to open that project. */
  onOpenProject?: (projectId: string) => void
  /** Called when the user clicks the topnav "+ New prospect" button. */
  onCreateProject?: () => void
  /** Called when an opportunity card is moved to a new kanban stage. */
  onMoveOpportunity?: (opportunityId: string, toStage: PipelineStage) => void
  /** Called when the user opens the row's three-dot action menu and picks an action. */
  onProjectAction?: (
    projectId: string,
    action: "open" | "won" | "lost" | "reassign" | "archive"
  ) => void
  /** Called when the user clicks a renewal entry. */
  onOpenRenewal?: (renewalId: string) => void
  /** Called when the user types into the topnav search input. */
  onSearchChange?: (query: string) => void
  /** Called when the user changes any of the filter dropdowns. */
  onFiltersChange?: (filters: PipelineFilters) => void
}

export interface PipelineFilters {
  ownerIds?: string[]
  stages?: PipelineStage[]
  heatTiers?: HeatTier[]
  industries?: string[]
}
