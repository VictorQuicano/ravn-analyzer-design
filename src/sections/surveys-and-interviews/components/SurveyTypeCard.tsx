import {
  Activity,
  Copy,
  DollarSign,
  Link2,
  Link2Off,
  Send,
  Wrench,
} from "lucide-react"

import type {
  SurveyType,
  SurveyTypeSummary,
} from "../../../../product/sections/surveys-and-interviews/types"

const ICONS: Record<SurveyType, React.ComponentType<{ className?: string }>> = {
  "tool-intake": Wrench,
  financial: DollarSign,
  usage: Activity,
}

const ACCENTS: Record<
  SurveyType,
  { ring: string; bar: string; text: string; chip: string; surface: string }
> = {
  "tool-intake": {
    ring: "ring-sky-200 dark:ring-sky-900/60",
    bar: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
    chip:
      "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
    surface:
      "from-sky-50/80 to-transparent dark:from-sky-950/30 dark:to-transparent",
  },
  financial: {
    ring: "ring-amber-200 dark:ring-amber-900/60",
    bar: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    chip:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
    surface:
      "from-amber-50/80 to-transparent dark:from-amber-950/30 dark:to-transparent",
  },
  usage: {
    ring: "ring-lime-300 dark:ring-lime-900/60",
    bar: "bg-lime-500",
    text: "text-lime-700 dark:text-lime-300",
    chip:
      "bg-lime-100 text-lime-900 ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
    surface:
      "from-lime-50/80 to-transparent dark:from-lime-950/30 dark:to-transparent",
  },
}

function timeAgo(iso: string | null, now: number): string {
  if (!iso) return "no responses yet"
  const diff = now - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.round(days / 7)
  return `${weeks}w ago`
}

interface SurveyTypeCardProps {
  summary: SurveyTypeSummary
  now: number
  onSend?: () => void
  onCopyPublicLink?: () => void
  onTogglePublicLink?: (nextActive: boolean) => void
}

export function SurveyTypeCard({
  summary,
  now,
  onSend,
  onCopyPublicLink,
  onTogglePublicLink,
}: SurveyTypeCardProps) {
  const accent = ACCENTS[summary.id]
  const Icon = ICONS[summary.id]

  return (
    <div
      className={`group bg-card relative flex flex-col overflow-hidden rounded-lg border ring-1 ring-inset ${accent.ring} transition-shadow hover:shadow-sm`}
    >
      {/* Decorative tinted top */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent.surface}`}
      />

      {/* Subtle corner index */}
      <span
        aria-hidden
        className="text-muted-foreground/40 absolute right-3 top-3 font-mono text-[10px] tracking-[0.18em]"
      >
        {summary.id.toUpperCase().slice(0, 4)}
      </span>

      <div className="relative flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${accent.chip}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5 pr-12">
            <span
              className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${accent.text}`}
            >
              {summary.label}
            </span>
            <p className="text-foreground/80 text-[12.5px] leading-snug">
              {summary.description}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-foreground font-mono text-3xl font-semibold tabular-nums leading-none">
              {summary.responseCount}
            </span>
            <span className="text-muted-foreground text-xs">responses</span>
          </div>
          <span className="text-muted-foreground ml-auto truncate text-[11px]">
            {timeAgo(summary.lastResponseAt, now)}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">
              <span className="font-mono tabular-nums">
                {summary.completedCount}
              </span>{" "}
              of{" "}
              <span className="font-mono tabular-nums">
                {summary.responseCount}
              </span>{" "}
              completed
            </span>
            <span className="text-foreground font-mono text-[11px] font-semibold tabular-nums">
              {summary.completionPercent}%
            </span>
          </div>
          <div className="bg-muted/70 relative h-1.5 overflow-hidden rounded-full">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${accent.bar} transition-[width] duration-500`}
              style={{ width: `${Math.min(summary.completionPercent, 100)}%` }}
            />
          </div>
          <div className="text-muted-foreground/90 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
            {summary.inProgressCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-sky-500" />
                <span className="font-mono tabular-nums">
                  {summary.inProgressCount}
                </span>{" "}
                in progress
              </span>
            )}
            {summary.overdueCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-rose-500" />
                <span className="font-mono tabular-nums">
                  {summary.overdueCount}
                </span>{" "}
                overdue
              </span>
            )}
            {summary.publicLinkActive && summary.publicLinkStarts > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-stone-500" />
                <span className="font-mono tabular-nums">
                  {summary.publicLinkStarts}
                </span>{" "}
                via Slack link
              </span>
            )}
          </div>
        </div>

        <div className="border-border/70 flex items-center justify-between gap-2 border-t pt-3">
          {/* Public link strip */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <button
              type="button"
              onClick={() => onTogglePublicLink?.(!summary.publicLinkActive)}
              className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition-colors ${
                summary.publicLinkActive
                  ? `${accent.chip} ring-1 ring-inset`
                  : "bg-muted/60 text-muted-foreground hover:bg-muted ring-border ring-1 ring-inset"
              }`}
              title={summary.publicLinkActive ? "Disable public link" : "Enable public link"}
            >
              {summary.publicLinkActive ? (
                <>
                  <Link2 className="h-3 w-3" />
                  <span>Public link</span>
                  <span className="bg-card/70 -mr-1 rounded-sm px-1 font-mono text-[9px] uppercase tracking-wider">
                    on
                  </span>
                </>
              ) : (
                <>
                  <Link2Off className="h-3 w-3" />
                  <span>Public link off</span>
                </>
              )}
            </button>
            {summary.publicLinkActive && (
              <button
                type="button"
                onClick={onCopyPublicLink}
                className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                aria-label="Copy public link"
                title="Copy public link"
              >
                <Copy className="h-3 w-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onSend}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-stone-900 px-2.5 text-[12px] font-medium text-stone-50 transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
