import type { ProposalStatus } from "../../../../product/sections/proposals/types"

interface StatusBadgeProps {
  status: ProposalStatus
  size?: "sm" | "md"
}

const STATUS_TOKENS: Record<
  ProposalStatus,
  { label: string; classes: string; dot: string }
> = {
  draft: {
    label: "Draft",
    classes:
      "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700",
    dot: "bg-stone-400 dark:bg-stone-500",
  },
  ready: {
    label: "Ready",
    classes:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/60",
    dot: "bg-amber-500",
  },
  sent: {
    label: "Sent",
    classes:
      "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-200 dark:ring-sky-800/60",
    dot: "bg-sky-500",
  },
  viewed: {
    label: "Viewed",
    classes:
      "bg-lime-50 text-lime-900 ring-lime-300 dark:bg-lime-900/30 dark:text-lime-200 dark:ring-lime-800/60",
    dot: "bg-lime-500",
  },
  accepted: {
    label: "Accepted",
    classes:
      "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/60",
    dot: "bg-emerald-500",
  },
  archived: {
    label: "Archived",
    classes:
      "bg-stone-50 text-stone-500 ring-stone-200 dark:bg-stone-900 dark:text-stone-500 dark:ring-stone-700",
    dot: "bg-stone-400",
  },
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const token = STATUS_TOKENS[status]
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset",
        size === "sm"
          ? "px-2 py-0.5 text-[11px]"
          : "px-2.5 py-1 text-xs",
        token.classes,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          token.dot,
          status === "viewed" ? "animate-pulse" : "",
        ].join(" ")}
      />
      {token.label}
    </span>
  )
}
