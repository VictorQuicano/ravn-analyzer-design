import { CalendarClock } from "lucide-react"

function classesFor(daysUntil: number): string {
  if (daysUntil < 0)
    return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60"
  if (daysUntil <= 30)
    return "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60"
  if (daysUntil <= 60)
    return "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60"
  if (daysUntil <= 90)
    return "bg-lime-50 text-lime-800 ring-lime-200 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60"
  return "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatDays(daysUntil: number): string {
  if (daysUntil === 0) return "today"
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d overdue`
  return `in ${daysUntil}d`
}

export function RenewalCountdown({
  endDate,
  daysUntil,
  variant = "chip",
}: {
  endDate: string
  daysUntil: number
  variant?: "chip" | "row"
}) {
  if (variant === "row") {
    const tone =
      daysUntil < 0
        ? "text-rose-600 dark:text-rose-400"
        : daysUntil <= 30
          ? "text-amber-700 dark:text-amber-400"
          : daysUntil <= 60
            ? "text-sky-700 dark:text-sky-400"
            : daysUntil <= 90
              ? "text-lime-700 dark:text-lime-400"
              : "text-foreground"
    return (
      <span className="flex items-center gap-1.5">
        <CalendarClock className="text-muted-foreground h-3.5 w-3.5" />
        <span className={`font-mono text-xs tabular-nums ${tone}`}>
          {formatDate(endDate)}
        </span>
        <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
          · {formatDays(daysUntil)}
        </span>
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums ring-1 ring-inset ${classesFor(daysUntil)}`}
    >
      <CalendarClock className="h-3 w-3" />
      {formatDays(daysUntil)}
    </span>
  )
}
