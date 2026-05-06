import {
  Bell,
  Copy,
  ExternalLink,
  Laptop,
  MapPin,
  Plus,
  Send,
  Smartphone,
  Tablet,
} from "lucide-react"

import type {
  EventDevice,
  Proposal,
} from "../../../../product/sections/proposals/types"
import { StatusBadge } from "./StatusBadge"

interface MetaPanelProps {
  proposal: Proposal
  onCopyShareLink?: (id: string) => void
  onAddRecipient?: (id: string) => void
  onResendToRecipient?: (proposalId: string, recipientId: string) => void
  onInspectViewEvent?: (eventId: string) => void
}

const AVATAR_RING: Record<string, string> = {
  lime: "bg-lime-100 text-lime-900 dark:bg-lime-900/40 dark:text-lime-200",
  amber:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  sky: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200",
  rose: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200",
}

const DEVICE_ICON: Record<EventDevice, typeof Laptop> = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: Laptop,
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatDwell(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const rem = seconds % 60
  return rem === 0 ? `${mins}m` : `${mins}m ${rem}s`
}

export function MetaPanel({
  proposal,
  onCopyShareLink,
  onAddRecipient,
  onResendToRecipient,
  onInspectViewEvent,
}: MetaPanelProps) {
  return (
    <aside className="bg-background border-border flex w-full shrink-0 flex-col gap-4 border-l p-4 xl:w-80 xl:overflow-y-auto">
      <ShareCard proposal={proposal} onCopy={() => onCopyShareLink?.(proposal.id)} />
      <RecipientsCard
        proposal={proposal}
        onAdd={() => onAddRecipient?.(proposal.id)}
        onResend={(rid) => onResendToRecipient?.(proposal.id, rid)}
      />
      <ActivityCard
        proposal={proposal}
        onInspect={(eid) => onInspectViewEvent?.(eid)}
      />
    </aside>
  )
}

function ShareCard({
  proposal,
  onCopy,
}: {
  proposal: Proposal
  onCopy: () => void
}) {
  return (
    <section className="bg-card rounded-lg border p-4">
      <header className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.14em]">
          Status &amp; share
        </span>
        <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
          {proposal.version}
        </span>
      </header>
      <div className="mb-3 flex items-center gap-2">
        <StatusBadge status={proposal.status} />
        <span className="text-muted-foreground text-xs">
          {proposal.uniqueOpens} unique · {proposal.totalOpens} opens
        </span>
      </div>
      <div className="bg-muted/40 group flex items-center gap-2 rounded-md border px-2.5 py-2">
        <ExternalLink className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
        <span className="font-mono text-[11px] truncate text-stone-700 dark:text-stone-300">
          {proposal.shareUrl.replace(/^https?:\/\//, "")}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
          aria-label="Copy share link"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  )
}

function RecipientsCard({
  proposal,
  onAdd,
  onResend,
}: {
  proposal: Proposal
  onAdd: () => void
  onResend: (rid: string) => void
}) {
  return (
    <section className="bg-card rounded-lg border p-4">
      <header className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.14em]">
          Recipients
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </header>
      <ul className="space-y-2.5">
        {proposal.recipients.map((r) => (
          <li key={r.id} className="flex items-center gap-2.5">
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                AVATAR_RING[r.avatarColor] ?? AVATAR_RING.lime,
              ].join(" ")}
            >
              {initials(r.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {r.name}
                </span>
                <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
                  {r.totalOpens > 0 ? `${r.totalOpens}×` : "—"}
                </span>
              </div>
              <span className="text-muted-foreground block truncate text-[11px]">
                {r.role}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onResend(r.id)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 w-7 shrink-0 items-center justify-center rounded"
              aria-label={`Resend to ${r.name}`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ActivityCard({
  proposal,
  onInspect,
}: {
  proposal: Proposal
  onInspect: (eid: string) => void
}) {
  return (
    <section className="bg-card rounded-lg border p-4">
      <header className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.14em]">
          View activity
        </span>
        <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
          <Bell className="h-3 w-3" /> Owner notified
        </span>
      </header>
      <ol className="relative space-y-3.5">
        <span className="bg-border absolute bottom-1.5 left-[7px] top-1.5 w-px" />
        {proposal.viewEvents.map((event) => {
          const Icon = DEVICE_ICON[event.device]
          return (
            <li key={event.id} className="relative pl-6">
              <span
                className={[
                  "absolute left-0 top-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2",
                  event.isFresh
                    ? "bg-lime-500 ring-lime-200 dark:ring-lime-900/60"
                    : "bg-stone-300 ring-background dark:bg-stone-600",
                ].join(" ")}
              >
                {event.isFresh && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-lime-500/60" />
                )}
              </span>
              <button
                type="button"
                onClick={() => onInspect(event.id)}
                className="block w-full text-left"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {event.recipientLabel}
                  </span>
                  <span className="text-muted-foreground shrink-0 font-mono text-[10px] tabular-nums">
                    {event.relativeTime}
                  </span>
                </div>
                <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    {event.device === "unknown"
                      ? "Forwarded"
                      : event.device}
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <span className="font-mono tabular-nums">
                    {formatDwell(event.dwellSeconds)} dwell
                  </span>
                  {event.city && (
                    <>
                      <span className="text-stone-300 dark:text-stone-600">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {event.city}
                      </span>
                    </>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
