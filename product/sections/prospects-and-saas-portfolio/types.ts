// =============================================================================
// UI Data Shapes — what the SaaS Portfolio components expect to receive
// =============================================================================

export type IntakeSource = "branded-form" | "rep-guided"

export type ContractStatus =
  | "active"
  | "renewing"
  | "expired"
  | "draft"
  | "not-in-use"

export type AiExtractionStatus =
  | "pending"
  | "extracting"
  | "ready-for-review"
  | "confirmed"
  | "manual"
  | "failed"
  | "not-started"

export type RipReadiness = "ready" | "needs-data" | "missing-contract"

export type SaasCategory =
  | "productivity"
  | "sales"
  | "marketing"
  | "support"
  | "finance"
  | "dev"
  | "data"
  | "design"
  | "hr"
  | "security"
  | "other"

export type StatFormat = "number" | "currency" | "percent" | "duration-days"

export type IntakeMethod = "branded-form" | "csv-import" | "manual"

export interface ProjectSummary {
  id: string
  company: string
  /** URL to a logo asset (or null to render the fallback tile). */
  logoUrl: string | null
  industry: string
  intakeSource: IntakeSource
  /** Owner name of the Ravn rep on this project. */
  ownerName: string
  ownerInitials: string
}

export interface PortfolioStat {
  id: string
  label: string
  /** Numeric value for the headline metric. Format using `format`. */
  value: number
  format: StatFormat
  sublabel: string
}

export interface CatalogFeature {
  id: string
  label: string
  /** Whether this feature is in active use at the prospect company. */
  inUse: boolean
}

export interface ContractTerms {
  /** USD annual contract value. */
  annualCost: number
  licenseCount: number
  billingCadence: "monthly" | "quarterly" | "annual" | "biennial" | "unknown"
  /** ISO date of contract end / next renewal trigger. */
  contractEndDate: string
  /** Negative when the renewal date is in the past. */
  daysUntilRenewal: number
  /** Auto-renew clause flag — relevant for renewal workflow. */
  autoRenew: boolean
  /** Custom terms/notes the AI extracted or rep typed. */
  customTerms?: string
}

export interface ContractDocument {
  /** File name shown to the user. */
  fileName: string
  /** ISO timestamp of upload. */
  uploadedAt: string
  /** Display size, e.g. "412 KB". */
  sizeLabel: string
  /** Page count for the PDF preview chip. */
  pageCount: number
}

export interface SaasApplication {
  id: string
  name: string
  vendorName: string
  websiteUrl: string
  logoUrl: string | null
  category: SaasCategory
  /** Free-text department tags ("Sales", "Engineering", "People Ops"). */
  departments: string[]
  contractStatus: ContractStatus
  contract: ContractTerms
  /** 0–1 utilization fraction (active seats ÷ licensed seats). */
  utilization: number
  ripReadiness: RipReadiness
  aiExtraction: AiExtractionStatus
  /** Pre-populated catalog features with per-prospect in-use toggles. */
  features: CatalogFeature[]
  contractDocument: ContractDocument | null
  addedAt: string
  /** Rep-friendly note about the SaaS at this prospect. */
  notes?: string
}

export interface ExtractionQueueItem {
  saasId: string
  saasName: string
  status: Extract<AiExtractionStatus, "extracting" | "ready-for-review" | "failed">
  /** ISO timestamp when this item entered the queue. */
  queuedAt: string
}

export interface PortfolioFilters {
  categories?: SaasCategory[]
  contractStatuses?: ContractStatus[]
  extractionStatuses?: AiExtractionStatus[]
  departments?: string[]
}

export type PortfolioSort =
  | "spend-desc"
  | "renewal-asc"
  | "utilization-asc"
  | "added-desc"

export type SaasAction =
  | "open"
  | "upload-contract"
  | "request-contract"
  | "toggle-features"
  | "duplicate"
  | "archive"

// =============================================================================
// Component Props
// =============================================================================

export interface SaasPortfolioProps {
  /** The active project context shown in the header strip. */
  project: ProjectSummary
  /** The four headline KPI tiles. */
  stats: PortfolioStat[]
  /** Every SaaS app captured for this project. */
  apps: SaasApplication[]
  /** Pending AI-extraction items shown in the queue strip. Empty array hides it. */
  extractionQueue: ExtractionQueueItem[]
  /** Public branded intake URL — copy-to-clipboard target on the intake card. */
  brandedIntakeUrl: string
  /** Called when the user clicks the topnav "+ Add SaaS" button or the manual intake card. */
  onAddSaas?: () => void
  /** Called when the user drops a CSV onto the bulk-import card or clicks "Import CSV". */
  onImportCsv?: () => void
  /** Called when the user clicks "Send branded intake form" on the intake-method card. */
  onSendIntakeLink?: () => void
  /** Called when the user clicks the public-URL copy icon on the branded-form card. */
  onCopyIntakeUrl?: () => void
  /** Called when the user clicks a SaaS card body (opens the detail Sheet in the host). */
  onOpenSaas?: (saasId: string) => void
  /** Called when the user picks "Upload contract" from the row menu. */
  onUploadContract?: (saasId: string) => void
  /** Called when the user picks "Request contract" from the row menu. */
  onRequestContract?: (saasId: string) => void
  /** Called when the user picks "Toggle features" from the row menu. */
  onToggleFeatures?: (saasId: string) => void
  /** Called when the user picks "Duplicate" from the row menu. */
  onDuplicateSaas?: (saasId: string) => void
  /** Called when the user picks "Archive" from the row menu. */
  onArchiveSaas?: (saasId: string) => void
  /** Generic action callback used by the row menu — fires after any specific callback above. */
  onSaasAction?: (saasId: string, action: SaasAction) => void
  /** Called when the user changes the filter set in the topnav filter button. */
  onFiltersChange?: (filters: PortfolioFilters) => void
  /** Called when the user types into the topnav search input. */
  onSearchChange?: (query: string) => void
  /** Called when the user changes the sort selector above the card grid. */
  onSortChange?: (sort: PortfolioSort) => void
  /** Called when the user clicks "Review N extractions" on the AI queue strip. */
  onReviewExtractions?: () => void
}
