import { useEffect, useRef, useState } from "react"
import {
  ArrowRightCircle,
  ClipboardPaste,
  FileAudio,
  Loader2,
  MoreVertical,
  Trash2,
  Upload,
} from "lucide-react"

import type {
  Respondent,
  TranscriptRow,
  TranscriptSource,
  TranscriptStatus,
} from "../../../../product/sections/surveys-and-interviews/types"

const SOURCE_ICONS: Record<
  TranscriptSource,
  React.ComponentType<{ className?: string }>
> = {
  zoom: FileAudio,
  granola: FileAudio,
  paste: ClipboardPaste,
  upload: Upload,
}

const SOURCE_LABEL: Record<TranscriptSource, string> = {
  zoom: "Zoom",
  granola: "Granola",
  paste: "Paste",
  upload: "Upload",
}

const SOURCE_CLASSES: Record<TranscriptSource, string> = {
  zoom:
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  granola:
    "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60",
  paste:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
  upload:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
}

const STATUS_LABEL: Record<TranscriptStatus, string> = {
  uploaded: "Uploaded",
  transcribing: "Transcribing",
  ready: "Ready",
  reviewed: "Reviewed",
}

const STATUS_CLASSES: Record<TranscriptStatus, string> = {
  uploaded:
    "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
  transcribing:
    "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  ready:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  reviewed:
    "bg-lime-100 text-lime-900 ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
}

function fmtDuration(seconds: number): string {
  if (!seconds) return "—"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m >= 60) {
    const hh = Math.floor(m / 60)
    const mm = m % 60
    return `${hh}:${mm.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }
  return `${m}:${s.toString().padStart(2, "0")}`
}

function timeAgo(iso: string, now: number): string {
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

interface TranscriptsTableProps {
  transcripts: TranscriptRow[]
  respondentsById: Record<string, Respondent>
  now: number
  onOpenTranscript?: (id: string) => void
  onUploadTranscript?: () => void
}

export function TranscriptsTable({
  transcripts,
  respondentsById,
  now,
  onOpenTranscript,
  onUploadTranscript,
}: TranscriptsTableProps) {
  return (
    <div className="bg-card flex flex-col rounded-lg border">
      <header className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <FileAudio className="text-muted-foreground h-4 w-4" />
          <h3 className="text-foreground text-sm font-semibold">
            Follow-up transcripts
          </h3>
          <span className="text-muted-foreground bg-muted rounded-full px-1.5 font-mono text-[10px] tabular-nums">
            {transcripts.length}
          </span>
        </div>
        <span className="text-muted-foreground hidden text-[11px] sm:inline">
          Drop a recording, or paste a transcript from a Granola/Zoom call
        </span>
      </header>

      {/* Inline dropzone */}
      <button
        type="button"
        onClick={onUploadTranscript}
        className="border-border/70 hover:border-foreground/30 hover:bg-muted/50 group mx-3 mt-3 flex flex-col items-center justify-center gap-1 rounded-md border border-dashed py-5 transition-colors sm:mx-4"
      >
        <span className="bg-muted text-foreground inline-flex h-9 w-9 items-center justify-center rounded-full">
          <Upload className="h-4 w-4" />
        </span>
        <span className="text-foreground text-sm font-medium">
          Drop a <span className="font-mono">.mp3</span> /{" "}
          <span className="font-mono">.m4a</span> /{" "}
          <span className="font-mono">.txt</span> here
        </span>
        <span className="text-muted-foreground text-[11px]">
          or paste a transcript directly · transcribed automatically
        </span>
      </button>

      {transcripts.length === 0 ? (
        <div className="text-muted-foreground px-4 py-10 text-center text-sm sm:px-6">
          No follow-up transcripts uploaded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-border border-b">
                <Th className="px-4 sm:px-5">Title</Th>
                <Th className="hidden md:table-cell">Respondent</Th>
                <Th className="hidden sm:table-cell">Source</Th>
                <Th className="hidden lg:table-cell text-right">Duration</Th>
                <Th>Status</Th>
                <Th className="hidden md:table-cell">Uploaded</Th>
                <Th className="w-8" srOnly>
                  Actions
                </Th>
              </tr>
            </thead>
            <tbody>
              {transcripts.map((t) => (
                <TranscriptRowEl
                  key={t.id}
                  transcript={t}
                  respondent={respondentsById[t.respondentId]}
                  now={now}
                  onOpen={onOpenTranscript}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TranscriptRowEl({
  transcript,
  respondent,
  now,
  onOpen,
}: {
  transcript: TranscriptRow
  respondent?: Respondent
  now: number
  onOpen?: (id: string) => void
}) {
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

  const SourceIcon = SOURCE_ICONS[transcript.source]

  return (
    <tr
      onClick={() => onOpen?.(transcript.id)}
      className="group/row border-border hover:bg-muted/40 cursor-pointer border-b transition-colors last:border-b-0"
    >
      <td className="px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-0.5 leading-tight">
          <span className="text-foreground truncate text-sm font-medium">
            {transcript.title}
          </span>
          {transcript.teaser && (
            <span className="text-muted-foreground max-w-[460px] truncate text-[11px] italic">
              &ldquo;{transcript.teaser}&rdquo;
            </span>
          )}
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <div className="flex items-center gap-2">
          {respondent && (
            <span
              title={respondent.name}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 font-mono text-[9px] font-semibold text-lime-300 dark:bg-stone-100 dark:text-stone-900"
            >
              {respondent.initials}
            </span>
          )}
          <span className="text-foreground/90 truncate text-[12px]">
            {respondent?.name ?? "—"}
          </span>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${SOURCE_CLASSES[transcript.source]}`}
        >
          <SourceIcon className="h-3 w-3" />
          {SOURCE_LABEL[transcript.source]}
        </span>
      </td>
      <td className="hidden px-4 py-3 text-right lg:table-cell">
        <span className="text-foreground font-mono text-xs tabular-nums">
          {fmtDuration(transcript.durationSeconds)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset ${STATUS_CLASSES[transcript.status]}`}
        >
          {transcript.status === "transcribing" && (
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
          )}
          {STATUS_LABEL[transcript.status]}
        </span>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
          {timeAgo(transcript.uploadedAt, now)}
        </span>
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
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onOpen?.(transcript.id)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm"
              >
                <ArrowRightCircle className="text-muted-foreground h-3.5 w-3.5" />
                Open transcript
              </button>
              <div className="bg-border my-1 h-px" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
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
