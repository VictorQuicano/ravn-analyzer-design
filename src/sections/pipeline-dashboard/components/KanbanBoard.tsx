import { useState } from "react"
import { Clock4, GripVertical } from "lucide-react"

import type {
  Owner,
  PipelineOpportunity,
  PipelineStage,
} from "../../../../product/sections/pipeline-dashboard/types"
import { stageLabel, STAGE_ORDER } from "./StageBadge"

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

const STAGE_ACCENT: Record<PipelineStage, string> = {
  identified: "bg-stone-400",
  "proposal-generated": "bg-amber-500",
  sent: "bg-sky-500",
  viewed: "bg-violet-500",
  "meeting-scheduled": "bg-lime-500",
}

function ripChipClass(score: number): string {
  if (score >= 80) return "text-rose-600 dark:text-rose-300"
  if (score >= 65) return "text-amber-700 dark:text-amber-300"
  if (score >= 45) return "text-sky-700 dark:text-sky-300"
  return "text-stone-500 dark:text-stone-400"
}

interface KanbanBoardProps {
  opportunities: PipelineOpportunity[]
  ownersById: Record<string, Owner>
  onMove?: (opportunityId: string, toStage: PipelineStage) => void
}

export function KanbanBoard({
  opportunities,
  ownersById,
  onMove,
}: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<PipelineStage | null>(null)

  const grouped = STAGE_ORDER.map((stage) => ({
    stage,
    items: opportunities.filter((o) => o.stage === stage),
  }))

  const handleDrop = (stage: PipelineStage) => {
    if (draggingId) onMove?.(draggingId, stage)
    setDraggingId(null)
    setOverStage(null)
  }

  return (
    <div className="flex h-full min-h-0 gap-3 overflow-x-auto px-4 pb-4 sm:px-6 lg:gap-4">
      {grouped.map(({ stage, items }) => {
        const total = items.reduce((sum, o) => sum + o.engagementValue, 0)
        const isOver = overStage === stage
        return (
          <div
            key={stage}
            className={`flex w-[280px] shrink-0 flex-col rounded-lg border transition-colors lg:w-[300px] ${
              isOver
                ? "border-lime-400 bg-lime-50/50 dark:border-lime-700 dark:bg-lime-950/20"
                : "border-border bg-muted/30"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setOverStage(stage)
            }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={() => handleDrop(stage)}
          >
            <header className="flex items-center justify-between gap-2 px-3 pb-2 pt-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${STAGE_ACCENT[stage]}`}
                />
                <span className="text-foreground truncate text-xs font-semibold uppercase tracking-wider">
                  {stageLabel(stage)}
                </span>
                <span className="text-muted-foreground bg-background rounded-full px-1.5 font-mono text-[10px] tabular-nums ring-1 ring-inset ring-stone-200 dark:ring-stone-700">
                  {items.length}
                </span>
              </div>
              <span className="text-muted-foreground shrink-0 font-mono text-[11px] tabular-nums">
                {fmtUsd(total)}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
              {items.length === 0 ? (
                <div className="border-border/70 text-muted-foreground/70 flex flex-1 items-center justify-center rounded-md border border-dashed py-6 text-center text-[11px]">
                  Drag opportunities here
                </div>
              ) : (
                items.map((opp) => (
                  <KanbanCard
                    key={opp.id}
                    opportunity={opp}
                    owner={ownersById[opp.ownerId]}
                    onDragStart={() => setDraggingId(opp.id)}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setOverStage(null)
                    }}
                    isDragging={draggingId === opp.id}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({
  opportunity,
  owner,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  opportunity: PipelineOpportunity
  owner?: Owner
  onDragStart?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group bg-card hover:border-foreground/20 relative flex flex-col gap-2 rounded-md border p-2.5 text-left shadow-sm transition-all ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <GripVertical
        aria-hidden
        className="text-muted-foreground/30 group-hover:text-muted-foreground absolute right-1.5 top-1.5 h-3.5 w-3.5 cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-2 pr-4">
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-foreground truncate text-sm font-medium">
            {opportunity.company}
          </span>
          <span className="text-muted-foreground truncate text-[11px]">
            {opportunity.saasApp}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {owner && (
            <span
              title={owner.name}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 font-mono text-[9px] font-semibold text-lime-300 dark:bg-stone-100 dark:text-stone-900"
            >
              {owner.initials}
            </span>
          )}
          <span
            className={`bg-muted/70 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums ${ripChipClass(opportunity.ripScore)}`}
            title={`Rip Score ${opportunity.ripScore}`}
          >
            {opportunity.ripScore}
          </span>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <Clock4 className="h-3 w-3" />
            {opportunity.daysInStage}d
          </span>
        </div>
        <span className="text-foreground font-mono text-xs font-semibold tabular-nums">
          {fmtUsd(opportunity.engagementValue)}
        </span>
      </div>
    </div>
  )
}
