// =============================================================================
// UI Data Shapes — what the Opportunities & Build Scoping screen expects
// =============================================================================

export type RipTier = "hot" | "warm" | "lukewarm" | "cold"

export type RipFactorId =
  | "cost"
  | "utilization"
  | "feature-concentration"
  | "pain"
  | "replacement-tolerance"
  | "renewal-timing"

export type FeatureComplexity = "trivial" | "standard" | "complex" | "hard"

export type IntegrationStyle = "rest" | "oauth" | "webhook" | "sdk" | "graphql"

export type IntegrationDirection = "in" | "out" | "both"

export type TechStackLane = "frontend" | "backend" | "data" | "infra"

export type TimelinePhaseKind = "discovery" | "build" | "hardening" | "launch"

export interface RipFactor {
  id: RipFactorId
  label: string
  /** Sub-score 0–100. */
  subScore: number
  /** Weight applied to the sub-score. The six weights sum to 1.0. */
  weight: number
  /** One-sentence evidence string shown next to the bar. */
  evidence: string
  /** Bullet list of inputs (cost, license count, survey quotes, etc.) revealed on hover. */
  inputs: string[]
}

export interface RedundancySibling {
  /** Sibling SaaS app name in the same category. */
  app: string
  /** USD annual spend on the sibling app. */
  annualSpend: number
  /** True when the sibling is the opportunity currently in focus. */
  isFocus: boolean
}

export interface RedundancyGroup {
  /** Category bucket — e.g. "Communication", "CRM". */
  category: string
  /** Plain-language summary line shown below the category title. */
  summary: string
  /** Cumulative redundant spend across all siblings in this group, USD. */
  redundantSpend: number
  siblings: RedundancySibling[]
}

export interface BuildScopeFeature {
  id: string
  title: string
  description: string
  complexity: FeatureComplexity
}

export interface BuildScopeIntegration {
  id: string
  name: string
  style: IntegrationStyle
  direction: IntegrationDirection
}

export interface BuildScopeTechStack {
  frontend: string[]
  backend: string[]
  data: string[]
  infra: string[]
}

export interface BuildScopeTeamMember {
  role: string
  count: number
  /** Engagement length for this role, in weeks. */
  weeks: number
  /** All-in cost for this role across the engagement, USD. */
  cost: number
}

export interface BuildScopeCostRange {
  /** Optimistic-case total, USD. */
  low: number
  /** Most-likely total, USD. */
  likely: number
  /** Worst-case total, USD. */
  high: number
}

export interface BuildScopePhase {
  id: string
  label: string
  kind: TimelinePhaseKind
  /** Inclusive 1-indexed start week. */
  startWeek: number
  /** Inclusive 1-indexed end week. */
  endWeek: number
}

export interface BuildScopeMilestone {
  id: string
  label: string
  /** Week number on which the milestone lands. */
  week: number
}

export interface BuildScope {
  /** AI-written paragraph framing the build. */
  narrative: string
  features: BuildScopeFeature[]
  integrations: BuildScopeIntegration[]
  techStack: BuildScopeTechStack
  team: BuildScopeTeamMember[]
  costRange: BuildScopeCostRange
  /** Total engagement length in weeks. Should match max endWeek across phases. */
  totalWeeks: number
  phases: BuildScopePhase[]
  milestones: BuildScopeMilestone[]
}

export interface RipOpportunity {
  id: string
  /** Human-readable SaaS app name. */
  app: string
  /** Vendor of the app — shown as a small subtitle. */
  vendor: string
  /** Category taxonomy slot used for redundancy grouping. */
  category: string
  /** USD annual contract value. */
  annualSpend: number
  /** Estimated USD annual waste exposed by the surveys. */
  annualWaste: number
  /** Total seats licensed under the contract. */
  seats: number
  /** Days until contract renewal. Negative when overdue. */
  daysToRenewal: number
  /** Renewal date in ISO format. */
  renewalDate: string
  /** Composite Rip Score 0–100. */
  ripScore: number
  /** Confidence in the score 0–100 — reflects survey coverage and data quality. */
  confidence: number
  tier: RipTier
  /** One-line headline shown next to the score in the hero. */
  headline: string
  /** Six factor sub-scores. The weighted sum yields ripScore. */
  factors: RipFactor[]
  /** Redundancy groups this app sits inside. */
  redundancy: RedundancyGroup[]
  /** AI-generated build scope. Optional — undefined means "not yet generated". */
  buildScope?: BuildScope
}

// =============================================================================
// Component Props
// =============================================================================

export interface OpportunityDetailProps {
  /** Every Rip Opportunity in the active project, sorted by Rip Score descending. */
  opportunities: RipOpportunity[]
  /** Currently active opportunity id. Falls back to the first opportunity. */
  activeOpportunityId?: string
  /** Called when the user clicks a different opportunity in the list rail. */
  onSelectOpportunity?: (opportunityId: string) => void
  /** Called when the user picks an item from a row's three-dot menu in the rail. */
  onOpportunityAction?: (
    opportunityId: string,
    action:
      | "pin-to-proposal"
      | "not-pursuing"
      | "regenerate-scope"
      | "copy-share-link"
  ) => void
  /** Called when the user toggles a tier filter chip in the topnav. */
  onTierFilterChange?: (tiers: RipTier[]) => void
  /** Called when the user types into the topnav search input. */
  onSearchChange?: (query: string) => void
  /** Called when the user clicks the topnav "Add to proposal" button. */
  onAddToProposal?: (opportunityId: string) => void
  /** Called when the user requests a build-scope regeneration from the hero ribbon. */
  onRegenerateScope?: (opportunityId: string) => void
  /** Called when the user generates a build scope for the first time. */
  onGenerateScope?: (opportunityId: string) => void
}
