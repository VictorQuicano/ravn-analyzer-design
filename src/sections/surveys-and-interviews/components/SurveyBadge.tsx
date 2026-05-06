import type {
  ResponseStatus,
  SurveyType,
} from "../../../../product/sections/surveys-and-interviews/types"

const SURVEY_LABELS: Record<SurveyType, string> = {
  "tool-intake": "Tool Intake",
  financial: "Financial",
  usage: "Usage",
}

const SURVEY_CLASSES: Record<SurveyType, string> = {
  "tool-intake":
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  financial:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  usage:
    "bg-lime-100 text-lime-900 ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
}

const SURVEY_DOT: Record<SurveyType, string> = {
  "tool-intake": "bg-sky-500",
  financial: "bg-amber-500",
  usage: "bg-lime-500",
}

export function SurveyBadge({
  surveyType,
  size = "md",
  showDot = true,
}: {
  surveyType: SurveyType
  size?: "sm" | "md"
  showDot?: boolean
}) {
  const padding =
    size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide ring-1 ring-inset ${padding} ${SURVEY_CLASSES[surveyType]}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${SURVEY_DOT[surveyType]}`} />
      )}
      {SURVEY_LABELS[surveyType]}
    </span>
  )
}

export function surveyLabel(surveyType: SurveyType): string {
  return SURVEY_LABELS[surveyType]
}

export const SURVEY_ORDER: SurveyType[] = ["tool-intake", "financial", "usage"]

const STATUS_LABEL: Record<ResponseStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  submitted: "Submitted",
  overdue: "Overdue",
}

const STATUS_CLASSES: Record<ResponseStatus, string> = {
  "not-started":
    "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
  "in-progress":
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  submitted:
    "bg-lime-50 text-lime-800 ring-lime-200 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
  overdue:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
}

export function StatusPill({
  status,
  size = "md",
}: {
  status: ResponseStatus
  size?: "sm" | "md"
}) {
  const padding =
    size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-mono uppercase tracking-wider ring-1 ring-inset ${padding} ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
