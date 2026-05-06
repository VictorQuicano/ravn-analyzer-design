import type { HeatTier, PipelineStage } from "../../../../product/sections/pipeline-dashboard/types"

const STAGE_LABELS: Record<PipelineStage, string> = {
  identified: "Identified",
  "proposal-generated": "Proposal generated",
  sent: "Sent",
  viewed: "Viewed",
  "meeting-scheduled": "Meeting scheduled",
}

const STAGE_CLASSES: Record<PipelineStage, string> = {
  identified:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
  "proposal-generated":
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  sent: "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  viewed:
    "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60",
  "meeting-scheduled":
    "bg-lime-100 text-lime-900 ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
}

const STAGE_DOT: Record<PipelineStage, string> = {
  identified: "bg-stone-400 dark:bg-stone-500",
  "proposal-generated": "bg-amber-500",
  sent: "bg-sky-500",
  viewed: "bg-violet-500",
  "meeting-scheduled": "bg-lime-500",
}

export function StageBadge({
  stage,
  size = "md",
  showDot = true,
}: {
  stage: PipelineStage
  size?: "sm" | "md"
  showDot?: boolean
}) {
  const padding = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide ring-1 ring-inset ${padding} ${STAGE_CLASSES[stage]}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[stage]}`} />
      )}
      {STAGE_LABELS[stage]}
    </span>
  )
}

const HEAT_LABEL: Record<HeatTier, string> = {
  hot: "Hot",
  warm: "Warm",
  lukewarm: "Lukewarm",
  cold: "Cold",
}

const HEAT_CLASSES: Record<HeatTier, string> = {
  hot: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  warm: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  lukewarm:
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  cold: "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
}

const HEAT_GLYPH: Record<HeatTier, string> = {
  hot: "●",
  warm: "◐",
  lukewarm: "○",
  cold: "·",
}

export function HeatBadge({ heat, size = "md" }: { heat: HeatTier; size?: "sm" | "md" }) {
  const padding = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-mono uppercase tracking-wider ring-1 ring-inset ${padding} ${HEAT_CLASSES[heat]}`}
    >
      <span aria-hidden className="leading-none">
        {HEAT_GLYPH[heat]}
      </span>
      {HEAT_LABEL[heat]}
    </span>
  )
}

export const STAGE_ORDER: PipelineStage[] = [
  "identified",
  "proposal-generated",
  "sent",
  "viewed",
  "meeting-scheduled",
]

export function stageLabel(stage: PipelineStage): string {
  return STAGE_LABELS[stage]
}
