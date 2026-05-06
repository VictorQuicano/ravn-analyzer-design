// =============================================================================
// UI Data Shapes — what the Surveys & Interviews components expect to receive
// =============================================================================

export type SurveyType = "tool-intake" | "financial" | "usage"

export type ResponseStatus =
  | "not-started"
  | "in-progress"
  | "submitted"
  | "overdue"

export type ResponsesView = "all" | "by-respondent" | "by-survey"

export type DeliveryChannel = "magic-link" | "public-link"

export type TranscriptSource = "zoom" | "granola" | "paste" | "upload"

export type TranscriptStatus =
  | "uploaded"
  | "transcribing"
  | "ready"
  | "reviewed"

export interface Reviewer {
  id: string
  name: string
  initials: string
}

export interface Respondent {
  id: string
  name: string
  email: string
  role: string
  initials: string
}

export interface SurveyTypeSummary {
  id: SurveyType
  label: string
  description: string
  /** Total respondents invited or who started this survey. */
  responseCount: number
  /** Number of fully submitted responses. */
  completedCount: number
  /** 0–100 completion percentage (precomputed). */
  completionPercent: number
  /** ISO timestamp of the most recent response activity. */
  lastResponseAt: string | null
  /** Whether the public blast link is currently active. */
  publicLinkActive: boolean
  /** Number of starts via the public blast link (when active). */
  publicLinkStarts: number
  /** Number of respondents the kanban-style "in-progress" pill should show. */
  inProgressCount: number
  /** Number of respondents whose deadline has passed without submission. */
  overdueCount: number
}

export interface SurveyResponseRow {
  id: string
  respondentId: string
  surveyType: SurveyType
  status: ResponseStatus
  /** Current step the respondent is on (in-progress only). */
  currentStep: number
  /** Total steps in the survey. */
  totalSteps: number
  /** ISO timestamp of submission, or null if not yet submitted. */
  submittedAt: string | null
  /** ISO timestamp of last respondent activity. */
  lastActivityAt: string
  lastActivityLabel: string
  /** How the invite reached the respondent. */
  channel: DeliveryChannel
  /** Days overdue (only relevant for status === "overdue"). */
  daysOverdue?: number
}

export interface StandoutQuote {
  id: string
  responseId: string
  respondentId: string
  surveyType: SurveyType
  /** The structured-question label this quote answered. */
  questionLabel: string
  text: string
  pinnedById: string
  pinnedAt: string
}

export interface TranscriptRow {
  id: string
  title: string
  respondentId: string
  source: TranscriptSource
  /** Duration in seconds; "0" for paste/upload of pure text. */
  durationSeconds: number
  status: TranscriptStatus
  uploadedAt: string
  /** Optional one-line teaser pulled from the transcript when ready. */
  teaser?: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface SurveysDashboardProps {
  /** The active project the surveys hang off of (for header + breadcrumb echo). */
  projectName: string
  /** Aggregated counts and state for the three survey-type cards. */
  surveyTypes: SurveyTypeSummary[]
  /** Internal Ravn users — used for the "pinned by" footer on quotes. */
  reviewers: Reviewer[]
  /** Every respondent referenced from rows / quotes / transcripts. */
  respondents: Respondent[]
  /** Every survey-response row to render in the responses table. */
  responses: SurveyResponseRow[]
  /** Reviewer-pinned standout quotes for the right-hand panel. */
  quotes: StandoutQuote[]
  /** Follow-up call transcripts uploaded against this project. */
  transcripts: TranscriptRow[]
  /** Currently selected responses-table grouping view. */
  view?: ResponsesView
  /** Called when the user toggles the responses-table grouping view. */
  onViewChange?: (view: ResponsesView) => void
  /** Called when the user clicks "Send" / "Open invites" on a survey-type card. */
  onOpenSendSheet?: (surveyType: SurveyType) => void
  /** Called when the user copies a survey's public blast link. */
  onCopyPublicLink?: (surveyType: SurveyType) => void
  /** Called when the user toggles a survey's public blast link on/off. */
  onTogglePublicLink?: (surveyType: SurveyType, nextActive: boolean) => void
  /** Called when the user clicks a response row body. */
  onOpenResponse?: (responseId: string) => void
  /** Called when the user picks an action from a response row's three-dot menu. */
  onResponseAction?: (
    responseId: string,
    action:
      | "open"
      | "copy-link"
      | "resend"
      | "mark-standout"
      | "archive"
  ) => void
  /** Called when the user opens a quote from the right-hand panel. */
  onOpenQuote?: (quoteId: string) => void
  /** Called when the user removes a pinned quote. */
  onUnpinQuote?: (quoteId: string) => void
  /** Called when the user clicks a transcript row. */
  onOpenTranscript?: (transcriptId: string) => void
  /** Called when the user activates the transcript-upload dropzone. */
  onUploadTranscript?: () => void
  /** Called when the user clicks the topnav "+ New invite" button. */
  onCreateInvite?: () => void
  /** Called when the user types into the topnav search input. */
  onSearchChange?: (query: string) => void
  /** Called when the user changes any of the filter chips. */
  onFiltersChange?: (filters: SurveyFilters) => void
}

export interface SurveyFilters {
  surveyTypes?: SurveyType[]
  statuses?: ResponseStatus[]
  roles?: string[]
}
