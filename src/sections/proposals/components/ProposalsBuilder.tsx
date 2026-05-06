import {
  Activity,
  Copy,
  Eye,
  FileDown,
  Link2,
  MoreVertical,
  Plus,
  Presentation,
  Sparkles,
} from "lucide-react"
import { useState } from "react"

import type { ProposalsProps } from "../../../../product/sections/proposals/types"
import { MetaPanel } from "./MetaPanel"
import { SectionContent } from "./SectionContent"
import { SectionNavigator } from "./SectionNavigator"
import { StatusBadge } from "./StatusBadge"

function fmtUsd(amount: number): string {
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

function timeAgo(iso: string | null): string {
  if (!iso) return "—"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export function ProposalsBuilder({
  proposals,
  activeProposal,
  activeSectionKey,
  onSelectProposal,
  onSelectSection,
  onCreateProposal,
  onTogglePreview,
  onCopyShareLink,
  onExportPdf,
  onExportSlides,
  onAddRecipient,
  onResendToRecipient,
  onRecommendOption,
  onEditFinancialYear,
  onDuplicate,
  onArchive,
  onInspectViewEvent,
}: ProposalsProps) {
  const [activityOpen, setActivityOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  return (
    <div className="bg-background animate-fade-in flex h-full min-h-0 flex-col">
      {/* Top action strip — mirrors useTopNav-injected actions in the live app */}
      <TopActionStrip
        proposal={activeProposal}
        onTogglePreview={onTogglePreview}
        onCopyShareLink={() => onCopyShareLink?.(activeProposal.id)}
        onExportPdf={() => onExportPdf?.(activeProposal.id)}
        onExportSlides={() => onExportSlides?.(activeProposal.id)}
        onActivityToggle={() => setActivityOpen((v) => !v)}
        moreOpen={moreMenuOpen}
        setMoreOpen={setMoreMenuOpen}
        onDuplicate={() => onDuplicate?.(activeProposal.id)}
        onArchive={() => onArchive?.(activeProposal.id)}
      />

      {/* Proposal list rail (horizontal) */}
      <ProposalRail
        proposals={proposals}
        activeId={activeProposal.id}
        onSelect={onSelectProposal}
        onCreate={onCreateProposal}
      />

      {/* Builder body: 3-pane on desktop, stacked on mobile */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <SectionNavigator
          sections={activeProposal.sections}
          activeKey={activeSectionKey}
          onSelect={onSelectSection}
        />

        <main className="bg-background flex-1 overflow-y-auto">
          <SectionContent
            sections={activeProposal.sections}
            activeKey={activeSectionKey}
            proposalId={activeProposal.id}
            prospectCompany={activeProposal.prospectCompany}
            prospectLogoMark={activeProposal.sections.cover.prospectLogoMark}
            onRecommendOption={onRecommendOption}
            onEditFinancialYear={onEditFinancialYear}
          />
        </main>

        {/* Desktop meta panel */}
        <div className="hidden xl:block xl:h-full xl:overflow-hidden">
          <MetaPanel
            proposal={activeProposal}
            onCopyShareLink={onCopyShareLink}
            onAddRecipient={onAddRecipient}
            onResendToRecipient={onResendToRecipient}
            onInspectViewEvent={onInspectViewEvent}
          />
        </div>
      </div>

      {/* Tablet/mobile activity drawer */}
      {activityOpen && (
        <div
          className="fixed inset-0 z-30 xl:hidden"
          onClick={() => setActivityOpen(false)}
        >
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
          <div
            className="bg-background absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="border-border flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Activity</span>
              <button
                type="button"
                onClick={() => setActivityOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Close
              </button>
            </header>
            <MetaPanel
              proposal={activeProposal}
              onCopyShareLink={onCopyShareLink}
              onAddRecipient={onAddRecipient}
              onResendToRecipient={onResendToRecipient}
              onInspectViewEvent={onInspectViewEvent}
            />
          </div>
        </div>
      )}

      {/* Floating activity FAB on mobile */}
      <button
        type="button"
        onClick={() => setActivityOpen(true)}
        className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-xs font-medium text-stone-50 shadow-lg shadow-stone-900/20 hover:bg-stone-800 xl:hidden dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
      >
        <Activity className="h-3.5 w-3.5" />
        Activity
        {activeProposal.totalOpens > 0 && (
          <span className="font-mono text-[10px] tabular-nums opacity-80">
            {activeProposal.totalOpens}
          </span>
        )}
      </button>
    </div>
  )
}

// =============================================================================
// Top Action Strip — what useTopNav would render in the live shell
// =============================================================================
function TopActionStrip({
  proposal,
  onTogglePreview,
  onCopyShareLink,
  onExportPdf,
  onExportSlides,
  onActivityToggle,
  moreOpen,
  setMoreOpen,
  onDuplicate,
  onArchive,
}: {
  proposal: ProposalsProps["activeProposal"]
  onTogglePreview?: () => void
  onCopyShareLink: () => void
  onExportPdf: () => void
  onExportSlides: () => void
  onActivityToggle: () => void
  moreOpen: boolean
  setMoreOpen: (v: boolean) => void
  onDuplicate: () => void
  onArchive: () => void
}) {
  return (
    <div className="bg-background border-border flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-stone-900 font-mono text-[11px] font-bold text-lime-300 dark:bg-stone-100 dark:text-stone-900">
          {proposal.sections.cover.prospectLogoMark}
        </div>
        <div className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="truncate text-sm font-semibold">
            {proposal.title}
          </span>
          <span className="text-muted-foreground truncate font-mono text-[11px]">
            {proposal.version} · updated {timeAgo(proposal.updatedAt)} · by{" "}
            {proposal.ownerName}
          </span>
        </div>
        <div className="ml-1 flex items-center gap-2">
          <StatusBadge status={proposal.status} size="sm" />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <ActionButton
          icon={<Eye className="h-3.5 w-3.5" />}
          label="Preview"
          onClick={onTogglePreview}
        />
        <ActionButton
          icon={<Link2 className="h-3.5 w-3.5" />}
          label="Share"
          onClick={onCopyShareLink}
        />
        <ActionButton
          icon={<FileDown className="h-3.5 w-3.5" />}
          label="PDF"
          onClick={onExportPdf}
        />
        <ActionButton
          icon={<Presentation className="h-3.5 w-3.5" />}
          label="Slides"
          onClick={onExportSlides}
        />
        <span className="bg-border mx-1 h-6 w-px" />
        <button
          type="button"
          onClick={onActivityToggle}
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs xl:hidden"
        >
          <Activity className="h-3.5 w-3.5" />
          <span className="font-mono tabular-nums">
            {proposal.totalOpens}
          </span>
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md"
            aria-label="More actions"
            aria-expanded={moreOpen}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {moreOpen && (
            <div
              className="bg-popover absolute right-0 top-full z-20 mt-1 w-44 rounded-md border py-1 shadow-md"
              onMouseLeave={() => setMoreOpen(false)}
            >
              <MenuRow
                icon={<Copy className="h-3.5 w-3.5" />}
                label="Duplicate"
                onClick={() => {
                  setMoreOpen(false)
                  onDuplicate()
                }}
              />
              <MenuRow
                icon={<FileDown className="h-3.5 w-3.5" />}
                label="Download backup"
                onClick={() => setMoreOpen(false)}
              />
              <MenuRow
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Regenerate from BuildScope"
                onClick={() => setMoreOpen(false)}
              />
              <div className="bg-border my-1 h-px" />
              <MenuRow
                icon={<Activity className="h-3.5 w-3.5" />}
                label="Archive"
                tone="destructive"
                onClick={() => {
                  setMoreOpen(false)
                  onArchive()
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs sm:text-sm"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function MenuRow({
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
      className={[
        "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm",
        tone === "destructive"
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
          : "hover:bg-muted",
      ].join(" ")}
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

// =============================================================================
// Proposal rail — horizontal switcher across this project's proposals
// =============================================================================
function ProposalRail({
  proposals,
  activeId,
  onSelect,
  onCreate,
}: {
  proposals: ProposalsProps["proposals"]
  activeId: string
  onSelect?: (id: string) => void
  onCreate?: () => void
}) {
  return (
    <div className="bg-muted/40 border-border flex shrink-0 items-center gap-2 overflow-x-auto border-b px-4 py-2.5 sm:px-6">
      <span className="text-muted-foreground shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em]">
        Proposals
      </span>
      <span className="bg-border h-4 w-px shrink-0" />
      <div className="flex shrink-0 items-center gap-1.5">
        {proposals.map((p) => {
          const isActive = p.id === activeId
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect?.(p.id)}
              className={[
                "group flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors",
                isActive
                  ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              <StatusBadge status={p.status} size="sm" />
              <span
                className={[
                  "max-w-[180px] truncate font-medium",
                  isActive ? "" : "text-foreground",
                ].join(" ")}
              >
                {p.prospectCompany}
              </span>
              <span
                className={[
                  "font-mono text-[10px] tabular-nums",
                  isActive
                    ? "text-stone-300 dark:text-stone-600"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {fmtUsd(p.engagementValue)}
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="text-muted-foreground hover:text-foreground border-border hover:bg-muted ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed px-3 py-1 text-xs"
      >
        <Plus className="h-3 w-3" />
        New proposal
      </button>
    </div>
  )
}
