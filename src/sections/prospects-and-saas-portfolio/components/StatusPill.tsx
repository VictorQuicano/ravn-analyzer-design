import type {
  ContractStatus,
  RipReadiness,
} from "../../../../product/sections/prospects-and-saas-portfolio/types"

const CONTRACT_LABEL: Record<ContractStatus, string> = {
  active: "Active",
  renewing: "Renewing",
  expired: "Expired",
  draft: "Draft",
  "not-in-use": "Not in use",
}

const CONTRACT_CLASSES: Record<ContractStatus, string> = {
  active:
    "bg-lime-50 text-lime-800 ring-lime-200 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
  renewing:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  expired:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  draft:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
  "not-in-use":
    "bg-stone-100 text-stone-500 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
}

export function ContractStatusPill({ status }: { status: ContractStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset ${CONTRACT_CLASSES[status]}`}
    >
      {CONTRACT_LABEL[status]}
    </span>
  )
}

const READINESS_LABEL: Record<RipReadiness, string> = {
  ready: "Rip-ready",
  "needs-data": "Needs data",
  "missing-contract": "No contract",
}

const READINESS_CLASSES: Record<RipReadiness, string> = {
  ready:
    "bg-lime-100 text-lime-900 ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
  "needs-data":
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  "missing-contract":
    "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
}

const READINESS_DOT: Record<RipReadiness, string> = {
  ready: "bg-lime-500",
  "needs-data": "bg-amber-500",
  "missing-contract": "bg-stone-400 dark:bg-stone-500",
}

export function RipReadinessChip({ readiness }: { readiness: RipReadiness }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset ${READINESS_CLASSES[readiness]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${READINESS_DOT[readiness]}`} />
      {READINESS_LABEL[readiness]}
    </span>
  )
}
