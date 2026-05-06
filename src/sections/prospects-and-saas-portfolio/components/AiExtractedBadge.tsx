import { AlertTriangle, CheckCircle2, FileText, Loader2, PenLine, Sparkles } from "lucide-react"

import type { AiExtractionStatus } from "../../../../product/sections/prospects-and-saas-portfolio/types"

const LABEL: Record<AiExtractionStatus, string> = {
  pending: "Pending",
  extracting: "Extracting",
  "ready-for-review": "Ready to review",
  confirmed: "AI · confirmed",
  manual: "Manual entry",
  failed: "Extraction failed",
  "not-started": "No contract",
}

const CLASSES: Record<AiExtractionStatus, string> = {
  pending:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
  extracting:
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  "ready-for-review":
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  confirmed:
    "bg-lime-50 text-lime-800 ring-lime-200 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
  manual:
    "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60",
  failed:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  "not-started":
    "bg-stone-100 text-stone-500 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
}

function StatusIcon({ status }: { status: AiExtractionStatus }) {
  const iconProps = { className: "h-3 w-3", "aria-hidden": true } as const
  switch (status) {
    case "extracting":
      return <Loader2 {...iconProps} className="h-3 w-3 animate-spin" />
    case "ready-for-review":
      return <Sparkles {...iconProps} />
    case "confirmed":
      return <CheckCircle2 {...iconProps} />
    case "manual":
      return <PenLine {...iconProps} />
    case "failed":
      return <AlertTriangle {...iconProps} />
    case "not-started":
      return <FileText {...iconProps} />
    case "pending":
    default:
      return <FileText {...iconProps} />
  }
}

export function AiExtractedBadge({
  status,
  size = "md",
}: {
  status: AiExtractionStatus
  size?: "sm" | "md"
}) {
  const padding =
    size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wider ring-1 ring-inset ${padding} ${CLASSES[status]}`}
    >
      <StatusIcon status={status} />
      {LABEL[status]}
    </span>
  )
}
