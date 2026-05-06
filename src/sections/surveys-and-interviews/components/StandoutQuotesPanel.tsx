import { Pin, Quote as QuoteIcon, Sparkles, X } from "lucide-react"

import type {
  Respondent,
  Reviewer,
  StandoutQuote,
} from "../../../../product/sections/surveys-and-interviews/types"
import { SurveyBadge } from "./SurveyBadge"

function timeAgo(iso: string, now: number): string {
  const diff = now - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.round(days / 7)
  return `${weeks}w`
}

interface StandoutQuotesPanelProps {
  quotes: StandoutQuote[]
  respondentsById: Record<string, Respondent>
  reviewersById: Record<string, Reviewer>
  now: number
  onOpenQuote?: (id: string) => void
  onUnpinQuote?: (id: string) => void
}

export function StandoutQuotesPanel({
  quotes,
  respondentsById,
  reviewersById,
  now,
  onOpenQuote,
  onUnpinQuote,
}: StandoutQuotesPanelProps) {
  return (
    <aside className="bg-card flex flex-col rounded-lg border xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)]">
      <header className="border-border flex items-center justify-between gap-2 border-b px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-lime-600 dark:text-lime-400" />
          <span className="text-foreground text-xs font-semibold uppercase tracking-wider">
            Standout quotes
          </span>
          <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
            {quotes.length}
          </span>
        </div>
        <span className="text-muted-foreground hidden text-[10px] sm:inline">
          for proposal lift
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4">
        {quotes.length === 0 ? (
          <div className="border-border/70 text-muted-foreground/80 flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-10 text-center">
            <QuoteIcon className="text-muted-foreground/50 mb-2 h-5 w-5" />
            <p className="text-foreground text-sm font-medium">
              No quotes pinned yet
            </p>
            <p className="mt-1 text-[11px]">
              Mark answers as standout from the response detail to surface
              verbatim pain points here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {quotes.map((q) => {
              const respondent = respondentsById[q.respondentId]
              const reviewer = reviewersById[q.pinnedById]
              return (
                <li key={q.id}>
                  <article
                    className="border-border bg-background hover:border-foreground/20 group relative flex flex-col gap-2.5 overflow-hidden rounded-md border p-3 transition-colors"
                  >
                    <button
                      type="button"
                      aria-label="Open quote"
                      onClick={() => onOpenQuote?.(q.id)}
                      className="absolute inset-0 cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 dark:focus-visible:ring-stone-700"
                    />
                    {/* Decorative quote glyph */}
                    <span
                      aria-hidden
                      className="text-muted-foreground/15 pointer-events-none absolute -right-2 -top-3 select-none font-serif text-7xl leading-none"
                    >
                      &ldquo;
                    </span>

                    <div className="relative flex items-start justify-between gap-2">
                      <SurveyBadge surveyType={q.surveyType} size="sm" />
                      {onUnpinQuote && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onUnpinQuote(q.id)
                          }}
                          className="text-muted-foreground/40 hover:bg-muted hover:text-foreground relative -mr-1 -mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition group-hover:opacity-100"
                          aria-label="Unpin quote"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <p className="text-foreground/90 relative z-[1] font-serif text-[13px] italic leading-snug">
                      &ldquo;{q.text}&rdquo;
                    </p>

                    <div className="border-border/70 relative flex items-center justify-between gap-2 border-t pt-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        {respondent && (
                          <span
                            title={respondent.name}
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 font-mono text-[9px] font-semibold text-lime-300 dark:bg-stone-100 dark:text-stone-900"
                          >
                            {respondent.initials}
                          </span>
                        )}
                        <div className="flex min-w-0 flex-col leading-tight">
                          <span className="text-foreground truncate text-[11px] font-medium">
                            {respondent?.name ?? "Unknown"}
                          </span>
                          <span className="text-muted-foreground truncate text-[10px]">
                            {respondent?.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-muted-foreground/80 shrink-0 text-right text-[10px] leading-tight">
                        {q.questionLabel}
                      </span>
                    </div>

                    {reviewer && (
                      <div className="text-muted-foreground/70 relative flex items-center gap-1 text-[10px]">
                        <Pin className="h-2.5 w-2.5" />
                        Pinned by{" "}
                        <span className="text-foreground/80 font-medium">
                          {reviewer.name}
                        </span>{" "}
                        ·{" "}
                        <span className="font-mono tabular-nums">
                          {timeAgo(q.pinnedAt, now)} ago
                        </span>
                      </div>
                    )}
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
