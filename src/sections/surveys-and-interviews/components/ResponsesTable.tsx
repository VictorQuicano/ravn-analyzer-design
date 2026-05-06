import { useEffect, useRef, useState } from "react"
import {
  Archive,
  ArrowRightCircle,
  Copy,
  Globe,
  Inbox,
  Mail,
  MoreVertical,
  Quote as QuoteIcon,
  RefreshCw,
} from "lucide-react"

import type {
  Respondent,
  SurveyResponseRow,
} from "../../../../product/sections/surveys-and-interviews/types"
import { StatusPill, SurveyBadge } from "./SurveyBadge"

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

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function RespondentAvatar({ respondent }: { respondent?: Respondent }) {
  if (!respondent) {
    return (
      <span className="bg-muted text-muted-foreground inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-[10px]">
        ?
      </span>
    )
  }
  const isAnon = respondent.id === "resp-public-anon"
  return (
    <span
      title={respondent.name}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold ring-2 ring-white dark:ring-stone-950 ${
        isAnon
          ? "border-border text-muted-foreground bg-transparent border border-dashed"
          : "bg-stone-900 text-lime-300 dark:bg-stone-100 dark:text-stone-900"
      }`}
    >
      {respondent.initials}
    </span>
  )
}

interface ResponseRowProps {
  response: SurveyResponseRow
  respondent?: Respondent
  now: number
  onOpen?: (id: string) => void
  onAction?: (
    id: string,
    action:
      | "open"
      | "copy-link"
      | "resend"
      | "mark-standout"
      | "archive"
  ) => void
}

export function ResponseRow({
  response,
  respondent,
  now,
  onOpen,
  onAction,
}: ResponseRowProps) {
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

  const progressPct = response.totalSteps
    ? Math.round((response.currentStep / response.totalSteps) * 100)
    : 0

  const progressBarColor =
    response.status === "submitted"
      ? "bg-lime-500"
      : response.status === "overdue"
        ? "bg-rose-500"
        : response.status === "in-progress"
          ? "bg-sky-500"
          : "bg-stone-400"

  return (
    <tr
      className="group/row border-border hover:bg-muted/40 cursor-pointer border-b transition-colors"
      onClick={() => onOpen?.(response.id)}
    >
      <td className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <RespondentAvatar respondent={respondent} />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-foreground truncate text-sm font-medium">
              {respondent?.name ?? "Unknown respondent"}
            </span>
            <span className="text-muted-foreground truncate text-[11px]">
              {respondent?.email}
            </span>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <span className="bg-muted text-muted-foreground inline-flex max-w-[150px] truncate rounded-md px-1.5 py-0.5 text-[11px]">
          {respondent?.role ?? "—"}
        </span>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <SurveyBadge surveyType={response.surveyType} size="sm" />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <StatusPill status={response.status} size="sm" />
            {response.status === "in-progress" && (
              <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
                step {response.currentStep}/{response.totalSteps}
              </span>
            )}
            {response.status === "overdue" &&
              response.daysOverdue !== undefined && (
                <span className="font-mono text-[10px] tabular-nums text-rose-600 dark:text-rose-300">
                  {response.daysOverdue}d overdue
                </span>
              )}
          </div>
          {(response.status === "in-progress" ||
            response.status === "overdue") && (
            <div className="bg-muted/70 relative h-1 w-full max-w-[140px] overflow-hidden rounded-full">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${progressBarColor}`}
                style={{ width: `${Math.max(progressPct, 4)}%` }}
              />
            </div>
          )}
        </div>
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        {response.submittedAt ? (
          <div className="flex flex-col leading-tight">
            <span className="text-foreground font-mono text-xs tabular-nums">
              {fmtDate(response.submittedAt)}
            </span>
            <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
              {timeAgo(response.submittedAt, now)} ago
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 font-mono text-xs">—</span>
        )}
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <span
          className={`inline-flex items-center gap-1 text-[11px] ${
            response.channel === "public-link"
              ? "text-stone-600 dark:text-stone-300"
              : "text-muted-foreground"
          }`}
          title={
            response.channel === "public-link"
              ? "Slack public link"
              : "Magic link"
          }
        >
          {response.channel === "public-link" ? (
            <Globe className="h-3 w-3" />
          ) : (
            <Mail className="h-3 w-3" />
          )}
          {response.channel === "public-link" ? "Public" : "Magic"}
        </span>
      </td>
      <td className="hidden px-4 py-3 xl:table-cell">
        <div className="flex flex-col leading-tight">
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {timeAgo(response.lastActivityAt, now)} ago
          </span>
          <span className="text-foreground/80 max-w-[260px] truncate text-[11px]">
            {response.lastActivityLabel}
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
              className="bg-popover border-border absolute right-0 top-full z-30 mt-1 w-48 rounded-md border py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <RowMenuItem
                icon={<ArrowRightCircle className="h-3.5 w-3.5" />}
                label="Open response"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(response.id, "open")
                }}
              />
              <RowMenuItem
                icon={<Copy className="h-3.5 w-3.5" />}
                label="Copy magic link"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(response.id, "copy-link")
                }}
              />
              <RowMenuItem
                icon={<RefreshCw className="h-3.5 w-3.5" />}
                label="Resend invitation"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(response.id, "resend")
                }}
              />
              <RowMenuItem
                icon={<QuoteIcon className="h-3.5 w-3.5" />}
                label="Pin a standout quote"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(response.id, "mark-standout")
                }}
              />
              <div className="bg-border my-1 h-px" />
              <RowMenuItem
                icon={<Archive className="h-3.5 w-3.5" />}
                label="Archive"
                tone="destructive"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.(response.id, "archive")
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

