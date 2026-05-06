import { useEffect, useRef, useState } from "react"
import {
  Archive,
  ArrowRightCircle,
  CheckCircle2,
  MoreVertical,
  UserCog,
  XCircle,
} from "lucide-react"

import type {
  Owner,
  PipelineProject,
} from "../../../../product/sections/pipeline-dashboard/types"
import { HeatBadge, StageBadge } from "./StageBadge"

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

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

function daysUntil(iso: string, now: number): number {
  const target = new Date(iso).getTime()
  return Math.round((target - now) / (1000 * 60 * 60 * 24))
}

function ripScoreClass(score: number): string {
  if (score >= 80)
    return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60"
  if (score >= 65)
    return "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60"
  if (score >= 45)
    return "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60"
  return "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700"
}

function OwnerAvatar({ owner }: { owner?: Owner }) {
  if (!owner) {
    return (
      <span className="bg-muted text-muted-foreground inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px]">
        —
      </span>
    )
  }
  return (
    <span
      title={owner.name}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 font-mono text-[10px] font-semibold text-lime-300 ring-2 ring-white dark:bg-stone-100 dark:text-stone-900 dark:ring-stone-950"
    >
      {owner.initials}
    </span>
  )
}

interface ProjectRowProps {
  project: PipelineProject
  owner?: Owner
  now: number
  onOpen?: (id: string) => void
  onAction?: (
    id: string,
    action: "open" | "won" | "lost" | "reassign" | "archive"
  ) => void
}

export function ProjectRow({
  project,
  owner,
  now,
  onOpen,
  onAction,
}: ProjectRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuOpen])

  const renewIn = daysUntil(project.nextRenewalDate, now)
  const renewUrgent = renewIn <= 30
  const renewSoon = renewIn > 30 && renewIn <= 60

  return (
    <tr
      className="group/row border-border hover:bg-muted/40 cursor-pointer border-b transition-colors"
      onClick={() => onOpen?.(project.id)}
    >
      <td className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-stone-100 to-stone-200 font-mono text-[11px] font-bold text-stone-600 dark:from-stone-800 dark:to-stone-900 dark:text-stone-400">
            {project.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-foreground truncate text-sm font-medium">
              {project.company}
            </span>
            <span className="text-muted-foreground truncate text-[11px]">
              {project.industry}
            </span>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <OwnerAvatar owner={owner} />
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <StageBadge stage={project.stage} />
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <HeatBadge heat={project.heat} />
      </td>
      <td className="hidden px-4 py-3 text-right md:table-cell">
        <span className="text-foreground font-mono text-sm tabular-nums">
          {fmtUsd(project.annualSpend)}
        </span>
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <span
          className={`inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md px-1.5 font-mono text-xs font-semibold tabular-nums ring-1 ring-inset ${ripScoreClass(project.ripScore)}`}
        >
          {project.ripScore}
        </span>
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="flex flex-col leading-tight">
          <span
            className={`font-mono text-xs tabular-nums ${
              renewUrgent
                ? "text-rose-600 dark:text-rose-400"
                : renewSoon
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-foreground"
            }`}
          >
            {fmtDate(project.nextRenewalDate)}
            <span className="text-muted-foreground ml-1">
              · {renewIn < 0 ? `${Math.abs(renewIn)}d ago` : `${renewIn}d`}
            </span>
          </span>
          <span className="text-muted-foreground truncate text-[10px]">
            {project.nextRenewalApp}
          </span>
        </div>
      </td>
      <td className="hidden px-4 py-3 xl:table-cell">
        <div className="flex flex-col leading-tight">
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {timeAgo(project.lastActivityAt, now)}
          </span>
          <span className="text-foreground/80 max-w-[220px] truncate text-[11px]">
            {project.lastActivityLabel}
          </span>
        </div>
      </td>
      <td className="w-8 px-2 py-3">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className={`text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md transition-opacity group-hover/row:opacity-100 ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Row actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              className="bg-popover border-border absolute right-0 top-full z-30 mt-1 w-44 rounded-md border py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <RowMenuItem
                icon={<ArrowRightCircle className="h-3.5 w-3.5" />}
                label="Open project"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(project.id, "open")
                }}
              />
              <RowMenuItem
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Mark as won"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(project.id, "won")
                }}
              />
              <RowMenuItem
                icon={<XCircle className="h-3.5 w-3.5" />}
                label="Mark as lost"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(project.id, "lost")
                }}
              />
              <RowMenuItem
                icon={<UserCog className="h-3.5 w-3.5" />}
                label="Reassign owner"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(project.id, "reassign")
                }}
              />
              <div className="bg-border my-1 h-px" />
              <RowMenuItem
                icon={<Archive className="h-3.5 w-3.5" />}
                label="Archive"
                tone="destructive"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(project.id, "archive")
                }}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

function RowMenuItem({
  icon,
  label,
  tone = "default",
  onClick,
}: {
  icon: React.ReactNode
  label: string
  tone?: "default" | "destructive"
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm ${
        tone === "destructive"
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
          : "hover:bg-muted"
      }`}
    >
      <span
        className={
          tone === "destructive"
            ? "text-rose-500 dark:text-rose-400"
            : "text-muted-foreground"
        }
      >
        {icon}
      </span>
      {label}
    </button>
  )
}
