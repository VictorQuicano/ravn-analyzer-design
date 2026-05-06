// =============================================================================
// UI Data Shapes — Proposals
// These define the data the components expect to receive
// =============================================================================

export type ProposalStatus =
  | "draft"
  | "ready"
  | "sent"
  | "viewed"
  | "accepted"
  | "archived"

export type ProposalSectionKey =
  | "cover"
  | "executiveSummary"
  | "currentState"
  | "ravnAlternative"
  | "financialComparison"
  | "riskMitigation"
  | "engagementOptions"

export type ProposalSectionState = "empty" | "in_progress" | "complete"

export type EventDevice = "desktop" | "mobile" | "tablet" | "unknown"

export interface ProposalRecipient {
  id: string
  name: string
  email: string
  role: string
  avatarColor: string
  totalOpens: number
  lastOpenedAt: string | null
}

export interface FinancialYear {
  year: number
  label: string
  currentSpend: number
  ravnInvestment: number
  savings: number
  cumulativeSavings: number
}

export interface FinancialSummary {
  totalSaved5yr: number
  paybackMonths: number
  fiveYearRoiPct: number
  annualizedSavings: number
  baselineLabel: string
  alternativeLabel: string
}

export interface ExecutiveSummary {
  state: ProposalSectionState
  headline: string
  subheadline: string
  bullets: string[]
  wordCount: number
}

export interface CurrentStatePoint {
  metric: string
  value: string
  detail: string
  trend: "up" | "down" | "flat"
}

export interface CurrentStateSection {
  state: ProposalSectionState
  narrative: string
  points: CurrentStatePoint[]
  redundancyCallouts: string[]
  wordCount: number
}

export interface RavnAlternativeFeature {
  name: string
  complexity: "low" | "medium" | "high"
  description: string
}

export interface RavnAlternativeSection {
  state: ProposalSectionState
  narrative: string
  features: RavnAlternativeFeature[]
  techStack: string[]
  team: string
  timelineWeeks: number
  wordCount: number
}

export interface FinancialComparisonSection {
  state: ProposalSectionState
  years: FinancialYear[]
  summary: FinancialSummary
  notes: string
  wordCount: number
}

export interface RiskItem {
  title: string
  severity: "low" | "medium" | "high"
  description: string
  mitigation: string
}

export interface RiskMitigationSection {
  state: ProposalSectionState
  intro: string
  risks: RiskItem[]
  wordCount: number
}

export interface EngagementOption {
  id: string
  name: string
  bestFor: string
  monthlyPrice: number
  totalValue: number
  durationLabel: string
  recommended: boolean
  scope: string[]
}

export interface EngagementOptionsSection {
  state: ProposalSectionState
  intro: string
  options: EngagementOption[]
  wordCount: number
}

export interface CoverSection {
  state: ProposalSectionState
  prospectCompany: string
  prospectLogoMark: string
  preparedFor: string
  preparedBy: string
  proposalDate: string
  tagline: string
  wordCount: number
}

export interface ProposalSections {
  cover: CoverSection
  executiveSummary: ExecutiveSummary
  currentState: CurrentStateSection
  ravnAlternative: RavnAlternativeSection
  financialComparison: FinancialComparisonSection
  riskMitigation: RiskMitigationSection
  engagementOptions: EngagementOptionsSection
}

export interface ViewEvent {
  id: string
  recipientId: string | null
  recipientLabel: string
  occurredAt: string
  relativeTime: string
  device: EventDevice
  dwellSeconds: number
  city: string | null
  isFresh: boolean
}

export interface Proposal {
  id: string
  title: string
  projectName: string
  prospectCompany: string
  status: ProposalStatus
  version: string
  shareUrl: string
  pdfUrl: string | null
  slidesUrl: string | null
  ownerName: string
  ownerEmail: string
  createdAt: string
  updatedAt: string
  totalOpens: number
  uniqueOpens: number
  lastOpenedAt: string | null
  engagementValue: number
  recipients: ProposalRecipient[]
  sections: ProposalSections
  viewEvents: ViewEvent[]
}

export interface ProposalListItem {
  id: string
  title: string
  prospectCompany: string
  status: ProposalStatus
  version: string
  totalOpens: number
  lastOpenedAt: string | null
  engagementValue: number
  updatedAt: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProposalsProps {
  /** All proposals belonging to the active project (used for the list rail). */
  proposals: ProposalListItem[]
  /** The fully-hydrated proposal currently open in the builder. */
  activeProposal: Proposal
  /** Section currently focused in the builder. */
  activeSectionKey: ProposalSectionKey
  /** Called when the user picks a different proposal from the list rail. */
  onSelectProposal?: (id: string) => void
  /** Called when the user clicks a section in the navigator. */
  onSelectSection?: (key: ProposalSectionKey) => void
  /** Called when the user clicks "New proposal". */
  onCreateProposal?: () => void
  /** Called when the user toggles the recipient-facing preview mode. */
  onTogglePreview?: () => void
  /** Called when the user copies the share URL to their clipboard. */
  onCopyShareLink?: (id: string) => void
  /** Called when the user clicks "Export PDF". */
  onExportPdf?: (id: string) => void
  /** Called when the user clicks "Export Slides". */
  onExportSlides?: (id: string) => void
  /** Called when the user adds a new recipient email. */
  onAddRecipient?: (id: string) => void
  /** Called when the user re-sends the proposal to a recipient. */
  onResendToRecipient?: (proposalId: string, recipientId: string) => void
  /** Called when the user toggles the "Recommend" flag on an engagement option. */
  onRecommendOption?: (proposalId: string, optionId: string) => void
  /** Called when the user adjusts a year's financial number. */
  onEditFinancialYear?: (
    proposalId: string,
    year: number,
    field: "currentSpend" | "ravnInvestment",
    value: number,
  ) => void
  /** Called when the user duplicates the proposal. */
  onDuplicate?: (id: string) => void
  /** Called when the user archives the proposal. */
  onArchive?: (id: string) => void
  /** Called when the user opens an existing view event in detail. */
  onInspectViewEvent?: (eventId: string) => void
}