interface ResponsesTableProps {
  responses: SurveyResponseRow[]
  respondentsById: Record<string, Respondent>
  now: number
  onOpenResponse?: (id: string) => void
  onResponseAction?: ResponseRowProps["onAction"]
}

export function ResponsesTable({
  responses,
  respondentsById,
  now,
  onOpenResponse,
  onResponseAction,
}: ResponsesTableProps) {
  if (responses.length === 0) {
    return (
      <div className="border-border/70 mx-4 my-6 flex flex-col items-center justify-center rounded-lg border border-dashed py-14 text-center sm:mx-6">
        <span className="bg-muted text-muted-foreground mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full">
          <Inbox className="h-4 w-4" />
        </span>
        <p className="text-foreground text-sm font-medium">
          No responses yet
        </p>
        <p className="text-muted-foreground mt-1 max-w-xs text-[12px]">
          Copy the public link, send an invite, or wait — submissions land here
          in real time.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-border bg-muted/30 border-b">
            <Th className="px-4 sm:px-5">Respondent</Th>
            <Th className="hidden md:table-cell">Role</Th>
            <Th className="hidden sm:table-cell">Survey</Th>
            <Th>Progress</Th>
            <Th className="hidden lg:table-cell">Submitted</Th>
            <Th className="hidden md:table-cell">Sent via</Th>
            <Th className="hidden xl:table-cell">Last activity</Th>
            <Th className="w-8" srOnly>
              Actions
            </Th>
          </tr>
        </thead>
        <tbody>
          {responses.map((r) => (
            <ResponseRow
              key={r.id}
              response={r}
              respondent={respondentsById[r.respondentId]}
              now={now}
              onOpen={onOpenResponse}
              onAction={onResponseAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({
  children,
  className = "",
  srOnly = false,
}: {
  children: React.ReactNode
  className?: string
  srOnly?: boolean
}) {
  return (
    <th
      scope="col"
      className={`text-muted-foreground px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${className}`}
    >
      {srOnly ? <span className="sr-only">{children}</span> : children}
    </th>
  )
}

